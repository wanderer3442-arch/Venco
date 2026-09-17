import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gymathome.app',
  appName: 'Gym at Home',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
