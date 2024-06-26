import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { findFontSize, colors } from '../utilities';

interface Props {
  title: string;
  number: number;
}

const NumberDisplay: React.FC<Props> = ({ number, title }) => (
  <View style={styles.mainView}>
    <Text allowFontScaling={false} style={styles.numberTextStyle}>
      {number}
    </Text>
    <Text allowFontScaling={false} style={styles.titleTextStyle}>
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mainView: { height: '100%', width: '30%', alignItems: 'center', justifyContent: 'center' },
  titleTextStyle: {
    width: '100%',
    height: '40%',
    textAlign: 'center',
    color: colors.springGreen,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  numberTextStyle: {
    width: '100%',
    height: '60%',
    textAlign: 'center',
    color: colors.springGreen,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(25),
    textAlignVertical: 'center',
  },
});

export default memo(NumberDisplay);
