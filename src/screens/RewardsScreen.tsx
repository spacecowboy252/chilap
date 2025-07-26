import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFamily } from '../context/FamilyContext';
import { Reward, RewardType, RewardCategory } from '../types';
import { RewardCard } from '../components/reward/RewardCard';
import { RewardModal } from '../components/reward/RewardModal';

const DEFAULT_REWARDS: Omit<Reward, 'id'>[] = [
  {
    title: 'Extra Screen Time',
    description: '30 minutes of extra device time',
    type: 'privilege',
    pointsCost: 50,
    isAvailable: true,
    category: 'fun',
  },
  {
    title: 'Choose Dinner',
    description: 'Pick what the family eats tonight',
    type: 'privilege',
    pointsCost: 75,
    isAvailable: true,
    category: 'fun',
  },
  {
    title: 'Movie Night',
    description: 'Watch a movie of your choice',
    type: 'experience',
    pointsCost: 100,
    isAvailable: true,
    category: 'fun',
    estimatedTime: 120,
  },
  {
    title: 'New Book',
    description: 'Get a new book from the bookstore',
    type: 'virtual',
    pointsCost: 150,
    isAvailable: true,
    category: 'educational',
  },
  {
    title: 'Park Visit',
    description: 'Family trip to the playground',
    type: 'experience',
    pointsCost: 80,
    isAvailable: true,
    category: 'physical',
    estimatedTime: 90,
  },
  {
    title: 'Art Supplies',
    description: 'New drawing or craft materials',
    type: 'virtual',
    pointsCost: 120,
    isAvailable: true,
    category: 'creative',
  },
];

type Props = {
  navigation: any;
};

export const RewardsScreen: React.FC<Props> = ({ navigation }) => {
  const { family, tasks, redeemReward } = useFamily();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
  const [rewards, setRewards] = useState<Reward[]>(() => 
    DEFAULT_REWARDS.map((reward, index) => ({
      ...reward,
      id: `reward_${index}`,
    }))
  );

  const totalFamilyPoints = useMemo(() => {
    return family?.children.reduce((sum, child) => sum + child.stats.totalPoints, 0) || 0;
  }, [family]);

  const filteredRewards = useMemo(() => {
    if (selectedCategory === 'all') return rewards;
    return rewards.filter(reward => reward.category === selectedCategory);
  }, [rewards, selectedCategory]);

  const availableRewards = useMemo(() => {
    return filteredRewards.filter(reward => reward.isAvailable);
  }, [filteredRewards]);

  const handleRedeemReward = async (reward: Reward) => {
    if (totalFamilyPoints < reward.pointsCost) {
      Alert.alert(
        'Not Enough Points! 😔',
        `You need ${reward.pointsCost} points, but you only have ${totalFamilyPoints}.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.title}" for ${reward.pointsCost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem!',
          onPress: async () => {
            try {
              // For now, deduct points from the first child (family-wide points)
              const firstChild = family?.children[0];
              if (firstChild) {
                await redeemReward(reward.id, firstChild.id, reward.pointsCost);
                Alert.alert(
                  'Reward Redeemed! 🎉',
                  `${reward.title} has been redeemed! Enjoy!`,
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to redeem reward'
              );
            }
          },
        },
      ]
    );
  };

  const handleAddReward = (rewardData: {
    title: string;
    description: string;
    type: RewardType;
    pointsCost: number;
    category: RewardCategory;
    estimatedTime?: number;
  }) => {
    const newReward: Reward = {
      ...rewardData,
      id: `reward_${Date.now()}`,
      isAvailable: true,
    };
    setRewards(prev => [...prev, newReward]);
    setShowModal(false);
  };

  const categories: Array<{ key: RewardCategory | 'all'; label: string; icon: string }> = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: 'fun', label: 'Fun', icon: 'happy-outline' },
    { key: 'educational', label: 'Learning', icon: 'school-outline' },
    { key: 'physical', label: 'Active', icon: 'fitness-outline' },
    { key: 'social', label: 'Social', icon: 'people-outline' },
    { key: 'creative', label: 'Creative', icon: 'color-palette-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Rewards</Text>
            <Text style={styles.subtitle}>Family Points: {totalFamilyPoints} ⭐</Text>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('RewardsHistory')} style={{padding:8}}>
            <Ionicons name="time" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.key ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.key && styles.categoryTextActive,
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Rewards Grid */}
        <View style={styles.rewardsContainer}>
          {availableRewards.length > 0 ? (
            <View style={styles.rewardsGrid}>
              {availableRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  onPress={() => handleRedeemReward(reward)}
                  canAfford={totalFamilyPoints >= reward.pointsCost}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No Rewards Available</Text>
              <Text style={styles.emptySubtitle}>
                {selectedCategory === 'all' 
                  ? 'Add some rewards to get started!' 
                  : `No ${selectedCategory} rewards available.`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Reward FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Add Reward Modal */}
      <RewardModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddReward}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  categoryButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#fff',
  },
  rewardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
}); 