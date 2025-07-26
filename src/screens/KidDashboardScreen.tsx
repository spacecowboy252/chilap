import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFamily } from '../context/FamilyContext';
import { useCelebration } from '../context/CelebrationContext';
import { TaskCelebrationModal } from '../components/TaskCelebrationModal';
import { Task } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Reward } from '../types';

interface Props {
  navigation: any;
  route: RouteProp<RootStackParamList, 'KidDashboard'>;
}

export const KidDashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const { childId } = route.params;
  const { tasks, completeTask, family, refreshData, rewards, requestRedemption, redemptions } = useFamily();
  const { showCelebration } = useCelebration();

  const child = family?.children.find(c => c.id === childId);

  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(t => {
      if (t.childId !== childId) return false;
      if (!t.dueDate) return true;
      return new Date(t.dueDate).toDateString() === today;
    });
  }, [tasks, childId]);

  const pendingCost = useMemo(()=>{
    return redemptions.filter(r=>r.childId===childId && r.status==='pending').reduce((sum,r)=>{
      const rew = rewards.find(rr=>rr.id===r.rewardId);
      return sum + (rew?.pointsCost||0);
    },0);
  },[redemptions,childId,rewards]);

  const remainingPoints = child.stats.totalPoints - pendingCost;

  const availableRewards = useMemo(() => {
    return rewards.filter(r => r.isAvailable && r.pointsCost <= remainingPoints);
  }, [rewards, remainingPoints]);

  const handleRedeemReward = (reward: Reward) => {
    if (reward.pointsCost > remainingPoints) {
      alert('Not enough points yet!');
      return;
    }

    const proceed = Platform.OS === 'web'
      ? window.confirm(`Request "${reward.title}" for ${reward.pointsCost} points?`)
      : undefined;

    if (Platform.OS === 'web') {
      if (proceed) {
        requestRedemption(reward.id, childId);
        alert('Reward requested! Waiting for parent approval.');
      }
      return;
    }

    Alert.alert('Request Reward', `Request "${reward.title}" for ${reward.pointsCost} points?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Request',
        onPress: () => {
          requestRedemption(reward.id, childId);
          Alert.alert('Requested!', 'Waiting for parent approval.', [{ text: 'OK' }]);
        },
      },
    ]);
  };

  const handleComplete = (task: Task) => {
    const proceed = Platform.OS === 'web'
      ? window.confirm(`Mark "${task.title}" as done?`)
      : undefined;

    if (Platform.OS === 'web') {
      if (proceed) {
        completeTask(task.id, childId).then(()=>{
          refreshData();
          showCelebration({taskTitle:task.title, pointsEarned:task.points, childName: child.name});
        });
      }
      return;
    }

    Alert.alert('Great job!', `Mark "${task.title}" as done?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Done',
        onPress: () => completeTask(task.id, childId).then(()=>{refreshData(); showCelebration({taskTitle:task.title, pointsEarned:task.points, childName: child.name});}),
      },
    ]);
  };

  const renderTaskCard = ({item}:{item:Task})=>{
    const completed = item.isCompleted;
    return (
      <TouchableOpacity
        style={[styles.taskCard, completed && styles.taskCardDone]}
        onPress={()=> !completed && handleComplete(item)}
        disabled={completed}
      >
        <Text style={[styles.taskTitle, completed && styles.taskTitleDone]}>{item.title}</Text>
        <Text style={[styles.taskPoints, completed && styles.taskTitleDone]}>+{item.points}</Text>
        {completed && <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" style={{position:'absolute',top:8,right:8}}/>}
      </TouchableOpacity>
    );
  };

  if (!child) {
    return (
      <View style={styles.center}> <Text>Child not found</Text></View>
    );
  }

  return (
    <SafeAreaView style={[styles.container]}> 
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> <Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{child.name}'s Tasks</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{child.stats.totalPoints}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{child.stats.level}</Text>
        </View>
      </View>

      <FlatList
        data={todayTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={renderTaskCard}
        ListEmptyComponent={<Text style={styles.emptyText}>All done for today! 🎉</Text>}
      />

      {/* Rewards Section */}
      <View style={styles.rewardsSection}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <FlatList
          data={availableRewards}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.rewardCard} onPress={() => handleRedeemReward(item)}>
              <Text style={styles.rewardTitle}>{item.title}</Text>
              <Text style={styles.rewardPoints}>{item.pointsCost} pts</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyRewardsText}>No rewards available</Text>}
        />
      </View>

      <TaskCelebrationModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: '#f0f8ff' },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  header: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    padding: 16, backgroundColor:'#007bff'
  },
  headerTitle:{ color:'#fff', fontSize:20, fontWeight:'700' },
  taskCard:{ backgroundColor:'#fff', padding:20, borderRadius:12, marginBottom:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center', elevation:2 },
  taskTitle:{ fontSize:18, fontWeight:'600' },
  taskPoints:{ fontSize:18, color:'#28a745', fontWeight:'700' },
  taskCardDone:{backgroundColor:'#f0f0f0',opacity:0.6},
  taskTitleDone:{textDecorationLine:'line-through',color:'#999'},
  emptyText:{ textAlign:'center', fontSize:18, marginTop:40, color:'#555' },
  statsBar:{flexDirection:'row', justifyContent:'space-around', backgroundColor:'#fff', paddingVertical:12, marginHorizontal:20, borderRadius:12, marginTop:16, elevation:2},
  statBox:{ alignItems:'center'},
  statLabel:{ fontSize:14, color:'#555'},
  statValue:{ fontSize:20, fontWeight:'700', color:'#007bff'},
  rewardsSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12, paddingHorizontal: 20 },
  rewardCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginRight: 12, minWidth: 120, alignItems: 'center', elevation: 2 },
  rewardTitle: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 4 },
  rewardPoints: { fontSize: 12, color: '#28a745', fontWeight: '600' },
  emptyRewardsText: { textAlign: 'center', fontSize: 14, color: '#666', paddingHorizontal: 20 },
}); 