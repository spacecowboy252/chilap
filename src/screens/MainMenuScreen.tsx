import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { BackgroundPattern } from '../components/graphics/BackgroundPattern';
import { FloatingElements } from '../components/graphics/FloatingElements';
import { theme } from '../constants/theme';

interface Props {
  navigation: any;
}

export const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const { family, tasks } = useFamily();

  const totalTasksToday = tasks.length;
  const completedTasksToday = tasks.filter(t => t.isCompleted).length;
  const totalPoints = family?.children.reduce((sum, child) => sum + child.stats.totalPoints, 0) || 0;
  const streakDays = Math.max(...(family?.children.map(c => c.stats.currentStreak) || [0]));

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Pattern */}
      <BackgroundPattern opacity={1.0} />
      
      {/* Floating Decorative Elements */}
      <FloatingElements />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>🌟 KidsTracker 🌟</Text>
          <Text style={styles.appSubtitle}>Making good behavior fun!</Text>
        </View>

        <View style={styles.menuButtons}>
          <TouchableOpacity 
            style={[styles.menuButton, styles.primaryButton]}
            onPress={() => navigation.navigate('ParentDashboard')}
          >
            <Text style={styles.primaryButtonText}>👨‍👩‍👧‍👦 Parent Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('ChildSelection')}
          >
            <Text style={styles.secondaryButtonText}>🧒 Child View</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.familyStats}>
          <Text style={styles.statsTitle}>Today's Family Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedTasksToday}</Text>
              <Text style={styles.statLabel}>Tasks Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  appTitle: {
    fontSize: theme.typography['4xl'],
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  appSubtitle: {
    fontSize: theme.typography.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  menuButtons: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
  },
  menuButton: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing['2xl'],
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  primaryButtonText: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.surface,
  },
  secondaryButtonText: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.text,
  },
  familyStats: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing['2xl'],
    ...theme.shadows.sm,
  },
  statsTitle: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: theme.typography['3xl'],
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
}); 