import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WalletIcon, HourglassIcon, CalendarStarIcon, TrophyIcon } from '../graphics/CustomIcons';
import { CelebrationBanner } from '../graphics/CelebrationBanner';

interface ProgressCardProps {
  child: any;
  completedTasks: number;
  totalTasks: number;
  pointsToday: number;
  pointsThisWeek: number;
  remainingPoints: number;
  pendingPoints: number;
}

interface PointsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  gradientColors: [string, string];
  textColor?: string;
  onPress: () => void;
}

const PointsCard: React.FC<PointsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradientColors,
  textColor = '#FFFFFF',
  onPress
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [countAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Number counting animation
    Animated.timing(countAnim, {
      toValue: value,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Haptic feedback for engagement
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
    onPress();
  };

  const renderCustomIcon = () => {
    const iconProps = { size: 32, color: textColor };
    switch (icon) {
      case 'wallet':
        return <WalletIcon {...iconProps} />;
      case 'time':
        return <HourglassIcon {...iconProps} />;
      case 'calendar':
        return <CalendarStarIcon {...iconProps} />;
      case 'trophy':
        return <TrophyIcon {...iconProps} />;
      default:
        return <Ionicons name={icon as any} size={28} color={textColor} />;
    }
  };

  return (
    <Animated.View style={[styles.pointsCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.cardTouchable}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
            <View style={styles.iconContainer}>
              {renderCustomIcon()}
            </View>
          </View>
          <Animated.Text style={[styles.cardValue, { color: textColor }]}>
            {Math.round((countAnim as any)._value || value)}
          </Animated.Text>
          <Text style={[styles.cardSubtitle, { color: textColor, opacity: 0.9 }]}>{subtitle}</Text>
          <Text style={[styles.tapHint, { color: textColor, opacity: 0.7 }]}>tap to see more</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ProgressCard: React.FC<ProgressCardProps> = ({
  child,
  completedTasks,
  totalTasks,
  pointsToday,
  pointsThisWeek,
  remainingPoints,
  pendingPoints,
}) => {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isPerfectDay = completedTasks === totalTasks && totalTasks > 0;
  const isNewRecord = pointsThisWeek > (child?.stats?.previousWeekPoints || 0);
  const isSpendingSpree = remainingPoints > 100;
  
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [celebrationAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Perfect day celebration
    if (isPerfectDay) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: false }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: false })
        ])
      ).start();

      Animated.spring(celebrationAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }
  }, [progressPercentage, isPerfectDay]);

  const handleCardPress = (cardType: string) => {
    console.log(`Tapped ${cardType} card`);
    // TODO: Navigate to specific screens based on card type
    switch (cardType) {
      case 'available':
        console.log('Show reward suggestions');
        break;
      case 'requested':
        console.log('Show pending requests');
        break;
      case 'today':
        console.log('Show today\'s tasks');
        break;
      case 'weekly':
        console.log('Show weekly chart');
        break;
    }
  };

  const getAchievementMessage = () => {
    if (isPerfectDay) return "🎉 Perfect Day!";
    if (isNewRecord) return "🏆 New Record!";
    if (isSpendingSpree) return "💰 Spending Spree!";
    if (progressPercentage > 50) return "⭐ Almost There!";
    return null;
  };

  const achievementMessage = getAchievementMessage();

  return (
    <View style={[styles.container, isPerfectDay && styles.celebrationContainer]}>
      {/* Progress Header */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Your Progress Today</Text>
        <Text style={styles.progressSubtitle}>
          Today's Progress: {completedTasks}/{totalTasks} tasks
        </Text>
        
        {/* Achievement Badge */}
        {achievementMessage && (
          <Animated.View 
            style={[
              styles.achievementBadge,
              { transform: [{ scale: celebrationAnim }] }
            ]}
          >
            <Text style={styles.achievementText}>{achievementMessage}</Text>
          </Animated.View>
        )}
      </View>

      {/* Perfect Day Celebration Banner */}
      <CelebrationBanner visible={isPerfectDay} />

      {/* Enhanced Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
                transform: isPerfectDay ? [{ scale: pulseAnim }] : []
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercentage, isPerfectDay && styles.celebrationText]}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* Enhanced Points Dashboard - 2x2 Grid */}
      <View style={styles.pointsSection}>
        <Text style={styles.pointsSectionTitle}>🎯 Your Points Dashboard</Text>
        
        {/* Party Graphics Above */}
        <View style={styles.partyGraphicsTop}>
          <Text style={styles.confetti}>🎉</Text>
          <Text style={styles.confetti}>🎊</Text>
          <Text style={styles.confetti}>✨</Text>
          <Text style={styles.confetti}>🌟</Text>
          <Text style={styles.confetti}>🎈</Text>
          <Text style={styles.confetti}>🎁</Text>
          <Text style={styles.confetti}>⭐</Text>
          <Text style={styles.confetti}>🏆</Text>
          <Text style={styles.confetti}>💫</Text>
          <Text style={styles.confetti}>🎯</Text>
        </View>
        
        <View style={styles.pointsGrid}>
          <PointsCard
            title="AVAILABLE POINTS"
            value={remainingPoints}
            subtitle="Ready to spend!"
            icon="wallet"
            gradientColors={['#22c55e', '#16a34a']}
            onPress={() => handleCardPress('available')}
          />
          
          <PointsCard
            title="REQUESTED POINTS"
            value={pendingPoints}
            subtitle="Waiting for approval"
            icon="time"
            gradientColors={['#f59e0b', '#d97706']}
            onPress={() => handleCardPress('requested')}
          />
          
          <PointsCard
            title="POINTS TODAY"
            value={pointsToday}
            subtitle="Earned today"
            icon="calendar"
            gradientColors={['#3b82f6', '#2563eb']}
            onPress={() => handleCardPress('today')}
          />
          
          <PointsCard
            title="POINTS THIS WEEK"
            value={pointsThisWeek}
            subtitle="This week's total"
            icon="trophy"
            gradientColors={['#8b5cf6', '#7c3aed']}
            onPress={() => handleCardPress('weekly')}
          />
        </View>
        
        {/* Party Graphics Below */}
        <View style={styles.partyGraphicsBottom}>
          <Text style={styles.confetti}>🎊</Text>
          <Text style={styles.confetti}>🎉</Text>
          <Text style={styles.confetti}>⭐</Text>
          <Text style={styles.confetti}>🌟</Text>
          <Text style={styles.confetti}>💫</Text>
          <Text style={styles.confetti}>🎈</Text>
          <Text style={styles.confetti}>🏆</Text>
          <Text style={styles.confetti}>✨</Text>
          <Text style={styles.confetti}>🎁</Text>
          <Text style={styles.confetti}>🎯</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  celebrationContainer: {
    backgroundColor: '#f0f9eb', // Light green background for celebration
    borderColor: '#a5d6a7',
    borderWidth: 2,
  },
  progressHeader: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#21808D',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#626C71',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#21808D',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#21808D',
    minWidth: 40,
  },
  pointsSection: {
    marginBottom: 24,
  },
  pointsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  pointsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pointsCard: {
    width: '48%',
    minHeight: 120,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTouchable: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  tapHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  achievementBadge: {
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  celebrationText: {
    color: '#21808D',
    fontWeight: '700',
  },
  partyGraphicsTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  partyGraphicsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  confetti: {
    fontSize: 24,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 