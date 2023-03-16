import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

import { findFontSize, colors } from '../utilities';

interface Props {
  onPress: () => void;
  extraStyles?: object;
}

const InfoCircle: React.FC<Props> = ({ onPress, extraStyles }) => (
  <View style={{ ...styles.infoIconStyle, ...extraStyles }}>
    <Icon
      name='info-circle'
      onPress={onPress}
      type='font-awesome'
      color={colors.springGreen}
      size={findFontSize(20)}
    />
  </View>
);

const styles = StyleSheet.create({
  infoIconStyle: { position: 'absolute', right: '3%', top: '4%', zIndex: 1 },
});

export default memo(InfoCircle);
