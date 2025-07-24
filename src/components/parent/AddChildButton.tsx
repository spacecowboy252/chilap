import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void;
}

export const AddChildButton: React.FC<Props> = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.plus}>＋</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 140,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { fontSize: 40, color: '#6c757d', lineHeight: 40 },
}); 