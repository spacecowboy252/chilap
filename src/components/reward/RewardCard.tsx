import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reward } from '../../types';

interface Props {
  reward: Reward;
  onPress: () => void;
  canAfford: boolean;
}

const getRewardIcon = (type: Reward['type']) => {
  switch (type) {
    case 'virtual': return 'gift-outline';
    case 'experience': return 'time-outline';
    case 'privilege': return 'star-outline';
    case 'activity': return 'fitness-outline';
    default: return 'gift-outline';
  }
};

const getRewardColor = (category: Reward['category']) => {
  switch (category) {
    case 'fun': return '#FF6B6B';
    case 'educational': return '#4ECDC4';
    case 'physical': return '#45B7D1';
    case 'social': return '#96CEB4';
    case 'creative': return '#FFEAA7';
    default: return '#007bff';
  }
};

export const RewardCard: React.FC<Props> = ({ reward, onPress, canAfford }) => {
  const iconName = getRewardIcon(reward.type);
  const color = getRewardColor(reward.category);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: color },
        !canAfford && styles.cardDisabled,
      ]}
      onPress={onPress}
      disabled={!canAfford}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={iconName as any} size={24} color="#fff" />
      </View>
      
      <Text style={styles.title} numberOfLines={2}>
        {reward.title}
      </Text>
      
      <Text style={styles.description} numberOfLines={2}>
        {reward.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.points}>{reward.pointsCost}</Text>
        </View>
        
        {reward.estimatedTime && (
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.time}>{reward.estimatedTime}m</Text>
          </View>
        )}
      </View>
      
      {!canAfford && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Need more points</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    position: 'relative',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
}); 