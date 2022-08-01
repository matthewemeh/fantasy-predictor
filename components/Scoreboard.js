import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { findFontSize } from '../utilities';
import { colors } from '../constants';

function Scoreboard({ score1, score2 }) {
  return (
    <View style={styles.mainView}>
      <Text allowFontScaling={false} style={styles.textStyle}>
        {score1 ? score1 : '0'}
      </Text>
      <View style={styles.separatorView} />
      <Text allowFontScaling={false} style={styles.textStyle}>
        {score2 ? score2 : '0'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    width: '49.5%',
    height: '80%',
    borderRadius: 5,
    backgroundColor: colors.forward,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorView: { height: '60%', width: '1%', backgroundColor: colors.white },
  textStyle: {
    width: '49.5%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.forward,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(33),
    color: colors.white,
  },
});

export default React.memo(Scoreboard);
