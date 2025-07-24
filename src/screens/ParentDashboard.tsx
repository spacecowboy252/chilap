// ParentDashboard implementation copied from notepad context
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFamily } from '../context/FamilyContext';
import { useAI } from '../context/AIContext';
import { Child } from '../types';
import { ChildCard } from '../components/parent/ChildCard';
import { AddChildButton } from '../components/parent/AddChildButton';
import { FamilyStats } from '../components/parent/FamilyStats';

interface Props {
  navigation: any;
}

export const ParentDashboard: React.FC<Props> = ({ navigation }) => {
  const { family, loading, error } = useFamily();
  const { aiEnabled, isAnalyzing } = useAI();
  const [selectedView, setSelectedView] = useState<'overview' | 'individual'>('overview');

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading family data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const handleChildPress = (child: Child) => {
    navigation.navigate('ChildDetail', { childId: child.id });
  };

  const handleAddChild = () => {
    if (family && family.children.length >= family.settings.maxChildren) {
      Alert.alert(
        'Maximum Children Reached',
        `You can have up to ${family.settings.maxChildren} children in your family plan.`
      );
      return;
    }
    navigation.navigate('AddChild');
  };

  const renderChildrenGrid = () => {
    if (!family || family.children.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Children Added Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first child to start tracking their behavior and tasks
          </Text>
          <AddChildButton onPress={handleAddChild} />
        </View>
      );
    }

    return (
      <View style={styles.childrenGrid}>
        {family.children.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            onPress={() => handleChildPress(child)}
            showAIInsights={aiEnabled}
          />
        ))}
        {family.children.length < family.settings.maxChildren && (
          <AddChildButton onPress={handleAddChild} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{family?.name || 'My Family'}</Text>
          <Text style={styles.subtitle}>
            {family?.children.length || 0} children • {aiEnabled ? 'AI Enabled' : 'AI Disabled'}
          </Text>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, selectedView === 'overview' && styles.toggleButtonActive]}
            onPress={() => setSelectedView('overview')}
          >
            <Text style={[styles.toggleText, selectedView === 'overview' && styles.toggleTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedView === 'individual' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedView('individual')}
          >
            <Text
              style={[styles.toggleText, selectedView === 'individual' && styles.toggleTextActive]}
            >
              Individual
            </Text>
          </TouchableOpacity>
        </View>

        {/* Family Stats Overview */}
        {selectedView === 'overview' && family && <FamilyStats family={family} />}

        {/* Children Grid */}
        {renderChildrenGrid()}

        {/* AI Status */}
        {aiEnabled && (
          <View style={styles.aiStatus}>
            <Text style={styles.aiStatusText}>
              {isAnalyzing ? '🤖 AI is analyzing behavior patterns...' : '🤖 AI ready'}
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.actionButtonText}>Manage Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Rewards')}
          >
            <Text style={styles.actionButtonText}>Manage Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.actionButtonText}>Family Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#007bff',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: 'white',
  },
  childrenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  aiStatus: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  aiStatusText: {
    fontSize: 14,
    color: '#155724',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#dc3545',
    marginTop: 50,
    paddingHorizontal: 20,
  },
}); 