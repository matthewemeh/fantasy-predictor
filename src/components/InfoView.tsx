import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import {
  colors,
  findFontSize,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  findScaledFontSize,
} from '../utilities';

const textHeight = Math.round(0.92 * 0.95 * 0.7 * 0.2 * 0.66 * DEVICE_HEIGHT);
const textWidth = Math.round(0.95 * 0.3 * DEVICE_WIDTH);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 470);

interface Props {
  type: string;
  infoName: string;
  infoText1?: string;
  infoText2?: string;
  infoValue1: number;
  infoValue2: number;
}

const InfoView: React.FC<Props> = ({
  type,
  infoName,
  infoText1,
  infoText2,
  infoValue1,
  infoValue2,
}) => {
  const findColor = (index: number) => {
    if (infoValue1 === infoValue2) return colors.stratos;
    else if (index === 1) {
      if (infoValue1 > infoValue2) return type === 'forward' ? colors.emerald : colors.stratos;
      return type === 'forward' ? colors.stratos : colors.emerald;
    } else {
      if (infoValue1 < infoValue2) return type === 'forward' ? colors.emerald : colors.stratos;
      return type === 'forward' ? colors.stratos : colors.emerald;
    }
  };

  const findText = (index: number) => {
    if (infoText1 && infoText2) return index === 1 ? infoText1 : infoText2;
    else if (infoName === 'Chances of Starting') return `${index === 1 ? infoValue1 : infoValue2}%`;
    return (index === 1 ? infoValue1 : infoValue2).toString();
  };

  return (
    <View style={styles.containerView}>
      <Text
        allowFontScaling={false}
        style={{
          ...styles.text,
          color: findColor(1),
          fontSize: findScaledFontSize(findText(1), maxTextLength, 14, 0.085),
        }}
      >
        {findText(1)}
      </Text>

      <Text allowFontScaling={false} style={styles.infoNameText}>
        {infoName}
      </Text>

      <Text
        allowFontScaling={false}
        style={{
          ...styles.text,
          color: findColor(2),
          fontSize: findScaledFontSize(findText(2), maxTextLength, 14, 0.085),
        }}
      >
        {findText(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {
    height: 75,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoNameText: {
    width: '40%',
    height: '100%',
    textAlign: 'center',
    color: colors.stratos,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(12),
    textAlignVertical: 'center',
  },
  text: {
    width: '30%',
    height: '100%',
    textAlign: 'center',
    color: colors.stratos,
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
});

export default memo(InfoView);
