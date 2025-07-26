import * as SecureStore from 'expo-secure-store';

// Provide minimal no-op implementations for web where SecureStore is not available
if (!(SecureStore as any).getValueWithKeyAsync) {
  (SecureStore as any).getValueWithKeyAsync = async () => null;
}
if (!(SecureStore as any).setValueWithKeyAsync) {
  (SecureStore as any).setValueWithKeyAsync = async () => {};
}

export {}; 