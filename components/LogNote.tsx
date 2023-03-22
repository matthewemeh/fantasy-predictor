import { memo } from 'react';
import { View, StyleSheet, Modal, Text, FlatList } from 'react-native';

import LogDisplay from './LogDisplay';

import logs from '../log.json';
import { findFontSize, colors } from '../utilities';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
}

const LogNote: React.FC<Props> = ({ visible, onRequestClose }) => (
  <Modal visible={visible} transparent={true} animationType='slide' onRequestClose={onRequestClose}>
    <View style={styles.containerView} onTouchStart={onRequestClose}>
      <View style={styles.mainView} onTouchStart={e => e.stopPropagation()}>
        <Text allowFontScaling={false} style={styles.textView}>
          Logs
        </Text>

        <FlatList
          data={logs.logs}
          style={styles.bodyView}
          keyExtractor={({ version }) => version}
          renderItem={({ item }) => <LogDisplay info={item.info} version={item.version} />}
        />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  containerView: {
    width: '100%',
    height: '100%',
    color: colors.alto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    elevation: 8,
    width: '70%',
    height: '70%',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyView: { width: '100%', height: '87%', backgroundColor: colors.white },
  textView: {
    width: '100%',
    height: '13%',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(20),
    textAlignVertical: 'center',
    backgroundColor: colors.stratos,
  },
});

export default memo(LogNote);
