import React, { memo } from 'react';
import { View, Modal, StyleSheet, Image } from 'react-native';

import { colors } from '../constants';

const LoadingPage = () => (
  <Modal visible={true} transparent={true}>
    <View style={styles.mainView}>
      <Image source={require('../assets/loading.gif')} />
    </View>
  </Modal>
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
