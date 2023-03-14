import React, { memo, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text as AnimatableText } from 'react-native-animatable';

import { findFontSize, colors } from '../utilities';

const Button = ({
  enabled,
  command,
  buttonText,
  buttonColor,
  extraStyles,
  activeOpacity,
  extraTextStyles,
  buttonTextColor,
}) => {
  const buttonRef = useRef();
  const initialRender = useRef(true);

  const animations = {
    buttonDisabled: {
      from: { backgroundColor: buttonColor, color: buttonTextColor },
      to: { backgroundColor: colors.alto, color: colors.lemonGrassLight },
    },
    buttonEnabled: {
      from: { backgroundColor: colors.alto, color: colors.lemonGrassLight },
      to: { backgroundColor: buttonColor, color: buttonTextColor },
    },
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (enabled) buttonRef.current.animate(animations.buttonEnabled);
    else buttonRef.current.animate(animations.buttonDisabled);
  }, [enabled]);

  return (
    <TouchableOpacity
      onPress={enabled ? command : null}
      style={{ ...styles.mainView, ...extraStyles }}
      activeOpacity={enabled && activeOpacity ? activeOpacity : 1}
    >
      <AnimatableText
        duration={400}
        ref={buttonRef}
        allowFontScaling={false}
        style={{
          ...styles.buttonText,
          backgroundColor: enabled ? buttonColor : colors.alto,
          color: enabled ? buttonTextColor : colors.lemonGrassLight,
          ...extraTextStyles,
        }}
      >
        {buttonText}
      </AnimatableText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainView: { width: '45%', height: '75%' },
  buttonText: {
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
