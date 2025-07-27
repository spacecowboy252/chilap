import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TestScreen } from '../screens/TestScreen';
// import { MainMenuScreen } from '../screens/MainMenuScreen';
// import { ChildSelectionScreen } from '../screens/ChildSelectionScreen';
// import { ParentDashboard } from '../screens/ParentDashboard';
// import { AddChildScreen } from '../screens/AddChildScreen';
// import { ChildDetailScreen } from '../screens/ChildDetailScreen';
// import { TasksScreen } from '../screens/TasksScreen';
// import { RewardsScreen } from '../screens/RewardsScreen';
// import { CalendarScreen } from '../screens/CalendarScreen';
// import ChildDashboard from '../screens/ChildDashboard';
// import { ApprovalsScreen } from '../screens/ApprovalsScreen';
// import { RewardsHistoryScreen } from '../screens/RewardsHistoryScreen';

export type RootStackParamList = {
  Test: undefined;
  // MainMenu: undefined;
  // ChildSelection: undefined;
  // ParentDashboard: undefined;
  // AddChild: undefined;
  // ChildDetail: { childId: string };
  // Tasks: undefined;
  // Rewards: undefined;
  // Calendar: undefined;
  // ChildDashboard: { childId: string };
  // Approvals: undefined;
  // RewardsHistory: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator initialRouteName="Test" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Test" component={TestScreen} />
    {/* <Stack.Screen name="MainMenu" component={MainMenuScreen} />
    <Stack.Screen name="ChildSelection" component={ChildSelectionScreen} />
    <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
    <Stack.Screen name="AddChild" component={AddChildScreen} />
    <Stack.Screen name="ChildDetail" component={ChildDetailScreen} />
    <Stack.Screen name="Tasks" component={TasksScreen} />
    <Stack.Screen name="Rewards" component={RewardsScreen} />
    <Stack.Screen name="Calendar" component={CalendarScreen} />
    <Stack.Screen name="ChildDashboard" component={ChildDashboard} />
    <Stack.Screen name="Approvals" component={ApprovalsScreen} />
    <Stack.Screen name="RewardsHistory" component={RewardsHistoryScreen} /> */}
  </Stack.Navigator>
); 