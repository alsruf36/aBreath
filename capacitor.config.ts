import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acompany.abreath',
  appName: 'aBreath',
  webDir: '.output/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
