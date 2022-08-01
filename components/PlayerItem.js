import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants';
import { findArrow, deviceHeight, deviceWidth, findFontSize } from '../utilities';

const textHeight = Math.round(0.8 * 0.085 * deviceHeight);
const textWidth = Math.round(0.3875 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 550);

function PlayerItem({
  team,
  command,
  enabled,
  shirtImage,
  playerName,
  playerIndex,
  extraStyles,
  activeOpacity,
}) {
  return (
    <TouchableOpacity
      style={{
        ...styles.mainView,
        ...extraStyles,
        backgroundColor: enabled ? colors.white : colors.grey,
      }}
      activeOpacity={enabled ? activeOpacity : 1}
      onPress={enabled ? command : null}
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
        <Image source={findArrow(playerIndex)} style={styles.arrowStyles} />
      </View>
      <Text
        allowFontScaling={false}
        style={{
          ...styles.textView,
          paddingLeft: '3%',
          fontSize:
            playerName.length >= maxTextLength
              ? findFontSize(11) / (0.085 * playerName.length)
              : findFontSize(11),
        }}
        onPress={enabled ? command : null}
      >
        {playerName}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          ...styles.textView,
          fontSize:
            team.length >= maxTextLength
              ? findFontSize(11) / (0.085 * team.length)
              : findFontSize(11),
        }}
        onPress={enabled ? command : null}
      >
        {team}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    width: '100%',
    height: deviceHeight * 0.085,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  arrowStyles: { width: '50%', height: '50%', resizeMode: 'contain' },
  imageView: { width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  arrowView: { width: '7.5%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  textView: {
    width: '38.75%',
    height: '100%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(11.5),
  },
  imageStyle: { width: '100%', height: '75%', resizeMode: 'contain' },
});

export default React.memo(PlayerItem);
