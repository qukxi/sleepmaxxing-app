import { Platform } from 'react-native';
import { SleepSession, SleepStageSegment, SleepStageType } from '../types/sleep';
import { optimalSession } from './mockData';
import { calculateSleepScore } from './sleepScoreCalculator';

export interface HealthKitSyncStatus {
  isAvailable: boolean;
  isAuthorized: boolean;
  isSyncing: boolean;
  source: 'apple_health' | 'simulator_fallback';
  lastSyncTime?: string;
  errorMessage?: string;
}

class HealthKitManager {
  private status: HealthKitSyncStatus = {
    isAvailable: Platform.OS === 'ios',
    isAuthorized: false,
    isSyncing: false,
    source: 'simulator_fallback',
  };

  /**
   * Request permissions from Apple HealthKit for sleep, HRV, and heart rate
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('[HealthKit] HealthKit is only available on iOS devices.');
      this.status.isAvailable = false;
      return false;
    }

    try {
      const Healthkit = require('@kingstinct/react-native-healthkit');
      const {
        HKCategoryTypeIdentifier,
        HKQuantityTypeIdentifier,
        requestAuthorization,
      } = Healthkit;

      const readPermissions = [
        HKCategoryTypeIdentifier.sleepAnalysis,
        HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
        HKQuantityTypeIdentifier.restingHeartRate,
      ];

      const granted = await requestAuthorization(readPermissions);
      this.status.isAuthorized = !!granted;
      this.status.source = granted ? 'apple_health' : 'simulator_fallback';
      return !!granted;
    } catch (err: any) {
      console.warn('[HealthKit] Authorization attempt:', err?.message || err);
      this.status.isAuthorized = false;
      this.status.source = 'simulator_fallback';
      this.status.errorMessage = err?.message;
      return false;
    }
  }

  /**
   * Sync last night's sleep analysis and biometrics from Apple Watch / HealthKit
   */
  async syncSleepData(): Promise<{ session: SleepSession; source: 'apple_health' | 'simulator_fallback' }> {
    this.status.isSyncing = true;

    if (Platform.OS !== 'ios') {
      this.status.isSyncing = false;
      return { session: optimalSession, source: 'simulator_fallback' };
    }

    try {
      const Healthkit = require('@kingstinct/react-native-healthkit');
      const {
        HKCategoryTypeIdentifier,
        HKQuantityTypeIdentifier,
        queryCategorySamples,
        queryQuantitySamples,
      } = Healthkit;

      // 1. Query sleep analysis for the past 24 hours
      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const sleepSamples = await queryCategorySamples(HKCategoryTypeIdentifier.sleepAnalysis, {
        from: past24h,
        to: now,
      });

      if (!sleepSamples || sleepSamples.length === 0) {
        console.log('[HealthKit] No recent sleep samples found. Using default profile.');
        this.status.isSyncing = false;
        return { session: optimalSession, source: 'simulator_fallback' };
      }

      // Aggregate stages in minutes
      let deepMinutes = 0;
      let remMinutes = 0;
      let coreMinutes = 0;
      let awakeMinutes = 0;
      const segments: SleepStageSegment[] = [];

      for (let i = 0; i < sleepSamples.length; i++) {
        const sample = sleepSamples[i];
        const start = new Date(sample.startDate);
        const end = new Date(sample.endDate);
        const durationMins = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));

        let stage: SleepStageType = 'core';
        // Value 0 = InBed, 1 = AsleepUnspecified, 2 = Awake, 3 = Core, 4 = Deep, 5 = REM
        if (sample.value === 4) {
          stage = 'deep';
          deepMinutes += durationMins;
        } else if (sample.value === 5) {
          stage = 'rem';
          remMinutes += durationMins;
        } else if (sample.value === 2) {
          stage = 'awake';
          awakeMinutes += durationMins;
        } else {
          stage = 'core';
          coreMinutes += durationMins;
        }

        const formatTime = (d: Date) =>
          `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

        segments.push({
          id: `hk-${i}`,
          stage,
          startTime: formatTime(start),
          endTime: formatTime(end),
          durationMinutes: durationMins,
        });
      }

      const totalMinutesAsleep = deepMinutes + remMinutes + coreMinutes;
      const timeInBedMinutes = totalMinutesAsleep + awakeMinutes;

      // 2. Query HRV (SDNN)
      let hrvSDNN = 72;
      try {
        const hrvSamples = await queryQuantitySamples(HKQuantityTypeIdentifier.heartRateVariabilitySDNN, {
          from: past24h,
          to: now,
        });
        if (hrvSamples && hrvSamples.length > 0) {
          hrvSDNN = Math.round(hrvSamples[hrvSamples.length - 1].quantity * 1000); // convert to ms if needed
        }
      } catch (e) {
        // use fallback HRV
      }

      // 3. Query Resting Heart Rate
      let restingHeartRate = 49;
      try {
        const rhrSamples = await queryQuantitySamples(HKQuantityTypeIdentifier.restingHeartRate, {
          from: past24h,
          to: now,
        });
        if (rhrSamples && rhrSamples.length > 0) {
          restingHeartRate = Math.round(rhrSamples[rhrSamples.length - 1].quantity);
        }
      } catch (e) {
        // use fallback RHR
      }

      // 4. Calculate Sleep Score using our formula
      const scoreData = calculateSleepScore({
        totalMinutesAsleep,
        timeInBedMinutes,
        deepMinutes,
        remMinutes,
        hrvSDNN,
      });

      const firstSample = sleepSamples[0];
      const lastSample = sleepSamples[sleepSamples.length - 1];
      const bedTime = `${String(new Date(firstSample.startDate).getHours()).padStart(2, '0')}:${String(new Date(firstSample.startDate).getMinutes()).padStart(2, '0')}`;
      const wakeTime = `${String(new Date(lastSample.endDate).getHours()).padStart(2, '0')}:${String(new Date(lastSample.endDate).getMinutes()).padStart(2, '0')}`;

      const session: SleepSession = {
        id: `hk-session-${Date.now()}`,
        date: 'Today (Apple Health)',
        bedTime,
        wakeTime,
        totalMinutesAsleep,
        timeInBedMinutes,
        sleepEfficiency: timeInBedMinutes > 0 ? Math.round((totalMinutesAsleep / timeInBedMinutes) * 100) : 90,
        deepMinutes,
        remMinutes,
        coreMinutes,
        awakeMinutes,
        deepPercent: totalMinutesAsleep > 0 ? Math.round((deepMinutes / totalMinutesAsleep) * 100) : 20,
        remPercent: totalMinutesAsleep > 0 ? Math.round((remMinutes / totalMinutesAsleep) * 100) : 20,
        corePercent: totalMinutesAsleep > 0 ? Math.round((coreMinutes / totalMinutesAsleep) * 100) : 50,
        awakePercent: timeInBedMinutes > 0 ? Math.round((awakeMinutes / timeInBedMinutes) * 100) : 10,
        hrvSDNN,
        restingHeartRate,
        respiratoryRate: 14.2,
        wristTempDeviation: -0.2,
        sleepScore: scoreData.score,
        recoveryRank: scoreData.rank,
        rankEmoji: scoreData.emoji,
        sleepDebtMinutes: Math.max(0, 480 - totalMinutesAsleep),
        recoveryAdvice: scoreData.advice,
        segments: segments.length > 0 ? segments : optimalSession.segments,
      };

      this.status.isSyncing = false;
      this.status.lastSyncTime = new Date().toLocaleTimeString();
      this.status.source = 'apple_health';

      return { session, source: 'apple_health' };
    } catch (err: any) {
      console.warn('[HealthKit] Error reading health metrics:', err?.message || err);
      this.status.isSyncing = false;
      this.status.source = 'simulator_fallback';
      return { session: optimalSession, source: 'simulator_fallback' };
    }
  }

  getStatus(): HealthKitSyncStatus {
    return this.status;
  }
}

export const healthKitService = new HealthKitManager();
