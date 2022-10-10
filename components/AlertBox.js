import React, { memo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import Button from '../components/Button';

import { colors } from '../constants';
import { deviceHeight, findFontSize } from '../utilities';

const AlertBox = ({ title, message, buttons, visible, onRequestClose }) => (
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
          {buttons.map(({ text, onPress }) => (
            <Button
              key={text}
              enabled={true}
              command={onPress}
              buttonText={text}
              activeOpacity={1}
              buttonColor={colors.white}
              buttonTextColor={colors.secondary}
              extraTextStyles={{ fontSize: findFontSize(11) }}
              extraStyles={{ width: '19%', height: '80%', marginRight: '6%' }}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
);

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
    paddingLeft: '6%',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    color: colors.secondary,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(17),
    textAlignVertical: 'center',
    height: 0.06 * deviceHeight,
    backgroundColor: colors.white,
  },
  messageView: {
    width: '100%',
    height: undefined,
    paddingHorizontal: '6%',
    color: colors.secondary,
    textAlignVertical: 'top',
    fontSize: findFontSize(13),
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.white,
  },
  buttonsView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 7,
    justifyContent: 'flex-end',
    borderBottomRightRadius: 7,
    height: 0.06 * deviceHeight,
    backgroundColor: colors.white,
  },
});

export default memo(AlertBox);
