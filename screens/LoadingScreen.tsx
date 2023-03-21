import { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { colors } from '../utilities';

import ConnectionErrorScreen from './ConnectionErrorScreen';

interface Props {
  connectionErrorState: boolean;
  command: () => void;
}

const LoadingScreen: React.FC<Props> = ({ connectionErrorState, command }) => (
  <View style={styles.mainView}>
    <Image source={require('../assets/loading.gif')} />
    <ConnectionErrorScreen visible={connectionErrorState} command={command} />
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
