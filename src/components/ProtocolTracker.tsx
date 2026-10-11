import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BiohackProtocolItem } from '../types/sleep';
import { FONTS } from '../constants/typography';

interface ProtocolTrackerProps {
  protocols: BiohackProtocolItem[];
  onToggle: (id: string) => void;
}

export const ProtocolTracker: React.FC<ProtocolTrackerProps> = ({ protocols, onToggle }) => {
  const completedCount = protocols.filter((p) => p.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>EVENING PROTOCOL</Text>
          <Text style={styles.subtitle}>PRE-SLEEP BIOHACKING OPTIMIZATION</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {completedCount} / {protocols.length}
          </Text>
        </View>
      </View>

      {/* List */}
      <View style={styles.list}>
        {protocols.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.itemCard, item.completed && styles.itemCardCompleted]}
            onPress={() => onToggle(item.id)}
            activeOpacity={0.7}
          >
            {/* Minimal Square Checkbox */}
            <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
              {item.completed && <Text style={styles.checkMark}>✓</Text>}
            </View>

            {/* Text content */}
            <View style={styles.itemContent}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.timingText}>{item.timing}</Text>
              </View>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#09090B',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 8,
    fontFamily: FONTS.medium,
    color: '#71717A',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  progressBadge: {
    backgroundColor: '#18181B',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  progressText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
  list: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E1E22',
  },
  itemCardCompleted: {
    borderColor: '#27272A',
    opacity: 0.85,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#52525B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkMark: {
    color: '#000000',
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  itemContent: {
    flex: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
  },
  timingText: {
    fontSize: 8,
    fontFamily: FONTS.medium,
    color: '#71717A',
  },
  itemDesc: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: '#71717A',
    lineHeight: 14,
  },
});
