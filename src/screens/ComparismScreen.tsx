import React, { useState, useEffect, memo, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ScrollView } from 'react-native';

import InfoView from '../components/InfoView';
import PlayerView from '../components/PlayerView';
import PlayerSelectModal from '../components/PlayerSelectModal';

import {
  player,
  colors,
  findData,
  findFontSize,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  findPlayerInfo,
  findTeamNumberOfMatches,
} from '../utilities';

import { AppContext } from '../App';

import { Opponent } from '../interfaces';

const textHeight = Math.round(0.92 * 0.95 * 0.25 * 0.165 * DEVICE_HEIGHT);
const textWidth = Math.round(0.95 * DEVICE_WIDTH);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 650);

interface Props {
  visible: boolean;
}

const ComparismScreen: React.FC<Props> = ({ visible }) => {
  const { playerKit, goalieKit, playerData, nextOpponent, fixturesData, gameweekFinished } =
    useContext(AppContext);

  const MAX_DIFFICULTY = 5;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerInfo] = useState([player(0), player(1)]);
  const [opponentIndex1, setOpponentIndex1] = useState(0);
  const [opponentIndex2, setOpponentIndex2] = useState(0);
  const [chosenTeam, setChosenTeam] = useState('All Teams');
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [chosenPosition, setChosenPosition] = useState('All Positions');

  const [compareDetails, setCompareDetails] = useState([
    {
      teamID: -1,
      gamesToPlay: 0,
      playerForm: 0.0,
      expectedGoals: 0.0,
      expectedSaves: 0.0,
      expectedAssists: 0.0,
      chancesOfStarting: 0,
      expectedGoalsPerMatch: 0.0,
      expectedAssistsPerMatch: 0.0,
    },
    {
      teamID: -1,
      gamesToPlay: 0,
      playerForm: 0.0,
      expectedGoals: 0.0,
      expectedSaves: 0.0,
      expectedAssists: 0.0,
      chancesOfStarting: 0,
      expectedGoalsPerMatch: 0.0,
      expectedAssistsPerMatch: 0.0,
    },
  ]);

  const playerViewCommand = (index: number) => {
    setCurrentIndex(index);
    setPlayerModalVisible(true);
  };

  const addDifficulties = (total: number, currentValue: Opponent) =>
    total + currentValue.difficulty;

  useEffect(() => {
    const newCompareDetails = playerInfo.map(({ playerID }) => {
      const {
        form,
        team,
        saves_per_90,
        expected_goals,
        expected_assists,
        expected_goals_per_90,
        expected_assists_per_90,
        chance_of_playing_next_round,
        chance_of_playing_this_round,
      } = findData(playerID, playerData) || {};
      const teamMatches = findTeamNumberOfMatches(fixturesData || []);

      return {
        teamID: team || -1,
        playerForm: Number(form) || 0.0,
        gamesToPlay: team ? teamMatches[team] : 0,
        expectedSaves: Number(saves_per_90) || 0.0,
        expectedGoals: Number(expected_goals) || 0.0,
        expectedAssists: Number(expected_assists) || 0.0,
        expectedGoalsPerMatch: Number(expected_goals_per_90) || 0.0,
        expectedAssistsPerMatch: Number(expected_assists_per_90) || 0.0,
        chancesOfStarting:
          (gameweekFinished ? chance_of_playing_next_round : chance_of_playing_this_round) || 100,
      };
    });

    setCompareDetails(newCompareDetails);
  }, [playerInfo, playerModalVisible]);

  const findAverageOpponentsDifficulty = () => {
    // get average of opponent indices
    let opponents1 = nextOpponent?.find(({ team }) => team === compareDetails[0].teamID)?.opponents;
    let opponents2 = nextOpponent?.find(({ team }) => team === compareDetails[1].teamID)?.opponents;

    let newOpponentIndex1 =
      opponents1 && opponents1.length > 0
        ? opponents1.reduce(addDifficulties, 0) / opponents1.length
        : MAX_DIFFICULTY + 1;
    let newOpponentIndex2 =
      opponents2 && opponents2.length > 0
        ? opponents2.reduce(addDifficulties, 0) / opponents2.length
        : MAX_DIFFICULTY + 1;

    setOpponentIndex1(newOpponentIndex1);
    setOpponentIndex2(newOpponentIndex2);
  };

  useEffect(findAverageOpponentsDifficulty, [compareDetails]);

  return (
    <View style={{ ...styles.mainView, display: visible ? 'flex' : 'none' }}>
      <PlayerSelectModal
        playerInfo={playerInfo}
        chosenTeam={chosenTeam}
        posPickerEnabled={true}
        teamPickerEnabled={true}
        currentIndex={currentIndex}
        playerKit={playerKit || {}}
        goalieKit={goalieKit || {}}
        visible={playerModalVisible}
        playerData={playerData || []}
        setChosenTeam={setChosenTeam}
        chosenPosition={chosenPosition}
        nextOpponent={nextOpponent || []}
        setChosenPosition={setChosenPosition}
        setPlayerModalVisible={setPlayerModalVisible}
      />

      <View style={styles.containerView}>
        <View style={styles.playerFrame}>
          {playerInfo.map(({ shirtImage, playerName, playerContent, playerID, index }) => (
            <PlayerView
              key={index}
              imgVal={shirtImage}
              playerName={playerName}
              playerContent={playerContent}
              extraShirtStyles={{ height: '75%' }}
              command={() => playerViewCommand(index)}
              extraTextStyles1={{ fontSize: findFontSize(9) }}
              extraStyles={{ width: '25%', marginHorizontal: '30%' }}
              extraTextStyles2={{
                fontSize:
                  playerContent.length >= maxTextLength
                    ? findFontSize(10) / (0.085 * playerContent.length)
                    : findFontSize(9),
              }}
              chanceOfPlayingNextRound={
                findPlayerInfo(
                  playerID,
                  gameweekFinished
                    ? 'chance_of_playing_next_round'
                    : 'chance_of_playing_this_round',
                  playerData
                ) || 100
              }
            />
          ))}
        </View>

        <LinearGradient colors={[colors.athens, colors.alto]} style={styles.gradientView} />

        <ScrollView style={styles.infoView}>
          <InfoView
            type='reverse'
            infoName='Better Fixture'
            infoValue1={opponentIndex1}
            infoValue2={opponentIndex2}
            infoText1={playerInfo[0].playerContent}
            infoText2={playerInfo[1].playerContent}
          />

          <InfoView
            type='forward'
            infoName='Player Form'
            infoValue1={compareDetails[0].playerForm}
            infoValue2={compareDetails[1].playerForm}
          />

          <InfoView
            type='forward'
            infoName='Games To Play'
            infoValue1={compareDetails[0].gamesToPlay}
            infoValue2={compareDetails[1].gamesToPlay}
          />

          <InfoView
            type='forward'
            infoName='Chances of Starting'
            infoValue1={compareDetails[0].chancesOfStarting}
            infoValue2={compareDetails[1].chancesOfStarting}
          />

          <InfoView
            type='forward'
            infoName='Expected Goals(xG)'
            infoValue1={compareDetails[0].expectedGoals}
            infoValue2={compareDetails[1].expectedGoals}
          />

          <InfoView
            type='forward'
            infoName='Expected Assists(xA)'
            infoValue1={compareDetails[0].expectedAssists}
            infoValue2={compareDetails[1].expectedAssists}
          />

          <InfoView
            type='forward'
            infoName='Expected Goals(xG) per match'
            infoValue1={compareDetails[0].expectedGoalsPerMatch}
            infoValue2={compareDetails[1].expectedGoalsPerMatch}
          />

          <InfoView
            type='forward'
            infoName='Expected Assists(xA) per match'
            infoValue1={compareDetails[0].expectedAssistsPerMatch}
            infoValue2={compareDetails[1].expectedAssistsPerMatch}
          />

          <InfoView
            type='forward'
            infoName='Expected Saves per match'
            infoValue1={compareDetails[0].expectedSaves}
            infoValue2={compareDetails[1].expectedSaves}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.alto,
  },
  containerView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  playerFrame: {
    width: '100%',
    height: '24.5%',
    paddingBottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.stratos,
    justifyContent: 'space-evenly',
  },
  infoView: { width: '100%', height: '75%' },
  gradientView: { height: '0.5%', width: '100%' },
});

export default memo(ComparismScreen);
