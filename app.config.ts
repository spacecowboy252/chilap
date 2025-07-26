import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';
import path from 'path';

// Load variables from env.local (fallback to .env)
dotenv.config({ path: path.resolve(__dirname, './env.local') });

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: (config as any).name || 'Children App',
    slug: (config as any).slug || 'children-app',
    version: (config as any).version || '1.0.0',
    extra: {
      ...(config as any).extra,
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    },
  } as ExpoConfig;
}; 