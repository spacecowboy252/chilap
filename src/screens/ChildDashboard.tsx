import React from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeScrollView } from '../components/SafeScrollView';
import { useFamily } from '../context/FamilyContext';
import { useCelebration } from '../context/CelebrationContext';
import { TaskPill } from '../components/TaskPill';
import { TaskCelebrationModal } from '../components/TaskCelebrationModal';
import { ProgressCard } from '../components/child/ProgressCard';
import { BackgroundPattern } from '../components/graphics/BackgroundPattern';
import { FloatingElements } from '../components/graphics/FloatingElements';
import { theme } from '../constants/theme';

interface Props {
  route?: { params?: { childId?: string } };
  navigation: any;
}

const ChildDashboard: React.FC<Props> = ({ route, navigation }) => {
  const { family, completeTask, tasks, rewards, requestRedemption, redemptions } = useFamily();
  const { show } = useCelebration();

  // Get childId from route params or use the first available child
  const childId = route?.params?.childId || family?.children[0]?.id;
  
  const child = family?.children.find((c) => c.id === childId);
  
  if (!child) {
    console.error('No child available');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.childName}>No children available</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.message}>Please add a child first</Text>
          <TouchableOpacity 
            style={styles.addChildButton}
            onPress={() => navigation.navigate('AddChild')}
          >
            <Text style={styles.addChildButtonText}>Add Child</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const today = new Date().toDateString();
  const todaysTasks = tasks.filter((t) => 
    t.childId === childId && 
    (!t.dueDate || new Date(t.dueDate).toDateString() === today)
  );

  const completedTasks = todaysTasks.filter(t => t.isCompleted).length;
  const progressPercentage = todaysTasks.length > 0 ? (completedTasks / todaysTasks.length) * 100 : 0;
  const isPerfectDay = completedTasks === todaysTasks.length && todaysTasks.length > 0;
  
  // Calculate points for different time periods
  const pointsToday = todaysTasks.filter(t => t.isCompleted && t.parentApproved).reduce((sum, task) => sum + task.points, 0);
  const pointsThisWeek = tasks.filter(t => {
    if (!t.isCompleted || !t.parentApproved || !t.completedAt) return false;
    const taskDate = new Date(t.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= weekAgo && t.childId === childId;
  }).reduce((sum, task) => sum + task.points, 0);

  // Calculate points from completed but not yet parent-approved tasks
  const pendingTaskPoints = todaysTasks.filter(t => t.isCompleted && !t.parentApproved).reduce((sum, task) => sum + task.points, 0);

  // Calculate remaining points after pending redemptions using the redemptions from context
  const pendingRedemptions = redemptions.filter(r => r.childId === childId && r.status === 'pending');
  const pendingPoints = pendingRedemptions.reduce((sum, redemption) => {
    const reward = rewards.find(r => r.id === redemption.rewardId);
    return sum + (reward?.pointsCost || 0);
  }, 0);
  
  // Total available points = awarded points + pending task points - pending redemption points
  const remainingPoints = child.stats.totalPoints + pendingTaskPoints - pendingPoints;
  
  const availableRewards = rewards.filter(r => 
    r.isAvailable && r.pointsCost <= remainingPoints
  ).slice(0, 6); // Show more rewards
  
  // Debug logging
  console.log('🎯 ChildDashboard - Rewards Debug:', {
    totalRewards: rewards.length,
    availableRewards: availableRewards.length,
    childPoints: child.stats.totalPoints,
    pendingPoints,
    remainingPoints,
    pendingRedemptions: pendingRedemptions.length,
    rewards: rewards.map(r => ({ title: r.title, pointsCost: r.pointsCost, isAvailable: r.isAvailable }))
  });
  
  // Also log to alert for immediate visibility
  if (rewards.length === 0) {
    console.warn('⚠️ No rewards found in system!');
  }
  if (availableRewards.length === 0 && rewards.length > 0) {
    console.warn('⚠️ Rewards exist but none are available!', {
      childPoints: child.stats.totalPoints,
      remainingPoints,
      rewards: rewards.map(r => ({ title: r.title, pointsCost: r.pointsCost, isAvailable: r.isAvailable }))
    });
  }

  const onComplete = async (taskId: string, childId: string) => {
    const task = todaysTasks.find((t) => t.id === taskId);
    if (!task || task.isCompleted) return;

    try {
      // Mark task as completed first
      await completeTask(taskId, childId);
      
      // Show celebration with the points that will be awarded
      setTimeout(() => {
        show({
          childName: child.name,
          points: task.points, // Show the actual points that will be awarded
          taskTitle: task.title,
        });
      }, 100);
      
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const onRedeemReward = async (rewardId: string) => {
    console.log('🎁 onRedeemReward called with rewardId:', rewardId);
    
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      console.error('❌ Reward not found with id:', rewardId);
      return;
    }

    console.log('🎁 Found reward:', reward.title);

    // Debug logging for points calculation
    console.log('🎁 Reward Redemption Debug:', {
      rewardTitle: reward.title,
      rewardCost: reward.pointsCost,
      childTotalPoints: child.stats.totalPoints,
      pendingTaskPoints,
      pendingRedemptionPoints: pendingPoints,
      remainingPoints,
      hasEnoughPoints: reward.pointsCost <= remainingPoints
    });

    // Check if child has enough remaining points
    if (reward.pointsCost > remainingPoints) {
      console.warn('❌ Not enough points for reward:', {
        needed: reward.pointsCost,
        available: remainingPoints,
        difference: reward.pointsCost - remainingPoints
      });
      
      if (Platform.OS === 'web') {
        alert(`Not enough points! You need ${reward.pointsCost} points but only have ${remainingPoints} available.`);
      } else {
        Alert.alert('Not Enough Points', `You need ${reward.pointsCost} points but only have ${remainingPoints} available. Keep completing tasks!`, [{ text: 'OK' }]);
      }
      return;
    }

    try {
      console.log('🎁 Attempting to request redemption...');
      // Request the redemption
      await requestRedemption(rewardId, child.id);
      
      console.log('🎁 Redemption requested successfully!');
      
      // Show success feedback
      if (Platform.OS === 'web') {
        alert(`🎁 Reward "${reward.title}" requested! Waiting for parent approval.`);
      } else {
        Alert.alert(
          'Reward Requested! 🎁', 
          `"${reward.title}" has been requested! Your parent will approve it soon.`,
          [{ text: 'Awesome!' }]
        );
      }
      
      console.log('🎁 Reward redemption requested successfully!');
    } catch (error) {
      console.error('❌ Error redeeming reward:', error);
      if (Platform.OS === 'web') {
        alert('Something went wrong. Please try again!');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again!', [{ text: 'OK' }]);
      }
    }
  };

  const getChildAvatar = () => {
    return child.age <= 6 ? '👶' : child.age <= 8 ? '🧒' : child.age <= 10 ? '👦' : '👧';
  };

  return (
    <SafeAreaView style={[styles.container, isPerfectDay && styles.celebrationContainer]}>
      {/* Background Pattern */}
      {/* <BackgroundPattern opacity={1.0} /> */}
      
      {/* Floating Decorative Elements */}
      {/* <FloatingElements /> */}
      
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
            <Text style={styles.childLevel}>
              Level {child.stats.level} • {remainingPoints}/{child.stats.totalPoints} points
              {pendingPoints > 0 && ` (${pendingPoints} pending)`}
            </Text>
          </View>
        </View>
      </View>

      <SafeScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Section */}
        <View style={styles.section}>
          <ProgressCard 
            child={child}
            completedTasks={completedTasks}
            totalTasks={todaysTasks.length}
            pointsToday={pointsToday}
            pointsThisWeek={pointsThisWeek}
            remainingPoints={remainingPoints}
            pendingPoints={pendingPoints}
          />
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.tasksCard}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <View style={styles.tasksContainer}>
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => (
                  <TaskPill 
                    key={task.id} 
                    task={task} 
                    onPress={() => onComplete(task.id, child.id)} 
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>🎉 All done for today!</Text>
                  <Text style={styles.emptySubtext}>Great job completing all your tasks!</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <View style={styles.rewardsCard}>
            <Text style={styles.sectionTitle}>🎁 Available Rewards</Text>
            {rewards.length > 0 ? (
              <View style={styles.rewardsGrid}>
                {rewards.map((reward) => {
                  const isAvailable = reward.pointsCost <= remainingPoints;
                  return (
                    <TouchableOpacity 
                      key={reward.id} 
                      style={[
                        styles.rewardCard,
                        isAvailable ? styles.availableRewardCard : styles.unavailableRewardCard
                      ]}
                      onPress={isAvailable ? () => onRedeemReward(reward.id) : undefined}
                      activeOpacity={isAvailable ? 0.7 : 1}
                      disabled={!isAvailable}
                    >
                      <Text style={[
                        styles.rewardIcon,
                        isAvailable ? styles.availableRewardIcon : styles.unavailableRewardIcon
                      ]}>
                        🎁
                      </Text>
                      <Text style={[
                        styles.rewardTitle,
                        isAvailable ? styles.availableRewardTitle : styles.unavailableRewardTitle
                      ]}>
                        {reward.title}
                      </Text>
                      <Text style={[
                        styles.rewardCost,
                        isAvailable ? styles.availableRewardCost : styles.unavailableRewardCost
                      ]}>
                        {reward.pointsCost} pts
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyRewardsState}>
                <Text style={styles.emptyRewardsText}>No rewards available yet</Text>
                <Text style={styles.emptyRewardsSubtext}>Complete more tasks to unlock rewards!</Text>
              </View>
            )}
          </View>
        </View>
      </SafeScrollView>

      <TaskCelebrationModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  celebrationContainer: {
    backgroundColor: '#f0f9eb', // Light green background for celebration
    borderColor: '#a5d6a7',
    borderWidth: 2,
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
    height: '100%',
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'], // Add some padding at the bottom for the modal
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
  tasksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tasksContainer: {
    gap: 12,
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
  rewardsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  rewardCard: {
    backgroundColor: '#F0F9FF', // Light blue background
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '48%', // Two columns
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  emptyRewardsState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyRewardsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#626C71',
    marginBottom: 8,
  },
  emptyRewardsSubtext: {
    fontSize: 14,
    color: '#626C71',
    textAlign: 'center',
  },
  // New styles for available/unavailable rewards
  availableRewardCard: {
    backgroundColor: '#E8F5E9', // Light green background
    borderColor: '#4CAF50', // Green border
    borderWidth: 1,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableRewardCard: {
    backgroundColor: '#F8F9FA', // Very light grey background
    borderColor: '#E9ECEF', // Light grey border
    borderWidth: 1,
    opacity: 0.6, // Make it look more disabled
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  availableRewardIcon: {
    color: '#2E7D32', // Dark green icon for available rewards
    fontSize: 32,
  },
  unavailableRewardIcon: {
    color: '#BDBDBD', // Light grey icon for unavailable rewards
    fontSize: 32,
  },
  availableRewardTitle: {
    color: '#1B5E20', // Very dark green for available rewards
    fontSize: theme.typography.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  unavailableRewardTitle: {
    color: '#9E9E9E', // Grey for unavailable rewards
    fontSize: theme.typography.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  availableRewardCost: {
    color: '#2E7D32', // Dark green for available rewards
    fontSize: theme.typography.xs,
    fontWeight: '700',
  },
  unavailableRewardCost: {
    color: '#BDBDBD', // Light grey for unavailable rewards
    fontSize: theme.typography.xs,
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addChildButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addChildButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChildDashboard; 