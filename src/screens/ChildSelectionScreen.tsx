import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useFamily } from '../context/FamilyContext';
import { theme } from '../constants/theme';
import { Child } from '../types';

interface Props {
  navigation: any;
}

export const ChildSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { family } = useFamily();

  const handleChildSelect = (child: Child) => {
    navigation.navigate('ChildDashboard', { childId: child.id });
  };

  const getChildAvatar = (child: Child) => {
    const avatars = ['🧒', '👦', '👧', '👶', '🧑'];
    return child.preferences?.uiTheme === 'animals' ? '🐻' : 
           child.age <= 6 ? '👶' : 
           child.age <= 8 ? '🧒' : '👦';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🧒 Choose Your Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profilesGrid}>
          {family?.children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.profileCard}
              onPress={() => handleChildSelect(child)}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{getChildAvatar(child)}</Text>
              </View>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childAge}>Age {child.age}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(child.stats.totalPoints / 100) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.pointsText}>{child.stats.totalPoints} points</Text>
              <Text style={styles.levelText}>{child.stats.level > 1 ? `Level ${child.stats.level}` : 'Beginner'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.lg,
  },
  backText: {
    fontSize: theme.typography.base,
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.typography['2xl'],
    fontWeight: '600',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.xl,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing['2xl'],
    alignItems: 'center',
    width: '45%',
    minWidth: 150,
    ...theme.shadows.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    fontSize: 40,
  },
  childName: {
    fontSize: theme.typography.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  childAge: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
  },
  pointsText: {
    fontSize: theme.typography.base,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  levelText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
}); 