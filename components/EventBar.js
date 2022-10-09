import React, { memo } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import { colors } from '../constants';
import { deviceWidth, findScaledFontSize, activityImage, deviceHeight } from '../utilities';

const textHeight = Math.round(0.7 * 0.085 * 0.5 * deviceHeight);
const textWidth = Math.round(0.4 * 0.7 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 160);

const EventBar = ({ event, extraStyles, extraTextStyles }) => {
  const { eventType, goalScorer, assistProvider, onTarget, saver } = event;
  const { goalImage, assistImage, onTargetImage, saveImage } = activityImage;

  const buildEventBar = () => {
    if (eventType === 'goal' && goalScorer) {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={goalImage} />
            </View>

            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize: findScaledFontSize(goalScorer, maxTextLength, 12, 0.085),
              }}
            >
              {goalScorer}
            </Text>
          </View>

          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={assistImage} />
            </View>

            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize: findScaledFontSize(assistProvider, maxTextLength, 12, 0.085),
              }}
            >
              {assistProvider}
            </Text>
          </View>
        </View>
      );
    } else if (eventType === 'onTarget' && onTarget) {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={onTargetImage} />
            </View>

            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize: findScaledFontSize(onTarget, maxTextLength, 12, 0.085),
              }}
            >
              {onTarget}
            </Text>
          </View>
        </View>
      );
    } else if (saver) {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={saveImage} />
            </View>

            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize: findScaledFontSize(saver, maxTextLength, 12, 0.085),
              }}
            >
              {saver}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return buildEventBar();
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  activityView: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  textStyle: {
    width: '70%',
    height: '100%',
    textAlign: 'left',
    paddingHorizontal: '5%',
    color: colors.secondary,
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  imageView: {
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '50%',
    height: '65%',
    resizeMode: 'contain',
  },
});

export default memo(EventBar);
