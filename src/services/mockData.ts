import { SleepSession, BiohackProtocolItem, CircadianMilestone, DaySleepRecord } from '../types/sleep';
import { calculateSleepScore } from './sleepScoreCalculator';

export const optimalSession: SleepSession = {
  id: 'session-optimal',
  date: 'Today, Oct 11',
  bedTime: '22:30',
  wakeTime: '07:05',
  totalMinutesAsleep: 475, // 7h 55m
  timeInBedMinutes: 515,   // 8h 35m
  sleepEfficiency: 92,
  deepMinutes: 110,        // 1h 50m (23%)
  remMinutes: 115,         // 1h 55m (24%)
  coreMinutes: 250,        // 4h 10m (53%)
  awakeMinutes: 40,
  deepPercent: 23,
  remPercent: 24,
  corePercent: 53,
  awakePercent: 8,
  hrvSDNN: 78,
  restingHeartRate: 47,
  respiratoryRate: 13.8,
  wristTempDeviation: -0.2,
  sleepScore: 94,
  recoveryRank: 'Sleep God',
  rankEmoji: '👑',
  sleepDebtMinutes: -15, // Almost zero debt!
  recoveryAdvice: 'Peak recovery achieved. Glycogen replenishment and neuroplasticity maximized.',
  segments: [
    { id: '1', stage: 'awake', startTime: '22:30', endTime: '22:45', durationMinutes: 15 },
    { id: '2', stage: 'core', startTime: '22:45', endTime: '23:30', durationMinutes: 45 },
    { id: '3', stage: 'deep', startTime: '23:30', endTime: '01:00', durationMinutes: 90 },
    { id: '4', stage: 'rem', startTime: '01:00', endTime: '01:45', durationMinutes: 45 },
    { id: '5', stage: 'core', startTime: '01:45', endTime: '03:00', durationMinutes: 75 },
    { id: '6', stage: 'deep', startTime: '03:00', endTime: '03:20', durationMinutes: 20 },
    { id: '7', stage: 'rem', startTime: '03:20', endTime: '04:10', durationMinutes: 50 },
    { id: '8', stage: 'awake', startTime: '04:10', endTime: '04:20', durationMinutes: 10 },
    { id: '9', stage: 'core', startTime: '04:20', endTime: '06:30', durationMinutes: 130 },
    { id: '10', stage: 'rem', startTime: '06:30', endTime: '06:50', durationMinutes: 20 },
    { id: '11', stage: 'awake', startTime: '06:50', endTime: '07:05', durationMinutes: 15 },
  ],
};

export const moderateSession: SleepSession = {
  id: 'session-moderate',
  date: 'Yesterday, Oct 10',
  bedTime: '23:45',
  wakeTime: '06:50',
  totalMinutesAsleep: 390, // 6h 30m
  timeInBedMinutes: 425,
  sleepEfficiency: 86,
  deepMinutes: 60,         // 1h (15%)
  remMinutes: 70,          // 1h 10m (18%)
  coreMinutes: 260,
  awakeMinutes: 35,
  deepPercent: 15,
  remPercent: 18,
  corePercent: 67,
  awakePercent: 9,
  hrvSDNN: 52,
  restingHeartRate: 56,
  respiratoryRate: 15.1,
  wristTempDeviation: +0.3,
  sleepScore: 76,
  recoveryRank: 'Functional Rest',
  rankEmoji: '🔋',
  sleepDebtMinutes: 90, // 1.5h debt
  recoveryAdvice: 'Moderate recovery. Aim to bank 1 extra hour of sleep tonight.',
  segments: [
    { id: 'm1', stage: 'awake', startTime: '23:45', endTime: '00:05', durationMinutes: 20 },
    { id: 'm2', stage: 'core', startTime: '00:05', endTime: '01:10', durationMinutes: 65 },
    { id: 'm3', stage: 'deep', startTime: '01:10', endTime: '02:10', durationMinutes: 60 },
    { id: 'm4', stage: 'rem', startTime: '02:10', endTime: '02:45', durationMinutes: 35 },
    { id: 'm5', stage: 'core', startTime: '02:45', endTime: '05:00', durationMinutes: 135 },
    { id: 'm6', stage: 'rem', startTime: '05:00', endTime: '05:35', durationMinutes: 35 },
    { id: 'm7', stage: 'core', startTime: '05:35', endTime: '06:35', durationMinutes: 60 },
    { id: 'm8', stage: 'awake', startTime: '06:35', endTime: '06:50', durationMinutes: 15 },
  ],
};

