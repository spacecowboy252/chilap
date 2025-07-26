// React Native Web compatibility fix for React 18
if (typeof window !== 'undefined') {
  const ReactDOM = require('react-dom');
  if (!ReactDOM.findDOMNode) {
    // React 19 removed findDOMNode; add a safe no-op polyfill
    ReactDOM.findDOMNode = () => null;
  }
}

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/AuthContext';
import { FamilyProvider } from './src/context/FamilyContext';
import { CelebrationProvider } from './src/context/CelebrationContext';
import { AIProvider } from './src/context/AIContext';

import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/constants/theme';
import { Platform } from 'react-native';

// Inject SecureStore polyfill on the web platform before any provider that might access SecureStore.
if (Platform.OS === 'web') {
  require('./src/polyfills/secureStore.web');
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FamilyProvider>
          <CelebrationProvider>
            <AIProvider>
              <NavigationContainer theme={theme.navigation}>
                <StatusBar style="dark" />
                <RootNavigator />
              </NavigationContainer>
            </AIProvider>
          </CelebrationProvider>
        </FamilyProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 