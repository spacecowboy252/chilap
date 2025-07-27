import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { theme } from '../constants/theme';

interface Props {
  task: Task;
  onPress: () => void;
}

export const TaskPill: React.FC<Props> = ({ task, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.pill, task.isCompleted && styles.pillCompleted]}
      onPress={onPress}
      disabled={task.isCompleted}
      activeOpacity={0.7}
    >
      {/* Checkbox on the left */}
      <View style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}>
        {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>
      
      {/* Title in the center */}
      <Text style={[styles.title, task.isCompleted && styles.titleCompleted]}>
        {task.title}
      </Text>
      
      {/* Points chip on the right */}
      <View style={[styles.pointsChip, task.isCompleted && styles.pointsChipCompleted]}>
        <Text style={styles.pointsText}>+{task.points} pts</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3FF', // Light teal background
    borderWidth: 1,
    borderColor: '#21808D', // Darker teal border
    borderRadius: 25, // More rounded for pill shape
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillCompleted: {
    backgroundColor: '#F0F9FF', // Lighter background when completed
    borderColor: '#21808D',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#21808D', // Darker teal border
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#21808D', // Darker teal background when checked
    borderColor: '#21808D',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#13343B', // Dark text
  },
  titleCompleted: {
    color: '#626C71', // Muted text when completed
  },
  pointsChip: {
    backgroundColor: '#21808D', // Darker teal background
    borderRadius: 15, // Rounded pill shape
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pointsChipCompleted: {
    backgroundColor: '#21808D', // Same color when completed
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
}); 