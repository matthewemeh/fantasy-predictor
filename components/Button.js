import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const Button = ({
  enabled,
  command,
  buttonText,
  buttonColor,
  extraStyles,
  activeOpacity,
  extraTextStyles,
  buttonTextColor,
}) => (
  <TouchableOpacity
    onPress={enabled ? command : null}
    style={{ ...styles.mainView, ...extraStyles }}
    activeOpacity={enabled && activeOpacity ? activeOpacity : 1}
  >
    <Text
      allowFontScaling={false}
      style={{
        ...styles.buttonTextStyle,
        color: enabled ? buttonTextColor : '#94948da0',
        backgroundColor: enabled ? buttonColor : colors.grey,
        ...extraTextStyles,
      }}
    >
      {buttonText}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainView: { width: '45%', height: '75%' },
  buttonTextStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    textAlign: 'center',
    color: colors.white,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(27),
    textAlignVertical: 'center',
  },
});

export default memo(Button);
