import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Family } from '../../types';

interface Props {
  family: Family;
}

export const FamilyStats: React.FC<Props> = ({ family }) => {
  const totalTasks = family.children.reduce((sum, c) => sum + c.stats.totalTasks, 0);
  const completedTasks = family.children.reduce((sum, c) => sum + c.stats.completedTasks, 0);
  const totalPoints = family.children.reduce((sum, c) => sum + c.stats.totalPoints, 0);

  return (
    <View style={styles.container}>
      <Stat label="Total Tasks" value={totalTasks} />
      <Stat label="Completed" value={completedTasks} />
      <Stat label="Points" value={totalPoints} />
    </View>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.stat}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', margin: 16, justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  value: { fontSize: 20, fontWeight: '700', color: '#007bff' },
  label: { fontSize: 14, color: '#6c757d' },
}); 