import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = { route: RouteProp<RootStackParamList, 'ChildDetail'> };

export const ChildDetailScreen: React.FC<Props> = ({ route }) => (
  <View style={styles.container}>
    <Text style={styles.text}>Child Detail – {route.params.childId}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
}); 