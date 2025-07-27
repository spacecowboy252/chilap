import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Task, Child } from '../../types';
import { TaskCard } from './TaskCard';

interface Props {
  title: string;
  tasks: Task[];
  children: Child[];
  onTaskPress?: (task: Task) => void;
  onReassignPress?: (task: Task) => void;
  showReassignButtons?: boolean;
}

export const TaskListSection: React.FC<Props> = ({ 
  title, 
  tasks, 
  children, 
  onTaskPress, 
  onReassignPress, 
  showReassignButtons = false 
}) => {
  if (tasks.length === 0) return null;

  const getAssignedChild = (task: Task) => {
    return children.find(child => child.id === task.childId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            assignedChild={getAssignedChild(item)}
            onPress={() => onTaskPress?.(item)} 
            onReassign={() => onReassignPress?.(item)}
            showReassignButton={showReassignButtons}
          />
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