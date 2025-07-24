import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Family,
  Child,
  Task,
  Reward,
  BehaviorEvent,
} from '../types';

interface FamilyContextType {
  family: Family | null;
  loading: boolean;
  error: string | null;
  tasks: Task[];
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
  // Reward System
  redeemReward: (rewardId: string, childId: string) => Promise<void>;
  addCustomReward: (reward: Omit<Reward, 'id'>) => Promise<void>;
  // Behavior Tracking
  logBehaviorEvent: (
    event: Omit<BehaviorEvent, 'id' | 'timestamp'>
  ) => Promise<void>;
  getBehaviorHistory: (childId: string, days?: number) => BehaviorEvent[];
  // Data Sync
  syncWithCloud: () => Promise<void>;
  exportData: () => Promise<string>;
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
  | { type: 'SET_TASKS'; payload: Task[] };

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

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
      const { taskId, childId } = action.payload;
      return {
        ...state,
        family: {
          ...state.family,
          children: state.family.children.map((child: Child) => {
            if (child.id === childId) {
              return {
                ...child,
                stats: {
                  ...child.stats,
                  completedTasks: child.stats.completedTasks + 1,
                  currentStreak: child.stats.currentStreak + 1,
                  totalPoints: child.stats.totalPoints + 10, // TODO
                },
              };
            }
            return child;
          }),
        },
      };
    case 'LOG_BEHAVIOR':
      return { ...state }; // Placeholder
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
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
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stored = await AsyncStorage.getItem('family_data');
      if (stored) {
        const parsedFamily = JSON.parse(stored);
        dispatch({ type: 'SET_FAMILY', payload: parsedFamily });
      } else {
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
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  };

  const saveFamily = async (family: Family) => {
    await AsyncStorage.setItem('family_data', JSON.stringify(family));
  };

  const saveTasks = async (tasks: Task[]) => {
    await AsyncStorage.setItem('family_tasks', JSON.stringify(tasks));
  };

  const addChild = async (
    childData: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!state.family) return;
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
    dispatch({ type: 'ADD_CHILD', payload: newChild });
    const updated = { ...state.family, children: [...state.family.children, newChild] };
    await saveFamily(updated);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      createdAt: new Date(),
      status: 'new',
    } as Task;
    dispatch({ type: 'ADD_TASK', payload: newTask });
    await saveTasks([...state.tasks, newTask]);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
    await saveTasks(state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const deleteTask = async (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    await saveTasks(state.tasks.filter(t => t.id !== taskId));
  };

  const completeTask = async (taskId: string, childId: string) => {
    dispatch({
      type: 'COMPLETE_TASK',
      payload: { taskId, childId, completedAt: new Date() },
    });
    if (state.family) await saveFamily(state.family);
  };

  const contextValue: FamilyContextType = {
    family: state.family,
    loading: state.loading,
    error: state.error,
    tasks: state.tasks,
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
    redeemReward: async () => {},
    addCustomReward: async () => {},
    logBehaviorEvent: async () => {},
    getBehaviorHistory: () => [],
    syncWithCloud: async () => {},
    exportData: async () => JSON.stringify(state.family),
  };

  return <FamilyContext.Provider value={contextValue}>{children}</FamilyContext.Provider>;
};

export const useFamily = () => {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider');
  return ctx;
}; 