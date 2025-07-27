import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { FamilyProvider } from './src/context/FamilyContext';
import { CelebrationProvider } from './src/context/CelebrationContext';
import { AIProvider } from './src/context/AIContext';

// Screens
import MainPage from './src/screens/MainPage';
import LoginScreen from './src/screens/LoginScreen';
import { ParentDashboard } from './src/screens/ParentDashboard';
import ChildDashboard from './src/screens/ChildDashboard';
import { AddChildScreen } from './src/screens/AddChildScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { ApprovalsScreen } from './src/screens/ApprovalsScreen';
// import { CalendarScreen } from './src/screens/CalendarScreen';

// Components
import { ErrorBoundary } from './src/components/ErrorBoundary';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <FamilyProvider>
          <CelebrationProvider>
            <AIProvider>
              <NavigationContainer>
                <Stack.Navigator 
                  initialRouteName="Main"
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#4A90E2',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="Main" 
                    component={MainPage} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen 
                    name="ParentDashboard" 
                    component={ParentDashboard}
                    options={{ title: 'Parent Dashboard' }}
                  />
                  <Stack.Screen 
                    name="ChildDashboard" 
                    component={ChildDashboard}
                    options={{ title: 'My Tasks' }}
                  />
                  <Stack.Screen 
                    name="AddChild" 
                    component={AddChildScreen}
                    options={{ title: 'Add Child' }}
                  />
                  <Stack.Screen 
                    name="Tasks" 
                    component={TasksScreen}
                    options={{ title: 'Manage Tasks' }}
                  />
                  <Stack.Screen 
                    name="Rewards" 
                    component={RewardsScreen}
                    options={{ title: 'Manage Rewards' }}
                  />
                  <Stack.Screen 
                    name="Approvals" 
                    component={ApprovalsScreen}
                    options={{ title: 'Approvals' }}
                  />
                  {/* <Stack.Screen 
                    name="Calendar" 
                    component={CalendarScreen}
                    options={{ title: 'Family Calendar' }}
                  /> */}
                </Stack.Navigator>
              </NavigationContainer>
            </AIProvider>
          </CelebrationProvider>
        </FamilyProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
} 