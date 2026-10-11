import { SleepSession } from '../types/sleep';

export interface ScoreBreakdown {
  score: number;
  rank: string;
  emoji: string;
  advice: string;
  durationScore: number;
  deepScore: number;
  remScore: number;
  efficiencyScore: number;
  hrvScore: number;
}

export function calculateSleepScore(params: {
  totalMinutesAsleep: number;
  timeInBedMinutes: number;
  deepMinutes: number;
  remMinutes: number;
  hrvSDNN: number;
}): ScoreBreakdown {
  const { totalMinutesAsleep, timeInBedMinutes, deepMinutes, remMinutes, hrvSDNN } = params;

  // 1. Duration score (max 30 pts) - target 450-510 mins (7.5 - 8.5 hours)
  const targetMinutes = 480;
  const durationRatio = Math.min(totalMinutesAsleep / targetMinutes, 1.1);
  const durationScore = Math.min(30, Math.round(durationRatio * 30));

  // 2. Deep Sleep Score (max 25 pts) - target 20% of total sleep (90+ mins)
  const deepPercent = totalMinutesAsleep > 0 ? (deepMinutes / totalMinutesAsleep) * 100 : 0;
  let deepScore = 0;
  if (deepPercent >= 20) {
    deepScore = 25;
  } else if (deepPercent >= 15) {
    deepScore = 20;
  } else if (deepPercent >= 10) {
    deepScore = 14;
  } else {
    deepScore = 8;
  }

  // 3. REM Sleep Score (max 20 pts) - target 20-25% of total sleep
  const remPercent = totalMinutesAsleep > 0 ? (remMinutes / totalMinutesAsleep) * 100 : 0;
  let remScore = 0;
  if (remPercent >= 20) {
    remScore = 20;
  } else if (remPercent >= 15) {
    remScore = 16;
  } else if (remPercent >= 10) {
    remScore = 10;
  } else {
    remScore = 5;
  }

  // 4. Sleep Efficiency Score (max 15 pts) - target >= 90%
  const efficiency = timeInBedMinutes > 0 ? (totalMinutesAsleep / timeInBedMinutes) * 100 : 0;
  let efficiencyScore = 0;
  if (efficiency >= 92) {
    efficiencyScore = 15;
  } else if (efficiency >= 85) {
    efficiencyScore = 12;
  } else if (efficiency >= 75) {
    efficiencyScore = 8;
  } else {
    efficiencyScore = 4;
  }

  // 5. HRV Recovery bonus (max 10 pts) - target > 65 ms
  let hrvScore = 0;
  if (hrvSDNN >= 70) {
    hrvScore = 10;
  } else if (hrvSDNN >= 50) {
    hrvScore = 8;
  } else if (hrvSDNN >= 35) {
    hrvScore = 5;
  } else {
    hrvScore = 2;
  }

  const totalScore = Math.min(100, Math.max(0, durationScore + deepScore + remScore + efficiencyScore + hrvScore));

  let rank = "Functional Mortal";
  let emoji = "🌱";
  let advice = "Solid baseline sleep, but opportunity remains to boost restorative deep sleep.";

  if (totalScore >= 92) {
    rank = "Sleep God";
    emoji = "👑";
    advice = "Peak sleepmaxxing! Autonomic nervous system fully restored with optimal growth hormone pulse.";
  } else if (totalScore >= 82) {
    rank = "Bio-Optimized";
    emoji = "⚡";
    advice = "Superior recovery. High autonomic HRV status and well-balanced REM/Deep architecture.";
  } else if (totalScore >= 70) {
    rank = "Functional Rest";
    emoji = "🔋";
    advice = "Ready for the day, though mild deep sleep deficiency might lower late-afternoon stamina.";
  } else if (totalScore >= 55) {
    rank = "Sleep Deprived";
    emoji = "⚠️";
    advice = "Accumulated sleep debt. Cut caffeine 10h before bed and cool the room to 18°C (65°F).";
  } else {
    rank = "Walking Zombie";
    emoji = "💀";
    advice = "Critical sleep deficit! Schedule a 20m power nap and execute strict pre-bed blackout protocol.";
  }

  return {
    score: totalScore,
    rank,
    emoji,
    advice,
    durationScore,
    deepScore,
    remScore,
    efficiencyScore,
    hrvScore,
  };
}
