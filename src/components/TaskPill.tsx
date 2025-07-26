import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { theme } from '../constants/theme';

interface Props {
  task: Task;
  onPress: () => void;
}

export const TaskPill: React.FC<Props> = ({ task, onPress }) => {
  const border = task.isCompleted ? theme.colors.success : theme.colors.primary;
  return (
    <TouchableOpacity
      style={[styles.pill, { borderColor: border, opacity: task.isCompleted ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={task.isCompleted}
    >
      <Text style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}>✔</Text>
      <Text style={[styles.title, task.isCompleted && styles.titleDone]}>{task.title}</Text>
      <View style={styles.pointsChip}><Text style={styles.pointsText}>+{task.points} pts</Text></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    textAlign: 'center',
    marginRight: 12,
    fontSize: 16,
    color: theme.colors.secondary,
  },
  checkboxChecked: { color: theme.colors.success },
  title: { flex: 1, fontSize: theme.typography.base, color: theme.colors.text },
  titleDone: { textDecorationLine: 'line-through', color: theme.colors.textSecondary },
  pointsChip: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointsText: { fontSize: 12, fontWeight: '600', color: theme.colors.text },
}); 