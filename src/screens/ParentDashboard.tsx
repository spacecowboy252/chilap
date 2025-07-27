// ParentDashboard implementation copied from notepad context
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeScrollView } from '../components/SafeScrollView';
import { useFamily } from '../context/FamilyContext';
import { useAI } from '../context/AIContext';
import { Child } from '../types';
import { ChildCard } from '../components/parent/ChildCard';
import { AddChildButton } from '../components/parent/AddChildButton';
import { FamilyStats } from '../components/parent/FamilyStats';
import { DebugInfo } from '../components/DebugInfo';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

export const ParentDashboard: React.FC<Props> = ({ navigation }) => {
  const { family, loading, error, refreshData, redemptions = [], tasks } = useFamily();
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

  const handleChildLongPress = (child: Child) => {
    navigation.navigate('ChildDashboard', { childId: child.id });
  };

  const handleApprovalsPress = () => {
    navigation.navigate('Approvals');
  };

  const pendingTaskApprovals = tasks.filter(t=>t.isCompleted && !t.parentApproved).length;
  const pendingApprovals = redemptions.filter(r => r.status === 'pending').length + pendingTaskApprovals;

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
            onLongPress={() => handleChildLongPress(child)}
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
      <SafeScrollView 
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{family?.name || 'My Family'}</Text>
            {pendingApprovals > 0 && (
              <TouchableOpacity style={styles.approvalBadge} onPress={handleApprovalsPress}>
                <View style={styles.approvalInner}>
                  <Ionicons name="notifications" size={24} color="#fff" />
                  <View style={styles.badgeCount}>
                    <Text style={styles.badgeText}>{pendingApprovals}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            <Text style={styles.subtitle}>
              {family?.children.length || 0} children • {aiEnabled ? 'AI Enabled' : 'AI Disabled'}
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
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

        {/* Management Actions */}
        <View style={styles.managementSection}>
          <Text style={styles.sectionTitle}>Family Management</Text>
          <View style={styles.managementButtons}>
            <TouchableOpacity
              style={styles.managementButton}
              onPress={() => navigation.navigate('Tasks')}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="list" size={24} color="#007bff" />
                <Text style={styles.managementButtonText}>Manage Tasks</Text>
                <Text style={styles.buttonSubtext}>Create & assign tasks</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.managementButton}
              onPress={() => navigation.navigate('Rewards')}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="gift" size={24} color="#28a745" />
                <Text style={styles.managementButtonText}>Manage Rewards</Text>
                <Text style={styles.buttonSubtext}>Set up rewards system</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Debug Info - Remove this after testing */}
        <DebugInfo />

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
      </SafeScrollView>
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
    height: '100%',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    fontSize: 18,
  },
     title: {
     fontSize: 28,
     fontWeight: 'bold',
     color: '#fff',
     flex: 1,
   },
   approvalBadge: {
     position: 'relative',
     padding: 8,
   },
   approvalInner: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   badgeCount: {
     position: 'absolute',
     top: 4,
     right: 4,
     backgroundColor: theme.colors.danger,
     borderRadius: 10,
     minWidth: 20,
     height: 20,
     justifyContent: 'center',
     alignItems: 'center',
   },
   badgeText: {
     color: '#fff',
     fontSize: 12,
     fontWeight: 'bold',
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
  managementSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  managementButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  managementButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    alignItems: 'center',
  },
  managementButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
}); 