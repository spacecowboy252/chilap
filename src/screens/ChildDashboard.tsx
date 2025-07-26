import React from 'react';
import { View, ScrollView, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { useCelebration } from '../context/CelebrationContext';
import { TaskCard } from '../components/TaskCard';
import { TaskCelebrationModal } from '../components/TaskCelebrationModal';
import { theme } from '../constants/theme';

interface Props {
  route: { params: { childId: string } };
  navigation: any;
}

const ChildDashboard: React.FC<Props> = ({ route, navigation }) => {
  const { childId } = route.params;
  const { family, completeTask, tasks, rewards } = useFamily();
  const { show } = useCelebration();

  const child = family?.children.find((c) => c.id === childId);
  if (!child) return null;

  const today = new Date().toDateString();
  const todaysTasks = tasks.filter((t) => 
    t.childId === childId && 
    (!t.dueDate || new Date(t.dueDate).toDateString() === today)
  );

  const completedTasks = todaysTasks.filter(t => t.isCompleted).length;
  const progressPercentage = todaysTasks.length > 0 ? (completedTasks / todaysTasks.length) * 100 : 0;

  const availableRewards = rewards.filter(r => r.isAvailable && r.pointsCost <= child.stats.totalPoints).slice(0, 3);

  const onComplete = async (taskId: string, childId: string) => {
    const task = todaysTasks.find((t) => t.id === taskId);
    if (!task) return;
    await completeTask(taskId, childId);

    show({
      childName: child.name,
      points: task.points,
      taskTitle: task.title,
    });
  };

  const getChildAvatar = () => {
    return child.age <= 6 ? '👶' : child.age <= 8 ? '🧒' : child.age <= 10 ? '👦' : '👧';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.childInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{getChildAvatar()}</Text>
          </View>
          <View>
            <Text style={styles.childName}>{child.name}'s Dashboard</Text>
            <Text style={styles.childLevel}>Level {child.stats.level} • {child.stats.totalPoints} points</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress Today</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Tasks Completed</Text>
              <Text style={styles.progressNumbers}>{completedTasks}/{todaysTasks.length}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <View style={styles.tasksContainer}>
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <TaskCard key={task.id} task={task} child={child} onComplete={onComplete} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>🎉 All done for today!</Text>
                <Text style={styles.emptySubtext}>Great job completing all your tasks!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Rewards Section */}
        {availableRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎁 Available Rewards</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsScroll}>
              {availableRewards.map((reward) => (
                <View key={reward.id} style={styles.rewardCard}>
                  <Text style={styles.rewardIcon}>🎁</Text>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardCost}>{reward.pointsCost} pts</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <TaskCelebrationModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.lg,
  },
  backText: {
    fontSize: theme.typography.base,
    color: theme.colors.text,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatar: {
    fontSize: 24,
  },
  childName: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.text,
  },
  childLevel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressText: {
    fontSize: theme.typography.base,
    color: theme.colors.text,
  },
  progressNumbers: {
    fontSize: theme.typography.lg,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
  },
  progressPercentage: {
    fontSize: theme.typography.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    minWidth: 40,
  },
  tasksContainer: {
    gap: theme.spacing.sm,
  },
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing['2xl'],
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  emptyText: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  rewardsScroll: {
    paddingLeft: theme.spacing.xl,
  },
  rewardCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    minWidth: 100,
    ...theme.shadows.sm,
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  rewardTitle: {
    fontSize: theme.typography.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  rewardCost: {
    fontSize: theme.typography.xs,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default ChildDashboard; 