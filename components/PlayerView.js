import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import { colors } from '../constants';
import { findFontSize, deviceHeight, deviceWidth, findScaledFontSize } from '../utilities';

const textHeight = Math.round(0.92 * 0.7 * 0.9 * 0.25 * 0.165 * deviceHeight);
const textWidth = Math.round(0.185 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 90);

const PlayerView = ({
  imgVal,
  captain,
  command,
  available,
  playerName,
  longCommand,
  extraStyles,
  playerContent,
  activeOpacity,
  extraTextStyles1,
  extraTextStyles2,
  extraShirtStyles,
}) => (
  <View style={{ ...styles.mainView, ...extraStyles }}>
    <View style={styles.captainBadgeView}>
      {captain && playerName && (
        <Text allowFontScaling={false} style={styles.captainBadgeText}>
          C
        </Text>
      )}
    </View>

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
        backgroundColor: available ? colors.contentViewColor : colors.red,
        fontSize: findScaledFontSize(playerContent, maxTextLength, 8, 0.085),
        ...extraTextStyles2,
      }}
    >
      {playerContent}
    </Text>
  </View>
);

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
  captainBadgeView: { width: '100%', height: '10%' },
  captainBadgeText: {
    zIndex: 1,
    top: '330%',
    left: '60%',
    textAlign: 'center',
    color: colors.white,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(10),
    width: deviceHeight * 0.023,
    height: deviceHeight * 0.023,
    backgroundColor: colors.black,
    borderRadius: deviceHeight * 0.0115,
  },
});

export default memo(PlayerView);