export const deprivedSession: SleepSession = {
  id: 'session-deprived',
  date: 'Oct 9 (Crisis)',
  bedTime: '01:30',
  wakeTime: '06:30',
  totalMinutesAsleep: 270, // 4h 30m
  timeInBedMinutes: 300,
  sleepEfficiency: 79,
  deepMinutes: 30,         // 30m (11%)
  remMinutes: 40,          // 40m (15%)
  coreMinutes: 200,
  awakeMinutes: 30,
  deepPercent: 11,
  remPercent: 15,
  corePercent: 74,
  awakePercent: 10,
  hrvSDNN: 34,
  restingHeartRate: 68,
  respiratoryRate: 16.5,
  wristTempDeviation: +0.8,
  sleepScore: 48,
  recoveryRank: 'Walking Zombie',
  rankEmoji: '💀',
  sleepDebtMinutes: 210, // 3.5h debt!
  recoveryAdvice: 'Critical sleep deficit. Avoid high-intensity training and stimulants after 12:00.',
  segments: [
    { id: 'd1', stage: 'awake', startTime: '01:30', endTime: '01:50', durationMinutes: 20 },
    { id: 'd2', stage: 'core', startTime: '01:50', endTime: '03:10', durationMinutes: 80 },
    { id: 'd3', stage: 'deep', startTime: '03:10', endTime: '03:40', durationMinutes: 30 },
    { id: 'd4', stage: 'core', startTime: '03:40', endTime: '05:20', durationMinutes: 100 },
    { id: 'd5', stage: 'rem', startTime: '05:20', endTime: '06:00', durationMinutes: 40 },
    { id: 'd6', stage: 'awake', startTime: '06:00', endTime: '06:30', durationMinutes: 30 },
  ],
};

export const initialProtocols: BiohackProtocolItem[] = [
  {
    id: 'p1',
    title: 'Magnesium L-Threonate / Glycinate',
    category: 'supplement',
    description: '400 mg 45m before bed to boost GABA transmission and muscular relaxation.',
    impactScore: 5,
    completed: true,
    timing: '21:45',
  },
  {
    id: 'p2',
    title: 'L-Theanine + Apigenin',
    category: 'supplement',
    description: '200 mg theanine + 50 mg apigenin to quiet active beta brain waves.',
    impactScore: 4,
    completed: true,
    timing: '22:00',
  },
  {
    id: 'p3',
    title: 'Cold Bedroom (18°C / 65°F)',
    category: 'environment',
    description: 'Core body temperature drop triggers natural melatonin synthesis.',
    impactScore: 5,
    completed: true,
    timing: 'Pre-bed',
  },
  {
    id: 'p4',
    title: '100% Blackout & Sleep Mask',
    category: 'environment',
    description: 'Zero photon leakage preserves melatonin even through closed eyelids.',
    impactScore: 5,
    completed: false,
    timing: '22:15',
  },
  {
    id: 'p5',
    title: 'Mouth Taping (Nasal Breathing)',
    category: 'behavior',
    description: 'Forces nasal breathing: maximizes nitric oxide (NO) and prevents snoring.',
    impactScore: 4,
    completed: false,
    timing: 'Bedtime',
  },
  {
    id: 'p6',
    title: 'Blue Light Blocking (Blue-Blockers)',
    category: 'behavior',
    description: 'Amber lenses ON and overhead lighting dimmed 2h before bed.',
    impactScore: 4,
    completed: true,
    timing: '20:30',
  },
];

