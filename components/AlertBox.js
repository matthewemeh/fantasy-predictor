import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import { deviceHeight, findFontSize } from '../utilities';
import { colors } from '../constants';
import Button from '../components/Button';

function AlertBox({ title, message, buttons, visible, onRequestClose }) {
  return (
    <Modal visible={visible} transparent={true} onRequestClose={onRequestClose}>
      <TouchableOpacity style={styles.mainView} onPress={onRequestClose} activeOpacity={1}>
        <View style={styles.containerView}>
          <Text allowFontScaling={false} style={styles.titleView}>
            {title}
          </Text>
          <Text allowFontScaling={false} style={styles.messageView}>
            {message}
          </Text>
          <View style={styles.buttonsView}>
            {buttons.map(button => (
              <Button
                enabled={true}
                key={button[0]}
                activeOpacity={0.6}
                command={button[1]}
                buttonColor={colors.white}
                buttonTextColor={colors.secondary}
                buttonText={button[0]}
                extraStyles={{ width: '19%', height: '80%', marginRight: '6%' }}
                extraTextStyles={{ fontSize: findFontSize(11) }}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.alertBackground,
  },
  containerView: { width: '70%', height: undefined, elevation: 10 },
  titleView: {
    width: '100%',
    height: 0.06 * deviceHeight,
    textAlign: 'left',
    textAlignVertical: 'center',
    paddingLeft: '6%',
    color: colors.secondary,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(17),
    backgroundColor: colors.white,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
  },
  messageView: {
    width: '100%',
    height: undefined,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: colors.secondary,
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(13),
    backgroundColor: colors.white,
    paddingHorizontal: '6%',
  },
  buttonsView: {
    width: '100%',
    height: 0.06 * deviceHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
  },
});

export default React.memo(AlertBox);
