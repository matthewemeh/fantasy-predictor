import React from 'react';
import { View, StyleSheet, Text, ToastAndroid, Clipboard, TouchableOpacity } from 'react-native';
import { findFontSize } from '../utilities';
import { Icon } from 'react-native-elements';
import { colors } from '../constants';

function CryptoBar(props) {
  function onPressCommand() {
    Clipboard.setString(props.address);
    ToastAndroid.show(`${props.name} address copied`, 2000);
  }
  return (
    <View style={styles.mainView}>
      <Text allowFontScaling={false} style={styles.nameTextStyle} numberOfLines={1}>
        {props.name}
      </Text>
      <Text allowFontScaling={false} style={styles.addressTextStyle} numberOfLines={1}>
        {props.address}
      </Text>
      <TouchableOpacity style={styles.iconView} activeOpacity={0.6} onPress={onPressCommand}>
        <Icon
          name={'file-text-o'}
          type='font-awesome'
          size={findFontSize(25)}
          color={colors.darkBlue}
          onPress={onPressCommand}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: '20%',
  },
  nameTextStyle: {
    width: '20%',
    height: '80%',
    backgroundColor: colors.darkBlue,
    borderRadius: 5,
    color: colors.skyBlue,
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(13),
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  addressTextStyle: {
    width: '65%',
    height: '80%',
    backgroundColor: colors.white,
    color: colors.secondary,
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(13),
    textAlign: 'left',
    textAlignVertical: 'center',
    paddingLeft: '2%',
  },
  iconView: {
    width: '10%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(CryptoBar);
