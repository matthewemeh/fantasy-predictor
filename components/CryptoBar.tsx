import { memo } from 'react';
import { Icon } from 'react-native-elements';
import {
  View,
  Text,
  Clipboard,
  StyleSheet,
  ToastAndroid,
  GestureResponderEvent,
} from 'react-native';

import { findFontSize, colors } from '../utilities';

interface Props {
  name: string;
  address: string;
}

const CryptoBar: React.FC<Props> = ({ address, name }) => {
  const onPress = (e: GestureResponderEvent) => {
    if (address) {
      Clipboard.setString(address);
      ToastAndroid.show(`${name} address copied`, 2000);
      e.stopPropagation();
    }
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
          color={colors.blueRibbon}
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
    color: colors.pattensBlue,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.blueRibbon,
  },
  addressText: {
    width: '73%',
    height: '80%',
    paddingLeft: '2%',
    color: colors.stratos,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.white,
  },
});

export default memo(CryptoBar);
