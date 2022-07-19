import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { findFontSize } from '../utilities';
import { colors } from '../constants';

function Button(props) {
  let isEnabled = props.enabled;
  let activeOpacity = props.activeOpacity;
  return (
    <TouchableOpacity
      style={{ ...styles.mainView, ...props.extraStyles }}
      onPress={isEnabled ? props.command : null}
      activeOpacity={isEnabled ? (activeOpacity ? activeOpacity : 0.9) : 1}
    >
      <Text
        allowFontScaling={false}
        style={{
          ...styles.buttonTextStyle,
          fontFamily: 'PoppinsBold',
          backgroundColor: isEnabled ? props.buttonColor : colors.grey,
          color: isEnabled ? props.buttonTextColor : colors.white,
          ...props.extraTextStyles,
        }}
      >
        {props.buttonText}
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
