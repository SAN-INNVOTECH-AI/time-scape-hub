import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d763df3b9498418ebc408bd89e953965',
  appName: 'time-scape-hub',
  webDir: 'dist',
  server: {
    url: 'https://d763df3b-9498-418e-bc40-8bd89e953965.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    Geolocation: {
      permissions: {
        location: "always"
      }
    }
  }
};

export default config;