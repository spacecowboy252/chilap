import { DefaultTheme } from '@react-navigation/native';

export const demoColors = {
  background: '#FCFCF9',
  surface: '#FFFFFD',
  text: '#13343B',
  textSecondary: '#626C71',
  primary: '#21808D',
  primaryHover: '#1D7480',
  primaryActive: '#1A6873',
  secondary: 'rgba(94, 82, 64, 0.12)',
  border: 'rgba(94, 82, 64, 0.2)',
  cardBorder: 'rgba(94, 82, 64, 0.12)',
  error: '#C0152F',
  success: '#21808D',
  warning: '#A84B2F',
  info: '#626C71',
  focusRing: 'rgba(33, 128, 141, 0.4)',
};

export const theme = {
  colors: {
    ...demoColors,
    // Legacy aliases for existing code
    danger: demoColors.error,
    light: demoColors.background,
    dark: demoColors.text,
    textMuted: demoColors.textSecondary,
    card: demoColors.surface,
  },
  typography: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 30,
    // Child-friendly sizing
    h1: 30,
    h2: 24,
    body: 16,
    small: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  radius: {
    sm: 6,
    base: 8,
    md: 10,
    lg: 12,
    full: 9999,
  },
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.02,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 3,
    },
  },
  navigation: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: demoColors.primary,
      background: demoColors.background,
      card: demoColors.surface,
      text: demoColors.text,
      border: demoColors.border,
    },
  },
};

// Legacy exports for backward compatibility
export const difficultyColors = {
  easy: demoColors.success,
  medium: demoColors.warning,
  hard: demoColors.error,
};

 