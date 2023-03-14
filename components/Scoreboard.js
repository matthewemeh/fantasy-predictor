import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { findFontSize, colors } from '../utilities';

const Scoreboard = ({ score1, score2, shortTeamName1, shortTeamName2 }) => (
  <View style={styles.scoreBoardView}>
    <Text allowFontScaling={false} style={styles.teamTextStyle}>
      {shortTeamName1.toUpperCase()}
    </Text>

    <View style={styles.mainView}>
      <Text allowFontScaling={false} style={styles.textStyle}>
        {score1}
      </Text>

      <View style={styles.separatorView} />

      <Text allowFontScaling={false} style={styles.textStyle}>
        {score2}
      </Text>
    </View>

    <Text allowFontScaling={false} style={styles.teamTextStyle}>
      {shortTeamName2.toUpperCase()}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mainView: {
    height: '80%',
    width: '49.5%',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forward,
  },
  separatorView: { height: '60%', width: '1%', backgroundColor: colors.white },
  textStyle: {
    width: '49.5%',
    height: '100%',
    textAlign: 'center',
    color: colors.white,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(33),
    textAlignVertical: 'center',
  },
  scoreBoardView: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-evenly',
  },
  teamTextStyle: {
    width: '25%',
    height: '100%',
    textAlign: 'center',
    color: colors.forward,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(19),
    textAlignVertical: 'center',
  },
});

export default memo(Scoreboard);
