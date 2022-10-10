import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';

import { colors } from '../constants';
import { findImage, findFontSize } from '../utilities';

const NavigationButton = ({ extraStyles, command, activeOpacity, active, type, title }) => (
  <TouchableOpacity
    onPress={command}
    style={{ ...styles.mainView, ...extraStyles }}
    activeOpacity={activeOpacity ? activeOpacity : 1}
  >
    <View style={styles.buttonView}>
      <View style={styles.imageView}>
        <Image style={styles.image} source={findImage(active, type)} />
      </View>

      <View style={styles.activeTextView}>
        <Text
          allowFontScaling={false}
          style={{
            ...styles.activeTextStyle,
            color: active ? colors.secondary : colors.gray,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainView: { width: '20%', height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  image: { width: '100%', height: '87%', resizeMode: 'contain' },
  buttonView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  imageView: { width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' },
  activeTextView: { width: '100%', height: '30%' },
  activeTextStyle: {
    bottom: '5%',
    width: '100%',
    height: '100%',
    color: colors.grey,
    textAlign: 'center',
    position: 'relative',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(10),
  },
});

export default memo(NavigationButton);
