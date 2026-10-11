import { Platform } from 'react-native';
import { SleepSession } from '../types/sleep';
import { optimalSession } from './mockData';

export interface HealthKitSyncStatus {
  isAvailable: boolean;
  isAuthorized: boolean;
  lastSyncTime?: Date;
  source: 'healthkit' | 'mock_simulator';
}

class HealthKitManager {
  private status: HealthKitSyncStatus = {
    isAvailable: Platform.OS === 'ios',
    isAuthorized: false,
    source: 'mock_simulator',
  };

  /**
   * Request authorization for Apple HealthKit sleep analysis, HRV, heart rate, and temperature
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('[HealthKit] HealthKit is only available on native iOS. Using simulator data.');
      return false;
    }

    // When compiled as a native iOS build with @kingstinct/react-native-healthkit,
    // this would invoke NativeHealthKit.requestAuthorization()
    console.log('[HealthKit] Initializing native permissions for sleep and heart metrics...');
    return true;
  }

  /**
   * Fetch the most recent night's sleep session
   */
  async fetchLatestSleepSession(): Promise<SleepSession> {
    // In simulator / Expo Go mode, returns optimalSession
    return optimalSession;
  }

  getStatus(): HealthKitSyncStatus {
    return this.status;
  }
}

export const healthKitService = new HealthKitManager();
