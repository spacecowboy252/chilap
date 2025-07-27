import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, Child } from '../../types';
import { difficultyColors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  task: Task;
  assignedChild?: Child;
  onPress?: () => void;
  onReassign?: () => void;
  showReassignButton?: boolean;
}

export const TaskCard: React.FC<Props> = ({ 
  task, 
  assignedChild, 
  onPress, 
  onReassign, 
  showReassignButton = false 
}) => {
  const borderColor = difficultyColors[task.difficulty];
  const cardHeight = showReassignButton ? 220 : assignedChild ? 200 : 160;

  return (
    <TouchableOpacity style={[styles.card, { borderColor, height: cardHeight }]} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{task.icon || '⭐️'}</Text>
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>
      
      <Text style={styles.points}>+{task.points}</Text>
      
      {/* Assigned Child Info */}
      {assignedChild && (
        <View style={styles.assignedChild}>
          <View style={[styles.childAvatar, { backgroundColor: assignedChild.preferences?.favoriteColors?.[0] || '#007bff' }]}>
            <Text style={styles.childAvatarText}>{assignedChild.avatar}</Text>
          </View>
          <Text style={styles.childName} numberOfLines={1}>{assignedChild.name}</Text>
        </View>
      )}
      
      {/* Reassign Button */}
      {showReassignButton && onReassign && (
        <TouchableOpacity 
          style={styles.reassignButton} 
          onPress={(e) => {
            e.stopPropagation(); // Prevent card press
            onReassign();
          }}
        >
          <Ionicons name="swap-horizontal" size={16} color="#007bff" />
          <Text style={styles.reassignText}>Reassign</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
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
  assignedChild: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  childAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  childAvatarText: {
    fontSize: 14,
    color: '#fff',
  },
  childName: {
    fontSize: 12,
    fontWeight: '500',
  },
  reassignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  reassignText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 