import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONTS } from '../constants/typography';

export type TabType = 'dashboard' | 'matrix' | 'protocols' | 'circadian';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  streakDays: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, streakDays }) => {
  return (
    <View style={styles.container}>
      {/* Top Branding Row */}
      <View style={styles.topRow}>
        <View style={styles.brandBox}>
          <Text style={styles.logoText}>SLEEPMAXXING</Text>
          <Text style={styles.subLogoText}>BIOHACK PROTOCOL</Text>
        </View>

        <View style={styles.streakBadge}>
          <Text style={styles.streakNumber}>{streakDays}</Text>
          <Text style={styles.streakLabel}>DAY STREAK</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'dashboard' && styles.tabButtonActive]}
          onPress={() => onTabChange('dashboard')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>
            TODAY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'matrix' && styles.tabButtonActive]}
          onPress={() => onTabChange('matrix')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'matrix' && styles.tabTextActive]}>
            MATRIX
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'protocols' && styles.tabButtonActive]}
          onPress={() => onTabChange('protocols')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'protocols' && styles.tabTextActive]}>
            PROTOCOLS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'circadian' && styles.tabButtonActive]}
          onPress={() => onTabChange('circadian')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'circadian' && styles.tabTextActive]}>
            RHYTHM
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#000000',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandBox: {
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 15,
    fontFamily: FONTS.extraBold,
    color: '#FAFAFA',
    letterSpacing: 2,
  },
  subLogoText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 1.2,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#09090B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 4,
  },
  streakNumber: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
  streakLabel: {
    fontSize: 7,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#09090B',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#18181B',
  },
  tabText: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: '#FAFAFA',
    fontFamily: FONTS.bold,
  },
});
