import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

import PlayerView from './PlayerView';

import { findPlayerInfo } from '../utilities';

const PlayerFrame = ({
  type,
  endIndex,
  playerInfo,
  startIndex,
  playerData,
  positionGroup,
  playerViewCommand,
  playerViewLongCommand,
}) => (
  <View style={styles.playerFrame}>
    {playerInfo
      .slice(startIndex, endIndex)
      .map(({ key, shirtImage, playerContent, playerKey, playerName, captain }) => (
        <PlayerView
          key={key}
          captain={captain}
          imgVal={shirtImage}
          playerName={playerName}
          playerContent={playerContent}
          activeOpacity={type === 'scout' ? 1 : 0.6}
          command={() => playerViewCommand(positionGroup, key)}
          longCommand={() => playerViewLongCommand(playerName, key)}
          available={!playerKey || findPlayerInfo(playerKey, 'available', playerData)}
        />
      ))}
  </View>
);

const styles = StyleSheet.create({
  playerFrame: {
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default memo(PlayerFrame);
