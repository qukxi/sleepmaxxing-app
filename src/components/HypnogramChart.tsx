import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { SleepSession, SleepStageType } from '../types/sleep';
import { FONTS } from '../constants/typography';

interface HypnogramChartProps {
  session: SleepSession;
}

const STAGE_CONFIG: Record<
  SleepStageType,
  { label: string; color: string; yLevel: number; height: number; desc: string }
> = {
  awake: { label: 'Awake', color: '#EF4444', yLevel: 4, height: 14, desc: 'Arousals' },
  rem: { label: 'REM', color: '#38BDF8', yLevel: 22, height: 14, desc: 'Cognition & Dreams' },
  core: { label: 'Core', color: '#3F3F46', yLevel: 40, height: 14, desc: 'Restorative Rest' },
  deep: { label: 'Deep', color: '#22C55E', yLevel: 58, height: 16, desc: 'Growth Hormone' },
};

export const HypnogramChart: React.FC<HypnogramChartProps> = ({ session }) => {
  const chartHeight = 80;
  const totalDuration = session.segments.reduce((acc, s) => acc + s.durationMinutes, 0) || 1;

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>SLEEP STAGES</Text>
        <Text style={styles.bedTimes}>
          {session.bedTime} — {session.wakeTime}
        </Text>
      </View>

      {/* SVG Hypnogram */}
      <View style={styles.chartWrapper}>
        <Svg width="100%" height={chartHeight} viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
          {(() => {
            let accumulatedPercent = 0;
            return session.segments.map((seg) => {
              const segWidthPercent = (seg.durationMinutes / totalDuration) * 100;
              const x = accumulatedPercent;
              accumulatedPercent += segWidthPercent;
              const config = STAGE_CONFIG[seg.stage];

              return (
                <Rect
                  key={seg.id}
                  x={x}
                  y={config.yLevel}
                  width={segWidthPercent}
                  height={config.height}
                  fill={config.color}
                  rx={1.5}
                />
              );
            });
          })()}
        </Svg>
      </View>

      {/* Time axis */}
      <View style={styles.timeAxis}>
        <Text style={styles.axisText}>{session.bedTime}</Text>
        <Text style={styles.axisText}>MIDPOINT</Text>
        <Text style={styles.axisText}>{session.wakeTime}</Text>
      </View>

      {/* Minimal Legend Row */}
      <View style={styles.legendContainer}>
        {/* Deep */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: STAGE_CONFIG.deep.color }]} />
          <View style={styles.textsBox}>
            <Text style={styles.stageName}>Deep</Text>
            <Text style={styles.stageDesc}>Growth Hormone</Text>
          </View>
          <Text style={styles.stageStats}>
            {formatMinutes(session.deepMinutes)} ({session.deepPercent}%)
          </Text>
        </View>

        {/* REM */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: STAGE_CONFIG.rem.color }]} />
          <View style={styles.textsBox}>
            <Text style={styles.stageName}>REM</Text>
            <Text style={styles.stageDesc}>Cognition & Dreams</Text>
          </View>
          <Text style={styles.stageStats}>
            {formatMinutes(session.remMinutes)} ({session.remPercent}%)
          </Text>
        </View>

        {/* Core */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: STAGE_CONFIG.core.color }]} />
          <View style={styles.textsBox}>
            <Text style={styles.stageName}>Core</Text>
            <Text style={styles.stageDesc}>Restorative Rest</Text>
          </View>
          <Text style={styles.stageStats}>
            {formatMinutes(session.coreMinutes)} ({session.corePercent}%)
          </Text>
        </View>

        {/* Awake */}
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: STAGE_CONFIG.awake.color }]} />
          <View style={styles.textsBox}>
            <Text style={styles.stageName}>Awake</Text>
            <Text style={styles.stageDesc}>Arousals</Text>
          </View>
          <Text style={styles.stageStats}>
            {formatMinutes(session.awakeMinutes)} ({session.awakePercent}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#09090B',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#F4F4F5',
    letterSpacing: 1.5,
  },
  bedTimes: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#71717A',
  },
  chartWrapper: {
    height: 80,
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E1E22',
  },
  timeAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 6,
    marginBottom: 10,
  },
  axisText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#52525B',
    letterSpacing: 0.5,
  },
  legendContainer: {
    gap: 7,
    borderTopWidth: 1,
    borderTopColor: '#18181B',
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  textsBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  stageName: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
  stageDesc: {
    fontSize: 9,
    fontFamily: FONTS.regular,
    color: '#52525B',
  },
  stageStats: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#A1A1AA',
  },
});
