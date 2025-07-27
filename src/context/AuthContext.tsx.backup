import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform, LogBox } from 'react-native';

// Suppress secure-store web warnings
LogBox.ignoreLogs([/getValueWithKeyAsync/]);

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: any | null;
  accessToken: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Grab extra config in a way that works on native & web, dev & prod
  const extra =
    (Constants.expoConfig?.extra as any) ||
    ((Constants as any).manifest?.extra as any) ||
    ((Constants as any).manifest2?.extra as any) ||
    {};

  const {
    googleWebClientId,
    googleAndroidClientId,
    googleIosClientId,
  } = extra || {};

  const storage = {
    async get(key: string) {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    },
    async set(key: string, value: string) {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      return SecureStore.setItemAsync(key, value);
    },
    async delete(key: string) {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      return SecureStore.deleteItemAsync(key);
    },
  };

  // Only create Google config if we have real client IDs
  const googleConfig = React.useMemo(() => {
    if (!googleWebClientId) {
      console.log('[AuthContext] No Google client IDs configured');
      return null;
    }
    
    return {
      webClientId: googleWebClientId,
      androidClientId: googleAndroidClientId,
      iosClientId: googleIosClientId,
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
      responseType: 'token' as const,
    };
  }, [googleWebClientId, googleAndroidClientId, googleIosClientId]);

  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig || {});

  // Handle response
  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      (async () => {
        const token = response.authentication!.accessToken;
        await storage.set('google_token', token);
        setAccessToken(token);
        try {
          const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profile = await res.json();
          setUser(profile);
        } catch {
          setUser({ name: 'Google User' });
        }
      })();
    }
  }, [response]);

  // Load token on mount
  useEffect(() => {
    (async () => {
      const stored = await storage.get('google_token');
      if (stored) {
        setAccessToken(stored);
        setUser({ name: 'Google User' });
      }
    })();
  }, []);

  const signIn = async () => {
    if (!googleConfig) {
      alert('Google Sign-In not configured. Please add client IDs to env.local');
      return;
    }
    try {
      await promptAsync();
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.');
    }
  };

  const signOut = async () => {
    setUser(null);
    setAccessToken(null);
    await storage.delete('google_token');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 