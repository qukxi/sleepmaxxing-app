export type SleepStageType = 'deep' | 'rem' | 'core' | 'awake';

export interface SleepStageSegment {
  id: string;
  stage: SleepStageType;
  startTime: string; // "23:15"
  endTime: string;   // "00:30"
  durationMinutes: number;
}

export interface DaySleepRecord {
  id: string;
  dayNumber: number;   // 1 to 28
  dayOfWeek: string;   // "ПН", "ВТ", etc.
  dateLabel: string;   // "11 Окт"
  score: number;       // 0 to 100
  totalHours: string;  // "7.9ч"
  deepPercent: number; // 23%
  remPercent: number;  // 24%
  hrvSDNN: number;     // 78
}

export interface BiohackProtocolItem {
  id: string;
  title: string;
  category: 'supplement' | 'environment' | 'behavior';
  description: string;
  impactScore: number; // +1 to +5
  completed: boolean;
  timing: string; // e.g., "30m before bed"
}

export interface CircadianMilestone {
  id: string;
  label: string;
  time: string;
  type: 'sunlight' | 'caffeine_cutoff' | 'last_meal' | 'digital_sunset' | 'melatonin_peak' | 'optimal_bedtime';
  status: 'passed' | 'active' | 'upcoming';
  instruction: string;
}

export interface SleepSession {
  id: string;
  date: string; // "2026-10-11"
  bedTime: string; // "22:45"
  wakeTime: string; // "07:15"
  totalMinutesAsleep: number;
  timeInBedMinutes: number;
  sleepEfficiency: number; // percentage (e.g. 91)
  
  // Stages breakdown in minutes
  deepMinutes: number;
  remMinutes: number;
  coreMinutes: number;
  awakeMinutes: number;

  // Stages breakdown in percentages
  deepPercent: number;
  remPercent: number;
  corePercent: number;
  awakePercent: number;

  // Bio-markers
  hrvSDNN: number; // ms (Heart Rate Variability)
  restingHeartRate: number; // bpm
  respiratoryRate: number; // breaths/min
  wristTempDeviation: number; // Celsius (+0.1, -0.2)

  // Sleepmaxxing analytics
  sleepScore: number; // 0 - 100
  recoveryRank: string; // "Sleep God", "Bio-Optimized", etc.
  rankEmoji: string;
  sleepDebtMinutes: number; // negative or positive minutes vs 8h baseline
  recoveryAdvice: string;

  // Detailed timeline for hypnogram
  segments: SleepStageSegment[];
}
