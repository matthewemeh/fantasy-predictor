import { Icon } from 'react-native-elements';
import { memo, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';

import Button from './Button';

import { findFontSize, colors } from '../utilities';

interface Props {
  visible: boolean;
  fontLoaded: boolean;
  command: () => void;
}

const ConnectionError: React.FC<Props> = ({ visible, command, fontLoaded }) => {
  const initialRender = useRef(true);

  const animations = {
    none: { from: {}, to: {} },
    glow: { from: { opacity: 0.3 }, to: { opacity: 1 } },
    slideIn: { from: { bottom: '-10%' }, to: { bottom: '0%' } },
    slideOut: { from: { bottom: '-10%' }, to: { bottom: '-10%' } },
  };

  useEffect(() => {
    if (initialRender.current) initialRender.current = false;
  }, []);

  return fontLoaded ? (
    <AnimatableView
      duration={400}
      easing='ease-in-out'
      style={styles.errorBarView}
      animation={visible ? animations.slideIn : animations.slideOut}
    >
      <View style={styles.network}>
        <AnimatableView
          duration={2000}
          direction='alternate'
          iterationCount='infinite'
          animation={visible ? animations.glow : animations.none}
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
        buttonColor={colors.springGreen}
        buttonTextColor={colors.stratos}
        extraStyles={{ width: '20%', height: '60%' }}
        extraTextStyles={{ fontSize: findFontSize(15), fontFamily: 'PoppinsRegular' }}
      />
    </AnimatableView>
  ) : null;
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
    backgroundColor: colors.stratos,
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

export default memo(ConnectionError);
