import { memo } from 'react';
import { Text as AnimatableText } from 'react-native-animatable';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import {
  colors,
  findFontSize,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  findScaledFontSize,
  findPlayingChanceColor,
} from '../utilities';

const textHeight = Math.round(0.92 * 0.7 * 0.9 * 0.25 * 0.165 * DEVICE_HEIGHT);
const textWidth = Math.round(0.185 * DEVICE_WIDTH);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 90);

interface Props {
  imgVal: any;
  playerName: string;
  command: () => void;
  isCaptain?: boolean;
  extraStyles?: object;
  playerContent: string;
  activeOpacity?: number;
  longCommand?: () => void;
  extraTextStyles1?: object;
  extraTextStyles2?: object;
  extraShirtStyles?: object;
  chanceOfPlayingNextRound: number;
}

const PlayerView: React.FC<Props> = ({
  imgVal,
  command,
  isCaptain,
  playerName,
  longCommand,
  extraStyles,
  playerContent,
  activeOpacity,
  extraTextStyles1,
  extraTextStyles2,
  extraShirtStyles,
  chanceOfPlayingNextRound,
}) => {
  const animations = {
    captain: { from: { opacity: 0 }, to: { opacity: 1 } },
    unCaptain: { from: { opacity: 0 }, to: { opacity: 0 } },
  };

  return (
    <View style={{ ...styles.mainView, ...extraStyles }}>
      <AnimatableText
        duration={400}
        allowFontScaling={false}
        style={styles.captainBadgeText}
        animation={isCaptain && playerName ? animations.captain : animations.unCaptain}
      >
        C
      </AnimatableText>

      <TouchableOpacity
        onPress={command}
        style={styles.shirtView}
        onLongPress={longCommand}
        activeOpacity={activeOpacity || 0.6}
      >
        <Image
          style={{ ...styles.image, ...extraShirtStyles }}
          source={typeof imgVal == 'string' ? { uri: imgVal, headers: { Accept: '*/*' } } : imgVal}
        />
      </TouchableOpacity>

      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{ ...styles.nameView, ...extraTextStyles1 }}
      >
        {playerName}
      </Text>

      <Text
        allowFontScaling={false}
        style={{
          ...styles.contentView,
          backgroundColor: findPlayingChanceColor(chanceOfPlayingNextRound),
          fontSize: findScaledFontSize(playerContent, maxTextLength, 8, 0.085),
          color: [50, 75].includes(chanceOfPlayingNextRound) ? colors.black : colors.white,
          ...extraTextStyles2,
        }}
      >
        {playerContent}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { width: '18.5%', height: '100%', justifyContent: 'flex-start' },
  image: { width: '100%', height: '85%', resizeMode: 'contain' },
  shirtView: { width: '100%', height: '57%', alignItems: 'center', justifyContent: 'center' },
  nameView: {
    width: '100%',
    height: '16.5%',
    textAlign: 'center',
    color: colors.white,
    marginVertical: '-1%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    fontSize: findFontSize(9),
    fontFamily: 'PoppinsBold',
    textAlignVertical: 'center',
    backgroundColor: colors.nameViewColor,
  },
  contentView: {
    width: '100%',
    height: '16.5%',
    textAlign: 'center',
    color: colors.white,
    fontFamily: 'PoppinsBold',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    textAlignVertical: 'center',
    backgroundColor: colors.contentViewColor,
  },
  captainBadgeText: {
    zIndex: 1,
    opacity: 0,
    top: '40%',
    left: '60%',
    textAlign: 'center',
    color: colors.white,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(10),
    width: DEVICE_HEIGHT * 0.023,
    height: DEVICE_HEIGHT * 0.023,
    backgroundColor: colors.black,
    borderRadius: DEVICE_HEIGHT * 0.0115,
  },
});

export default memo(PlayerView);
