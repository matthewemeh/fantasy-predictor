import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '../constants';
import NumberDisplay from './NumberDisplay';

function NumberTab({ title1, title2, title3, number1, number2, number3 }) {
  return (
    <View style={styles.mainView}>
      <NumberDisplay title={title1} number={number1} />
      <NumberDisplay title={title2} number={number2} />
      <NumberDisplay title={title3} number={number3} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    paddingHorizontal: '5%',
  },
});

export default React.memo(NumberTab);
