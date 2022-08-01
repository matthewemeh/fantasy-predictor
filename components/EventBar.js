import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { deviceWidth, findFontSize, activity, deviceHeight } from '../utilities';
import { colors } from '../constants';

function EventBar({ event, extraStyles, extraTextStyles }) {
  const textHeight = Math.round(0.7 * 0.085 * 0.5 * deviceHeight);
  const textWidth = Math.round(0.4 * 0.7 * deviceWidth);
  const area = textHeight * textWidth;
  const maxTextLength = Math.floor(area / 160);

  function buildEventBar() {
    const eventType = event.eventType;
    const goalScorer = event.goalScorer;
    const assistProvider = event.assistProvider;
    const onTarget = event.onTarget;
    const saver = event.saver;

    if (eventType === 'goal' && goalScorer !== '') {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={activity.goal} />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize:
                  goalScorer && goalScorer.length >= maxTextLength
                    ? findFontSize(12) / (0.085 * goalScorer.length)
                    : findFontSize(12),
              }}
            >
              {goalScorer}
            </Text>
          </View>

          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={activity.assist} />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize:
                  assistProvider && assistProvider.length >= maxTextLength
                    ? findFontSize(12) / (0.085 * assistProvider.length)
                    : findFontSize(12),
              }}
            >
              {assistProvider}
            </Text>
          </View>
        </View>
      );
    } else if (eventType === 'onTarget' && onTarget !== '') {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={activity.onTarget} />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize:
                  onTarget && onTarget.length >= maxTextLength
                    ? findFontSize(12) / (0.085 * onTarget.length)
                    : findFontSize(12),
              }}
            >
              {onTarget}
            </Text>
          </View>
        </View>
      );
    } else if (saver !== '') {
      return (
        <View style={styles.mainView}>
          <View style={{ ...styles.activityView, ...extraStyles }}>
            <View style={styles.imageView}>
              <Image style={styles.imageStyle} source={activity.save} />
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.textStyle,
                ...extraTextStyles,
                fontSize:
                  saver && saver.length >= maxTextLength
                    ? findFontSize(12) / (0.085 * saver.length)
                    : findFontSize(12),
              }}
            >
              {saver}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }
  return buildEventBar();
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '50%',
    backgroundColor: colors.white,
  },
  textStyle: {
    width: '70%',
    height: '100%',
    paddingHorizontal: '5%',
    color: colors.secondary,
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(12),
    textAlign: 'left',
    textAlignVertical: 'center',
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

export default React.memo(EventBar);
