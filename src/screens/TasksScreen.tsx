import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { Task } from '../types';
import { TaskListSection } from '../components/task/TaskListSection';
import { TaskModal } from '../components/task/TaskModal';
import { Ionicons } from '@expo/vector-icons';

export const TasksScreen: React.FC = () => {
  const { tasks, family, addTask } = useFamily();
  const [showModal, setShowModal] = useState(false);

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
      status: 'new',
    } as Omit<Task, 'id' | 'createdAt'>);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TaskListSection
          title="Overdue"
          tasks={sections.overdue}
        />
        <TaskListSection title="Today" tasks={sections.todayTasks} />
        <TaskListSection title="Upcoming" tasks={sections.upcoming} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>

      {family && (
        <TaskModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
          childrenOptions={family.children}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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