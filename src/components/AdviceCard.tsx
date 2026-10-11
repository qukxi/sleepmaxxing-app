import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../constants/typography';

interface AdviceCardProps {
  advice: string;
  rank: string;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ advice, rank }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>DAILY PROTOCOL ACTION</Text>
      <Text style={styles.adviceText}>{advice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  label: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: '#D4D4D8',
    lineHeight: 16,
  },
});
