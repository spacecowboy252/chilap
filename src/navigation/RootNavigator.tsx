import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ParentDashboard } from '../screens/ParentDashboard';
import { AddChildScreen } from '../screens/AddChildScreen';
import { ChildDetailScreen } from '../screens/ChildDetailScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { CalendarScreen } from '../screens/CalendarScreen';

export type RootStackParamList = {
  ParentDashboard: undefined;
  AddChild: undefined;
  ChildDetail: { childId: string };
  Tasks: undefined;
  Rewards: undefined;
  Calendar: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator initialRouteName="ParentDashboard" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
    <Stack.Screen name="AddChild" component={AddChildScreen} />
    <Stack.Screen name="ChildDetail" component={ChildDetailScreen} />
    <Stack.Screen name="Tasks" component={TasksScreen} />
    <Stack.Screen name="Rewards" component={RewardsScreen} />
    <Stack.Screen name="Calendar" component={CalendarScreen} />
  </Stack.Navigator>
); 