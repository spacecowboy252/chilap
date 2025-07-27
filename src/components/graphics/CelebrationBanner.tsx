import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';

interface CelebrationBannerProps {
  visible: boolean;
  message?: string;
}

const CelebrationGraphic: React.FC<{ size: number }> = ({ size }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    {/* Burst background */}
    <Path 
      d="M20 5 L22 15 L32 12 L25 20 L35 22 L25 25 L32 28 L22 25 L20 35 L18 25 L8 28 L15 20 L5 22 L15 25 L8 12 L18 15 Z" 
      fill="#FFD700" 
      opacity="0.8" 
    />
    
    {/* Center star */}
    <Polygon 
      points="20,8 22,16 30,16 24.5,21 26.5,29 20,25 13.5,29 15.5,21 10,16 18,16" 
      fill="#FF6B6B" 
    />
    
    {/* Sparkles */}
    <Circle cx="12" cy="12" r="1.5" fill="#4ECDC4" />
    <Circle cx="28" cy="12" r="1" fill="#FFE66D" />
    <Circle cx="32" cy="25" r="1.2" fill="#A8E6CF" />
    <Circle cx="8" cy="25" r="1" fill="#DDA0DD" />
    
    {/* Small stars */}
    <Polygon points="30,30 31,32 33,32 31.5,33.5 32,35.5 30,34.5 28,35.5 28.5,33.5 27,32 29,32" fill="#98FB98" />
    <Polygon points="10,8 11,10 13,10 11.5,11.5 12,13.5 10,12.5 8,13.5 8.5,11.5 7,10 9,10" fill="#F0E68C" />
  </Svg>
);

export const CelebrationBanner: React.FC<CelebrationBannerProps> = ({
  visible,
  message = "🎉 Perfect Day!"
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#FFD700', '#FF6B6B', '#4ECDC4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        {/* Decorative graphics on left */}
        <View style={styles.leftGraphics}>
          <CelebrationGraphic size={32} />
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subMessage}>All tasks completed!</Text>
        </View>

        {/* Decorative graphics on right */}
        <View style={styles.rightGraphics}>
          <CelebrationGraphic size={28} />
        </View>
      </LinearGradient>

      {/* Floating sparkles */}
      <View style={styles.sparklesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.sparkle,
              {
                left: `${15 + index * 12}%`,
                top: index % 2 === 0 ? -8 : -12,
                transform: [
                  {
                    scale: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.sparkleText}>✨</Text>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 16,
    zIndex: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  leftGraphics: {
    marginRight: 12,
  },
  rightGraphics: {
    marginLeft: 12,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.9,
  },
  sparklesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 