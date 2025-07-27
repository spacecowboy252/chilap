import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFamily } from '../context/FamilyContext';

interface MainPageProps {
  navigation: any;
}

export default function MainPage({ navigation }: MainPageProps) {
  const { family, tasks } = useFamily();

  // Calculate today's progress with error handling
  const today = new Date().toISOString().split('T')[0];
  const tasksCompleted = tasks.filter(task => {
    try {
      if (!task.isCompleted || !task.completedAt) return false;
      
      // Handle both Date objects and date strings
      let completedDate: Date;
      if (task.completedAt instanceof Date) {
        completedDate = task.completedAt;
      } else {
        completedDate = new Date(task.completedAt);
      }
      
      // Check if the date is valid
      if (isNaN(completedDate.getTime())) return false;
      
      return completedDate.toISOString().split('T')[0] === today;
    } catch (error) {
      console.warn('Error processing task completion date:', error);
      return false;
    }
  }).length;
  
  const pointsEarned = tasksCompleted * 10; // Assuming 10 points per task
  
  // Calculate day streak (simplified)
  const dayStreak = 5; // This would need more complex logic

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5F1', '#FFD6E7']}
        style={styles.background}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.title}>KidsTracker</Text>
          <Text style={styles.starIcon}>⭐</Text>
        </View>
        
        <Text style={styles.tagline}>Making good behavior fun!</Text>

        {/* Main Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.parentButton}
            onPress={() => navigation.navigate('ParentDashboard')}
          >
            <Text style={styles.parentButtonText}>👨‍👩‍👧‍👦 Parent Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.childButton}
            onPress={() => navigation.navigate('ChildDashboard')}
          >
            <Text style={styles.childButtonText}>👶 Child View</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Family Progress Section */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Today's Family Progress</Text>
          
          <View style={styles.progressCards}>
            <LinearGradient
              colors={['#8B5CF6', '#3B82F6']}
              style={styles.progressItem}
            >
              <Text style={styles.progressNumber}>{tasksCompleted}</Text>
              <Text style={styles.progressLabel}>Tasks Completed</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#8B5CF6', '#3B82F6']}
              style={styles.progressItem}
            >
              <Text style={styles.progressNumber}>{pointsEarned}</Text>
              <Text style={styles.progressLabel}>Points Earned</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#8B5CF6', '#3B82F6']}
              style={styles.progressItem}
            >
              <Text style={styles.progressNumber}>{dayStreak}</Text>
              <Text style={styles.progressLabel}>Day Streak</Text>
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D5A5A',
    marginHorizontal: 10,
  },
  starIcon: {
    fontSize: 24,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 60,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  parentButton: {
    backgroundColor: '#2D5A5A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  parentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  childButton: {
    backgroundColor: '#F8BBD9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  childButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5A5A',
    marginBottom: 20,
  },
  progressCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
}); 