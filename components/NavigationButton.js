import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';

import { colors } from '../constants';
import { findNavIcon, findFontSize } from '../utilities';

const NavigationButton = ({ extraStyles, command, activeOpacity, active, title }) => (
  <TouchableOpacity
    onPress={command}
    activeOpacity={activeOpacity || 1}
    style={{ ...styles.mainView, ...extraStyles }}
  >
    <View style={styles.buttonView}>
      <View style={styles.imageView}>
        <Image
          source={findNavIcon(title)}
          style={{ ...styles.image, tintColor: active ? colors.secondary : colors.gray }}
        />
      </View>

      <Text
        allowFontScaling={false}
        style={{
          ...styles.activeText,
          color: active ? colors.secondary : colors.gray,
        }}
      >
        {title}
      </Text>
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
  activeText: {
    bottom: '5%',
    height: '30%',
    width: '100%',
    color: colors.grey,
    textAlign: 'center',
    position: 'relative',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(10),
    textTransform: 'capitalize',
  },
});

export default memo(NavigationButton);
