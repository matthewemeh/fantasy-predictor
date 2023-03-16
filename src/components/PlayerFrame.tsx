import React, { memo, useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import PlayerView from './PlayerView';

import { findPlayerInfo } from '../utilities';

import { AppContext } from '../App';

import { PlayerInfoData, ElementData } from '../interfaces';

interface Props {
  type: string;
  endIndex: number;
  playerInfo: PlayerInfoData[];
  startIndex: number;
  playerData: ElementData[];
  positionGroup: string;
  playerViewCommand: (positionGroup: string, index: number) => void;
  playerViewLongCommand: (playerName: string, index: number) => void;
}

const PlayerFrame: React.FC<Props> = ({
  type,
  endIndex,
  playerInfo,
  startIndex,
  playerData,
  positionGroup,
  playerViewCommand,
  playerViewLongCommand,
}) => {
  const { gameweekFinished } = useContext(AppContext);

  return (
    <View style={styles.playerFrame}>
      {playerInfo
        .slice(startIndex, endIndex)
        .map(({ index, shirtImage, playerContent, playerID, playerName, isCaptain }) => (
          <PlayerView
            key={index}
            imgVal={shirtImage}
            isCaptain={isCaptain}
            playerName={playerName}
            playerContent={playerContent}
            activeOpacity={type === 'scout' ? 1 : 0.6}
            command={() => playerViewCommand(positionGroup, index)}
            longCommand={() => playerViewLongCommand(playerName, index)}
            chanceOfPlayingNextRound={
              findPlayerInfo(
                playerID,
                gameweekFinished ? 'chance_of_playing_next_round' : 'chance_of_playing_this_round',
                playerData
              ) || 100
            }
          />
        ))}
    </View>
  );
};

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
