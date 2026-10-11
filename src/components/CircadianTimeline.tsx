import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircadianMilestone } from '../types/sleep';
import { FONTS } from '../constants/typography';

interface CircadianTimelineProps {
  milestones: CircadianMilestone[];
}

export const CircadianTimeline: React.FC<CircadianTimelineProps> = ({ milestones }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>CIRCADIAN WINDOWS</Text>
        <Text style={styles.chronoTag}>CHRONOTYPE: EARLY LION</Text>
      </View>

      <View style={styles.timelineList}>
        {milestones.map((item, index) => {
          const isLast = index === milestones.length - 1;
          const isActive = item.status === 'active';
          const isPassed = item.status === 'passed';

          return (
            <View key={item.id} style={styles.itemRow}>
              {/* Indicator */}
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.node,
                    isActive && styles.nodeActive,
                    isPassed && styles.nodePassed,
                  ]}
                />
                {!isLast && <View style={styles.verticalLine} />}
              </View>

              {/* Box */}
              <View style={[styles.contentCard, isActive && styles.contentCardActive]}>
                <View style={styles.cardTop}>
                  <Text style={styles.itemTitle}>{item.label}</Text>
                  <Text style={[styles.statusTag, isActive && styles.statusTagActive]}>
                    {isActive ? 'NOW' : isPassed ? 'PASSED' : 'UPCOMING'}
                  </Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={styles.descText}>{item.instruction}</Text>
              </View>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: '#FAFAFA',
    letterSpacing: 1.5,
  },
  chronoTag: {
    fontSize: 8,
    fontFamily: FONTS.bold,
    color: '#71717A',
    letterSpacing: 0.8,
  },
  timelineList: {
    paddingLeft: 2,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 18,
    marginRight: 6,
  },
  node: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#27272A',
    marginTop: 5,
  },
  nodePassed: {
    backgroundColor: '#52525B',
  },
  nodeActive: {
    backgroundColor: '#22C55E',
  },
  verticalLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#1E1E22',
    marginTop: 3,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#09090B',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  contentCardActive: {
    borderColor: '#52525B',
    backgroundColor: '#111113',
  },
  cardTop: {
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
  statusTag: {
    fontSize: 7,
    fontFamily: FONTS.bold,
    color: '#52525B',
    letterSpacing: 0.5,
  },
  statusTagActive: {
    color: '#22C55E',
  },
  timeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#A1A1AA',
    marginBottom: 3,
  },
  descText: {
    fontSize: 9,
    fontFamily: FONTS.regular,
    color: '#71717A',
    lineHeight: 13,
  },
});
