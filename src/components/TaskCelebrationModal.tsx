import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Vibration, 
  Dimensions,
  Animated,
  Modal
} from 'react-native';
import { useCelebration } from '../context/CelebrationContext';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

export const TaskCelebrationModal: React.FC = () => {
  const { celebration, hide } = useCelebration();
  const scaleAnim = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (celebration.visible) {
      Vibration.vibrate(100);
      
      // Celebration entrance animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 3,
      }).start();

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        hide();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0.3);
    }
  }, [celebration.visible]);

  return (
    <Modal
      visible={celebration.visible}
      transparent={true}
      animationType="fade"
      onRequestClose={hide}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={hide}
        />
        <Animated.View style={[
          styles.box,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          {/* Simple Celebration Content */}
          <Text style={styles.bigText}>
            🎉 AMAZING WORK! 🎉
          </Text>
          
          <Text style={styles.childText}>
            {celebration.childName}!
          </Text>
          
          <View style={styles.taskInfo}>
            <Text style={styles.taskText}>
              ✅ {celebration.taskTitle}
            </Text>
            
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>
                +{celebration.points}
              </Text>
              <Text style={styles.pointsLabel}>POINTS!</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.btn} 
            onPress={hide}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Keep Going! 🚀</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  box: {
    width: width * 0.85,
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  bigText: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  childText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 20,
  },
  taskInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  taskText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  pointsText: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  btn: {
    backgroundColor: '#22c55e',
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 16,
    minWidth: 180,
    alignItems: 'center',
  },
  btnText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});