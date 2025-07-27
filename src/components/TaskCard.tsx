import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Task, Child } from '../types';
import { theme } from '../constants/theme';

interface Props {
  task: Task;
  child: Child;
  onComplete: (taskId: string, childId: string) => void;
}

export const TaskCard: React.FC<Props> = ({ task, child, onComplete }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const press = () => {
    if (task.isCompleted) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => onComplete(task.id, child.id));
  };

  const diffColor = {
    easy: theme.colors.primary,
    medium: theme.colors.accent,
    hard: theme.colors.secondary,
  }[task.difficulty];

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          { borderLeftColor: diffColor },
          task.isCompleted && styles.cardCompleted,
        ]}
        onPress={press}
        disabled={task.isCompleted}
      >
        {/* Task Content - Always Visible */}
        <View style={styles.taskContent}>
          <Text style={[
            styles.title, 
            task.isCompleted && styles.titleCompleted
          ]}>
            {task.title}
          </Text>
          
          {task.description && (
            <Text style={[
              styles.desc, 
              task.isCompleted && styles.descCompleted
            ]}>
              {task.description}
            </Text>
          )}
        </View>

        {/* Points Badge - Always Visible */}
        <View style={[
          styles.pointsBadge, 
          { backgroundColor: diffColor },
          task.isCompleted && styles.pointsBadgeCompleted
        ]}>
          <Text style={styles.pointsText}>+{task.points}</Text>
        </View>

        {/* Completion Celebration Overlay - Only when completed */}
        {task.isCompleted && (
          <View style={styles.celebrationOverlay}>
            <View style={styles.celebrationContent}>
              <Text style={styles.celebrationIcon}>🎉</Text>
              <Text style={styles.celebrationText}>COMPLETED!</Text>
              <Text style={styles.checkmark}>✅</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 6,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: '#f0f9ff', // Light celebration background
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  titleCompleted: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  descCompleted: {
    color: theme.colors.primary,
  },
  pointsBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pointsBadgeCompleted: {
    backgroundColor: '#22c55e', // Green for completed
  },
  pointsText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  celebrationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(34, 197, 94, 0.9)', // Semi-transparent green
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  celebrationIcon: {
    fontSize: 20,
  },
  celebrationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
  },
});