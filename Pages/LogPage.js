import React from 'react';
import { View, StyleSheet, Modal, Text, FlatList } from 'react-native';
import { findFontSize } from '../utilities';
import { colors } from '../constants';
import logs from '../log.json';
import LogDisplay from '../components/LogDisplay';

function LogPage({ visible, onRequestClose }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={'slide'}
      onRequestClose={onRequestClose}
    >
      <View style={styles.containerView}>
        <View style={styles.mainView}>
          <Text allowFontScaling={false} style={styles.textView}>
            Logs
          </Text>
          <View style={styles.bodyView}>
            <FlatList
              data={logs.logs}
              keyExtractor={item => item.version}
              renderItem={({ item }) => <LogDisplay info={item.info} version={item.version} />}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.grey,
  },
  mainView: {
    width: '70%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    elevation: 8,
  },
  bodyView: { width: '100%', height: '87%', backgroundColor: colors.white },
  textView: {
    width: '100%',
    height: '13%',
    backgroundColor: colors.secondary,
    fontSize: findFontSize(20),
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsBold',
  },
});

export default React.memo(LogPage);
