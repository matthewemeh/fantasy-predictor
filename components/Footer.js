import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import Button from './Button';
import NumberTab from './NumberTab';

import { colors } from '../constants';
import { findFontSize, sum, average } from '../utilities';

const Footer = ({ playerInfo, predictButtonVisible, type, teamPredicted, onPredict, onReveal }) => {
  const points = playerInfo.map(({ playerContent }) => playerContent);

  return (
    <View style={styles.bottomView}>
      {teamPredicted ? (
        <NumberTab
          title1='Average'
          title2='Total'
          title3='Highest'
          number1={Math.round(average(points))}
          number2={sum(points)}
          number3={Math.max(...points)}
        />
      ) : (
        <Button
          enabled={
            type === 'fantasy'
              ? predictButtonVisible
              : playerInfo.every(({ playerName }) => !playerName)
          }
          extraStyles={{ width: '90%', height: '80%' }}
          extraTextStyles={{ fontSize: findFontSize(25) }}
          command={type === 'fantasy' ? onPredict : onReveal}
          buttonText={type === 'fantasy' ? 'Predict' : 'Reveal'}
          buttonColor={type === 'fantasy' ? colors.forward : colors.secondary}
          buttonTextColor={type === 'fantasy' ? colors.white : colors.primary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default memo(Footer);
