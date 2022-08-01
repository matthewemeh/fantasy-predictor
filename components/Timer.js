import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { findFontSize } from '../utilities';
import { colors } from '../constants';

function Timer({ timeInSeconds }) {
  let minutes = parseInt(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  return (
    <Text allowFontScaling={false} style={styles.textStyle}>{`${
      minutes < 10 ? '0' : ''
    }${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`}</Text>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    width: '60%',
    height: '80%',
    backgroundColor: colors.white,
    borderRadius: 5,
    fontSize: findFontSize(35),
    fontFamily: 'PoppinsBold',
    color: colors.forward,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default React.memo(Timer);
