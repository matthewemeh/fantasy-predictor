import React, { useEffect, useState, memo, useContext } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { AdMobBanner, setTestDeviceIDAsync, AdMobInterstitial } from 'expo-ads-admob';

import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import PickerBox from '../components/PickerBox';
import InfoCircle from '../components/InfoCircle';
import PlayerFrame from '../components/PlayerFrame';
import PlayerSelectModal from '../components/PlayerSelectModal';

import { colors, fieldConstants } from '../constants';
import {
  player,
  predict,
  findData,
  unknownImage,
  findFontSize,
  randomSelect,
  deviceHeight,
  findPlayerInfo,
  defaultAdHeight,
  findGameweekNumber,
  findOpponentAbbreviation,
} from '../utilities';

import { AppContext } from '../App';

const PlayerScreen = ({ type, visible }) => {
  const initializeId = async () => await setTestDeviceIDAsync('EMULATOR');
  const {
    teams,
    playerKit,
    goalieKit,
    currentGW,
    selections,
    playerData,
    fieldImage,
    nextOpponent,
    setAlertVisible,
    StandardRatings,
    TeamAbbreviations,
    setAlertComponents,
  } = useContext(AppContext);

  // componentDidMount
  useEffect(initializeId, []);

  const { formations } = fieldConstants;
  const [clicks, setClicks] = useState(1);
  const gameweek = findGameweekNumber(currentGW);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenFormation, setChosenFormation] = useState(
    type === 'fantasy' ? '4-4-2' : selections?.formation
  );
  const [teamPredicted, setTeamPredicted] = useState(false);
  const [chosenTeam, setChosenTeam] = useState('All Teams');
  const [currentScoutIndex, setCurrentScoutIndex] = useState(0);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [chosenPosition, setChosenPosition] = useState('All Positions');
  const [revealButtonClicked, setRevealButtonClicked] = useState(false);
  const [footerButtonEnabled, setFooterButtonEnabled] = useState(false);

  const numberOfGoalkeepers = 1;
  const [numberOfForwards, setNumberOfForwards] = useState(2);
  const [numberOfDefenders, setNumberOfDefenders] = useState(4);
  const [numberOfMidfielders, setNumberOfMidfielders] = useState(4);
  const [playerInfo, setPlayerInfo] = useState([
    player(0),
    player(1),
    player(2),
    player(3),
    player(4),
    player(5),
    player(6),
    player(7),
    player(8),
    player(9),
    player(10),
  ]);

  useEffect(() => {
    const allSelected = playerInfo.every(({ playerName }) => playerName);
    setFooterButtonEnabled(allSelected);
  }, [playerModalVisible, footerButtonEnabled, playerInfo]);

  useEffect(() => {
    if (type === 'scout') changeFormationHandler(chosenFormation);
  }, [type]);

  useEffect(() => {
    const timer = setTimeout(fillPlayers, 500);
    return () => clearTimeout(timer);
  }, [revealButtonClicked, currentScoutIndex]);

  useEffect(() => {
    // appoint captain
    if (currentScoutIndex === 11) {
      const newPlayerInfo = playerInfo;
      const { captainIndex } = selections;

      newPlayerInfo[captainIndex].captain = true;
      setPlayerInfo([...newPlayerInfo]);
    }
  }, [currentScoutIndex]);

  const fillPlayers = () => {
    if (revealButtonClicked && currentScoutIndex < selections.players.length) {
      const tempData = playerData.find(({ key }) => key === selections.players[currentScoutIndex]);

      if (tempData) {
        const { playerName, key, team } = tempData;

        playerInfo[currentScoutIndex] = {
          playerName,
          captain: false,
          playerKey: key,
          key: currentScoutIndex,
          shirtImage: currentScoutIndex === 0 ? goalieKit[team] : playerKit[team],
          playerContent: findOpponentAbbreviation(team, nextOpponent, TeamAbbreviations),
        };
      }
      setCurrentScoutIndex(currentScoutIndex + 1);
    }
  };

  const removePlayer = index => {
    const newPlayerInfo = playerInfo;

    newPlayerInfo[index] = {
      key: index,
      playerKey: '',
      captain: false,
      playerName: '',
      playerContent: '',
      shirtImage: unknownImage,
    };

    setPlayerInfo([...newPlayerInfo]);
  };

  const filterPlayers = pos => {
    return chosenTeam === 'All Teams'
      ? playerData.filter(
          ({ position, key }) =>
            position === pos && !playerInfo.some(({ playerKey }) => playerKey === key)
        )
      : playerData.filter(
          ({ position, team, key }) =>
            position === pos &&
            team === chosenTeam &&
            !playerInfo.some(({ playerKey }) => playerKey === key)
        );
  };

  const playersEnough = (pos, returnLength) => {
    const requiredNoOfPlayers = {
      goalkeeper: numberOfGoalkeepers,
      defender: numberOfDefenders,
      midfielder: numberOfMidfielders,
      forward: numberOfForwards,
    };

    if (chosenTeam === 'All Teams') {
      const filteredPlayersLength = playerData.filter(({ position }) => position === pos).length;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    } else {
      const filteredPlayersLength = playerData.filter(
        ({ position, team }) => position === pos && team === chosenTeam
      ).length;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    }
  };

  const addRandomPlayer = (pos, index) => {
    const possiblePlayers = filterPlayers(pos);

    if (possiblePlayers.length > 0) {
      const newPlayerInfo = playerInfo;
      const { captain } = newPlayerInfo[index];
      const { team, playerName, key } = randomSelect(possiblePlayers);

      newPlayerInfo[index] = {
        captain,
        playerName,
        key: index,
        playerKey: key,
        shirtImage: index === 0 ? goalieKit[team] : playerKit[team],
        playerContent: findOpponentAbbreviation(team, nextOpponent, TeamAbbreviations),
      };
      setPlayerInfo([...newPlayerInfo]);
    }
  };

  const captainHandler = index => {
    const newPlayerInfo = playerInfo;
    newPlayerInfo.forEach(player => (player.captain = player.key === index && !player.captain));
    setPlayerInfo([...newPlayerInfo]);

    if (teamPredicted) predictPoints();
  };

  const closeAlert = () => setAlertVisible(false);

  const removeAll = () => {
    closeAlert();
    setTeamPredicted(false);
    playerInfo.forEach((player, index) => removePlayer(index));
  };

  const confirmRemoveAll = () => {
    if (playerInfo.some(({ playerName }) => playerName)) {
      setAlertComponents({
        title: 'Confirm',
        onCloseAlert: closeAlert,
        message: 'Are you sure you want to delete team?',
        buttons: [
          { text: 'YES', onPress: removeAll },
          { text: 'NO', onPress: closeAlert },
        ],
      });
      setAlertVisible(true);
    }
  };

  const changeFormationHandler = formation => {
    setTeamPredicted(false);
    setNumberOfDefenders(parseInt(formation.charAt(0)));
    setNumberOfMidfielders(parseInt(formation.charAt(2)));
    setNumberOfForwards(parseInt(formation.charAt(4)));
  };

  const randomizePlayers = () => {
    const defEnd = playersEnough('defender')
      ? 1 + numberOfDefenders
      : 1 + playersEnough('defender', true);

    const midStart = 1 + numberOfDefenders;
    const midEnd = playersEnough('midfielder')
      ? midStart + numberOfMidfielders
      : midStart + playersEnough('midfielder', true);

    const fwdStart = midStart + numberOfMidfielders;
    const fwdEnd = playersEnough('forward') ? 11 : fwdStart + playersEnough('forward', true);

    setTeamPredicted(false);
    addRandomPlayer('goalkeeper', 0);

    for (let i = 1; i < defEnd; i++) addRandomPlayer('defender', i);

    for (let i = midStart; i < midEnd; i++) addRandomPlayer('midfielder', i);

    for (let i = fwdStart; i < fwdEnd; i++) addRandomPlayer('forward', i);
  };

  const predictPoints = () => {
    const newPlayerInfo = playerInfo;

    newPlayerInfo.forEach(player => {
      const { playerKey, captain } = player;
      const playerDetails = findData(playerKey, playerData);
      const predictedPoint = predict(playerDetails, StandardRatings, nextOpponent, gameweek);

      player.playerContent = (captain ? 2 : 1) * predictedPoint;
    });
    setPlayerInfo([...newPlayerInfo]);
  };

  const playerViewCommand = (pos, index) => {
    if (type === 'fantasy') {
      setChosenPosition(pos);
      setCurrentIndex(index);
      setPlayerModalVisible(true);
    }
  };

  const playerViewLongCommand = (playerName, index) => {
    if (type === 'fantasy' && playerName) {
      setCurrentIndex(index);
      captainHandler(index);
    }
  };

  useEffect(() => {
    if (clicks % 4 === 0) showInterstitial();
  }, [clicks]);

  const onPredict = () => {
    predictPoints();
    setClicks(clicks + 1);
    setTeamPredicted(true);
  };

  const onReveal = () => {
    fillPlayers();
    setRevealButtonClicked(true);
  };

  const showInfo = () => {
    setAlertComponents({
      title: 'Info',
      onCloseAlert: closeAlert,
      buttons: [{ text: 'OK', onPress: closeAlert }],
      message:
        'You can now optionally select the captain of your squad by long pressing on the player',
    });
    setAlertVisible(true);
  };

  const showInterstitial = async () => {
    await AdMobInterstitial.setAdUnitID('ca-app-pub-7152054343360573/2734540598');
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true }).catch(null);
    await AdMobInterstitial.showAdAsync().catch(null);
  };

  useEffect(() => changeFormationHandler(chosenFormation), [chosenFormation]);

  useEffect(() => {
    // remove non-defenders
    const defEnd = 1 + numberOfDefenders;
    for (let i = 1; i < defEnd; i++) {
      const { playerKey } = playerInfo[i];

      if (playerKey && findPlayerInfo(playerKey, 'position', playerData) !== 'defender') {
        removePlayer(i);
      }
    }

    // remove non-midfielders
    const midEnd = defEnd + numberOfMidfielders;
    for (let i = defEnd; i < midEnd; i++) {
      const { playerKey } = playerInfo[i];

      if (playerKey && findPlayerInfo(playerKey, 'position', playerData) !== 'midfielder') {
        removePlayer(i);
      }
    }

    // remove non-forwards
    for (let i = midEnd; i < 11; i++) {
      const { playerKey } = playerInfo[i];

      if (playerKey && findPlayerInfo(playerKey, 'position', playerData) !== 'forward') {
        removePlayer(i);
      }
    }
  }, [numberOfDefenders, numberOfMidfielders, numberOfForwards]);

  return (
    <View style={{ ...styles.main, display: visible ? 'flex' : 'none' }}>
      <PlayerSelectModal
        teams={teams}
        key={chosenPosition}
        playerKit={playerKit}
        goalieKit={goalieKit}
        playerData={playerData}
        playerInfo={playerInfo}
        chosenTeam={chosenTeam}
        posPickerEnabled={false}
        teamPickerEnabled={true}
        currentIndex={currentIndex}
        nextOpponent={nextOpponent}
        visible={playerModalVisible}
        setChosenTeam={setChosenTeam}
        chosenPosition={chosenPosition}
        setTeamPredicted={setTeamPredicted}
        TeamAbbreviations={TeamAbbreviations}
        setChosenPosition={setChosenPosition}
        setPlayerModalVisible={setPlayerModalVisible}
      />

      {type === 'fantasy' && <InfoCircle onPress={showInfo} />}

      <View
        style={{
          ...styles.header,
          height: type === 'fantasy' ? '12%' : '13%',
          paddingBottom: type === 'fantasy' ? 0 : '1%',
          justifyContent: type === 'fantasy' ? 'center' : 'space-between',
        }}
      >
        {type === 'scout' && (
          <Text allowFontScaling={false} style={styles.headerText}>
            Scout's Selection for {currentGW}
          </Text>
        )}

        <PickerBox
          list={formations}
          enabled={type === 'fantasy'}
          selectedValue={chosenFormation}
          selectedItemHandler={setChosenFormation}
          extraStyles={{
            width: '30%',
            height: '50%',
            position: 'relative',
            bottom: type === 'fantasy' ? 0 : '7%',
          }}
        />
      </View>

      <View style={styles.body}>
        <ImageBackground
          style={styles.imgViewStyle}
          imageStyle={styles.imageBg}
          source={
            typeof fieldImage == 'string'
              ? { uri: fieldImage, headers: { Accept: '*/*' } }
              : fieldImage
          }
        >
          <PlayerFrame
            type={type}
            endIndex={1}
            startIndex={0}
            playerInfo={playerInfo}
            playerData={playerData}
            positionGroup='goalkeepers'
            playerViewCommand={playerViewCommand}
            playerViewLongCommand={playerViewLongCommand}
          />
          <PlayerFrame
            type={type}
            endIndex={1 + numberOfDefenders}
            startIndex={1}
            playerInfo={playerInfo}
            playerData={playerData}
            positionGroup='defenders'
            playerViewCommand={playerViewCommand}
            playerViewLongCommand={playerViewLongCommand}
          />
          <PlayerFrame
            type={type}
            endIndex={1 + numberOfDefenders + numberOfMidfielders}
            startIndex={1 + numberOfDefenders}
            playerInfo={playerInfo}
            playerData={playerData}
            positionGroup='midfielders'
            playerViewCommand={playerViewCommand}
            playerViewLongCommand={playerViewLongCommand}
          />
          <PlayerFrame
            type={type}
            endIndex={11}
            startIndex={1 + numberOfDefenders + numberOfMidfielders}
            playerInfo={playerInfo}
            playerData={playerData}
            positionGroup='forwards'
            playerViewCommand={playerViewCommand}
            playerViewLongCommand={playerViewLongCommand}
          />
        </ImageBackground>

        <FilterBar
          type={type}
          teams={teams}
          pickerEnabled={true}
          chosenTeam={chosenTeam}
          setChosenTeam={setChosenTeam}
          confirmRemoveAll={confirmRemoveAll}
          randomizePlayers={randomizePlayers}
        />
      </View>

      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: type === 'fantasy' ? '18%' : '17%',
        }}
      >
        {0.92 * (type === 'fantasy' ? 0.18 : 0.17) * 0.5 * deviceHeight >= defaultAdHeight ? (
          <AdMobBanner
            style={styles.admob}
            servePersonalizedAds={true}
            bannerSize='smartBannerLandscape'
            onDidFailToReceiveAdWithError={null}
            adUnitID='ca-app-pub-7152054343360573/9830430705'
          />
        ) : (
          <View style={styles.admob} />
        )}

        <Footer
          type={type}
          onReveal={onReveal}
          onPredict={onPredict}
          playerInfo={playerInfo}
          teamPredicted={teamPredicted}
          footerButtonEnabled={footerButtonEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { width: '100%', height: '92%', backgroundColor: colors.white },
  header: { width: '100%', alignItems: 'center', backgroundColor: colors.secondary },
  headerText: {
    top: '6%',
    width: '100%',
    height: undefined,
    color: colors.white,
    textAlign: 'center',
    position: 'relative',
    fontSize: findFontSize(15),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  body: { width: '100%', height: '70%', backgroundColor: colors.secondary },
  imgViewStyle: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    paddingVertical: '5%',
    justifyContent: 'space-evenly',
  },
  admob: { width: '100%', height: '50%', backgroundColor: colors.grey },
  imageBg: {
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(PlayerScreen);
