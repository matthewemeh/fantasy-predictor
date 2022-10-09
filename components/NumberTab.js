import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import NumberDisplay from './NumberDisplay';

import { colors } from '../constants';

const NumberTab = ({ title1, title2, title3, number1, number2, number3 }) => (
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
    backgroundColor: colors.secondary,
  },
});

export default memo(NumberTab);
