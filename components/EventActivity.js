import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import EventBar from './EventBar';

import { colors } from '../constants';
import { deviceHeight, findFontSize } from '../utilities';

const EventActivity = ({ event }) => {
  const {
    saver1,
    saver2,
    eventType,
    onTarget1,
    onTarget2,
    timeStamp,
    goalScorer1,
    goalScorer2,
    assistProvider1,
    assistProvider2,
  } = event || {};

  const teamEvent1 = {
    saver: saver1,
    onTarget: onTarget1,
    eventType: eventType,
    goalScorer: goalScorer1,
    assistProvider: assistProvider1,
  };

  const teamEvent2 = {
    saver: saver2,
    onTarget: onTarget2,
    eventType: eventType,
    goalScorer: goalScorer2,
    assistProvider: assistProvider2,
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.eventView}>
        <EventBar event={teamEvent1} extraStyles={{ flexDirection: 'row-reverse' }} />
      </View>

      <View style={styles.timeView}>
        <Text allowFontScaling={false} style={styles.timeText}>
          {Math.ceil(timeStamp / 60)}'
        </Text>
      </View>

      <View style={styles.eventView}>
        <EventBar event={teamEvent2} extraTextStyles={{ textAlign: 'right' }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: deviceHeight * 0.085,
    backgroundColor: colors.white,
  },
  eventView: { width: '40%', height: '100%' },
  timeView: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(15),
    width: deviceHeight * 0.075,
    textAlignVertical: 'center',
    height: deviceHeight * 0.075,
    backgroundColor: colors.forward,
    borderRadius: deviceHeight * 0.075,
  },
});

export default memo(EventActivity);
