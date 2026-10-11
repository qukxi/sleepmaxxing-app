import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SleepSession } from '../types/sleep';
import { FONTS } from '../constants/typography';

interface MetricsGridProps {
  session: SleepSession;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ session }) => {
  const formatDebt = (debtMinutes: number) => {
    if (debtMinutes <= 0) return { text: '0M', label: 'RESOLVED', isGood: true };
    const h = Math.floor(debtMinutes / 60);
    const m = debtMinutes % 60;
    const text = h > 0 ? `+${h}H ${m}M` : `+${m}M`;
    return { text, label: 'DEBT', isGood: debtMinutes < 60 };
  };

  const debtInfo = formatDebt(session.sleepDebtMinutes);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>BIOMARKERS</Text>

      <View style={styles.grid}>
        {/* HRV */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>HRV (SDNN)</Text>
            <Text style={[styles.badge, session.hrvSDNN >= 65 ? styles.badgeGood : styles.badgeWarn]}>
              {session.hrvSDNN >= 65 ? 'HIGH' : 'LOW'}
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.valueNumber}>{session.hrvSDNN}</Text>
            <Text style={styles.valueUnit}>MS</Text>
          </View>
          <Text style={styles.cardDesc}>
            {session.hrvSDNN >= 65 ? 'Parasympathetic recovery optimal' : 'Autonomic nervous system strain'}
          </Text>
        </View>

        {/* RHR */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>RESTING HR</Text>
            <Text style={[styles.badge, session.restingHeartRate < 55 ? styles.badgeGood : styles.badgeWarn]}>
              {session.restingHeartRate < 55 ? 'GOOD' : 'HIGH'}
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.valueNumber}>{session.restingHeartRate}</Text>
            <Text style={styles.valueUnit}>BPM</Text>
          </View>
          <Text style={styles.cardDesc}>
            {session.restingHeartRate < 55 ? 'Cardiovascular strain minimized' : 'Elevated nocturnal metabolism'}
          </Text>
        </View>

        {/* Sleep Debt */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>SLEEP DEBT</Text>
            <Text style={[styles.badge, debtInfo.isGood ? styles.badgeGood : styles.badgeBad]}>
              {debtInfo.isGood ? 'OK' : 'DEBT'}
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={[styles.valueNumber, !debtInfo.isGood && styles.textWarn]}>
              {debtInfo.text}
            </Text>
          </View>
          <Text style={styles.cardDesc}>
            {debtInfo.isGood ? 'Sleep bank on baseline target' : 'Recovery bank hours needed'}
          </Text>
        </View>

        {/* Temp */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>WRIST TEMP</Text>
            <Text style={[styles.badge, session.wristTempDeviation <= 0 ? styles.badgeGood : styles.badgeWarn]}>
              {session.wristTempDeviation <= 0 ? 'COOL' : 'WARM'}
            </Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.valueNumber}>
              {session.wristTempDeviation > 0 ? `+${session.wristTempDeviation}` : session.wristTempDeviation}
            </Text>
            <Text style={styles.valueUnit}>°C</Text>
          </View>
          <Text style={styles.cardDesc}>
            {session.wristTempDeviation <= 0 ? 'Core body cooling achieved' : 'Metabolic thermogenesis elevated'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#F4F4F5',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  badge: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeGood: {
    backgroundColor: '#14532D',
    color: '#4ADE80',
  },
  badgeWarn: {
    backgroundColor: '#451A03',
    color: '#F59E0B',
  },
  badgeBad: {
    backgroundColor: '#450A0A',
    color: '#EF4444',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  valueNumber: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: '#FAFAFA',
  },
  textWarn: {
    color: '#EF4444',
  },
  valueUnit: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#71717A',
    marginLeft: 3,
  },
  cardDesc: {
    fontSize: 9,
    fontFamily: FONTS.regular,
    color: '#71717A',
    lineHeight: 12,
  },
});
