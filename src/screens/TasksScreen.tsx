import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { SafeScrollView } from '../components/SafeScrollView';
import { useFamily } from '../context/FamilyContext';
import { Task } from '../types';
import { TaskListSection } from '../components/task/TaskListSection';
import { TaskModal } from '../components/task/TaskModal';
import { ReassignTaskModal } from '../components/task/ReassignTaskModal';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

type Props = {
  navigation: any;
};

export const TasksScreen: React.FC<Props> = ({ navigation }) => {
  const { tasks, family, addTask, reassignTask } = useFamily();
  const [showModal, setShowModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const today = new Date();

  const sections = useMemo(() => {
    const todayTasks: Task[] = [];
    const overdue: Task[] = [];
    const upcoming: Task[] = [];

    tasks.forEach((task) => {
      if (!task.dueDate) {
        upcoming.push(task);
        return;
      }
      const due = new Date(task.dueDate);
      if (due.toDateString() === today.toDateString()) {
        todayTasks.push(task);
      } else if (due < today) {
        overdue.push(task);
      } else {
        upcoming.push(task);
      }
    });
    return { overdue, todayTasks, upcoming };
  }, [tasks]);

  const handleSaveTask = async (data: {
    title: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
    icon: string;
    childId: string;
    dueDate?: Date;
  }) => {
    await addTask({
      childId: data.childId,
      title: data.title,
      points: data.points,
      difficulty: data.difficulty,
      icon: data.icon,
      color: undefined,
      category: 'chores',
      isCompleted: false,
      parentApproved: true,
      dueDate: data.dueDate,
      status: 'new',
    } as Omit<Task, 'id' | 'createdAt'>);
  };

  const handleReassignPress = (task: Task) => {
    setSelectedTask(task);
    setShowReassignModal(true);
  };

  const handleReassign = async (newChildId: string) => {
    if (selectedTask) {
      await reassignTask(selectedTask.id, newChildId);
      setSelectedTask(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Tasks</Text>
        <TouchableOpacity 
          style={styles.reassignModeButton}
          onPress={() => {/* Could toggle reassign mode */}}
        >
          <Ionicons name="swap-horizontal" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <SafeScrollView 
        style={styles.scrollView}
      >
        <TaskListSection
          title="Overdue"
          tasks={sections.overdue}
          children={family?.children || []}
          onReassignPress={handleReassignPress}
          showReassignButtons={true}
        />
        <TaskListSection 
          title="Today" 
          tasks={sections.todayTasks} 
          children={family?.children || []}
          onReassignPress={handleReassignPress}
          showReassignButtons={true}
        />
        <TaskListSection 
          title="Upcoming" 
          tasks={sections.upcoming} 
          children={family?.children || []}
          onReassignPress={handleReassignPress}
          showReassignButtons={true}
        />
      </SafeScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>

      {family && (
        <>
          <TaskModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSaveTask}
            childrenOptions={family.children}
          />
          
          <ReassignTaskModal
            visible={showReassignModal}
            onClose={() => setShowReassignModal(false)}
            onReassign={handleReassign}
            task={selectedTask}
            children={family.children}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  reassignModeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    height: '100%',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
}); 