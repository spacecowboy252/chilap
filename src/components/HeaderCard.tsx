import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Child } from '../types';
import { theme } from '../constants/theme';

interface Props { child: Child }

const getAvatar = (child: Child) => {
  return child.age <= 6 ? '👶' : child.age <= 8 ? '🧒' : child.age <= 10 ? '👦' : '👧';
};

export const HeaderCard: React.FC<Props> = ({ child }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}><Text style={styles.avatar}>{getAvatar(child)}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>Hi, {child.name}!</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>{child.stats.level > 1 ? `Level ${child.stats.level}` : 'Super Star'}</Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    ...theme.shadows.md,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: { fontSize: 32 },
  name: { fontSize: theme.typography.lg, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  badge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: theme.typography.xs, color: theme.colors.text },
}); 