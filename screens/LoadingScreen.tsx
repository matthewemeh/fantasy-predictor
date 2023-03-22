import { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { colors } from '../utilities';

import ConnectionError from '../components/ConnectionError';

interface Props {
  fontLoaded: boolean;
  command: () => void;
  connectionErrorOccured: boolean;
}

const LoadingScreen: React.FC<Props> = ({ connectionErrorOccured, command, fontLoaded }) => (
  <View style={styles.mainView}>
    <Image source={require('../assets/loading.gif')} />
    <ConnectionError command={command} fontLoaded={fontLoaded} visible={connectionErrorOccured} />
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

export default memo(LoadingScreen);
