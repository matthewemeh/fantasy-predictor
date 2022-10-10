import React, { memo, useRef, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';

import Button from '../components/Button';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const ConnectionErrorPage = ({ visible, command }) => {
  const viewRef = useRef();
  const initialRender = useRef(true);

  const animations = {
    slideIn: { from: { bottom: '-10%' }, to: { bottom: '0%' } },
    slideOut: { from: { bottom: '0%' }, to: { bottom: '-10%' } },
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (visible) viewRef.current.animate(animations.slideIn);
    else viewRef.current.animate(animations.slideOut);
  }, [visible]);

  return (
    <AnimatableView duration={400} ref={viewRef} style={styles.errorBarView}>
      <Text allowFontScaling={false} style={styles.textStyle}>
        No Internet Connection
      </Text>

      <Button
        enabled={true}
        command={command}
        buttonText='Retry'
        buttonColor={colors.primary}
        buttonTextColor={colors.secondary}
        extraStyles={{ width: '25%', height: '65%' }}
        extraTextStyles={{ fontSize: findFontSize(15), fontFamily: 'PoppinsRegular' }}
      />
    </AnimatableView>
  );
};

const styles = StyleSheet.create({
  mainView: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  errorBarView: {
    zIndex: 2,
    height: '8%',
    width: '100%',
    bottom: '-10%',
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
  },
  textStyle: {
    width: '75%',
    height: '100%',
    color: colors.white,
    fontSize: findFontSize(11),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
});

export default memo(ConnectionErrorPage);
