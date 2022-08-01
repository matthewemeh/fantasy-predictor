import React from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { findFontSize } from '../utilities';
import { colors } from '../constants';
import Button from '../components/Button';

function ConnectionErrorPage({ visible, command }) {
  return (
    <Modal visible={visible} transparent={true} animationType={'slide'}>
      <View style={styles.mainView}>
        <View style={styles.errorBarView}>
          <Text allowFontScaling={false} style={styles.textStyle}>
            No Internet Connection
          </Text>
          <Button
            enabled={true}
            command={command}
            buttonColor={colors.primary}
            buttonTextColor={colors.secondary}
            buttonText={'Retry'}
            extraStyles={{ width: '25%', height: '65%' }}
            extraTextStyles={{ fontSize: findFontSize(15), fontFamily: 'PoppinsRegular' }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  errorBarView: {
    flexDirection: 'row',
    width: '100%',
    height: '8%',
    paddingHorizontal: '3%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
  },
  textStyle: {
    width: '75%',
    height: '100%',
    fontSize: findFontSize(11),
    textAlign: 'left',
    textAlignVertical: 'center',
    color: colors.white,
    fontFamily: 'PoppinsRegular',
  },
});

export default React.memo(ConnectionErrorPage);
