import React, { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { colors } from '../constants';

import ConnectionErrorPage from './ConnectionErrorPage';

const LoadingPage = ({ connectionErrorState, command }) => (
  <View style={styles.mainView}>
    <Image source={require('../assets/loading.gif')} />
    <ConnectionErrorPage visible={connectionErrorState} command={command} />
  </View>
);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

export default memo(LoadingPage);
