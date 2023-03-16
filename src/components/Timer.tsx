import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { findFontSize, colors } from '../utilities';

interface Props {
  timeInSeconds: number;
}

const Timer: React.FC<Props> = ({ timeInSeconds }) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds - minutes * 60;

  return (
    <View style={styles.timerView}>
      <Text allowFontScaling={false} style={styles.textStyle}>
        {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    width: '60%',
    height: '80%',
    borderRadius: 5,
    textAlign: 'center',
    color: colors.forward,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(35),
    textAlignVertical: 'center',
    backgroundColor: colors.white,
  },
  timerView: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forward,
  },
});

export default memo(Timer);
