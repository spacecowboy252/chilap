import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../../types';
import { difficultyColors } from '../../constants/theme';

interface Props {
  task: Task;
  onPress?: () => void;
}

export const TaskCard: React.FC<Props> = ({ task, onPress }) => {
  const borderColor = difficultyColors[task.difficulty];

  return (
    <TouchableOpacity style={[styles.card, { borderColor }]} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{task.icon || '⭐️'}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>
      <Text style={styles.points}>+{task.points}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 160,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderRadius: 16,
    marginRight: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginTop: 8,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007bff',
    marginBottom: 4,
  },
}); 