import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

export const FloatingElements: React.FC = () => {
  // For now, return null to prevent runtime errors
  // We can re-enable this later with a simpler implementation
  return null;
  
  // TODO: Re-implement with simpler, mobile-safe graphics
  // const isMobile = Platform.OS !== 'web';
  // if (isMobile) return null; // Disable on mobile for now
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
}); 