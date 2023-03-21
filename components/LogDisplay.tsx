import { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { DEVICE_HEIGHT, findFontSize, colors } from '../utilities';

interface Props {
  version: string;
  info: string[][];
}

const LogDisplay: React.FC<Props> = ({ info, version }) => (
  <View style={{ ...styles.mainView, height: DEVICE_HEIGHT * 0.05 * (info.length + 1) }}>
    <Text allowFontScaling={false} style={styles.versionText}>
      {version}
    </Text>

    {info.map(([logType, logMessage]) => (
      <View style={styles.logView} key={logMessage}>
        <Text
          allowFontScaling={false}
          style={{ ...styles.signView, color: logType === 'add' ? colors.emerald : colors.red }}
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
    color: colors.stratos,
    fontSize: findFontSize(15),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  logView: { flexDirection: 'row', width: '100%', height: DEVICE_HEIGHT * 0.05 },
  textView: {
    width: '80%',
    color: colors.stratos,
    fontSize: findFontSize(11),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  versionText: {
    width: '100%',
    paddingLeft: '10%',
    color: colors.stratos,
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(16),
    textAlignVertical: 'center',
    height: DEVICE_HEIGHT * 0.05,
  },
});

export default memo(LogDisplay);
