import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import { colors } from '../constants';
import { findRotationAngle, deviceWidth, deviceHeight, findScaledFontSize } from '../utilities';

const textHeight = Math.round(0.8 * 0.085 * deviceHeight);
const textWidth = Math.round(0.3875 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 550);

const PlayerItem = ({
  team,
  command,
  enabled,
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
        backgroundColor: enabled ? colors.white : colors.grey,
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
          fontSize: findScaledFontSize(team, maxTextLength, 11, 0.085),
        }}
      >
        {team}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: deviceHeight * 0.085,
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
