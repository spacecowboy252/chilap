import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Child } from '../../types';

interface Props {
  child: Child;
  onPress: () => void;
  showAIInsights?: boolean;
}

export const ChildCard: React.FC<Props> = ({ child, onPress, showAIInsights }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {child.avatar ? (
        <Image source={{ uri: child.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.name}>{child.name}</Text>
      {showAIInsights && <Text style={styles.aiBadge}>AI</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    padding: 8,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 24, color: '#495057' },
  name: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  aiBadge: { marginTop: 4, fontSize: 12, color: '#28a745' },
}); 