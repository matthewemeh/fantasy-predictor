import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const InfoCircle = ({ onPress, extraStyles }) => (
  <View style={{ ...styles.infoIconStyle, ...extraStyles }}>
    <Icon
      name='info-circle'
      onPress={onPress}
      type='font-awesome'
      color={colors.primary}
      size={findFontSize(20)}
    />
  </View>
);

const styles = StyleSheet.create({
  infoIconStyle: { position: 'absolute', right: '3%', top: '4.5%', zIndex: 1 },
});

export default memo(InfoCircle);
