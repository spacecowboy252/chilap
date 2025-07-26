import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFamily } from '../context/FamilyContext';

export const DebugInfo: React.FC = () => {
  const { family, tasks, loading, error, refreshData } = useFamily();

  const clearData = async () => {
    // This will help reset the app state for testing
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.default.clear();
    if (typeof window !== 'undefined') {
      window.location.reload(); // For web
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Loading:</Text>
        <Text style={styles.value}>{loading ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Error:</Text>
        <Text style={styles.value}>{error || 'None'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Family ID:</Text>
        <Text style={styles.value}>{family?.id || 'No Family'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Children Count:</Text>
        <Text style={styles.value}>{family?.children.length || 0}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Tasks Count:</Text>
        <Text style={styles.value}>{tasks.length}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Children:</Text>
        {family?.children.map((child, index) => (
          <Text key={child.id} style={styles.childInfo}>
            {index + 1}. {child.name} (ID: {child.id}) - {child.stats.totalPoints} points
          </Text>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshData}>
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearData}>
          <Text style={styles.clearButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  childInfo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 