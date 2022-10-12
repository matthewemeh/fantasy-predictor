import React, { memo, useRef, useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import { Icon } from 'react-native-elements';

import Button from '../components/Button';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const ConnectionErrorPage = ({ visible, command }) => {
  const viewRef = useRef();
  const initialRender = useRef(true);

  const animations = {
    slideIn: { from: { bottom: '-10%' }, to: { bottom: '0%' } },
    slideOut: { from: { bottom: '0%' }, to: { bottom: '-10%' } },
    glow: { from: { opacity: 0.3 }, to: { opacity: 1 } },
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (viewRef.current) {
      if (visible) viewRef.current.animate(animations.slideIn);
      else viewRef.current.animate(animations.slideOut);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true}>
      <AnimatableView duration={400} ref={viewRef} style={styles.errorBarView}>
        <View style={styles.network}>
          <AnimatableView
            duration={2000}
            direction='alternate'
            iterationCount='infinite'
            animation={animations.glow}
          >
            <Icon name='wifi' type='font-awesome' size={findFontSize(25)} color={colors.white} />
          </AnimatableView>

          <Text allowFontScaling={false} style={styles.text}>
            No Internet Connection
          </Text>
        </View>

        <Button
          enabled={true}
          command={command}
          buttonText='Retry'
          buttonColor={colors.primary}
          buttonTextColor={colors.secondary}
          extraStyles={{ width: '20%', height: '60%' }}
          extraTextStyles={{ fontSize: findFontSize(15), fontFamily: 'PoppinsRegular' }}
        />
      </AnimatableView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  errorBarView: {
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
  text: {
    marginTop: '3%',
    marginLeft: 10,
    color: colors.white,
    fontSize: findFontSize(11),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  network: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ConnectionErrorPage);
