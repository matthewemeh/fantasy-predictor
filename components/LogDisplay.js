import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { deviceHeight, findFontSize } from '../utilities';
import { colors } from '../constants';

function LogDisplay(props) {
  let info = props.info;
  return (
    <View style={{ ...styles.mainView, height: deviceHeight * 0.05 * (info.length + 1) }}>
      <Text allowFontScaling={false} style={styles.versionTextStyle}>
        {props.version}
      </Text>
      {info.map(item => (
        <View style={styles.logView} key={item[1]}>
          <Text
            allowFontScaling={false}
            style={{
              ...styles.signView,
              color: item[0] === 'add' ? colors.emerald : colors.red,
            }}
          >
            {item[0] === 'add' ? '+' : '-'}
          </Text>
          <Text allowFontScaling={false} style={{ ...styles.textView }}>
            {item[1]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '100%', justifyContent: 'space-evenly', marginBottom: '10%' },
  signView: {
    width: '10%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(15),
    color: colors.secondary,
  },
  logView: { flexDirection: 'row', width: '100%', height: deviceHeight * 0.05 },
  textView: {
    width: '80%',
    textAlign: 'left',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(11),
    color: colors.secondary,
  },
  versionTextStyle: {
    width: '100%',
    height: deviceHeight * 0.05,
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: findFontSize(16),
    fontFamily: 'PoppinsBold',
    color: colors.secondary,
    paddingLeft: '10%',
  },
});

export default React.memo(LogDisplay);
