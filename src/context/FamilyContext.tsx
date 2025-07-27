import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleCalendar } from '../services/GoogleCalendarService';
import {
  Family,
  Child,
  Task,
  Reward,
  BehaviorEvent,
  Redemption,
} from '../types';

interface FamilyContextType {
  family: Family | null;
  loading: boolean;
  error: string | null;
  tasks: Task[];
  rewards: Reward[];
  // Child Management
  addChild: (
    child: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateChild: (childId: string, updates: Partial<Child>) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  // Task Management
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  completeTask: (taskId: string, childId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  reassignTask: (taskId: string, newChildId: string) => Promise<void>;
  // Reward System
  redeemReward: (rewardId: string, childId: string, pointsCost: number) => Promise<void>;
  addCustomReward: (reward: Omit<Reward, 'id'>) => Promise<void>;
  addReward: (reward: Omit<Reward, 'id'>) => Promise<void>;
  // Behavior Tracking
  logBehaviorEvent: (
    event: Omit<BehaviorEvent, 'id' | 'timestamp'>
  ) => Promise<void>;
  getBehaviorHistory: (childId: string, days?: number) => BehaviorEvent[];
  // Data Sync
  syncWithCloud: () => Promise<void>;
  exportData: () => Promise<string>;
  refreshData: () => Promise<void>;
  requestRedemption: (rewardId: string, childId: string) => Promise<void>;
  approveRedemption: (id: string, parentId: string) => Promise<void>;
  rejectRedemption: (id: string, parentId: string) => Promise<void>;
  redemptions: Redemption[];
  approveTaskCompletion: (taskId: string, parentId: string) => Promise<void>;
  rejectTaskCompletion: (taskId: string, parentId: string) => Promise<void>;
}

type FamilyAction =
  | { type: 'SET_FAMILY'; payload: Family }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CHILD'; payload: Child }
  | {
      type: 'UPDATE_CHILD';
      payload: { childId: string; updates: Partial<Child> };
    }
  | { type: 'REMOVE_CHILD'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | {
      type: 'UPDATE_TASK';
      payload: { taskId: string; updates: Partial<Task> };
    }
  | { type: 'DELETE_TASK'; payload: string }
  | {
      type: 'COMPLETE_TASK';
      payload: { taskId: string; childId: string; completedAt: Date };
    }
  | { type: 'LOG_BEHAVIOR'; payload: BehaviorEvent }
  | { type: 'SET_TASKS'; payload: Task[] }
  | {
      type: 'UPDATE_CHILD_STATS';
      payload: { childId: string; stats: Partial<Child['stats']> };
    }
  | { type: 'SET_REDEMPTIONS'; payload: Redemption[] }
  | { type: 'ADD_REDEMPTION'; payload: Redemption }
  | { type: 'UPDATE_REDEMPTION_STATUS'; payload: { id: string; status: 'approved' | 'rejected'; approvedBy: string } }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'ADD_REWARD'; payload: Reward }
  | { type: 'UPDATE_REWARD'; payload: { rewardId: string; updates: Partial<Reward> } }
  | { type: 'UPDATE_TASK_PARENT_APPROVAL'; payload: { taskId: string; approved: boolean } };

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

// Calendar event helpers now live in useGoogleCalendar

const familyReducer = (state: any, action: FamilyAction): any => {
  switch (action.type) {
    case 'SET_FAMILY':
      return { ...state, family: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_CHILD':
      return {
        ...state,
        family: {
          ...state.family,
          children: [...state.family.children, action.payload],
        },
      };
    case 'UPDATE_CHILD':
      return {
        ...state,
        family: {
          ...state.family,
          children: state.family.children.map((child: Child) =>
            child.id === action.payload.childId
              ? { ...child, ...action.payload.updates, updatedAt: new Date() }
              : child
          ),
        },
      };
    case 'REMOVE_CHILD':
      return {
        ...state,
        family: {
          ...state.family,
          children: state.family.children.filter(
            (c: Child) => c.id !== action.payload
          ),
        },
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_CHILD_STATS':
      return {
        ...state,
        family: {
          ...state.family,
          children: state.family.children.map((child: Child) =>
            child.id === action.payload.childId
              ? { ...child, stats: { ...child.stats, ...action.payload.stats } }
              : child
          ),
        },
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t: Task) =>
          t.id === action.payload.taskId ? { ...t, ...action.payload.updates } : t
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t: Task) => t.id !== action.payload),
      };
    case 'COMPLETE_TASK':
      const { taskId, childId, completedAt } = action.payload;
      
      return {
        ...state,
        // Update the task to mark it as completed but NOT parent approved
        tasks: state.tasks.map((t: Task) =>
          t.id === taskId 
            ? { ...t, isCompleted: true, completedAt, status: 'done', parentApproved: false }
            : t
        ),
        // DO NOT update child stats here - points will be awarded when parent approves
      };
    case 'LOG_BEHAVIOR':
      return { ...state }; // Placeholder
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_REDEMPTIONS':
      return { ...state, redemptions: action.payload };
    case 'ADD_REDEMPTION':
      return { ...state, redemptions: [...state.redemptions, action.payload] };
    case 'UPDATE_REDEMPTION_STATUS':
      return {
        ...state,
        redemptions: state.redemptions.map(r => r.id === action.payload.id ? { ...r, status: action.payload.status, approvedAt: new Date(), approvedBy: action.payload.approvedBy } : r)
      };
    case 'SET_REWARDS':
      return { ...state, rewards: action.payload };
    case 'ADD_REWARD':
      return { ...state, rewards: [...state.rewards, action.payload] };
    case 'UPDATE_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(r => r.id === action.payload.rewardId ? { ...r, ...action.payload.updates } : r)
      };
    case 'UPDATE_TASK_PARENT_APPROVAL':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.taskId ? { ...t, parentApproved: action.payload.approved } : t),
      };
    default:
      return state;
  }
};

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(familyReducer, {
    family: null,
    tasks: [],
    redemptions: [],
    rewards: [],
    loading: true,
    error: null,
  });

  // Google Calendar integration helpers (requires user to be signed in)
  const {
    authenticated: calendarAuth,
    createEvent: calCreateEvent,
    updateEvent: calUpdateEvent,
    deleteEvent: calDeleteEvent,
  } = useGoogleCalendar();

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('🔍 Loading family data...');
      
      const stored = await AsyncStorage.getItem('family_data');
      console.log('📦 Stored family data:', stored ? 'Found' : 'Not found');
      
      if (stored) {
        const parsedFamily = JSON.parse(stored);
        console.log('👨‍👩‍👧‍👦 Parsed family:', parsedFamily);
        dispatch({ type: 'SET_FAMILY', payload: parsedFamily });
      } else {
        console.log('🏠 Creating default family...');
        const defaultFamily: Family = {
          id: 'family_' + Date.now(),
          name: 'My Family',
          children: [],
          parents: [],
          settings: {
            timezone: 'America/New_York',
            language: 'en',
            aiEnabled: false,
            calendarIntegration: false,
            classroomMode: false,
            maxChildren: 10,
          },
          subscription: 'free',
          createdAt: new Date(),
        } as Family;
        await saveFamily(defaultFamily);
        dispatch({ type: 'SET_FAMILY', payload: defaultFamily });
      }
      
      const storedTasks = await AsyncStorage.getItem('family_tasks');
      console.log('📋 Stored tasks:', storedTasks ? 'Found' : 'Not found');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      dispatch({ type: 'SET_TASKS', payload: tasks });

      const storedRedemptions = await AsyncStorage.getItem('family_redemptions');
      dispatch({ type: 'SET_REDEMPTIONS', payload: storedRedemptions ? JSON.parse(storedRedemptions) : [] });

      const storedRewards = await AsyncStorage.getItem('family_rewards');
      let initialRewards: Reward[] = [];
      if (storedRewards) {
        initialRewards = JSON.parse(storedRewards);
      } else {
        initialRewards = [
          {
            id: 'reward_screen_time',
            title: '30 min Screen Time',
            description: 'Extra screen time reward',
            type: 'privilege',
            pointsCost: 25,
            isAvailable: true,
            category: 'fun',
          },
          {
            id: 'reward_ice_cream',
            title: 'Ice Cream Treat',
            description: 'Enjoy a scoop of ice cream',
            type: 'experience',
            pointsCost: 35,
            isAvailable: true,
            category: 'fun',
          },
          {
            id: 'reward_stay_up_late',
            title: 'Stay Up 30 Min Later',
            description: 'Extra bedtime extension',
            type: 'privilege',
            pointsCost: 20,
            isAvailable: true,
            category: 'fun',
          },
          {
            id: 'reward_choose_movie',
            title: 'Choose Family Movie',
            description: 'Pick the movie for family night',
            type: 'experience',
            pointsCost: 15,
            isAvailable: true,
            category: 'fun',
          },
          {
            id: 'reward_special_time',
            title: 'Special One-on-One Time',
            description: 'Quality time with parent',
            type: 'experience',
            pointsCost: 40,
            isAvailable: true,
            category: 'fun',
          },
          {
            id: 'reward_small_toy',
            title: 'Small Toy or Treat',
            description: 'A small surprise reward',
            type: 'experience',
            pointsCost: 50,
            isAvailable: true,
            category: 'fun',
          },
        ];
      }
      dispatch({ type: 'SET_REWARDS', payload: initialRewards });
      await saveRewards(initialRewards);
      
      console.log('✅ Data loading complete');
    } catch (e) {
      console.error('❌ Error loading data:', e);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  };

  const saveFamily = async (family: Family) => {
    await AsyncStorage.setItem('family_data', JSON.stringify(family));
  };

  const saveTasks = async (tasks: Task[]) => {
    await AsyncStorage.setItem('family_tasks', JSON.stringify(tasks));
  };

  const saveRedemptions = async (list: Redemption[]) => {
    await AsyncStorage.setItem('family_redemptions', JSON.stringify(list));
  };

  const saveRewards = async (rewards: Reward[]) => {
    await AsyncStorage.setItem('family_rewards', JSON.stringify(rewards));
  };

  const requestRedemption = async (rewardId: string, childId: string) => {
    // Ensure child has enough remaining points (total - pending requests)
    const child = state.family?.children.find(c=>c.id===childId);
    const reward = state.rewards.find(r=>r.id===rewardId);
    if(!child || !reward) return;
    const pendingTotal = state.redemptions.filter(r=>r.childId===childId && r.status==='pending').reduce((sum,r)=>{
      const rew = state.rewards.find(rr=>rr.id===r.rewardId);
      return sum + (rew?.pointsCost||0);
    },0);
    const remaining = child.stats.totalPoints - pendingTotal;
    if(remaining < reward.pointsCost){
      alert('Not enough points for this reward yet!');
      return;
    }
    const newRed: Redemption = {
      id: 'red_' + Date.now(),
      rewardId,
      childId,
      status: 'pending',
      requestedAt: new Date(),
    };
    dispatch({ type: 'ADD_REDEMPTION', payload: newRed });
    await saveRedemptions([...state.redemptions, newRed]);
  };

  const approveRedemption = async (id: string, parentId: string) => {
    // Find redemption and reward details
    const redemption = state.redemptions.find(r => r.id === id);
    if (!redemption) return;
    const reward = state.rewards.find(r => r.id === redemption.rewardId);
    if (!reward) return;

    // Update child points in family
    let updatedFamily = state.family;
    if (state.family) {
      updatedFamily = {
        ...state.family,
        children: state.family.children.map(c =>
          c.id === redemption.childId
            ? {
                ...c,
                stats: {
                  ...c.stats,
                  totalPoints: Math.max(0, c.stats.totalPoints - reward.pointsCost),
                },
              }
            : c
        ),
      } as Family;
      await saveFamily(updatedFamily);
      dispatch({ type: 'SET_FAMILY', payload: updatedFamily });
    }

    // Update redemption status
    dispatch({ type: 'UPDATE_REDEMPTION_STATUS', payload: { id, status: 'approved', approvedBy: parentId } });
    await saveRedemptions(state.redemptions.map(r => r.id === id ? { ...r, status: 'approved', approvedAt: new Date(), approvedBy: parentId } : r));
  };

  const rejectRedemption = async (id: string, parentId: string) => {
    dispatch({ type: 'UPDATE_REDEMPTION_STATUS', payload: { id, status: 'rejected', approvedBy: parentId } });
    await saveRedemptions(state.redemptions.map(r => r.id === id ? { ...r, status: 'rejected', approvedAt: new Date(), approvedBy: parentId } : r));
  };

  const addReward = async (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: `reward_${Date.now()}`,
    };
    dispatch({ type: 'ADD_REWARD', payload: newReward });
    await saveRewards([...state.rewards, newReward]);
  };

  const addChild = async (
    childData: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    console.log('👶 Adding child:', childData);
    if (!state.family) {
      console.error('❌ No family found');
      return;
    }
    if (state.family.children.length >= state.family.settings.maxChildren) {
      throw new Error(
        `Maximum ${state.family.settings.maxChildren} children allowed`
      );
    }
    const newChild: Child = {
      ...childData,
      id: 'child_' + Date.now(),
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        level: 1,
        badges: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Child;
    
    console.log('👶 New child created:', newChild);
    
    // Create the updated family data first
    const updatedFamily = {
      ...state.family,
      children: [...state.family.children, newChild],
    };
    
    // Save to storage first
    console.log('💾 Saving updated family:', updatedFamily);
    await saveFamily(updatedFamily);
    
    // Then update the state
    dispatch({ type: 'ADD_CHILD', payload: newChild });
    
    console.log('✅ Child added successfully');
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      createdAt: new Date(),
      status: 'new',
    } as Task;
    dispatch({ type: 'ADD_TASK', payload: newTask });
    
    // Update child's totalTasks count
    dispatch({
      type: 'UPDATE_CHILD_STATS',
      payload: {
        childId: taskData.childId,
        stats: { totalTasks: (state.family?.children.find(c => c.id === taskData.childId)?.stats.totalTasks || 0) + 1 }
      }
    });
    
    await saveTasks([...state.tasks, newTask]);
    if (state.family) await saveFamily(state.family);
    
    // Google Calendar: create event for this task if authenticated and dueDate exists
    if (calendarAuth && newTask.dueDate) {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const childName = state.family?.children.find(c => c.id === newTask.childId)?.name ?? '';
        const eventId = await calCreateEvent({
          summary: newTask.title,
          description: `Task for ${childName}`,
          start: { dateTime: newTask.dueDate.toISOString(), timeZone: tz },
          end: { dateTime: new Date(newTask.dueDate.getTime() + 30 * 60000).toISOString(), timeZone: tz },
        });
        if (eventId) {
          // Persist eventId on task
          dispatch({ type: 'UPDATE_TASK', payload: { taskId: newTask.id, updates: { calendarEventId: eventId } } });
          await saveTasks(state.tasks.map(t => t.id === newTask.id ? { ...t, calendarEventId: eventId } : t));
        }
      } catch (e) {
        console.log('📅 Failed to create calendar event', e);
      }
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const existingTask = state.tasks.find(t => t.id === taskId);
    if (!existingTask) return;

    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    await saveTasks(state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));

    if (!calendarAuth) return;

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

      // If task already linked to event, update it
      if (existingTask.calendarEventId) {
        if (updates.dueDate === undefined && existingTask.dueDate) {
          // dueDate removed -> delete calendar event
          await calDeleteEvent(existingTask.calendarEventId);
          dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates: { calendarEventId: undefined } } });
        } else {
          const newDue = updates.dueDate ?? existingTask.dueDate;
          if (newDue) {
            await calUpdateEvent(existingTask.calendarEventId, {
              summary: updates.title ?? existingTask.title,
              start: { dateTime: newDue.toISOString(), timeZone: tz },
              end: { dateTime: new Date(newDue.getTime() + 30 * 60000).toISOString(), timeZone: tz },
            });
          }
        }
      } else if (!existingTask.calendarEventId && (updates.dueDate ?? existingTask.dueDate)) {
        // No event yet, but we now have a due date -> create one
        const due = updates.dueDate ?? existingTask.dueDate!;
        const childName = state.family?.children.find(c => c.id === existingTask.childId)?.name ?? '';
        const eventId = await calCreateEvent({
          summary: updates.title ?? existingTask.title,
          description: `Task for ${childName}`,
          start: { dateTime: due.toISOString(), timeZone: tz },
          end: { dateTime: new Date(due.getTime() + 30 * 60000).toISOString(), timeZone: tz },
        });
        if (eventId) {
          dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates: { calendarEventId: eventId } } });
          await saveTasks(state.tasks.map(t => t.id === taskId ? { ...t, calendarEventId: eventId } : t));
        }
      }
    } catch (e) {
      console.log('📅 Failed to update calendar event', e);
    }
  };

  const deleteTask = async (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Delete calendar event if linked
    if (calendarAuth && task.calendarEventId) {
      try {
        await calDeleteEvent(task.calendarEventId);
      } catch (e) {
        console.log('📅 Failed to delete calendar event', e);
      }
    }

    dispatch({ type: 'DELETE_TASK', payload: taskId });
    await saveTasks(state.tasks.filter(t => t.id !== taskId));
  };

  const reassignTask = async (taskId: string, newChildId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldChildId = task.childId;
    
    // If reassigning to the same child, just return (no changes needed)
    if (oldChildId === newChildId) {
      console.log('Task is already assigned to this child');
      return;
    }
    
    // When reassigning to a different child, reset completion status
    const taskUpdates = {
      childId: newChildId,
      isCompleted: false,
      completedAt: undefined,
      parentApproved: false,
    };
    
    // Update task assignment and reset completion
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates: taskUpdates } });
    
    // Update calendar event description if it exists
    if (calendarAuth && task.calendarEventId) {
      try {
        const newChildName = state.family?.children.find(c => c.id === newChildId)?.name ?? '';
        await calUpdateEvent(task.calendarEventId, {
          description: `Task for ${newChildName}`,
        });
      } catch (e) {
        console.log('📅 Failed to update calendar event description', e);
      }
    }

    // Save updated tasks with reset completion status
    await saveTasks(state.tasks.map(t => 
      t.id === taskId 
        ? { ...t, ...taskUpdates } 
        : t
    ));
    
    console.log(`Task "${task.title}" reassigned from ${state.family?.children.find(c => c.id === oldChildId)?.name} to ${state.family?.children.find(c => c.id === newChildId)?.name} and marked as incomplete`);
  };

  const completeTask = async (taskId: string, childId: string) => {
    // Mark as completed but not yet parent approved
    dispatch({
      type: 'COMPLETE_TASK',
      payload: { taskId, childId, completedAt: new Date() },
    });

    const updatedTasks = state.tasks.map(t =>
      t.id === taskId ? { ...t, isCompleted: true, completedAt: new Date(), status: 'done' } : t
    );
    await saveTasks(updatedTasks);
  };

  const approveTaskCompletion = async (taskId: string, parentId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || task.parentApproved) return;

    // Update task approval
    dispatch({ type: 'UPDATE_TASK_PARENT_APPROVAL', payload: { taskId, approved: true } });
    const updatedTasks = state.tasks.map(t => t.id === taskId ? { ...t, parentApproved: true } : t);
    await saveTasks(updatedTasks);

    // Add points to child now
    if (state.family) {
      const updatedFamily = {
        ...state.family,
        children: state.family.children.map(c => c.id === task.childId ? {
          ...c,
          stats: {
            ...c.stats,
            completedTasks: c.stats.completedTasks + 1,
            currentStreak: c.stats.currentStreak + 1,
            totalPoints: c.stats.totalPoints + task.points,
          }
        } : c)
      } as Family;
      await saveFamily(updatedFamily);
      dispatch({ type: 'SET_FAMILY', payload: updatedFamily });
    }
  };

  const rejectTaskCompletion = async (taskId: string, parentId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || task.parentApproved) return;
    // Simply mark task as not completed? Or reset
    dispatch({ type: 'UPDATE_TASK_PARENT_APPROVAL', payload: { taskId, approved: false } });
    const updatedTasks = state.tasks.map(t => t.id === taskId ? { ...t, isCompleted: false, status: 'in_progress', parentApproved: false } : t);
    await saveTasks(updatedTasks);
  };

  const redeemReward = async (rewardId: string, childId: string, pointsCost: number) => {
    if (!state.family) return;
    
    const child = state.family.children.find(c => c.id === childId);
    if (!child || child.stats.totalPoints < pointsCost) {
      throw new Error('Not enough points to redeem this reward');
    }
    
    // Deduct points from child
    dispatch({
      type: 'UPDATE_CHILD_STATS',
      payload: {
        childId,
        stats: { totalPoints: child.stats.totalPoints - pointsCost }
      }
    });
    
    if (state.family) await saveFamily(state.family);

    // If rewardId is provided, schedule experience reward placeholder
    // This would involve fetching the reward details and potentially scheduling it
    // For now, we'll just log the redemption.
    console.log(`Redeemed reward with ID: ${rewardId} for child ${childId} with ${pointsCost} points.`);
  };

  const logBehaviorEvent = async (
    event: Omit<BehaviorEvent, 'id' | 'timestamp'>
  ) => {
    if (!state.family) return;
    const newEvent: BehaviorEvent = {
      ...event,
      id: 'behavior_' + Date.now(),
      timestamp: new Date(),
    } as BehaviorEvent;
    const updatedFamily = {
      ...state.family,
      behaviorEvents: [...state.family.behaviorEvents, newEvent],
    };
    await saveFamily(updatedFamily);
    dispatch({ type: 'LOG_BEHAVIOR', payload: newEvent });
  };

  const getBehaviorHistory = (childId: string, days?: number) => {
    if (!state.family) return [];
    const child = state.family.children.find(c => c.id === childId);
    if (!child) return [];

    const history = child.behaviorEvents || [];
    return history.filter(event => {
      const eventDate = new Date(event.timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDay = new Date(eventDate);
      eventDay.setHours(0, 0, 0, 0);
      return eventDay >= today;
    }).slice(-(days || 30)); // Return last 'days' or 30 days
  };

  const syncWithCloud = async () => {
    console.log('Syncing with cloud...');
    // Implement cloud sync logic here
    // This might involve pushing data to a backend and pulling updates
    // For now, we'll just refresh local data
    await refreshData();
  };

  const exportData = async () => {
    if (!state.family) return JSON.stringify({ error: 'No family data' });
    return JSON.stringify(state.family);
  };

  const refreshData = async () => {
    console.log('🔄 Refreshing data...');
    await loadFamilyData();
  };

  const contextValue: FamilyContextType = {
    family: state.family,
    loading: state.loading,
    error: state.error,
    tasks: state.tasks,
    rewards: state.rewards,
    addChild,
    updateChild: async (childId, updates) => {
      dispatch({ type: 'UPDATE_CHILD', payload: { childId, updates } });
      if (state.family) await saveFamily(state.family);
    },
    removeChild: async (childId) => {
      dispatch({ type: 'REMOVE_CHILD', payload: childId });
      if (state.family) await saveFamily(state.family);
    },
    addTask,
    completeTask,
    updateTask,
    deleteTask,
    reassignTask,
    redeemReward,
    addCustomReward: async () => {},
    logBehaviorEvent,
    getBehaviorHistory,
    syncWithCloud,
    exportData,
    refreshData,
    requestRedemption,
    approveRedemption,
    rejectRedemption,
    redemptions: state.redemptions,
    addReward,
    approveTaskCompletion,
    rejectTaskCompletion,
  };

  return <FamilyContext.Provider value={contextValue}>{children}</FamilyContext.Provider>;
};

export const useFamily = () => {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider');
  return ctx;
}; 