export const circadianMilestones: CircadianMilestone[] = [
  {
    id: 'c1',
    label: 'Morning Sunlight (Cortisol Anchor)',
    time: '07:30 - 08:00',
    type: 'sunlight',
    status: 'passed',
    instruction: '15-20 minutes direct sunlight to synchronize master suprachiasmatic nucleus.',
  },
  {
    id: 'c2',
    label: 'Caffeine Cut-off Window',
    time: '13:30',
    type: 'caffeine_cutoff',
    status: 'passed',
    instruction: 'Caffeine half-life spans up to 8 hours. Cease all stimulant ingestion.',
  },
  {
    id: 'c3',
    label: 'Last Heavy Meal Deadline',
    time: '19:00',
    type: 'last_meal',
    status: 'passed',
    instruction: 'Digestion within 3h of bed elevates resting heart rate and degrades deep sleep.',
  },
  {
    id: 'c4',
    label: 'Digital Sunset Protocol',
    time: '21:00',
    type: 'digital_sunset',
    status: 'active',
    instruction: 'Switch screens to Night Shift; read physical book under low-lux warm light.',
  },
  {
    id: 'c5',
    label: 'Peak Melatonin Synthesis',
    time: '22:15',
    type: 'melatonin_peak',
    status: 'upcoming',
    instruction: 'Maximum biological sleepiness. Prime moment to close eyes for rapid onset.',
  },
  {
    id: 'c6',
    label: 'Optimal Sleep Window',
    time: '22:30 - 22:45',
    type: 'optimal_bedtime',
    status: 'upcoming',
    instruction: 'Aligns with your 90-minute ultradian sleep architecture for 4 full cycles.',
  },
];

// Generate 70 days (10 weeks x 7 days) of realistic sleep matrix history
const generateHistoryDays = (): DaySleepRecord[] => {
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const records: DaySleepRecord[] = [];

  // Seeded scores simulating sleepmaxxing journey (improving over time with some variance)
  const scoresPattern = [
    // Week 1 (Baseline)
    62, 68, 74, 58, 65, 78, 82,
    // Week 2 (Early biohacking)
    72, 76, 80, 68, 75, 84, 88,
    // Week 3
    82, 85, 89, 74, 81, 88, 91,
    // Week 4 (Travel / Stress dip)
    48, 55, 64, 70, 78, 85, 88,
    // Week 5 (Recovery)
    84, 87, 90, 82, 86, 92, 94,
    // Week 6
    88, 91, 93, 76, 85, 93, 95,
    // Week 7
    74, 78, 84, 88, 92, 94, 96,
    // Week 8
    90, 92, 95, 84, 89, 93, 95,
    // Week 9
    86, 89, 92, 88, 91, 94, 96,
    // Week 10 (Current week - Peak Sleep God)
    92, 91, 94, 85, 78, 94, 96,
  ];

  for (let i = 0; i < scoresPattern.length; i++) {
    const score = scoresPattern[i];
    const dayOfWeek = daysOfWeek[i % 7];
    const dayNum = i + 1;
    const hours = (6.0 + (score / 100) * 2.3).toFixed(1);
    const deep = Math.round(10 + (score / 100) * 15);
    const rem = Math.round(14 + (score / 100) * 11);
    const hrv = Math.round(35 + (score / 100) * 45);

    let dateLabel = `Sep ${(i % 30) + 1}`;
    if (i < 14) dateLabel = `Aug ${15 + i}`;
    else if (i >= 56) dateLabel = `Oct ${i - 55}`;

    if (i === scoresPattern.length - 1) dateLabel = 'Today';

    records.push({
      id: `day-${i + 1}`,
      dayNumber: dayNum,
      dayOfWeek,
      dateLabel,
      score,
      totalHours: `${hours}h`,
      deepPercent: deep,
      remPercent: rem,
      hrvSDNN: hrv,
    });
  }

  return records;
};

export const historyDays: DaySleepRecord[] = generateHistoryDays();
