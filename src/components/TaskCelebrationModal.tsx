import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useCelebration } from '../context/CelebrationContext';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

export const TaskCelebrationModal: React.FC = () => {
  const { celebration, hide } = useCelebration();

  useEffect(() => {
    if (celebration.visible) Vibration.vibrate(100);
  }, [celebration.visible]);

  if (!celebration.visible) return null;

  return (
    <Modal
      isVisible={celebration.visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.3}
      onBackdropPress={hide}
      style={styles.modal}
    >
      <View style={styles.box}>
        <ConfettiCannon
          count={120}
          origin={{x: width/2, y: 0}}
          fadeOut
          colors={[
            theme.colors.primary,
            theme.colors.secondary,
            theme.colors.accent,
            theme.colors.info,
          ]}
        />

        <Text style={styles.bigText}>Great job, {celebration.childName}! 🎉</Text>
        <Text style={styles.taskText}>{celebration.taskTitle}</Text>
        <Text style={styles.pointsText}>+{celebration.points} pts</Text>

        <TouchableOpacity style={styles.btn} onPress={hide}>
          <Text style={styles.btnText}>Keep Going!</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'center', alignItems: 'center' },
  box: {
    width: width * 0.8,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  bigText: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  taskText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  pointsText: {
    fontSize: 18,
    color: theme.colors.secondary,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
}); 