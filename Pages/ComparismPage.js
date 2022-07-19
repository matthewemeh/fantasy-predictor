import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import PlayerView from '../components/PlayerView';
import { colors } from '../constants';
import InfoView from '../components/InfoView';
import PlayerSelectModal, {
  getPlayerData,
  getChosenPosition,
  getChosenTeam,
} from '../components/PlayerSelectModal';
import {
  findData,
  findPlayerInfo,
  unknownImage,
  deviceWidth,
  findFontSize,
  deviceHeight,
} from '../utilities';

const textHeight = Math.round(0.92 * 0.95 * 0.25 * 0.165 * deviceHeight);
const textWidth = Math.round(0.95 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 650);

function findChancesOfStarting(data) {
  let starts = 0;
  if (!data.available) return '0';
  let points = data.points;
  let recentPoints = points.slice(-5);
  recentPoints.map(point => (starts += point !== 0 ? 1 : 0));
  return `${Math.round((starts * 100) / recentPoints.length)}`;
}

function ComparismPage(props) {
  const playerData = props.playerData;
  const playerKit = props.playerKit;
  const teams = props.teams;
  const goalieKit = props.goalieKit;
  const nextOpponent = props.nextOpponent;
  const TeamAbbreviations = props.TeamAbbreviations;
  const StandardRatings = props.StandardRatings;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenTeam, setChosenTeam] = useState('All Teams');
  const [chosenPosition, setChosenPosition] = useState('All Positions');
  const [playerModalState, setPlayerModalState] = useState(false);
  function onClose() {
    setPlayerModalState(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
  }
  function onSelect() {
    let initialData = getPlayerData();
    playerInfo[currentIndex] = {
      ...initialData,
      data: findData(initialData.playerKey, playerData),
    };
    setPlayerModalState(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
  }
  function playerViewCommand(key) {
    setCurrentIndex(key);
    setPlayerModalState(true);
  }
  const [playerInfo, setPlayerInfo] = useState([
    {
      playerName: '',
      playerKey: '',
      key: 0,
      shirtImage: unknownImage,
      playerContent: '',
      data: {},
    },
    {
      playerName: '',
      playerKey: '',
      key: 1,
      shirtImage: unknownImage,
      playerContent: '',
      data: {},
    },
  ]);

  return (
    <View style={styles.mainView}>
      <PlayerSelectModal
        visible={playerModalState}
        currentIndex={currentIndex}
        teams={teams}
        playerKit={playerKit}
        goalieKit={goalieKit}
        playerData={playerData}
        playerInfo={playerInfo}
        nextOpponent={nextOpponent}
        TeamAbbreviations={TeamAbbreviations}
        chosenPosition={chosenPosition}
        chosenTeam={chosenTeam}
        onRequestClose={onClose}
        onSelectPlayer={onSelect}
        posPickerEnabled={true}
        teamPickerEnabled={true}
        key={chosenPosition}
      />
      <View style={styles.containerView}>
        <View style={styles.playerFrame}>
          {playerInfo.map(player => {
            return (
              <PlayerView
                key={player.key}
                imgVal={player.shirtImage}
                playerName={player.playerName}
                extraTextStyles1={{ fontSize: findFontSize(9) }}
                playerContent={player.playerContent}
                extraTextStyles2={{
                  fontSize:
                    player.playerContent.length >= maxTextLength
                      ? findFontSize(10) / (0.085 * player.playerContent.length)
                      : findFontSize(9),
                }}
                extraShirtStyles={{ height: '75%' }}
                extraStyles={{ width: '25%', marginHorizontal: '30%' }}
                available={findPlayerInfo(player.playerKey, 'available', playerData)}
                command={() => playerViewCommand(player.key)}
                longCommand={null}
              />
            );
          })}
        </View>
        <View style={styles.infoView}>
          <InfoView
            infoName={'Better Fixture'}
            infoValue1={nextOpponent[playerInfo[0].data.team]}
            infoValue2={nextOpponent[playerInfo[1].data.team]}
            playerContent1={playerInfo[0].playerContent}
            playerContent2={playerInfo[1].playerContent}
            StandardRatings={StandardRatings}
          />
          <InfoView
            infoName={'Player Form'}
            infoValue1={playerInfo[0].data.index ? playerInfo[0].data.index.toFixed(1) : '0.0'}
            infoValue2={playerInfo[1].data.index ? playerInfo[1].data.index.toFixed(1) : '0.0'}
            StandardRatings={StandardRatings}
          />
          <InfoView
            infoName={'Team Form'}
            infoValue1={
              playerInfo[0].data.team
                ? (StandardRatings.teamIndex[playerInfo[0].data.team] * (10 / 3)).toFixed(1)
                : '0.0'
            }
            infoValue2={
              playerInfo[1].data.team
                ? (StandardRatings.teamIndex[playerInfo[1].data.team] * (10 / 3)).toFixed(1)
                : '0.0'
            }
            StandardRatings={StandardRatings}
          />
          <InfoView
            infoName={'Games To Play'}
            infoValue1={
              playerInfo[0].playerContent.length > 0
                ? playerInfo[0].playerContent.split(',').length
                : '0'
            }
            infoValue2={
              playerInfo[1].playerContent.length > 0
                ? playerInfo[1].playerContent.split(',').length
                : '0'
            }
            StandardRatings={StandardRatings}
          />
          <InfoView
            infoName={'Chances of Starting'}
            infoValue1={playerInfo[0].data.points ? findChancesOfStarting(playerInfo[0].data) : '0'}
            infoValue2={playerInfo[1].data.points ? findChancesOfStarting(playerInfo[1].data) : '0'}
            StandardRatings={StandardRatings}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey,
  },
  containerView: {
    width: '95%',
    height: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  infoView: { width: '100%', height: '70%', borderTopWidth: 2, borderColor: colors.secondary },
  playerFrame: {
    flexDirection: 'row',
    width: '100%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default React.memo(ComparismPage);
