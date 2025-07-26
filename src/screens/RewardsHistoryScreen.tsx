import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { Redemption, Reward } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

export const RewardsHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { redemptions, rewards, family } = useFamily();
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all');

  const filtered = useMemo(() => {
    return redemptions
      .filter(r => filter === 'all' ? true : filter === 'approved' ? r.status === 'approved' : r.status === 'rejected')
      .sort((a,b)=> (b.approvedAt ? new Date(b.approvedAt).getTime() : 0) - (a.approvedAt ? new Date(a.approvedAt).getTime() : 0));
  }, [redemptions, filter]);

  const getReward = (id: string): Reward | undefined => rewards.find(r=>r.id===id);
  const getChild = (id: string) => family?.children.find(c=>c.id===id);

  const renderItem = ({ item }: { item: Redemption }) => {
    const reward = getReward(item.rewardId);
    const child = getChild(item.childId);
    if(!reward || !child) return null;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.child}>{child.name}</Text>
          <Text style={[styles.status, item.status==='approved'? styles.approved : styles.rejected]}>{item.status}</Text>
        </View>
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.date}>{format(new Date(item.requestedAt), 'MMM d, yyyy h:mm a')}</Text>
        <Text style={styles.points}>{reward.pointsCost} pts</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards History</Text>
        <View style={{width:24}} />
      </View>

      <View style={styles.filterRow}>
        {['all','approved','rejected'].map(f=>(
          <TouchableOpacity key={f} style={[styles.filterBtn, filter===f && styles.filterActive]} onPress={()=>setFilter(f as any)}>
            <Text style={[styles.filterText, filter===f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item)=>item.id}
        renderItem={renderItem}
        contentContainerStyle={{padding:16}}
        ListEmptyComponent={<Text style={{textAlign:'center',marginTop:40,color:'#666'}}>No records</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header:{flexDirection:'row',alignItems:'center',backgroundColor:'#007bff',padding:16},
  headerTitle:{flex:1,textAlign:'center',color:'#fff',fontSize:20,fontWeight:'700'},
  filterRow:{flexDirection:'row',justifyContent:'center',marginVertical:12},
  filterBtn:{paddingVertical:6,paddingHorizontal:12,marginHorizontal:4,borderRadius:16,backgroundColor:'#e9ecef'},
  filterActive:{backgroundColor:'#007bff'},
  filterText:{color:'#333'},
  filterTextActive:{color:'#fff'},
  card:{backgroundColor:'#fff',padding:12,borderRadius:10,marginBottom:12,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:4,elevation:2},
  row:{flexDirection:'row',justifyContent:'space-between',marginBottom:4},
  child:{fontWeight:'600',fontSize:16},
  status:{fontSize:14,textTransform:'capitalize'},
  approved:{color:'#28a745'},
  rejected:{color:'#dc3545'},
  title:{fontSize:15,fontWeight:'600',marginBottom:2},
  date:{fontSize:13,color:'#666'},
  points:{marginTop:4,fontWeight:'600',color:'#007bff'},
}); 