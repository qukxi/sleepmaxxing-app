import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { FONTS } from '../constants/typography';

interface ScoreRingProps {
  score: number;
  rank: string;
  emoji: string;
  totalTime: string;
  efficiency: number;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  rank,
  emoji,
  totalTime,
  efficiency,
}) => {
  const size = 180;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  // Strict minimal accent colors
  const getAccentColor = () => {
    if (score >= 92) return '#22C55E'; // Emerald
    if (score >= 82) return '#10B981'; // Green
    if (score >= 70) return '#71717A'; // Zinc
    return '#EF4444';                  // Red
  };

  const accentColor = getAccentColor();

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Subtle dark track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#18181B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Minimalist ring stroke */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreMax}>OUT OF 100</Text>
          <View style={styles.rankBadge}>
            <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
            <Text style={styles.rankText}>{rank.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Minimalist Key Stats Row */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>DURATION</Text>
          <Text style={styles.statValue}>{totalTime}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>EFFICIENCY</Text>
          <Text style={styles.statValue}>{efficiency}%</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STATUS</Text>
          <Text style={[styles.statValue, { color: accentColor }]}>
            {score >= 82 ? 'OPTIMAL' : score >= 70 ? 'NORMAL' : 'DEBT'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  ringWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 54,
    fontFamily: FONTS.extraBold,
    color: '#FAFAFA',
    letterSpacing: -2,
    lineHeight: 58,
  },
  scoreMax: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  rankText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#D4D4D8',
    letterSpacing: 1,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09090B',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    width: '92%',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: '#27272A',
  },
  statLabel: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
});
