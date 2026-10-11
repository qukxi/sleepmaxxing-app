import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FONTS } from '../constants/typography';

interface PresetSelectorProps {
  currentPresetId: string;
  onSelectPreset: (presetId: 'optimal' | 'moderate' | 'deprived') => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  onSelectPreset,
}) => {
  const presets: { id: 'optimal' | 'moderate' | 'deprived'; label: string; score: number }[] = [
    { id: 'optimal', label: 'OPTIMAL', score: 94 },
    { id: 'moderate', label: 'NORMAL', score: 76 },
    { id: 'deprived', label: 'ZOMBIE', score: 48 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        {presets.map((preset) => {
          const isActive = currentPresetId === preset.id;

          return (
            <TouchableOpacity
              key={preset.id}
              style={[styles.button, isActive && styles.buttonActive]}
              onPress={() => onSelectPreset(preset.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnLabel, isActive && styles.btnLabelActive]}>
                {preset.label}
              </Text>
              <Text style={[styles.btnScore, isActive && styles.btnScoreActive]}>
                {preset.score} PTS
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09090B',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  buttonActive: {
    borderColor: '#71717A',
    backgroundColor: '#18181B',
  },
  btnLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  btnLabelActive: {
    color: '#FAFAFA',
  },
  btnScore: {
    fontSize: 8,
    fontFamily: FONTS.medium,
    color: '#52525B',
  },
  btnScoreActive: {
    color: '#A1A1AA',
  },
});
