import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { findFontSize } from '../utilities';
import { colors } from '../constants';

function NumberDisplay(props) {
  return (
    <View style={styles.mainView}>
      <Text allowFontScaling={false} style={styles.numberTextStyle}>
        {props.number}
      </Text>
      <Text allowFontScaling={false} style={styles.titleTextStyle}>
        {props.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { height: '100%', width: '30%', alignItems: 'center', justifyContent: 'center' },
  titleTextStyle: {
    width: '100%',
    height: '40%',
    fontSize: findFontSize(13),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    color: colors.primary,
  },
  numberTextStyle: {
    width: '100%',
    height: '60%',
    fontSize: findFontSize(25),
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.primary,
  },
});

export default React.memo(NumberDisplay);
