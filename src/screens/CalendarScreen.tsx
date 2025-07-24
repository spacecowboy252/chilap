import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CalendarScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Calendar Screen – TBD</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
}); 