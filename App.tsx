import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { FamilyProvider } from './src/context/FamilyContext';
import { AIProvider } from './src/context/AIContext';

// Navigation
import { RootNavigator } from './src/navigation/RootNavigator';

// Theme
import { theme } from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FamilyProvider>
          <AIProvider>
            <NavigationContainer theme={theme.navigation}>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </AIProvider>
        </FamilyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 