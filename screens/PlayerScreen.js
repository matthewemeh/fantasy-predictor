import React, { useEffect, useState, memo, useContext } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { AdMobBanner, setTestDeviceIDAsync, AdMobInterstitial } from 'expo-ads-admob';

import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import PickerBox from '../components/PickerBox';
import InfoCircle from '../components/InfoCircle';
import PlayerFrame from '../components/PlayerFrame';
import PlayerSelectModal from '../components/PlayerSelectModal';

import {
  player,
  colors,
  findData,
  unknownImage,
  findFontSize,
  randomSelect,
  DEVICE_HEIGHT,
  fieldConstants,
  findPlayerInfo,
  DEFAULT_AD_HEIGHT,
  findOpponentAbbreviation,
} from '../utilities';

import { AppContext } from '../App';

const PlayerScreen = ({ type, visible }) => {
  const initializeId = async () => await setTestDeviceIDAsync('EMULATOR');
  const {
    teamsData,
    playerKit,
    goalieKit,
    currentGW,
    selections,
    playerData,
    fieldImage,
    nextOpponent,
    positionData,
    currentGWType,
    setAlertVisible,
    gameweekFinished,
    setAlertComponents,
  } = useContext(AppContext);

  // componentDidMount
  useEffect(initializeId, []);
  const teams = teamsData.map(({ name }) => name).sort();

  const { formations } = fieldConstants;
  const [clicks, setClicks] = useState(1);
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

      newPlayerInfo[captainIndex].isCaptain = true;
      setPlayerInfo([...newPlayerInfo]);
    }
  }, [currentScoutIndex]);

  const fillPlayers = () => {
    if (revealButtonClicked && currentScoutIndex < selections.playerIDs.length) {
      const tempData = playerData.find(({ id }) => id === selections.playerIDs[currentScoutIndex]);

      if (tempData) {
        const { web_name, id, team } = tempData;
        const { id: teamID, name: teamName } = teamsData.find(({ id }) => id === team) || {};

        playerInfo[currentScoutIndex] = {
          playerID: id,
          isCaptain: false,
          playerName: web_name,
          index: currentScoutIndex,
          playerContent: findOpponentAbbreviation(teamID, nextOpponent, teamsData),
          shirtImage: currentScoutIndex === 0 ? goalieKit[teamName] : playerKit[teamName],
        };
      }
      setCurrentScoutIndex(currentScoutIndex + 1);
    }
  };

  const removePlayer = index => {
    const newPlayerInfo = playerInfo;

    newPlayerInfo[index] = {
      index,
      playerID: '',
      playerName: '',
      isCaptain: false,
      playerContent: '',
      shirtImage: unknownImage,
    };

    setPlayerInfo([...newPlayerInfo]);
  };

  const filterPlayers = pos => {
    // get id for position argument passed into pos variable...
    const positionID = positionData.find(
      ({ singular_name }) => singular_name.toLowerCase() === pos
    )?.id;

    const teamID = teamsData.find(({ name }) => name === chosenTeam)?.id;

    return chosenTeam === 'All Teams'
      ? playerData.filter(
          ({ element_type, id }) =>
            positionID === element_type && !playerInfo.some(({ playerID }) => playerID === id)
        )
      : playerData.filter(
          ({ element_type, team, id }) =>
            teamID === team &&
            positionID === element_type &&
            !playerInfo.some(({ playerID }) => playerID === id)
        );
  };

  const playersEnough = (pos, returnLength) => {
    const requiredNoOfPlayers = {
      goalkeeper: numberOfGoalkeepers,
      defender: numberOfDefenders,
      midfielder: numberOfMidfielders,
      forward: numberOfForwards,
    };
    const positionID = positionData.find(
      ({ singular_name }) => singular_name.toLowerCase() === pos
    )?.id;
    const teamID = teamsData.find(({ name }) => name === chosenTeam)?.id;

    if (chosenTeam === 'All Teams') {
      const filteredPlayersLength = playerData.filter(
        ({ element_type }) => element_type === positionID
      ).length;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    } else {
      const filteredPlayersLength = playerData.filter(
        ({ element_type, team }) => element_type === positionID && team === teamID
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
      const { isCaptain } = newPlayerInfo[index];
      const { team, web_name, id } = randomSelect(possiblePlayers);
      const teamName = teamsData.find(({ id }) => id === team)?.name;

      newPlayerInfo[index] = {
        index,
        isCaptain,
        playerID: id,
        playerName: web_name,
        shirtImage: index === 0 ? goalieKit[teamName] : playerKit[teamName],
        playerContent: findOpponentAbbreviation(team, nextOpponent, teamsData),
      };
      setPlayerInfo([...newPlayerInfo]);
    }
  };

  const captainHandler = index => {
    const newPlayerInfo = playerInfo;
    newPlayerInfo.forEach(
      player => (player.isCaptain = player.index === index && !player.isCaptain)
    );
    setPlayerInfo([...newPlayerInfo]);

    if (teamPredicted) predictPoints();
  };

  const closeAlert = () => setAlertVisible(false);

  const removeAll = () => {
    closeAlert();
    setTeamPredicted(false);
    playerInfo.forEach(({ index }) => removePlayer(index));
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
      const { playerID, isCaptain } = player;
      const { ep_next, ep_this } = findData(playerID, playerData);
      const predictedPoint = gameweekFinished ? ep_next : ep_this;

      player.playerContent = Math.round((isCaptain ? 2 : 1) * predictedPoint).toString();
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
    if (clicks % 5 === 0) showInterstitial();
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
    const defendersID = positionData.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'defender'
    )?.id;
    const midfieldersID = positionData.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'midfielder'
    )?.id;
    const forwardsID = positionData.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'forward'
    )?.id;

    // remove non-defenders
    const defEnd = 1 + numberOfDefenders;
    for (let i = 1; i < defEnd; i++) {
      const { playerID } = playerInfo[i];

      if (playerID && findPlayerInfo(playerID, 'element_type', playerData) !== defendersID) {
        removePlayer(i);
      }
    }

    // remove non-midfielders
    const midEnd = defEnd + numberOfMidfielders;
    for (let i = defEnd; i < midEnd; i++) {
      const { playerID } = playerInfo[i];

      if (playerID && findPlayerInfo(playerID, 'element_type', playerData) !== midfieldersID) {
        removePlayer(i);
      }
    }

    // remove non-forwards
    for (let i = midEnd; i < 11; i++) {
      const { playerID } = playerInfo[i];

      if (playerID && findPlayerInfo(playerID, 'element_type', playerData) !== forwardsID) {
        removePlayer(i);
      }
    }
  }, [numberOfDefenders, numberOfMidfielders, numberOfForwards]);

  return (
    <View style={{ ...styles.main, display: visible ? 'flex' : 'none' }}>
      <PlayerSelectModal
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
            Scout's Selection for {currentGWType} {currentGW}
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
          pickerEnabled={true}
          chosenTeam={chosenTeam}
          setChosenTeam={setChosenTeam}
          teams={['All Teams', ...teams]}
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
        {0.92 * (type === 'fantasy' ? 0.18 : 0.17) * 0.5 * DEVICE_HEIGHT >= DEFAULT_AD_HEIGHT ? (
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
  header: { width: '100%', alignItems: 'center', backgroundColor: colors.stratos },
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
  body: { width: '100%', height: '70%', backgroundColor: colors.stratos },
  imgViewStyle: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    paddingVertical: '5%',
    justifyContent: 'space-evenly',
  },
  admob: { width: '100%', height: '50%', backgroundColor: colors.alto },
  imageBg: {
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(PlayerScreen);
