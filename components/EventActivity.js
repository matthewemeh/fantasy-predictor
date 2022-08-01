import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../constants';
import { deviceHeight, findFontSize } from '../utilities';
import EventBar from './EventBar';

function EventActivity({ event }) {
  let teamEvent1 = {
    eventType: event.eventType,
    goalScorer: event.goalScorer1,
    assistProvider: event.assistProvider1,
    onTarget: event.onTarget1,
    saver: event.saver1,
  };
  let teamEvent2 = {
    eventType: event.eventType,
    goalScorer: event.goalScorer2,
    assistProvider: event.assistProvider2,
    onTarget: event.onTarget2,
    saver: event.saver2,
  };
  return (
    <View style={styles.mainView}>
      <View style={styles.teamViewStyle}>
        <EventBar event={teamEvent1} extraStyles={{ flexDirection: 'row-reverse' }} />
      </View>
      <View style={styles.timeView}>
        <Text allowFontScaling={false} style={styles.timeTextStyle}>{`${Math.ceil(
          event.timeStamp / 60
        )}'`}</Text>
      </View>
      <View style={styles.teamViewStyle}>
        <EventBar event={teamEvent2} extraTextStyles={{ textAlign: 'right' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    width: '100%',
    height: deviceHeight * 0.085,
    backgroundColor: colors.white,
    alignItems: 'center',
    marginBottom: '1%',
  },
  teamViewStyle: { width: '40%', height: '100%' },
  timeView: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTextStyle: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: colors.forward,
    fontFamily: 'PoppinsBold',
    borderRadius: deviceHeight * 0.075,
    width: deviceHeight * 0.075,
    height: deviceHeight * 0.075,
    color: colors.white,
    fontSize: findFontSize(15),
  },
});

export default React.memo(EventActivity);
