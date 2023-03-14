import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import {
  colors,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  findRotationAngle,
  findScaledFontSize,
} from '../utilities';

const textHeight = Math.round(0.8 * 0.085 * DEVICE_HEIGHT);
const textWidth = Math.round(0.3875 * DEVICE_WIDTH);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 550);

const PlayerItem = ({
  command,
  enabled,
  teamName,
  shirtImage,
  playerName,
  playerIndex,
  extraStyles,
  activeOpacity,
}) => {
  const rotationAngle = findRotationAngle(playerIndex);
  const arrowImage = require('../assets/arrowUp.webp');

  return (
    <TouchableOpacity
      onPress={enabled ? command : null}
      activeOpacity={enabled ? activeOpacity : 1}
      style={{
        ...styles.mainView,
        ...extraStyles,
        backgroundColor: enabled ? colors.white : colors.alto,
      }}
    >
      <View style={styles.imageView}>
        <Image
          source={
            typeof shirtImage == 'string'
              ? { uri: shirtImage, headers: { Accept: '*/*' } }
              : shirtImage
          }
          style={styles.imageStyle}
        />
      </View>

      <View style={styles.arrowView}>
        <Image
          source={arrowImage}
          style={{ ...styles.arrowStyles, transform: [{ rotate: rotationAngle }] }}
        />
      </View>

      <Text
        allowFontScaling={false}
        style={{
          ...styles.textView,
          paddingLeft: '3%',
          fontSize: findScaledFontSize(playerName, maxTextLength, 11, 0.085),
        }}
      >
        {playerName}
      </Text>

      <Text
        allowFontScaling={false}
        style={{
          ...styles.textView,
          fontSize: findScaledFontSize(teamName, maxTextLength, 11, 0.085),
        }}
      >
        {teamName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: DEVICE_HEIGHT * 0.085,
    backgroundColor: colors.white,
  },
  arrowStyles: { width: '50%', height: '50%', resizeMode: 'contain' },
  imageView: { width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  arrowView: { width: '7.5%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  textView: {
    height: '100%',
    width: '38.75%',
    fontFamily: 'PoppinsBold',
    textAlignVertical: 'center',
  },
  imageStyle: { width: '100%', height: '75%', resizeMode: 'contain' },
});

export default memo(PlayerItem);
