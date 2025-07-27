import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface BackgroundPatternProps {
  opacity?: number;
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ opacity = 0.12 }) => {
  // For now, return null to prevent runtime errors on mobile
  // We can re-enable this later with a simpler implementation
  return null;
  
  // TODO: Re-implement with simpler, mobile-safe pattern
  // const isMobile = Platform.OS !== 'web';
  // if (isMobile) return null; // Disable on mobile for now
}; 