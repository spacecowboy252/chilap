// Updated onComplete function for ChildDashboard.tsx
// Replace your existing onComplete function with this code:

const onComplete = async (taskId: string, childId: string) => {
  const task = todaysTasks.find((t) => t.id === taskId);
  if (!task || task.isCompleted) return;

  try {
    // Mark task as completed first
    await completeTask(taskId, childId);
    
    // Small delay to ensure UI updates, then show celebration
    setTimeout(() => {
      show({
        childName: child.name,
        points: task.points,
        taskTitle: task.title,
      });
    }, 100);
    
  } catch (error) {
    console.error('Error completing task:', error);
  }
};

// FULL ChildDashboard.tsx FILE (if you need the complete file):

import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { useCelebration } from '../context/CelebrationContext';
import { TaskCard } from '../components/TaskCard';
import { TaskCelebrationModal } from '../components/TaskCelebrationModal';
import { theme } from '../constants/theme';

interface Props {
  route: { params: { childId: string } };
}

const ChildDashboard: React.FC<Props> = ({ route }) => {
  const { childId } = route.params;
  const { family, completeTask } = useFamily();
  const { show } = useCelebration();

  const child = family?.children.find((c) => c.id === childId);
  if (!child) return null;

  const today = new Date().toDateString();
  const todaysTasks = child.tasks.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  );

  const onComplete = async (taskId: string, childId: string) => {
    const task = todaysTasks.find((t) => t.id === taskId);
    if (!task || task.isCompleted) return;

    try {
      // Mark task as completed first
      await completeTask(taskId, childId);
      
      // Small delay to ensure UI updates, then show celebration
      setTimeout(() => {
        show({
          childName: child.name,
          points: task.points,
          taskTitle: task.title,
        });
      }, 100);
      
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Tasks</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {todaysTasks.map((t) => (
          <TaskCard key={t.id} task={t} child={child} onComplete={onComplete} />
        ))}
      </ScrollView>

      <TaskCelebrationModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
    marginVertical: 18,
    marginLeft: 16,
  },
  list: { paddingBottom: 120 },
});

export default ChildDashboard;