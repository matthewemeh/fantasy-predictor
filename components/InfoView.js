import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../constants';
import {
  deviceWidth,
  findFontSize,
  deviceHeight,
  findScaledFontSize,
  findAverageOfOpponentIndex,
} from '../utilities';

const textHeight = Math.round(0.92 * 0.95 * 0.7 * 0.2 * 0.66 * deviceHeight);
const textWidth = Math.round(0.95 * 0.3 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 470);

const InfoView = props => {
  const { infoName, StandardRatings, type } = props;
  const { teamIndex } = StandardRatings;

  const infoValue1 = props.infoValue1 || '';
  const infoValue2 = props.infoValue2 || '';
  const playerContent1 = props.playerContent1 || '';
  const playerContent2 = props.playerContent2 || '';

  const findColor = index => {
    const value1 =
      infoName === 'Better Fixture'
        ? findAverageOfOpponentIndex(infoValue1, teamIndex)
        : parseFloat(infoValue1);
    const value2 =
      infoName === 'Better Fixture'
        ? findAverageOfOpponentIndex(infoValue2, teamIndex)
        : parseFloat(infoValue2);

    if (value1 === value2) return colors.secondary;
    else if (index === 1) {
      if (value1 > value2) return type === 'forward' ? colors.emerald : colors.secondary;
      return type === 'forward' ? colors.secondary : colors.emerald;
    } else {
      if (value1 < value2) return type === 'forward' ? colors.emerald : colors.secondary;
      return type === 'forward' ? colors.secondary : colors.emerald;
    }
  };

  const findText = index => {
    if (infoName === 'Better Fixture') return index === 1 ? playerContent1 : playerContent2;
    else if (infoName === 'Chances of Starting') return `${index === 1 ? infoValue1 : infoValue2}%`;
    return index === 1 ? infoValue1 : infoValue2;
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.containerView}>
        <Text
          allowFontScaling={false}
          style={{
            ...styles.textStyle,
            color: findColor(1),
            fontSize: findScaledFontSize(findText(1), maxTextLength, 14, 0.085),
          }}
        >
          {findText(1)}
        </Text>

        <Text allowFontScaling={false} style={styles.infoNameStyle}>
          {infoName}
        </Text>

        <Text
          allowFontScaling={false}
          style={{
            ...styles.textStyle,
            color: findColor(2),
            fontSize: findScaledFontSize(findText(2), maxTextLength, 14, 0.085),
          }}
        >
          {findText(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: { width: '100%', height: 75, backgroundColor: colors.white },
  containerView: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '2%',
    justifyContent: 'center',
  },
  infoNameStyle: {
    width: '40%',
    height: '100%',
    textAlign: 'center',
    color: colors.secondary,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(12),
    textAlignVertical: 'center',
  },
  textStyle: {
    width: '30%',
    height: '100%',
    textAlign: 'center',
    color: colors.secondary,
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
});

export default memo(InfoView);
