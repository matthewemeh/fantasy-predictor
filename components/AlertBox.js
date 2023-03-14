import React, { memo } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

import Button from '../components/Button';

import { DEVICE_HEIGHT, findFontSize, colors } from '../utilities';

const AlertBox = ({ title, message, buttons, visible, onRequestClose }) => (
  <Modal visible={visible} transparent={true} onRequestClose={onRequestClose}>
    <View style={styles.mainView} onTouchStart={onRequestClose}>
      <View style={styles.containerView} onTouchStart={e => e.stopPropagation()}>
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
              buttonTextColor={colors.stratos}
              extraTextStyles={{ fontSize: findFontSize(11) }}
              extraStyles={{ width: '19%', height: '80%', marginRight: '6%' }}
            />
          ))}
        </View>
      </View>
    </View>
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
  containerView: { width: '70%', elevation: 10, borderRadius: 7, backgroundColor: colors.white },
  titleView: {
    width: '100%',
    paddingLeft: '6%',
    color: colors.stratos,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(17),
    textAlignVertical: 'center',
    height: 0.06 * DEVICE_HEIGHT,
  },
  messageView: {
    width: '100%',
    paddingHorizontal: '6%',
    color: colors.stratos,
    textAlignVertical: 'top',
    fontSize: findFontSize(13),
    fontFamily: 'PoppinsRegular',
  },
  buttonsView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 0.06 * DEVICE_HEIGHT,
  },
});

export default memo(AlertBox);
