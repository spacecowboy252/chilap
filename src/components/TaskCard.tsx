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
          task.isCompleted && styles.cardDone,
        ]}
        onPress={press}
        disabled={task.isCompleted}
      >
        <View>
          <Text style={[styles.title, task.isCompleted && styles.titleDone]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={[styles.desc, task.isCompleted && styles.descDone]}>
              {task.description}
            </Text>
          ) : null}
        </View>

        <View style={[styles.pointsBadge, { backgroundColor: diffColor }]}>
          <Text style={styles.pointsText}>+{task.points}</Text>
        </View>

        {task.isCompleted && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>✅</Text>
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 12,
    borderLeftWidth: 5,
  },
  cardDone: {
    opacity: 0.6,
  },
  title: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  desc: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  descDone: {
    textDecorationLine: 'line-through',
  },
  pointsBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pointsText: { color: 'white', fontWeight: 'bold' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: { fontSize: 38 },
}); 