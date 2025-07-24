import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface Props {
  title: string;
  tasks: Task[];
  onTaskPress?: (task: Task) => void;
}

export const TaskListSection: React.FC<Props> = ({ title, tasks, onTaskPress }) => {
  if (tasks.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => onTaskPress?.(item)} />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  title: { fontSize: 20, fontWeight: '700', marginLeft: 20, marginBottom: 8 },
}); 