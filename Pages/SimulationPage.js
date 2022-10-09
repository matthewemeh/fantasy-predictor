import React, { useEffect, useState, memo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { AdMobBanner, setTestDeviceIDAsync, AdMobInterstitial } from 'expo-ads-admob';

import AlertBox from '../components/AlertBox';

import Button from '../components/Button';
import PickerBox from '../components/PickerBox';
import FilterBar from '../components/FilterBar';
import PlayerFrame from '../components/PlayerFrame';
import SimulationBoard from '../components/SimulationBoard';
import PlayerSelectModal from '../components/PlayerSelectModal';

import { colors, fieldConstants } from '../constants';
import {
  player,
  findData,
  findFontSize,
  unknownImage,
  deviceHeight,
  randomSelect,
  findPlayerInfo,
  defaultAdHeight,
  descendingPointsOrder,
  findOpponentAbbreviation,
} from '../utilities';

const SimulationPage = ({
  teams,
  playerKit,
  goalieKit,
  playerData,
  fieldImage,
  nextOpponent,
  StandardRatings,
  TeamAbbreviations,
}) => {
  const initializeId = async () => await setTestDeviceIDAsync('EMULATOR');

  // componentDidMount
  useEffect(initializeId, []);

  const type = 'simulate';
  const { formations } = fieldConstants;
  const [clicks, setClicks] = useState(1);
  const [squad1, setSquad1] = useState([]);
  const [squad2, setSquad2] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [boardVisible, setBoardVisible] = useState(false);
  const [chosenTeam1, setChosenTeam1] = useState('All Teams');
  const [chosenTeam2, setChosenTeam2] = useState('All Teams');
  const [playerSelectVisible, setPlayerSelectVisible] = useState(false);
  const [simulateButtonEnabled, setSimulateButtonEnabled] = useState(false);
  const [alertComponents, setAlertComponents] = useState({
    title: '',
    message: '',
    buttons: [],
    onCloseAlert: null,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenFormation, setChosenFormation] = useState('4-4-2');
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [playerModalVisible1, setPlayerModalVisible1] = useState(false);
  const [playerModalVisible2, setPlayerModalVisible2] = useState(false);

  const numberOfGoalkeepers = 1;
  const [chosenTeam, setChosenTeam] = useState(chosenTeam1);
  const [numberOfDefenders, setNumberOfDefenders] = useState(4);
  const [numberOfMidfielders, setNumberOfMidfielders] = useState(4);
  const [numberOfForwards, setNumberOfForwards] = useState(2);
  const [chosenPosition, setChosenPosition] = useState('All Positions');
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

  useEffect(
    () => setSaveButtonEnabled(playerInfo.every(({ playerName }) => playerName)),
    [playerModalVisible1, saveButtonEnabled, playerInfo]
  );

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
    let requiredNoOfPlayers = {
      goalkeeper: numberOfGoalkeepers,
      defender: numberOfDefenders,
      midfielder: numberOfMidfielders,
      forward: numberOfForwards,
    };

    if (chosenTeam === 'All Teams') {
      return returnLength
        ? playerData.filter(({ position }) => position === pos).length
        : playerData.filter(({ position }) => position === pos).length >= requiredNoOfPlayers[pos];
    } else {
      return returnLength
        ? playerData.filter(({ position, team }) => position === pos && team === chosenTeam).length
        : playerData.filter(({ position, team }) => position === pos && team === chosenTeam)
            .length >= requiredNoOfPlayers[pos];
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

  const closeAlert = () => setAlertVisible(false);

  const removeSingle = index => {
    closeAlert();
    removePlayer(index);
  };

  const confirmRemoveSingle = (index, playerName) => {
    setAlertComponents({
      title: 'Confirm',
      message: `Do you want to remove ${playerName}?`,
      buttons: [
        { text: 'YES', onPress: () => removeSingle(index) },
        { text: 'NO', onPress: closeAlert },
      ],
      onCloseAlert: closeAlert,
    });
    setAlertVisible(true);
  };

  const removeAll = () => {
    closeAlert();
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

    addRandomPlayer('goalkeeper', 0);

    for (let i = 1; i < defEnd; i++) addRandomPlayer('defender', i);

    for (let i = midStart; i < midEnd; i++) addRandomPlayer('midfielder', i);

    for (let i = fwdStart; i < fwdEnd; i++) addRandomPlayer('forward', i);
  };

  const playerViewCommand = (pos, index) => {
    setChosenPosition(pos);
    setCurrentIndex(index);
    setPlayerModalVisible1(true);
  };

  const playerViewLongCommand = (playerName, index) => {
    if (playerName) {
      setCurrentIndex(index);
      confirmRemoveSingle(index, playerName);
    }
  };

  const findPlayerDetails = () =>
    playerInfo.map(({ playerKey }) => findData(playerKey, playerData));

  const save = () => {
    if (chosenTeam === chosenTeam1) {
      setSquad1(findPlayerDetails());
      ToastAndroid.show(`${chosenTeam}'s team saved`, 2000);
      playerInfo.forEach((player, index) => removePlayer(index));
      setChosenTeam(chosenTeam2);
    } else if (chosenTeam === chosenTeam2) {
      setSquad2(findPlayerDetails());
      ToastAndroid.show(`${chosenTeam}'s team saved`, 2000);
      playerInfo.forEach((player, index) => removePlayer(index));
      setPlayerSelectVisible(false);
    }
  };

  const teamEnough = teamName => {
    if (
      playerData.filter(({ team, position }) => team === teamName && position === 'goalkeeper')
        .length < 1
    ) {
      return false;
    } else if (
      playerData.filter(({ team, position }) => team === teamName && position === 'defender')
        .length < 4
    ) {
      return false;
    } else if (
      playerData.filter(({ team, position }) => team === teamName && position === 'midfielder')
        .length < 5
    ) {
      return false;
    } else if (
      playerData.filter(({ team, position }) => team === teamName && position === 'forward')
        .length < 1
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (chosenTeam1 !== 'All Teams' && chosenTeam2 !== 'All Teams' && chosenTeam1 !== chosenTeam2) {
      setSquad1(getTeam(chosenTeam1));
      setSquad2(getTeam(chosenTeam2));
    } else {
      setSquad1([]);
      setSquad2([]);
    }
  }, [chosenTeam1, chosenTeam2]);

  useEffect(() => {
    if (squad1.length === 11 && squad2.length === 11) setSimulateButtonEnabled(true);
    else setSimulateButtonEnabled(false);
  }, [squad1, squad2]);

  const findBestFormation = teamName => {
    return playerData.filter(({ team, position }) => team === teamName && position === 'forward')
      .length >= 2
      ? '4-4-2'
      : '4-5-1';
  };

  const getTeam = teamName => {
    let squad = [];
    const formation = findBestFormation(teamName);

    if (teamEnough(teamName)) {
      const bestGoalies = playerData
        .filter(({ team, position }) => team === teamName && position === 'goalkeeper')
        .sort(descendingPointsOrder);
      const bestDefenders = playerData
        .filter(({ team, position }) => team === teamName && position === 'defender')
        .sort(descendingPointsOrder);
      const bestMidfielders = playerData
        .filter(({ team, position }) => team === teamName && position === 'midfielder')
        .sort(descendingPointsOrder);
      const bestForwards = playerData
        .filter(({ team, position }) => team === teamName && position === 'forward')
        .sort(descendingPointsOrder);

      squad.push(bestGoalies[0]);
      squad.push(...bestDefenders.slice(0, parseInt(formation.charAt(0))));
      squad.push(...bestMidfielders.slice(0, parseInt(formation.charAt(2))));
      squad.push(...bestForwards.slice(0, parseInt(formation.charAt(4))));

      return squad;
    }

    return squad;
  };

  const onSelectModalClose = () => {
    setPlayerSelectVisible(false);
    playerInfo.forEach((player, index) => removePlayer(index));
    setChosenTeam(chosenTeam1);
  };

  useEffect(() => {
    if (clicks % 4 === 0 && !boardVisible) showInterstitial();
  }, [clicks, boardVisible]);

  const openBoard = () => {
    setBoardVisible(true);
    setClicks(clicks + 1);
  };

  const onSelectPlayer = playerKey => {
    let newSquad;

    if (chosenTeam === chosenTeam1) {
      newSquad = squad1;
      newSquad[currentIndex] = findData(playerKey, playerData);
      setSquad1([...newSquad]);
    } else if (chosenTeam === chosenTeam2) {
      newSquad = squad2;
      newSquad[currentIndex] = findData(playerKey, playerData);
      setSquad2([...newSquad]);
    }
  };

  const chooseSquad = () => {
    setChosenTeam(chosenTeam1);
    setPlayerSelectVisible(true);
  };

  const playerCommand = (team, playerKey, index) => {
    const { position } = findData(playerKey, playerData);
    setChosenTeam(team);
    setCurrentIndex(index);
    setChosenPosition(`${position}s`);
    setPlayerModalVisible2(true);
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
    <View style={styles.main}>
      <Modal visible={playerSelectVisible} onRequestClose={onSelectModalClose} transparent={true}>
        <View style={styles.mainSelect}>
          <PlayerSelectModal
            teams={teams}
            playerKit={playerKit}
            goalieKit={goalieKit}
            playerData={playerData}
            playerInfo={playerInfo}
            chosenTeam={chosenTeam}
            posPickerEnabled={false}
            teamPickerEnabled={false}
            currentIndex={currentIndex}
            nextOpponent={nextOpponent}
            visible={playerModalVisible1}
            setChosenTeam={setChosenTeam}
            chosenPosition={chosenPosition}
            TeamAbbreviations={TeamAbbreviations}
            setChosenPosition={setChosenPosition}
            key={chosenPosition.concat(chosenTeam)}
            setPlayerModalVisible={setPlayerModalVisible1}
          />

          <AlertBox
            visible={alertVisible}
            title={alertComponents.title}
            message={alertComponents.message}
            buttons={alertComponents.buttons}
            onRequestClose={alertComponents.onCloseAlert}
          />

          <View style={styles.headerSelect}>
            <PickerBox
              enabled={true}
              list={formations}
              selectedValue={chosenFormation}
              selectedItemHandler={setChosenFormation}
              extraStyles={{ width: '30%', height: '50%' }}
            />
          </View>

          <View style={styles.bodySelect}>
            <ImageBackground
              imageStyle={styles.imageBackgroundStyle}
              source={
                typeof fieldImage == 'string'
                  ? { uri: fieldImage, headers: { Accept: '*/*' } }
                  : fieldImage
              }
              style={styles.imgViewStyle}
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
              pickerEnabled={false}
              chosenTeam={chosenTeam}
              setChosenTeam={setChosenTeam}
              confirmRemoveAll={confirmRemoveAll}
              randomizePlayers={randomizePlayers}
            />
          </View>

          <View style={styles.admobContainer}>
            {0.23 * 0.5 * deviceHeight >= defaultAdHeight ? (
              <AdMobBanner
                style={styles.admobView}
                servePersonalizedAds={true}
                bannerSize='smartBannerLandscape'
                onDidFailToReceiveAdWithError={null}
                adUnitID='ca-app-pub-7152054343360573/9830430705'
              />
            ) : (
              <View style={styles.admobView} />
            )}
            <View style={styles.bottomView}>
              <Button
                command={save}
                buttonText='Save'
                enabled={saveButtonEnabled}
                buttonColor={colors.forward}
                buttonTextColor={colors.white}
                extraStyles={{ width: '90%', height: '60%' }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <PlayerSelectModal
        teams={teams}
        playerKit={playerKit}
        goalieKit={goalieKit}
        playerData={playerData}
        chosenTeam={chosenTeam}
        posPickerEnabled={false}
        teamPickerEnabled={false}
        nextOpponent={nextOpponent}
        currentIndex={currentIndex}
        visible={playerModalVisible2}
        setChosenTeam={setChosenTeam}
        chosenPosition={chosenPosition}
        onSelectPlayer={onSelectPlayer}
        TeamAbbreviations={TeamAbbreviations}
        setChosenPosition={setChosenPosition}
        key={chosenPosition.concat(chosenTeam)}
        setPlayerModalVisible={setPlayerModalVisible2}
        playerInfo={chosenTeam === chosenTeam1 ? squad1 : squad2}
      />

      <SimulationBoard
        squad1={squad1}
        squad2={squad2}
        visible={boardVisible}
        playerData={playerData}
        teamName1={chosenTeam1}
        teamName2={chosenTeam2}
        setBoardVisible={setBoardVisible}
        StandardRatings={StandardRatings}
        TeamAbbreviations={TeamAbbreviations}
      />

      <View style={styles.header}>
        <PickerBox
          enabled={true}
          list={teams.sort()}
          selectedValue={chosenTeam1}
          extraStyles={{ width: '45%' }}
          selectedItemHandler={setChosenTeam1}
          extraListStyles={{ top: '1.5%', left: '5%', width: '40.3%', marginBottom: '35%' }}
        />

        <Text allowFontScaling={false} style={styles.textStyle}>
          Vs
        </Text>

        <PickerBox
          enabled={true}
          list={teams.sort()}
          selectedValue={chosenTeam2}
          extraStyles={{ width: '45%' }}
          selectedItemHandler={setChosenTeam2}
          extraListStyles={{ top: '1.5%', left: '54.6%', width: '40.5%', marginBottom: '35%' }}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.chooseSquadButton}>
          <Button
            command={chooseSquad}
            buttonText='Choose Squads'
            buttonColor={colors.secondary}
            buttonTextColor={colors.white}
            extraStyles={{ width: '95%' }}
            enabled={simulateButtonEnabled}
            extraTextStyles={{ fontSize: findFontSize(15) }}
          />
        </View>

        <View style={styles.squadView}>
          <View style={{ ...styles.listStyle, paddingRight: '0.5%' }}>
            {squad1.map(({ key }, index) => (
              <TouchableOpacity
                key={key}
                activeOpacity={0.6}
                onPress={() => playerCommand(chosenTeam1, key, index)}
                style={{ ...styles.touchView, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                <Text allowFontScaling={false} style={styles.textStyle2}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ ...styles.listStyle, paddingLeft: '0.5%' }}>
            {squad2.map(({ key }, index) => (
              <TouchableOpacity
                key={key}
                activeOpacity={0.6}
                onPress={() => playerCommand(chosenTeam2, key, index)}
                style={{ ...styles.touchView, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <Text allowFontScaling={false} style={styles.textStyle2}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          command={openBoard}
          buttonText='SIMULATE'
          buttonColor={colors.secondary}
          buttonTextColor={colors.white}
          extraStyles={{ width: '40%' }}
          enabled={simulateButtonEnabled}
          extraTextStyles={{ fontSize: findFontSize(17) }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { width: '100%', height: '92%' },
  header: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    backgroundColor: colors.forward,
  },
  body: { width: '100%', height: '80%', backgroundColor: colors.white },
  footer: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  textStyle: {
    width: '10%',
    height: '70%',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
  },
  chooseSquadButton: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadView: {
    width: '100%',
    height: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle: { width: '47.5%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  touchView: {
    width: '97%',
    height: '8%',
    borderRadius: 5,
    marginVertical: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skyBlue,
  },
  textStyle2: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: colors.darkBlue,
    fontSize: findFontSize(12),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },

  //styles for inbuilt player SelectPage
  mainSelect: { width: '100%', height: '100%', backgroundColor: colors.white, elevation: 10 },
  headerSelect: {
    width: '100%',
    height: '12%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  bodySelect: { width: '100%', height: '65%', backgroundColor: colors.secondary },
  bottomView: { width: '100%', height: '50%', alignItems: 'center', justifyContent: 'center' },
  imgViewStyle: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    paddingVertical: '5%',
    justifyContent: 'space-evenly',
  },
  imageBackgroundStyle: {
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  admobView: {
    width: '100%',
    height: '50%',
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  admobContainer: { width: '100%', height: '23%', alignItems: 'center', justifyContent: 'center' },
});

export default memo(SimulationPage);
