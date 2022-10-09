import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { colors } from '../constants';
import { deviceHeight, findFontSize } from '../utilities';

const LogDisplay = ({ info, version }) => (
  <View style={{ ...styles.mainView, height: deviceHeight * 0.05 * (info.length + 1) }}>
    <Text allowFontScaling={false} style={styles.versionTextStyle}>
      {version}
    </Text>

    {info.map(([logType, logMessage]) => (
      <View style={styles.logView} key={logMessage}>
        <Text
          allowFontScaling={false}
          style={{
            ...styles.signView,
            color: logType === 'add' ? colors.emerald : colors.red,
          }}
        >
          {logType === 'add' ? '+' : '-'}
        </Text>

        <Text allowFontScaling={false} style={styles.textView}>
          {logMessage}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  mainView: { width: '100%', justifyContent: 'space-evenly', marginBottom: '10%' },
  signView: {
    width: '10%',
    height: '100%',
    textAlign: 'center',
    color: colors.secondary,
    fontSize: findFontSize(15),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  logView: { flexDirection: 'row', width: '100%', height: deviceHeight * 0.05 },
  textView: {
    width: '80%',
    textAlign: 'left',
    color: colors.secondary,
    fontSize: findFontSize(11),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  versionTextStyle: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '10%',
    color: colors.secondary,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(16),
    textAlignVertical: 'center',
    height: deviceHeight * 0.05,
  },
});

export default memo(LogDisplay);
