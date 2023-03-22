import { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import NumberDisplay from './NumberDisplay';

import { colors } from '../utilities';

interface Props {
  title1: string;
  title2: string;
  title3: string;
  number1: number;
  number2: number;
  number3: number;
}

const NumberTab: React.FC<Props> = ({ title1, title2, title3, number1, number2, number3 }) => (
  <View style={styles.mainView}>
    <NumberDisplay title={title1} number={number1} />
    <NumberDisplay title={title2} number={number2} />
    <NumberDisplay title={title3} number={number3} />
  </View>
);

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    backgroundColor: colors.stratos,
  },
});

export default memo(NumberTab);
