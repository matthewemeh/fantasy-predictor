import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../constants';
import { findAverageOfOpponentIndex, deviceWidth, findFontSize, deviceHeight } from '../utilities';

const textHeight = Math.round(0.92 * 0.95 * 0.7 * 0.2 * 0.66 * deviceHeight);
const textWidth = Math.round(0.95 * 0.3 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 470);

function InfoView(props) {
  let infoName = props.infoName;
  let infoValue1 = props.infoValue1 ? props.infoValue1 : '';
  let infoValue2 = props.infoValue2 ? props.infoValue2 : '';
  let playerContent1 = props.playerContent1 ? props.playerContent1 : '';
  let playerContent2 = props.playerContent2 ? props.playerContent2 : '';
  let StandardRatings = props.StandardRatings;

  function findColor(index) {
    let type = infoName === 'Better Fixture' ? 'reverse' : 'forward';
    let value1 =
      infoName === 'Better Fixture'
        ? findAverageOfOpponentIndex(infoValue1, StandardRatings)
        : parseFloat(infoValue1);
    let value2 =
      infoName === 'Better Fixture'
        ? findAverageOfOpponentIndex(infoValue2, StandardRatings)
        : parseFloat(infoValue2);
    switch (index) {
      case 1:
        if (value1 > value2) return type === 'forward' ? colors.emerald : colors.secondary;
        return type === 'forward' ? colors.secondary : colors.emerald;
      case 2:
        if (value1 < value2) return type === 'forward' ? colors.emerald : colors.secondary;
        return type === 'forward' ? colors.secondary : colors.emerald;
      default:
        return colors.secondary;
    }
  }

  function findText(index) {
    if (infoName === 'Better Fixture') return index === 1 ? playerContent1 : playerContent2;
    else if (infoName === 'Chances of Starting') return `${index === 1 ? infoValue1 : infoValue2}%`;
    return index === 1 ? infoValue1 : infoValue2;
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.containerView}>
        <Text
          allowFontScaling={false}
          style={{
            ...styles.textStyle,
            fontSize:
              findText(1).length >= maxTextLength
                ? findFontSize(13) / (0.085 * findText(1).length)
                : findFontSize(13),
            color: findColor(1),
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
            fontSize:
              findText(2).length >= maxTextLength
                ? findFontSize(13) / (0.085 * findText(2).length)
                : findFontSize(13),
            color: findColor(2),
          }}
        >
          {findText(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '100%', height: '20%', backgroundColor: colors.white },
  containerView: {
    flexDirection: 'row',
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
  },
  infoNameStyle: {
    width: '40%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(12),
    color: colors.secondary,
  },
  textStyle: {
    width: '30%',
    height: '100%',
    textAlign: 'center',
    fontFamily: 'PoppinsRegular',
    textAlignVertical: 'center',
    color: colors.secondary,
  },
});

export default React.memo(InfoView);
