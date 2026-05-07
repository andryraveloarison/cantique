import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.andry.cantique',
  appName: 'Cantiques FFPM',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
