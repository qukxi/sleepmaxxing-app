import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DaySleepRecord } from '../types/sleep';
import { FONTS } from '../constants/typography';

interface SleepMatrixGridProps {
  days: DaySleepRecord[];
  onSelectDay?: (day: DaySleepRecord) => void;
}

export const SleepMatrixGrid: React.FC<SleepMatrixGridProps> = ({ days, onSelectDay }) => {
  const [selectedDayId, setSelectedDayId] = useState<string>(days[days.length - 1]?.id || '');

  const selectedDay = days.find((d) => d.id === selectedDayId) || days[days.length - 1];

  const getSquareColor = (score: number) => {
    if (score >= 92) return '#22C55E'; // Vibrant Green (Sleep God 92+)
    if (score >= 82) return '#15803D'; // Forest Emerald (Bio-Optimized 82-91)
    if (score >= 72) return '#2E4057'; // Slate (Functional 72-81)
    if (score >= 60) return '#854D0E'; // Bronze (Deprived 60-71)
    return '#7F1D1D';                  // Crimson (<60 Zombie)
  };

  const getScoreRank = (score: number) => {
    if (score >= 92) return 'Sleep God';
    if (score >= 82) return 'Bio-Optimized';
    if (score >= 72) return 'Functional';
    if (score >= 60) return 'Deprived';
    return 'Zombie';
  };

  // Organize days into 7 rows (one for each day of week) across weeks
  const dayRowLabels = ['M', '', 'W', '', 'F', '', 'S'];

  // Group by week (columns of 7)
  const weeksCount = Math.ceil(days.length / 7);
  const weeks: DaySleepRecord[][] = [];
  for (let w = 0; w < weeksCount; w++) {
    weeks.push(days.slice(w * 7, (w + 1) * 7));
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SLEEP MATRIX</Text>
          <Text style={styles.subtitle}>{days.length} DAYS • 10 WEEKS</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={styles.statPillText}>AVG 86 PTS</Text>
        </View>
      </View>

      {/* GitHub-style small square heatmap */}
      <View style={styles.matrixContainer}>
        {/* Left Weekday Labels */}
        <View style={styles.dayLabelsCol}>
          {dayRowLabels.map((lbl, i) => (
            <View key={i} style={styles.labelSlot}>
              <Text style={styles.dayLabelText}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Scrollable / Responsive Weeks Grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weeksScroll}
        >
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekCol}>
              {week.map((item) => {
                const isSelected = item.id === selectedDayId;
                const bg = getSquareColor(item.score);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.smallSquare,
                      { backgroundColor: bg },
                      isSelected && styles.squareSelected,
                    ]}
                    onPress={() => {
                      setSelectedDayId(item.id);
                      if (onSelectDay) onSelectDay(item);
                    }}
                    activeOpacity={0.7}
                  />
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Minimal Legend */}
      <View style={styles.legendRow}>
        <Text style={styles.legendLabel}>&lt;60 CRISIS</Text>
        <View style={styles.legendDots}>
          <View style={[styles.legendSquare, { backgroundColor: '#7F1D1D' }]} />
          <View style={[styles.legendSquare, { backgroundColor: '#854D0E' }]} />
          <View style={[styles.legendSquare, { backgroundColor: '#2E4057' }]} />
          <View style={[styles.legendSquare, { backgroundColor: '#15803D' }]} />
          <View style={[styles.legendSquare, { backgroundColor: '#22C55E' }]} />
        </View>
        <Text style={styles.legendLabel}>92+ SLEEP GOD</Text>
      </View>

      {/* Selected Day Inspector Box */}
      {selectedDay && (
        <View style={styles.inspectorBox}>
          <View style={styles.inspectorTop}>
            <Text style={styles.inspectorDate}>
              {selectedDay.dateLabel} ({selectedDay.dayOfWeek})
            </Text>
            <View style={styles.inspectorScoreRow}>
              <View
                style={[
                  styles.rankDot,
                  { backgroundColor: getSquareColor(selectedDay.score) },
                ]}
              />
              <Text style={styles.inspectorScore}>{selectedDay.score} PTS</Text>
              <Text style={styles.inspectorRank}>[{getScoreRank(selectedDay.score)}]</Text>
            </View>
          </View>

          <View style={styles.inspectorMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>DURATION</Text>
              <Text style={styles.metricValue}>{selectedDay.totalHours}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>DEEP</Text>
              <Text style={styles.metricValue}>{selectedDay.deepPercent}%</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>REM</Text>
              <Text style={styles.metricValue}>{selectedDay.remPercent}%</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>HRV</Text>
              <Text style={styles.metricValue}>{selectedDay.hrvSDNN}ms</Text>
            </View>
          </View>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    color: '#71717A',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  statPill: {
    backgroundColor: '#18181B',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statPillText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  matrixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayLabelsCol: {
    marginRight: 6,
    justifyContent: 'space-between',
  },
  labelSlot: {
    height: 14,
    justifyContent: 'center',
    marginBottom: 3,
  },
  dayLabelText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#52525B',
    letterSpacing: 0.5,
  },
  weeksScroll: {
    flexDirection: 'row',
    gap: 3,
    paddingVertical: 2,
  },
  weekCol: {
    flexDirection: 'column',
    gap: 3,
  },
  smallSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  squareSelected: {
    borderColor: '#FAFAFA',
    borderWidth: 1.5,
    transform: [{ scale: 1.15 }],
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#18181B',
    marginBottom: 10,
  },
  legendLabel: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#52525B',
    letterSpacing: 0.5,
  },
  legendDots: {
    flexDirection: 'row',
    gap: 3,
  },
  legendSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  inspectorBox: {
    backgroundColor: '#0F0F12',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  inspectorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inspectorDate: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
  inspectorScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rankDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inspectorScore: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
  inspectorRank: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#A1A1AA',
  },
  inspectorMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1C1C20',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#27272A',
  },
  metricLabel: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    marginBottom: 1,
  },
  metricValue: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
});
