import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { findFontSize } from '../utilities';
import { colors } from '../constants';

function Button({
  enabled,
  command,
  buttonText,
  buttonColor,
  extraStyles,
  activeOpacity,
  extraTextStyles,
  buttonTextColor,
}) {
  return (
    <TouchableOpacity
      style={{ ...styles.mainView, ...extraStyles }}
      onPress={enabled ? command : null}
      activeOpacity={enabled ? (activeOpacity ? activeOpacity : 0.9) : 1}
    >
      <Text
        allowFontScaling={false}
        style={{
          ...styles.buttonTextStyle,
          fontFamily: 'PoppinsBold',
          backgroundColor: enabled ? buttonColor : colors.grey,
          color: enabled ? buttonTextColor : colors.white,
          ...extraTextStyles,
        }}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '45%', height: '75%' },
  buttonTextStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: findFontSize(27),
    color: colors.white,
  },
});

export default React.memo(Button);
