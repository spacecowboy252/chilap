import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Child, Task } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onReassign: (newChildId: string) => void;
  task: Task | null;
  children: Child[];
}

export const ReassignTaskModal: React.FC<Props> = ({
  visible,
  onClose,
  onReassign,
  task,
  children,
}) => {
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  const handleReassign = () => {
    if (selectedChildId && task) {
      onReassign(selectedChildId);
      setSelectedChildId('');
      onClose();
    }
  };

  const currentChild = children.find(c => c.id === task?.childId);
  const availableChildren = children; // Show all children, not filtered
  const isReassigningToSame = selectedChildId === task?.childId;
  const buttonText = isReassigningToSame ? 'Confirm Assignment' : 'Assign Task';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Assign Task</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Task Info */}
          {task && (
            <View style={styles.taskInfo}>
              <View style={styles.taskIconContainer}>
                <Text style={styles.taskIcon}>{task.icon || '⭐'}</Text>
              </View>
              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.currentAssignment}>
                  Currently assigned to: <Text style={styles.childName}>{currentChild?.name}</Text>
                </Text>
                <View style={styles.taskStatus}>
                  <Text style={styles.taskPoints}>+{task.points} points</Text>
                  <Text style={[styles.completionStatus, task.isCompleted ? styles.completed : styles.incomplete]}>
                    {task.isCompleted ? '✅ Completed' : '⏳ Incomplete'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Child Selection */}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Assign to:</Text>
            
            {/* Warning for reassignment */}
            {selectedChildId && selectedChildId !== task?.childId && task?.isCompleted && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#ff9800" />
                <Text style={styles.warningText}>
                  This task is currently marked as complete. Reassigning it will reset it to incomplete.
                </Text>
              </View>
            )}
            
            <ScrollView style={styles.childrenList}>
              {availableChildren.map((child) => {
                const isCurrentlyAssigned = child.id === task?.childId;
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childOption,
                      selectedChildId === child.id && styles.selectedChild,
                      isCurrentlyAssigned && styles.currentlyAssigned,
                    ]}
                    onPress={() => setSelectedChildId(child.id)}
                  >
                    <View style={styles.childInfo}>
                      <View style={[styles.childAvatar, { backgroundColor: child.preferences?.favoriteColors?.[0] || '#007bff' }]}>
                        <Text style={styles.childAvatarText}>{child.avatar}</Text>
                      </View>
                      <View style={styles.childDetails}>
                        <View style={styles.childNameRow}>
                          <Text style={styles.childName}>{child.name}</Text>
                          {isCurrentlyAssigned && (
                            <View style={styles.currentBadge}>
                              <Text style={styles.currentBadgeText}>Current</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.childAge}>Age {child.age}</Text>
                        <Text style={styles.childStats}>
                          {child.stats.totalPoints} points • Level {child.stats.level}
                        </Text>
                      </View>
                    </View>
                    {selectedChildId === child.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.reassignButton, !selectedChildId && styles.disabledButton]}
              onPress={handleReassign}
              disabled={!selectedChildId}
            >
              <Text style={styles.reassignText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  taskInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  taskIconContainer: {
    marginRight: 12,
  },
  taskIcon: {
    fontSize: 32,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentAssignment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  taskPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007bff',
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  completionStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  completed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  incomplete: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  childrenList: {
    maxHeight: 300,
  },
  childOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    marginBottom: 12,
  },
  selectedChild: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
  currentlyAssigned: {
    borderColor: '#ffc107', // Highlight color for currently assigned
    backgroundColor: '#fffbeb',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  childAvatarText: {
    fontSize: 20,
  },
  childDetails: {
    flex: 1,
  },
  childNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentBadge: {
    backgroundColor: '#ffc107',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  childStats: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  reassignButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginLeft: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  reassignText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
    flexShrink: 1,
  },
}); 