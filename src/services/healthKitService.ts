import { Platform } from 'react-native';
import Healthkit, {
  isHealthDataAvailable,
  requestAuthorization,
  queryCategorySamples,
  queryQuantitySamples,
} from '@kingstinct/react-native-healthkit';
import { SleepSession, SleepStageSegment, SleepStageType, DaySleepRecord } from '../types/sleep';
import { optimalSession } from './mockData';
import { calculateSleepScore } from './sleepScoreCalculator';

export interface HealthKitSyncStatus {
  isAvailable: boolean;
  isAuthorized: boolean;
  isSyncing: boolean;
  source: 'apple_health' | 'simulator_fallback';
  lastSyncTime?: string;
  sampleCount?: number;
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
   * Request permissions from Apple HealthKit for sleep, HRV, heart rate, wrist temp, respiratory rate
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('[HealthKit] HealthKit is only available on iOS devices.');
      this.status.isAvailable = false;
      this.status.errorMessage = 'iOS only';
      return false;
    }

    try {
      const available = isHealthDataAvailable();
      if (!available) {
        console.warn('[HealthKit] HealthKit is not available on this device.');
        this.status.isAvailable = false;
        this.status.errorMessage = 'HealthKit not available on device';
        return false;
      }
      this.status.isAvailable = true;

      console.log('[HealthKit] Requesting HealthKit authorization...');
      const granted = await requestAuthorization({
        toRead: [
          'HKCategoryTypeIdentifierSleepAnalysis',
          'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
          'HKQuantityTypeIdentifierRestingHeartRate',
          'HKQuantityTypeIdentifierAppleSleepingWristTemperature',
          'HKQuantityTypeIdentifierRespiratoryRate',
        ],
      });

      console.log('[HealthKit] Authorization result:', granted);
      this.status.isAuthorized = !!granted;
      return !!granted;
    } catch (err: any) {
      console.warn('[HealthKit] Authorization attempt error:', err?.message || err);
      this.status.isAuthorized = false;
      this.status.errorMessage = err?.message || 'Auth failed';
      return false;
    }
  }

  /**
   * Sync last night's sleep analysis and biometrics from Apple Watch / Apple Health
   */
  async syncSleepData(): Promise<{
    session: SleepSession;
    source: 'apple_health' | 'simulator_fallback';
    message?: string;
  }> {
    this.status.isSyncing = true;
    this.status.errorMessage = undefined;

    if (Platform.OS !== 'ios') {
      this.status.isSyncing = false;
      this.status.source = 'simulator_fallback';
      return { session: optimalSession, source: 'simulator_fallback', message: 'Simulator fallback (non-iOS)' };
    }

    try {
      const available = isHealthDataAvailable();
      if (!available) {
        this.status.isSyncing = false;
        this.status.source = 'simulator_fallback';
        this.status.errorMessage = 'HealthKit not available';
        return { session: optimalSession, source: 'simulator_fallback', message: 'HealthKit unavailable' };
      }

      // 1. Query sleep analysis for the past 72 hours
      const now = new Date();
      const past72h = new Date(now.getTime() - 72 * 60 * 60 * 1000);

      let rawSamples = await queryCategorySamples(
        'HKCategoryTypeIdentifierSleepAnalysis',
        {
          filter: {
            date: {
              startDate: past72h,
              endDate: now,
            },
          },
          limit: 0,
          ascending: true,
        }
      );

      // Fallback: If no samples in 72h, query without date restriction to catch the latest logged sleep
      if (!rawSamples || rawSamples.length === 0) {
        const recentSamples = await queryCategorySamples(
          'HKCategoryTypeIdentifierSleepAnalysis',
          {
            limit: 100,
            ascending: false,
          }
        );
        if (recentSamples && recentSamples.length > 0) {
          rawSamples = [...recentSamples].reverse();
        }
      }

      if (!rawSamples || rawSamples.length === 0) {
        console.log('[HealthKit] No recent sleep samples found in Apple Health.');
        this.status.isSyncing = false;
        this.status.source = 'simulator_fallback';
        this.status.errorMessage = 'No sleep records in Apple Health';
        return {
          session: optimalSession,
          source: 'simulator_fallback',
          message: 'No sleep records found in Apple Health',
        };
      }

      // 2. Cluster samples to isolate the most recent continuous sleep session
      // A gap of > 3 hours between sample[i-1].endDate and sample[i].startDate separates sessions
      const clusters: (typeof rawSamples)[] = [];
      let currentCluster: typeof rawSamples = [];

      for (const sample of rawSamples) {
        if (currentCluster.length === 0) {
          currentCluster.push(sample);
        } else {
          const prevSample = currentCluster[currentCluster.length - 1];
          const prevEnd = new Date(prevSample.endDate).getTime();
          const currStart = new Date(sample.startDate).getTime();

          if (currStart - prevEnd > 3 * 60 * 60 * 1000) {
            clusters.push(currentCluster);
            currentCluster = [sample];
          } else {
            currentCluster.push(sample);
          }
        }
      }
      if (currentCluster.length > 0) {
        clusters.push(currentCluster);
      }

      const latestSleepCluster = clusters[clusters.length - 1];

      // Check if Apple Watch detailed stages (core, deep, rem) exist
      const hasDetailedStages = latestSleepCluster.some(
        (s) => s.value === 3 || s.value === 4 || s.value === 5
      );

      let deepMinutes = 0;
      let remMinutes = 0;
      let coreMinutes = 0;
      let awakeMinutes = 0;
      const segments: SleepStageSegment[] = [];

      const formatTime = (d: Date) =>
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

      for (let i = 0; i < latestSleepCluster.length; i++) {
        const sample = latestSleepCluster[i];
        const start = new Date(sample.startDate);
        const end = new Date(sample.endDate);
        const durationMins = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));

        // Value map in Apple HealthKit:
        // 0: inBed, 1: asleepUnspecified, 2: awake, 3: core, 4: deep, 5: rem
        if (hasDetailedStages) {
          // Ignore value 0 (inBed broad envelope) when detailed watch stages are present to prevent double-counting
          if (sample.value === 0) continue;

          let stage: SleepStageType = 'core';
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

          segments.push({
            id: `hk-stage-${i}-${start.getTime()}`,
            stage,
            startTime: formatTime(start),
            endTime: formatTime(end),
            durationMinutes: durationMins,
          });
        } else {
          // iPhone bedtime or 3rd party basic sleep (inBed / asleep)
          if (sample.value === 2) {
            stageAwake: {
              awakeMinutes += durationMins;
              segments.push({
                id: `hk-awake-${i}-${start.getTime()}`,
                stage: 'awake',
                startTime: formatTime(start),
                endTime: formatTime(end),
                durationMinutes: durationMins,
              });
            }
          } else if (sample.value === 1 || sample.value === 0) {
            coreMinutes += durationMins;
            segments.push({
              id: `hk-asleep-${i}-${start.getTime()}`,
              stage: 'core',
              startTime: formatTime(start),
              endTime: formatTime(end),
              durationMinutes: durationMins,
            });
          }
        }
      }

      // If user had basic sleep without stage separation, estimate deep/rem for biohacking formulas
      if (!hasDetailedStages && coreMinutes > 0) {
        const estDeep = Math.round(coreMinutes * 0.22);
        const estRem = Math.round(coreMinutes * 0.22);
        deepMinutes = estDeep;
        remMinutes = estRem;
        coreMinutes = Math.max(1, coreMinutes - estDeep - estRem);
      }

      const totalMinutesAsleep = Math.max(1, deepMinutes + remMinutes + coreMinutes);
      const timeInBedMinutes = Math.max(totalMinutesAsleep, totalMinutesAsleep + awakeMinutes);
      const sleepEfficiency = Math.min(100, Math.round((totalMinutesAsleep / timeInBedMinutes) * 100));

      const sessionStart = new Date(latestSleepCluster[0].startDate);
      const sessionEnd = new Date(latestSleepCluster[latestSleepCluster.length - 1].endDate);
      const bedTime = formatTime(sessionStart);
      const wakeTime = formatTime(sessionEnd);

      // 3. Query Heart Rate Variability (SDNN)
      let hrvSDNN = 70;
      try {
        const hrvSamples = await queryQuantitySamples(
          'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
          {
            filter: {
              date: {
                startDate: new Date(sessionStart.getTime() - 2 * 60 * 60 * 1000),
                endDate: new Date(sessionEnd.getTime() + 2 * 60 * 60 * 1000),
              },
            },
            limit: 30,
            ascending: false,
            unit: 'ms',
          }
        );

        if (hrvSamples && hrvSamples.length > 0) {
          const vals = hrvSamples
            .map((s) => (s.quantity < 1 ? Math.round(s.quantity * 1000) : Math.round(s.quantity)))
            .filter((v) => v > 0 && v < 300);
          if (vals.length > 0) {
            hrvSDNN = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
          }
        } else {
          // Fallback to most recent HRV
          const recentHrv = await queryQuantitySamples(
            'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
            {
              limit: 1,
              ascending: false,
              unit: 'ms',
            }
          );
          if (recentHrv && recentHrv.length > 0) {
            const val = recentHrv[0].quantity;
            hrvSDNN = Math.round(val < 1 ? val * 1000 : val);
          }
        }
      } catch (e: any) {
        console.warn('[HealthKit] HRV query error:', e?.message || e);
      }

      // 4. Query Resting Heart Rate
      let restingHeartRate = 49;
      try {
        const rhrSamples = await queryQuantitySamples(
          'HKQuantityTypeIdentifierRestingHeartRate',
          {
            filter: {
              date: {
                startDate: new Date(sessionStart.getTime() - 24 * 60 * 60 * 1000),
                endDate: new Date(sessionEnd.getTime() + 12 * 60 * 60 * 1000),
              },
            },
            limit: 5,
            ascending: false,
            unit: 'count/min',
          }
        );
        if (rhrSamples && rhrSamples.length > 0) {
          restingHeartRate = Math.round(rhrSamples[0].quantity);
        } else {
          const recentRhr = await queryQuantitySamples(
            'HKQuantityTypeIdentifierRestingHeartRate',
            {
              limit: 1,
              ascending: false,
              unit: 'count/min',
            }
          );
          if (recentRhr && recentRhr.length > 0) {
            restingHeartRate = Math.round(recentRhr[0].quantity);
          }
        }
      } catch (e: any) {
        console.warn('[HealthKit] RHR query error:', e?.message || e);
      }

      // 5. Query Respiratory Rate
      let respiratoryRate = 14.0;
      try {
        const respSamples = await queryQuantitySamples(
          'HKQuantityTypeIdentifierRespiratoryRate',
          {
            filter: {
              date: {
                startDate: sessionStart,
                endDate: sessionEnd,
              },
            },
            limit: 10,
            ascending: false,
            unit: 'count/min',
          }
        );
        if (respSamples && respSamples.length > 0) {
          const valid = respSamples.map((s) => s.quantity).filter((v) => v > 0 && v < 60);
          if (valid.length > 0) {
            respiratoryRate = Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
          }
        }
      } catch (e: any) {
        // ignore
      }

      // 6. Query Apple Sleeping Wrist Temperature
      let wristTempDeviation = -0.2;
      try {
        const tempSamples = await queryQuantitySamples(
          'HKQuantityTypeIdentifierAppleSleepingWristTemperature',
          {
            filter: {
              date: {
                startDate: new Date(sessionStart.getTime() - 24 * 60 * 60 * 1000),
                endDate: sessionEnd,
              },
            },
            limit: 5,
            ascending: false,
            unit: 'degC',
          }
        );
        if (tempSamples && tempSamples.length > 0) {
          wristTempDeviation = Math.round(tempSamples[0].quantity * 10) / 10;
        }
      } catch (e: any) {
        // Wrist temp is only supported on Apple Watch Series 8 / Ultra or newer
      }

      // 7. Calculate Sleep Score & Insights
      const scoreData = calculateSleepScore({
        totalMinutesAsleep,
        timeInBedMinutes,
        deepMinutes,
        remMinutes,
        hrvSDNN,
      });

      const deepPercent = totalMinutesAsleep > 0 ? Math.round((deepMinutes / totalMinutesAsleep) * 100) : 0;
      const remPercent = totalMinutesAsleep > 0 ? Math.round((remMinutes / totalMinutesAsleep) * 100) : 0;
      const corePercent = totalMinutesAsleep > 0 ? Math.round((coreMinutes / totalMinutesAsleep) * 100) : 0;
      const awakePercent = timeInBedMinutes > 0 ? Math.round((awakeMinutes / timeInBedMinutes) * 100) : 0;

      const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      const dateStr = sessionEnd.toLocaleDateString('en-US', dateOptions);

      const session: SleepSession = {
        id: `hk-${sessionStart.getTime()}`,
        date: `${dateStr} (Apple Health)`,
        bedTime,
        wakeTime,
        totalMinutesAsleep,
        timeInBedMinutes,
        sleepEfficiency,
        deepMinutes,
        remMinutes,
        coreMinutes,
        awakeMinutes,
        deepPercent,
        remPercent,
        corePercent,
        awakePercent,
        hrvSDNN,
        restingHeartRate,
        respiratoryRate,
        wristTempDeviation,
        sleepScore: scoreData.score,
        recoveryRank: scoreData.rank,
        rankEmoji: scoreData.emoji,
        sleepDebtMinutes: Math.max(0, 480 - totalMinutesAsleep),
        recoveryAdvice: scoreData.advice,
        segments: segments.length > 0 ? segments : optimalSession.segments,
      };

      this.status.isSyncing = false;
      this.status.isAuthorized = true;
      this.status.source = 'apple_health';
      this.status.sampleCount = latestSleepCluster.length;
      this.status.lastSyncTime = new Date().toLocaleTimeString();
      this.status.errorMessage = undefined;

      return {
        session,
        source: 'apple_health',
        message: `Synced ${latestSleepCluster.length} records • Score ${scoreData.score}`,
      };
    } catch (err: any) {
      console.warn('[HealthKit] Error reading health metrics:', err?.message || err);
      this.status.isSyncing = false;
      this.status.source = 'simulator_fallback';
      this.status.errorMessage = err?.message || 'Read error';
      return {
        session: optimalSession,
        source: 'simulator_fallback',
        message: this.status.errorMessage,
      };
    }
  }

  /**
   * Sync past 70 days for Sleep Matrix Heatmap
   */
  async syncHistoricalDays(): Promise<DaySleepRecord[] | null> {
    if (Platform.OS !== 'ios') return null;
    try {
      const now = new Date();
      const past70d = new Date(now.getTime() - 70 * 24 * 60 * 60 * 1000);

      const samples = await queryCategorySamples(
        'HKCategoryTypeIdentifierSleepAnalysis',
        {
          filter: {
            date: {
              startDate: past70d,
              endDate: now,
            },
          },
          limit: 0,
          ascending: true,
        }
      );

      if (!samples || samples.length === 0) return null;

      const daysMap = new Map<string, { deep: number; rem: number; core: number; total: number }>();
      for (const s of samples) {
        if (s.value === 0 || s.value === 2) continue;
        const d = new Date(s.endDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dur = Math.max(1, Math.round((new Date(s.endDate).getTime() - new Date(s.startDate).getTime()) / 60000));

        const curr = daysMap.get(key) || { deep: 0, rem: 0, core: 0, total: 0 };
        if (s.value === 4) curr.deep += dur;
        else if (s.value === 5) curr.rem += dur;
        else curr.core += dur;
        curr.total += dur;
        daysMap.set(key, curr);
      }

      if (daysMap.size === 0) return null;

      const result: DaySleepRecord[] = [];
      const dateCursor = new Date(now.getTime() - 69 * 24 * 60 * 60 * 1000);

      for (let i = 0; i < 70; i++) {
        const d = new Date(dateCursor.getTime() + i * 24 * 60 * 60 * 1000);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const data = daysMap.get(key);

        if (data && data.total > 60) {
          const score = Math.min(100, Math.max(40, Math.round((data.total / 480) * 85 + (data.deep / 90) * 15)));
          const deepPct = Math.round((data.deep / data.total) * 100);
          const remPct = Math.round((data.rem / data.total) * 100);
          result.push({
            id: `day-${i}-${key}`,
            dayNumber: i + 1,
            dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score,
            totalHours: `${(data.total / 60).toFixed(1)}h`,
            deepPercent: deepPct,
            remPercent: remPct,
            hrvSDNN: 65,
          });
        } else {
          result.push({
            id: `day-${i}-${key}`,
            dayNumber: i + 1,
            dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: 82,
            totalHours: '7.5h',
            deepPercent: 22,
            remPercent: 22,
            hrvSDNN: 70,
          });
        }
      }
      return result;
    } catch (e) {
      console.warn('[HealthKit] Historical sync error:', e);
      return null;
    }
  }

  getStatus(): HealthKitSyncStatus {
    return this.status;
  }
}

export const healthKitService = new HealthKitManager();
