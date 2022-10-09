import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import InfoView from '../components/InfoView';
import PlayerView from '../components/PlayerView';
import PlayerSelectModal from '../components/PlayerSelectModal';

import { colors } from '../constants';
import {
  player,
  average,
  findData,
  isNumber,
  findReturns,
  deviceWidth,
  findFontSize,
  deviceHeight,
  findPlayerInfo,
  findGameweekNumber,
} from '../utilities';

const textHeight = Math.round(0.92 * 0.95 * 0.25 * 0.165 * deviceHeight);
const textWidth = Math.round(0.95 * deviceWidth);
const area = textHeight * textWidth;
const maxTextLength = Math.floor(area / 650);

const ComparismPage = ({
  teams,
  currentGW,
  goalieKit,
  playerKit,
  playerData,
  nextOpponent,
  StandardRatings,
  TeamAbbreviations,
}) => {
  const { teamIndex } = StandardRatings;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerInfo] = useState([player(0), player(1)]);
  const [chosenTeam, setChosenTeam] = useState('All Teams');
  const [playerDetails, setPlayerDetails] = useState([{}, {}]);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [chosenPosition, setChosenPosition] = useState('All Positions');

  const [compareDetails, setCompareDetails] = useState([
    {
      teamForm: '0.0',
      gamesToPlay: '0',
      playerForm: '0.0',
      expectedGoals: '0.0',
      expectedSaves: '0.0',
      expectedAssists: '0.0',
      chancesOfStarting: '0',
    },
    {
      teamForm: '0.0',
      gamesToPlay: '0',
      playerForm: '0.0',
      expectedGoals: '0.0',
      expectedSaves: '0.0',
      expectedAssists: '0.0',
      chancesOfStarting: '0',
    },
  ]);

  const findChancesOfStarting = (points, available, opponent) => {
    if (!available || opponent === '-') return '0';

    const recentPoints = points.slice(-5);
    const starts = recentPoints.filter(num => num > 0).length;

    return `${Math.round((starts * 100) / recentPoints.length)}`;
  };

  const gameweek = findGameweekNumber(currentGW);

  const pointsRange = -gameweek;

  const playerViewCommand = key => {
    setCurrentIndex(key);
    setPlayerModalVisible(true);
  };

  useEffect(() => {
    const newDetails = playerInfo.map(({ playerKey }) => findData(playerKey, playerData) || {});
    setPlayerDetails(newDetails);
  }, [playerInfo, playerModalVisible]);

  useEffect(() => {
    playerDetails.forEach((details, index) => {
      if (Object.keys(details).length > 0) {
        const newCompareDetails = compareDetails;
        const { playerContent } = playerInfo[index];
        const { team, points, key, available } = details;
        const { goals, assists, saves } = findReturns(
          key,
          StandardRatings,
          playerData,
          pointsRange
        );
        const gamesToPlay =
          playerContent && playerContent !== '-' ? playerContent.split(',').length : '0';

        const expectedGoals = (goals / gameweek).toFixed(1);
        const expectedSaves = (saves / gameweek).toFixed(0);
        const expectedAssists = (assists / gameweek).toFixed(1);
        const teamForm = (teamIndex[team] * (10 / 3)).toFixed(1);
        const playerForm = average(points.slice(pointsRange)).toFixed(1);
        const chancesOfStarting = findChancesOfStarting(points, available, playerContent);

        newCompareDetails[index] = {
          teamForm,
          playerForm,
          gamesToPlay,
          expectedGoals,
          expectedSaves,
          expectedAssists,
          chancesOfStarting,
        };
        setCompareDetails([...newCompareDetails]);
      }
    });
  }, [playerDetails]);

  return (
    <View style={styles.mainView}>
      <PlayerSelectModal
        teams={teams}
        playerKit={playerKit}
        goalieKit={goalieKit}
        playerData={playerData}
        playerInfo={playerInfo}
        chosenTeam={chosenTeam}
        posPickerEnabled={true}
        teamPickerEnabled={true}
        currentIndex={currentIndex}
        nextOpponent={nextOpponent}
        visible={playerModalVisible}
        setChosenTeam={setChosenTeam}
        chosenPosition={chosenPosition}
        setChosenPosition={setChosenPosition}
        TeamAbbreviations={TeamAbbreviations}
        setPlayerModalVisible={setPlayerModalVisible}
      />

      <View style={styles.containerView}>
        <View style={styles.playerFrame}>
          {playerInfo.map(({ shirtImage, playerName, playerContent, playerKey, key }) => (
            <PlayerView
              key={key}
              longCommand={null}
              imgVal={shirtImage}
              playerName={playerName}
              playerContent={playerContent}
              extraShirtStyles={{ height: '75%' }}
              command={() => playerViewCommand(key)}
              extraTextStyles1={{ fontSize: findFontSize(9) }}
              extraStyles={{ width: '25%', marginHorizontal: '30%' }}
              available={!playerKey || findPlayerInfo(playerKey, 'available', playerData)}
              extraTextStyles2={{
                fontSize:
                  playerContent.length >= maxTextLength
                    ? findFontSize(10) / (0.085 * playerContent.length)
                    : findFontSize(9),
              }}
            />
          ))}
        </View>

        <ScrollView style={styles.infoView}>
          <InfoView
            type='reverse'
            infoName='Better Fixture'
            StandardRatings={StandardRatings}
            playerContent1={playerInfo[0].playerContent}
            playerContent2={playerInfo[1].playerContent}
            infoValue1={nextOpponent[playerDetails[0]?.team]}
            infoValue2={nextOpponent[playerDetails[1]?.team]}
          />

          <InfoView
            type='forward'
            infoName='Player Form'
            StandardRatings={StandardRatings}
            infoValue1={compareDetails[0].playerForm}
            infoValue2={compareDetails[1].playerForm}
          />

          <InfoView
            type='forward'
            infoName='Team Form'
            StandardRatings={StandardRatings}
            infoValue1={compareDetails[0].teamForm}
            infoValue2={compareDetails[1].teamForm}
          />

          <InfoView
            type='forward'
            infoName='Games To Play'
            StandardRatings={StandardRatings}
            infoValue1={compareDetails[0].gamesToPlay}
            infoValue2={compareDetails[1].gamesToPlay}
          />

          <InfoView
            type='forward'
            infoName='Chances of Starting'
            StandardRatings={StandardRatings}
            infoValue1={compareDetails[0].chancesOfStarting}
            infoValue2={compareDetails[1].chancesOfStarting}
          />

          <InfoView
            type='forward'
            infoName='Expected Goals(xG) per match'
            StandardRatings={StandardRatings}
            infoValue1={compareDetails[0].expectedGoals}
            infoValue2={compareDetails[1].expectedGoals}
          />

          <InfoView
            type='forward'
            infoName='Expected Assists(xA) per match'
            StandardRatings={StandardRatings}
            infoValue1={compareDetails[0].expectedAssists}
            infoValue2={compareDetails[1].expectedAssists}
          />

          <InfoView
            type='forward'
            infoName='Expected Saves per match'
            StandardRatings={StandardRatings}
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
    backgroundColor: colors.grey,
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
    height: '25%',
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.secondary,
    justifyContent: 'space-evenly',
  },
  infoView: { width: '100%', height: '75%' },
});

export default memo(ComparismPage);
