import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { Redemption, Reward } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export const ApprovalsScreen: React.FC = () => {
  const { redemptions, rewards, family, tasks, approveRedemption, rejectRedemption, approveTaskCompletion, rejectTaskCompletion } = useFamily();

  const pendingRedemptions = redemptions.filter(r => r.status === 'pending');
  const pendingTasks = tasks.filter(t => t.isCompleted && !t.parentApproved);

  const getReward = (rewardId: string): Reward | undefined => {
    return rewards.find(r => r.id === rewardId);
  };

  const getChild = (childId: string) => {
    return family?.children.find(c => c.id === childId);
  };

  const handleApprove = async (redemption: Redemption) => {
    console.log('approve pressed', redemption.id);
    if (Platform.OS === 'web') {
      const proceed = window.confirm('Approve this reward?');
      if (!proceed) return;
      await approveRedemption(redemption.id, 'parent_1');
      return;
    }
    Alert.alert(
      'Approve Reward',
      `Approve ${getChild(redemption.childId)?.name}'s request for "${getReward(redemption.rewardId)?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            await approveRedemption(redemption.id, 'parent_1');
          },
        },
      ]
    );
  };

  const handleReject = async (redemption: Redemption) => {
    console.log('reject pressed', redemption.id);
    if (Platform.OS === 'web') {
      const proceed = window.confirm('Reject this reward?');
      if (!proceed) return;
      await rejectRedemption(redemption.id, 'parent_1');
      return;
    }
    Alert.alert(
      'Reject Reward',
      `Reject ${getChild(redemption.childId)?.name}'s request for "${getReward(redemption.rewardId)?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            await rejectRedemption(redemption.id, 'parent_1');
          },
        },
      ]
    );
  };

  const renderRedemption = ({ item }: { item: Redemption }) => {
    const reward = getReward(item.rewardId);
    const child = getChild(item.childId);

    if (!reward || !child) return null;

    return (
      <View style={styles.redemptionCard}>
        <View style={styles.redemptionHeader}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.requestDate}>
            {format(new Date(item.requestedAt), 'MMM d, h:mm a')}
          </Text>
        </View>
        
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardTitle}>{reward.title}</Text>
          <Text style={styles.rewardDescription}>{reward.description}</Text>
          <Text style={styles.pointsCost}>{reward.pointsCost} points</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(item)}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item)}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTask = ({ item }) => {
    const child = family?.children.find(c => c.id === item.childId);
    if (!child) return null;
    return (
      <View style={styles.redemptionCard}>
        <View style={styles.redemptionHeader}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.requestDate}>{format(new Date(item.completedAt||Date.now()), 'MMM d, h:mm a')}</Text>
        </View>
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardTitle}>{item.title}</Text>
          <Text style={styles.pointsCost}>{item.points} points</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={async ()=>{await rejectTaskCompletion(item.id,'parent_1');}}>
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={async ()=>{await approveTaskCompletion(item.id,'parent_1');}}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Approvals</Text>
          <Text style={styles.pendingCount}>{pendingRedemptions.length + pendingTasks.length} pending</Text>
        </View>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <View style={{paddingHorizontal:16}}>
            <Text style={{fontSize:18,fontWeight:'600',marginBottom:8}}>Task Completions</Text>
            <FlatList data={pendingTasks} keyExtractor={(item)=>item.id} renderItem={renderTask} scrollEnabled={false}/>
          </View>
        )}

        {/* Pending Redemptions */}
        <View style={{paddingHorizontal:16, marginTop:24}}>
          <Text style={{fontSize:18,fontWeight:'600',marginBottom:8}}>Reward Requests</Text>
          <FlatList
            data={pendingRedemptions}
            keyExtractor={(item) => item.id}
            renderItem={renderRedemption}
            scrollEnabled={false}
            ListEmptyComponent={pendingTasks.length===0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={64} color="#28a745" />
                <Text style={styles.emptyText}>No pending approvals!</Text>
              </View>
            ) : null}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pendingCount: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  redemptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  redemptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  requestDate: {
    fontSize: 14,
    color: '#666',
  },
  rewardInfo: {
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pointsCost: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 