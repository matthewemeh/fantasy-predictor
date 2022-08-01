import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants';
import { findFontSize, deviceHeight, deviceWidth } from '../utilities';

const textHeight = Math.round(0.92 * 0.7 * 0.9 * 0.25 * 0.165 * deviceHeight);
const textWidth = Math.round(0.185 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 90);

function PlayerView({
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
}) {
  return (
    <View style={{ ...styles.mainView, ...extraStyles }}>
      <View style={styles.captainBadgeView}>
        {captain && playerName !== '' && (
          <Text allowFontScaling={false} style={styles.captainBadgeTextStyle}>
            C
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.shirtView}
        activeOpacity={activeOpacity ? activeOpacity : 0.6}
        onPress={command}
        onLongPress={longCommand}
      >
        <Image
          style={{ ...styles.image, ...extraShirtStyles }}
          source={typeof imgVal == 'string' ? { uri: imgVal, headers: { Accept: '*/*' } } : imgVal}
        />
      </TouchableOpacity>
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={{ ...styles.nameView, fontSize: findFontSize(9), ...extraTextStyles1 }}
      >
        {playerName}
      </Text>
      <Text
        allowFontScaling={false}
        style={{
          ...styles.contentView,
          backgroundColor: available ? colors.contentViewColor : colors.red,
          fontSize:
            playerContent.length >= maxTextLength
              ? findFontSize(8) / (0.085 * playerContent.length)
              : findFontSize(8),
          ...extraTextStyles2,
        }}
      >
        {playerContent}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '18.5%', height: '100%', justifyContent: 'flex-start' },
  image: { width: '100%', height: '85%', resizeMode: 'contain' },
  shirtView: { width: '100%', height: '57%', alignItems: 'center', justifyContent: 'center' },
  nameView: {
    width: '100%',
    height: '16.5%',
    backgroundColor: colors.nameViewColor,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsBold',
    color: colors.white,
    marginVertical: '-1%',
  },
  contentView: {
    width: '100%',
    height: '16.5%',
    backgroundColor: colors.contentViewColor,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsBold',
    color: colors.white,
  },
  captainBadgeView: { width: '100%', height: '10%' },
  captainBadgeTextStyle: {
    position: 'relative',
    top: '330%',
    left: '60%',
    zIndex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: colors.black,
    width: deviceHeight * 0.023,
    height: deviceHeight * 0.023,
    borderRadius: deviceHeight * 0.0115,
    color: colors.white,
    fontSize: findFontSize(10),
    fontFamily: 'PoppinsBold',
  },
});

export default React.memo(PlayerView);
