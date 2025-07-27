import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, Platform, View } from 'react-native';

/**
 * SafeScrollView – Drop-in replacement for ScrollView that guarantees
 * 1. container fills available space (flex:1 + height:100%)
 * 2. inner content can grow (flexGrow:1)
 * 3. scroll bars are always visible (showsVerticalScrollIndicator, persistentScrollbar on Android)
 */
export const SafeScrollView: React.FC<ScrollViewProps> = ({
  children,
  contentContainerStyle,
  style,
  ...rest
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <ScrollView
          {...rest}
          style={[styles.webScrollView, style]}
          contentContainerStyle={[styles.grow, contentContainerStyle]}
          showsVerticalScrollIndicator
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      {...rest}
      style={[styles.flex, style]}
      contentContainerStyle={[styles.grow, contentContainerStyle]}
      showsVerticalScrollIndicator
      persistentScrollbar={Platform.OS === 'android'}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    height: '100%',
  },
  webContainer: {
    flex: 1,
    height: '100%',
    ...(Platform.OS === 'web' ? { maxHeight: '100vh' as any, overflow: 'hidden' as any } : {}),
  },
  webScrollView: {
    flex: 1,
    height: '100%',
    ...(Platform.OS === 'web' ? { 
      overflowY: 'auto' as any,
      overflowX: 'hidden' as any,
    } : {}),
  },
  grow: {
    flexGrow: 1,
  },
}); 