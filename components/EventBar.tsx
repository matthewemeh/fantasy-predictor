import { memo } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import {
  colors,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  activityImage,
  findScaledFontSize,
} from '../utilities';

const textHeight = Math.round(0.7 * 0.085 * 0.5 * DEVICE_HEIGHT);
const textWidth = Math.round(0.4 * 0.7 * DEVICE_WIDTH);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 160);

interface Props {
  event: {
    eventType: string;
    goalScorer: string;
    assistProvider: string;
    onTarget: string;
    saver: string;
  };
  extraStyles?: object;
  extraTextStyles?: object;
}

const EventBar: React.FC<Props> = ({ event, extraStyles, extraTextStyles }) => {
  const { eventType, goalScorer, assistProvider, onTarget, saver } = event;
  const { goalImage, assistImage, onTargetImage, saveImage } = activityImage;

  const buildEventBar = () => {
    if (eventType === 'goal' && goalScorer) {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.image} source={goalImage} />
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
              <Image style={styles.image} source={assistImage} />
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
              <Image style={styles.image} source={onTargetImage} />
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
              <Image style={styles.image} source={saveImage} />
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
  },
  activityView: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    width: '70%',
    height: '100%',
    paddingHorizontal: '5%',
    color: colors.stratos,
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  imageView: {
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
    height: '65%',
    resizeMode: 'contain',
  },
});

export default memo(EventBar);
