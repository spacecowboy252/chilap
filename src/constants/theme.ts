import { DefaultTheme } from '@react-navigation/native';

// Age-appropriate color schemes for children 6-12
export const childThemes = {
  animals: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    background: '#FFF8E1',
  },
  space: {
    primary: '#667EEA',
    secondary: '#764BA2',
    accent: '#F093FB',
    background: '#E6F3FF',
  },
  nature: {
    primary: '#26D0CE',
    secondary: '#1A2980',
    accent: '#96E6A1',
    background: '#F0FFF4',
  },
  sports: {
    primary: '#FF512F',
    secondary: '#DD2476',
    accent: '#FFA726',
    background: '#FFF3E0',
  },
};

export const difficultyColors = {
  easy: '#28a745', // green
  medium: '#ff9800', // orange
  hard: '#dc3545', // red
};

export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  navigation: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#007bff',
      background: '#ffffff',
      card: '#ffffff',
      text: '#212529',
      border: '#dee2e6',
      notification: '#ff3b30',
    },
  },
  // Child-specific styling (ages 6-12)
  child: {
    buttonHeight: 56, // Larger touch targets
    fontSize: 18, // Larger text for developing reading skills
    iconSize: 32, // Larger icons
    spacing: 20, // More generous spacing
    borderRadius: 12, // Friendly rounded corners
  },
}; 