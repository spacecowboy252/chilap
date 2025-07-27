import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeScrollView } from '../components/SafeScrollView';
import { useFamily } from '../context/FamilyContext';
import { Child, ChildPreferences } from '../types';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🦄', '🐸', '🦁', '🐯'];
const AGE_OPTIONS = [6, 7, 8, 9, 10, 11, 12];

// Simple theme options for child preferences
const THEME_OPTIONS = [
  { key: 'animals', name: 'Animals', color: '#4CAF50' },
  { key: 'space', name: 'Space', color: '#2196F3' },
  { key: 'nature', name: 'Nature', color: '#8BC34A' },
  { key: 'sports', name: 'Sports', color: '#FF9800' },
];

export const AddChildScreen: React.FC<Props> = ({ navigation }) => {
  const { addChild } = useFamily();
  const [name, setName] = useState('');
  const [age, setAge] = useState(8);
  const [selectedAvatar, setSelectedAvatar] = useState('👦');
  const [selectedTheme, setSelectedTheme] = useState<'animals' | 'space' | 'nature' | 'sports'>('animals');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Oops!', 'Please enter a name for your child.');
      return;
    }

    if (name.trim().length < 2) {
      Alert.alert('Name too short', 'Please enter a name with at least 2 characters.');
      return;
    }

    setLoading(true);
    try {
      console.log('🎯 AddChildScreen: Creating child preferences...');
      const selectedThemeOption = THEME_OPTIONS.find(t => t.key === selectedTheme);
      const childPreferences: ChildPreferences = {
        favoriteColors: [selectedThemeOption?.color || theme.colors.primary],
        preferredRewards: ['virtual', 'experience'],
        difficultyLevel: difficulty,
        aiVoiceEnabled: true,
        uiTheme: selectedTheme,
      };

      console.log('🎯 AddChildScreen: Calling addChild with data:', {
        name: name.trim(),
        age,
        avatar: selectedAvatar,
        preferences: childPreferences,
      });
      
      await addChild({
        name: name.trim(),
        age,
        avatar: selectedAvatar,
        preferences: childPreferences,
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalPoints: 0,
          level: 1,
          badges: [],
        },
      });
      
      console.log('🎯 AddChildScreen: addChild completed successfully');

      Alert.alert(
        'Success! 🎉',
        `${name} has been added to your family!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      
      // Reset form
      setName('');
      setAge(8);
      setSelectedAvatar('👦');
      setSelectedTheme('animals');
      setDifficulty('easy');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeScrollView 
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add New Child</Text>
          <Text style={styles.subtitle}>Let's set up their profile!</Text>
        </View>

        {/* Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>What's their name?</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter child's name"
            placeholderTextColor="#999"
            maxLength={20}
          />
        </View>

        {/* Age Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>How old are they?</Text>
          <View style={styles.ageContainer}>
            {AGE_OPTIONS.map((ageOption) => (
              <TouchableOpacity
                key={ageOption}
                style={[styles.ageButton, age === ageOption && styles.ageButtonActive]}
                onPress={() => setAge(ageOption)}
              >
                <Text style={[styles.ageText, age === ageOption && styles.ageTextActive]}>
                  {ageOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Avatar Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose their avatar</Text>
          <View style={styles.avatarContainer}>
            {AVATAR_OPTIONS.map((avatar) => (
              <TouchableOpacity
                key={avatar}
                style={[
                  styles.avatarButton,
                  selectedAvatar === avatar && styles.avatarButtonActive,
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Text style={styles.avatarText}>{avatar}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Pick their favorite theme</Text>
          <View style={styles.themeContainer}>
            {THEME_OPTIONS.map((themeOption) => (
              <TouchableOpacity
                key={themeOption.key}
                style={[
                  styles.themeButton,
                  { backgroundColor: themeOption.color },
                  selectedTheme === themeOption.key && styles.themeButtonActive,
                ]}
                onPress={() => setSelectedTheme(themeOption.key as 'animals' | 'space' | 'nature' | 'sports')}
              >
                <Text style={styles.themeText}>{themeOption.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Level */}
        <View style={styles.section}>
          <Text style={styles.label}>What's their skill level?</Text>
          <View style={styles.difficultyContainer}>
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive,
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={[styles.difficultyText, difficulty === level && styles.difficultyTextActive]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.button, (!name || !age || !selectedAvatar || !selectedTheme) && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!name || !age || !selectedAvatar || !selectedTheme}
          >
            <Text style={styles.buttonText}>Add Child</Text>
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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#333',
  },
  ageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ageButton: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  ageButtonActive: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  ageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  ageTextActive: {
    color: '#fff',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarButton: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarButtonActive: {
    borderColor: '#28a745',
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 24,
  },
  themeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  themeButtonActive: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  difficultyButtonActive: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  difficultyTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
}); 