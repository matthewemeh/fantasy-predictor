import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import { View, StyleSheet, Text, ToastAndroid, Clipboard } from 'react-native';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const CryptoBar = ({ address, name }) => {
  const onPress = () => {
    Clipboard.setString(address);
    ToastAndroid.show(`${name} address copied`, 2000);
  };

  return (
    <View style={styles.mainView}>
      <Text allowFontScaling={false} style={styles.nameText} numberOfLines={1}>
        {name}
      </Text>

      <Text allowFontScaling={false} style={styles.addressText} numberOfLines={1}>
        {address}
      </Text>

      <View onTouchStart={onPress}>
        <Icon
          name='file-text-o'
          type='font-awesome'
          size={findFontSize(25)}
          color={colors.darkBlue}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '20%',
    minHeight: 33,
    paddingLeft: '9.5%',
    paddingRight: '0.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    width: '15%',
    height: '80%',
    borderRadius: 5,
    textAlign: 'center',
    color: colors.skyBlue,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.darkBlue,
  },
  addressText: {
    width: '73%',
    height: '80%',
    textAlign: 'left',
    paddingLeft: '2%',
    color: colors.secondary,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.white,
  },
});

export default memo(CryptoBar);
