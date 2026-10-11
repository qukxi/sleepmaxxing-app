import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  useFonts,
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
  JetBrainsMono_800ExtraBold,
} from '@expo-google-fonts/jetbrains-mono';
import { Header, TabType } from './src/components/Header';
import { ScoreRing } from './src/components/ScoreRing';
import { SleepMatrixGrid } from './src/components/SleepMatrixGrid';
import { HypnogramChart } from './src/components/HypnogramChart';
import { MetricsGrid } from './src/components/MetricsGrid';
import { AdviceCard } from './src/components/AdviceCard';
import { CircadianTimeline } from './src/components/CircadianTimeline';
import { ProtocolTracker } from './src/components/ProtocolTracker';
import { PresetSelector } from './src/components/PresetSelector';
import {
  optimalSession,
  moderateSession,
  deprivedSession,
  historyDays,
  initialProtocols,
  circadianMilestones,
} from './src/services/mockData';
import { healthKitService } from './src/services/healthKitService';
import { SleepSession, BiohackProtocolItem, DaySleepRecord } from './src/types/sleep';
import { FONTS } from './src/constants/typography';

export default function App() {
  const [fontsLoaded] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
    JetBrainsMono_800ExtraBold,
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentPresetId, setCurrentPresetId] = useState<'optimal' | 'moderate' | 'deprived'>('optimal');
  const [session, setSession] = useState<SleepSession>(optimalSession);
  const [protocols, setProtocols] = useState<BiohackProtocolItem[]>(initialProtocols);
  const [streakDays, setStreakDays] = useState(14);
  const [selectedDay, setSelectedDay] = useState<DaySleepRecord | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSource, setSyncSource] = useState<'apple_health' | 'simulator_fallback'>('simulator_fallback');
  const [syncMessage, setSyncMessage] = useState<string>('APPLE HEALTHKIT • CONNECTING...');
  const [matrixDays, setMatrixDays] = useState<DaySleepRecord[]>(historyDays);

  const handleSelectPreset = (presetId: 'optimal' | 'moderate' | 'deprived') => {
    setCurrentPresetId(presetId);
    if (presetId === 'optimal') {
      setSession(optimalSession);
    } else if (presetId === 'moderate') {
      setSession(moderateSession);
    } else {
      setSession(deprivedSession);
    }
  };

  const handleToggleProtocol = (id: string) => {
    setProtocols((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSyncHealthKit = async () => {
    setIsSyncing(true);
    setSyncMessage('REQUESTING HEALTH PERMISSIONS...');
    await healthKitService.requestPermissions();

    setSyncMessage('SYNCING APPLE HEALTH DATA...');
    const result = await healthKitService.syncSleepData();
    setSession(result.session);
    setSyncSource(result.source);

    if (result.source === 'apple_health') {
      setSyncMessage(result.message || 'APPLE HEALTHKIT • LIVE SYNCED');
      const hist = await healthKitService.syncHistoricalDays();
      if (hist && hist.length > 0) {
        setMatrixDays(hist);
      }
    } else {
      const err = healthKitService.getStatus().errorMessage;
      setSyncMessage(err ? `HEALTH • ${err.toUpperCase()}` : 'APPLE HEALTHKIT • TAP TO SYNC');
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    handleSyncHealthKit();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={[styles.safeArea, styles.loadingCenter]}>
        <ActivityIndicator color="#22C55E" size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Top Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} streakDays={streakDays} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'dashboard' && (
          <View>
            {/* Apple HealthKit Sync Status Pill */}
            <TouchableOpacity
              style={[
                styles.healthSyncBar,
                syncSource === 'apple_health' && styles.healthSyncBarActive,
              ]}
              onPress={handleSyncHealthKit}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.syncDot,
                  isSyncing
                    ? styles.syncDotSyncing
                    : syncSource === 'apple_health'
                    ? styles.syncDotActive
                    : styles.syncDotSim,
                ]}
              />
              <Text
                style={[
                  styles.syncText,
                  syncSource === 'apple_health' && styles.syncTextActive,
                ]}
                numberOfLines={1}
              >
                {isSyncing ? 'SYNCING APPLE HEALTH...' : syncMessage}
              </Text>
            </TouchableOpacity>

            {/* Minimal Simulator Selector */}
            <PresetSelector
              currentPresetId={currentPresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Strict Monolithic Score Display */}
            <ScoreRing
              score={session.sleepScore}
              rank={session.recoveryRank}
              emoji={session.rankEmoji}
              totalTime={`${Math.floor(session.totalMinutesAsleep / 60)}h ${session.totalMinutesAsleep % 60}m`}
              efficiency={session.sleepEfficiency}
            />

            {/* Sleep Matrix: Day Small Squares Heatmap */}
            <SleepMatrixGrid
              days={matrixDays}
              onSelectDay={(day) => setSelectedDay(day)}
            />

            {/* Apple Watch Minimalist Hypnogram */}
            <HypnogramChart session={session} />

            {/* Biomarkers Grid */}
            <MetricsGrid session={session} />

            {/* Protocol Day Advice */}
            <AdviceCard advice={session.recoveryAdvice} rank={session.recoveryRank} />
          </View>
        )}

        {activeTab === 'matrix' && (
          <View>
            <SleepMatrixGrid
              days={matrixDays}
              onSelectDay={(day) => setSelectedDay(day)}
            />
            <View style={styles.matrixInsightsCard}>
              <Text style={styles.matrixInsightTitle}>MATRIX ANALYTICS</Text>
              <Text style={styles.matrixInsightText}>
                • Over 70 days, your average sleep score is <Text style={styles.highlight}>86 PTS</Text> (Bio-Optimized).
              </Text>
              <Text style={styles.matrixInsightText}>
                • Sleep God nights (92+): <Text style={styles.highlight}>38 of 70 days (54%)</Text>.
              </Text>
              <Text style={styles.matrixInsightText}>
                • Sleep consistency increased Deep Sleep duration by 28%.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'protocols' && (
          <View>
            <ProtocolTracker protocols={protocols} onToggle={handleToggleProtocol} />
          </View>
        )}

        {activeTab === 'circadian' && (
          <View>
            <CircadianTimeline milestones={circadianMilestones} />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SLEEPMAXXING • HEALTHKIT READY • STRICT BLACK</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  healthSyncBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#09090B',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 6,
  },
  healthSyncBarActive: {
    borderColor: '#15803D',
    backgroundColor: '#052E1620',
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  syncDotActive: {
    backgroundColor: '#22C55E',
  },
  syncDotSyncing: {
    backgroundColor: '#EAB308',
  },
  syncDotSim: {
    backgroundColor: '#38BDF8',
  },
  syncText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  syncTextActive: {
    color: '#4ADE80',
  },
  matrixInsightsCard: {
    backgroundColor: '#09090B',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  matrixInsightTitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#F4F4F5',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  matrixInsightText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#A1A1AA',
    lineHeight: 16,
    marginBottom: 4,
  },
  highlight: {
    color: '#FAFAFA',
    fontFamily: FONTS.bold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 18,
    marginTop: 10,
  },
  footerText: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#27272A',
    letterSpacing: 1.5,
  },
});
