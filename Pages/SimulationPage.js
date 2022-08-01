import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { AdMobBanner, setTestDeviceIDAsync, AdMobInterstitial } from 'expo-ads-admob';
import AlertBox from '../components/AlertBox';

import { colors, fieldConstants } from '../constants';
import Button from '../components/Button';
import SimulationBoard from './SimulationBoard';
import PickerBox, { getSelectedItem } from '../components/PickerBox';
import PlayerView from '../components/PlayerView';
import PlayerSelectModal, {
  getPlayerData,
  getChosenPosition,
  getChosenTeam,
} from '../components/PlayerSelectModal';
import {
  findOpponentAbbreviation,
  findPlayerInfo,
  descendingPointsOrder,
  getRndInteger,
  unknownImage,
  player,
  capitalize,
  findFontSize,
  deviceHeight,
  defaultAdHeight,
} from '../utilities';

function SimulationPage({
  teams,
  playerKit,
  goalieKit,
  playerData,
  fieldImage,
  nextOpponent,
  StandardRatings,
  TeamAbbreviations,
}) {
  async function initializeId() {
    await setTestDeviceIDAsync('EMULATOR');
  }
  useEffect(initializeId, []);

  const [clicks, setClicks] = useState(1);
  const [chosenTeam1, setChosenTeam1] = useState('All Teams');
  const [chosenTeam2, setChosenTeam2] = useState('All Teams');
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [boardState, setBoardState] = useState(false);
  const [simulationButtonState, setSimulationButtonState] = useState(false);
  const [playerSelectState, setPlayerSelectState] = useState(false);
  const [alertState, setAlertState] = useState(false);
  const [alertComponents, setAlertComponents] = useState({
    title: '',
    message: '',
    buttons: [],
    onCloseAlert: null,
  });

  const [chosenFormation, setChosenFormation] = useState('4-4-2');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [playerModalState, setPlayerModalState] = useState(false);
  const [playerModalState2, setPlayerModalState2] = useState(false);
  const [saveButtonState, setSaveButtonState] = useState(false);
  const [chosenTeam, setChosenTeam] = useState(chosenTeam1);
  const [chosenPosition, setChosenPosition] = useState('All Positions');
  const numberOfGoalkeepers = 1;
  const [numberOfDefenders, setNumberOfDefenders] = useState(4);
  const [numberOfMidfielders, setNumberOfMidfielders] = useState(4);
  const [numberOfForwards, setNumberOfForwards] = useState(2);
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
    () => setSaveButtonState(!playerInfo.some(item => item.playerName === '')),
    [playerModalState, saveButtonState, playerInfo]
  );

  function removePlayer(index) {
    playerInfo[index] = {
      playerName: '',
      playerKey: '',
      key: index,
      shirtImage: unknownImage,
      playerContent: '',
    };
  }

  function filterPlayers(pos) {
    if (chosenTeam === 'All Teams')
      return playerData.filter(
        item => item.position === pos && !playerInfo.some(player => player.playerKey === item.key)
      );

    return playerData.filter(
      item =>
        item.position === pos &&
        item.team === chosenTeam &&
        !playerInfo.some(player => player.playerKey === item.key)
    );
  }

  function playersEnough(pos, returnLength) {
    let requiredNoOfPlayers = {
      goalkeeper: numberOfGoalkeepers,
      defender: numberOfDefenders,
      midfielder: numberOfMidfielders,
      forward: numberOfForwards,
    };
    if (chosenTeam === 'All Teams') {
      if (returnLength) return playerData.filter(item => item.position === pos).length;
      return playerData.filter(item => item.position === pos).length >= requiredNoOfPlayers[pos];
    } else {
      if (returnLength)
        return playerData.filter(item => item.position === pos && item.team === chosenTeam).length;
      return (
        playerData.filter(item => item.position === pos && item.team === chosenTeam).length >=
        requiredNoOfPlayers[pos]
      );
    }
  }

  function addRandomPlayer(pos, index) {
    let possiblePlayers = filterPlayers(pos);
    let indexPos = getRndInteger(0, possiblePlayers.length);
    let team = possiblePlayers[indexPos].team;
    playerInfo[index] = {
      playerName: possiblePlayers[indexPos].playerName,
      playerKey: possiblePlayers[indexPos].key,
      key: index,
      shirtImage: index != 0 ? playerKit[team] : goalieKit[team],
      playerContent: findOpponentAbbreviation(team, nextOpponent, TeamAbbreviations),
    };
  }

  function closeAlert() {
    setAlertState(false);
  }

  function removeSingle(index) {
    closeAlert();
    setPlayerModalState(true);
    removePlayer(index);
    setPlayerModalState(false);
    setSaveButtonState(false);
  }

  function removePlayerHandler(index, playerName) {
    setAlertComponents({
      title: 'Confirm',
      message: `Do you want to remove ${playerName}?`,
      buttons: [
        ['YES', () => removeSingle(index)],
        ['NO', closeAlert],
      ],
      onCloseAlert: closeAlert,
    });
    setAlertState(true);
  }

  function removeAll() {
    closeAlert();
    setPlayerModalState(true);
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
    setPlayerModalState(false);
    setSaveButtonState(false);
  }

  function removeAllPlayers() {
    if (playerInfo.some(player => player.playerName.length > 0)) {
      setAlertComponents({
        title: 'Confirm',
        message: 'Are you sure you want to delete team?',
        buttons: [
          ['YES', removeAll],
          ['NO', closeAlert],
        ],
        onCloseAlert: closeAlert,
      });
      setAlertState(true);
    }
  }

  function changeFormationHandler(formation) {
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);

    setSaveButtonState(false);
    setNumberOfDefenders(parseInt(formation.charAt(0)));
    setNumberOfMidfielders(parseInt(formation.charAt(2)));
    setNumberOfForwards(parseInt(formation.charAt(4)));
  }

  function randomizePlayers() {
    // remove all players first
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
    setSaveButtonState(!saveButtonState);

    // randomize players

    // goalkeepers
    addRandomPlayer('goalkeeper', 0);

    // defenders
    if (playersEnough('defender', false)) {
      for (let i = 1; i < 1 + numberOfDefenders; i++) addRandomPlayer('defender', i);
      setSaveButtonState(!saveButtonState);
    } else {
      for (let i = 1; i < 1 + playersEnough('defender', true); i++) addRandomPlayer('defender', i);
      setSaveButtonState(!saveButtonState);
    }

    // midfielders
    if (playersEnough('midfielder', false)) {
      for (let i = 1 + numberOfDefenders; i < 1 + numberOfDefenders + numberOfMidfielders; i++)
        addRandomPlayer('midfielder', i);
      setSaveButtonState(!saveButtonState);
    } else {
      for (
        let i = 1 + numberOfDefenders;
        i < 1 + numberOfDefenders + playersEnough('midfielder', true);
        i++
      )
        addRandomPlayer('midfielder', i);
      setSaveButtonState(!saveButtonState);
    }

    // forwards
    if (playersEnough('forward', false)) {
      for (let i = 1 + numberOfDefenders + numberOfMidfielders; i < 11; i++)
        addRandomPlayer('forward', i);
      setSaveButtonState(!saveButtonState);
    } else {
      for (
        let i = 1 + numberOfDefenders + numberOfMidfielders;
        i < 1 + numberOfDefenders + numberOfMidfielders + playersEnough('forward', true);
        i++
      )
        addRandomPlayer('forward', i);
      setSaveButtonState(!saveButtonState);
    }
    setSaveButtonState(!saveButtonState);
  }

  function playerViewCommand(pos, index) {
    setCurrentIndex(index);
    setPlayerModalState(true);
    setChosenPosition(pos);
  }

  function playerViewLongCommand(playerName, index) {
    if (playerName !== '') {
      setCurrentIndex(index);
      removePlayerHandler(index, playerName);
    }
  }

  function buildGoalkeeperFrame() {
    return (
      <View style={styles.playerFrame}>
        <PlayerView
          key={playerInfo[0].key}
          imgVal={playerInfo[0].shirtImage}
          playerName={playerInfo[0].playerName}
          playerContent={playerInfo[0].playerContent}
          available={findPlayerInfo(playerInfo[0].playerKey, 'available', playerData)}
          command={() => playerViewCommand('Goalkeepers', playerInfo[0].key)}
          longCommand={() => playerViewLongCommand(playerInfo[0].playerName, playerInfo[0].key)}
        />
      </View>
    );
  }

  function buildDefenderFrame() {
    let data = [];
    for (let i = numberOfGoalkeepers; i < numberOfGoalkeepers + numberOfDefenders; i++) {
      data.push(playerInfo[i]);
    }
    return (
      <View style={styles.playerFrame}>
        {data.map(player => {
          return (
            <PlayerView
              key={player.key}
              imgVal={player.shirtImage}
              playerName={player.playerName}
              playerContent={player.playerContent}
              available={findPlayerInfo(player.playerKey, 'available', playerData)}
              command={() => playerViewCommand('Defenders', player.key)}
              longCommand={() => playerViewLongCommand(player.playerName, player.key)}
            />
          );
        })}
      </View>
    );
  }

  function buildMidfielderFrame() {
    let data = [];
    for (
      let i = numberOfGoalkeepers + numberOfDefenders;
      i < numberOfGoalkeepers + numberOfDefenders + numberOfMidfielders;
      i++
    ) {
      data.push(playerInfo[i]);
    }
    return (
      <View style={styles.playerFrame}>
        {data.map(player => {
          return (
            <PlayerView
              key={player.key}
              imgVal={player.shirtImage}
              playerName={player.playerName}
              playerContent={player.playerContent}
              available={findPlayerInfo(player.playerKey, 'available', playerData)}
              command={() => playerViewCommand('Midfielders', player.key)}
              longCommand={() => playerViewLongCommand(player.playerName, player.key)}
            />
          );
        })}
      </View>
    );
  }

  function buildForwardFrame() {
    let data = [];
    for (let i = numberOfGoalkeepers + numberOfDefenders + numberOfMidfielders; i < 11; i++) {
      data.push(playerInfo[i]);
    }
    return (
      <View style={styles.playerFrame}>
        {data.map(player => {
          return (
            <PlayerView
              key={player.key}
              imgVal={player.shirtImage}
              playerName={player.playerName}
              playerContent={player.playerContent}
              available={findPlayerInfo(player.playerKey, 'available', playerData)}
              command={() => playerViewCommand('Forwards', player.key)}
              longCommand={() => playerViewLongCommand(player.playerName, player.key)}
            />
          );
        })}
      </View>
    );
  }

  function buildFilter() {
    return (
      <View style={styles.filterView}>
        <View style={styles.iconView}>
          <Icon
            name='random'
            type='font-awesome'
            size={findFontSize(25)}
            color={colors.primary}
            onPress={randomizePlayers}
          />
        </View>

        <View
          style={{ width: '70%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <PickerBox
            selectedValue={chosenTeam}
            extraStyles={{ width: '55%', height: '80%' }}
            enabled={false}
            list={teams.sort()}
            onPickerClose={() => setChosenTeam(getSelectedItem())}
          />
        </View>
        <View style={styles.iconView}>
          <Icon
            name='trash'
            type='font-awesome'
            size={findFontSize(25)}
            color={colors.primary}
            onPress={removeAllPlayers}
          />
        </View>
      </View>
    );
  }

  function findPlayerKeys() {
    let tempData = [];
    playerInfo.forEach(player =>
      tempData.push(playerData.find(item => item.key === player.playerKey))
    );
    return tempData;
  }

  function saveButtonHandler() {
    if (chosenTeam === chosenTeam1) {
      setTeam1(findPlayerKeys());
      ToastAndroid.show('Team saved', 2000);
      for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
      setSaveButtonState(false);
      setChosenTeam(chosenTeam2);
    } else if (chosenTeam === chosenTeam2) {
      setTeam2(findPlayerKeys());
      ToastAndroid.show('Team saved', 2000);
      for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
      setSaveButtonState(false);
      setPlayerSelectState(false);
    }
  }

  function buildBottomView() {
    return (
      <Button
        enabled={saveButtonState}
        command={saveButtonHandler}
        buttonColor={colors.forward}
        buttonTextColor={colors.white}
        buttonText={'Save'}
        extraStyles={{ width: '90%', height: '60%' }}
      />
    );
  }

  useEffect(() => {
    if (chosenTeam1 !== 'All Teams' && chosenTeam2 !== 'All Teams' && chosenTeam1 !== chosenTeam2) {
      setTeam1(getTeam(chosenTeam1));
      setTeam2(getTeam(chosenTeam2));
      setSimulationButtonState(true);
    } else {
      setTeam1([]);
      setTeam2([]);
      setSimulationButtonState(false);
    }
  }, [chosenTeam1, chosenTeam2]);

  function findBestFormation(teamName) {
    return playerData.filter(player => player.team === teamName && player.position === 'forward')
      .length >= 2
      ? '4-4-2'
      : '4-5-1';
  }

  function getTeam(teamName) {
    let squad = [];
    let formation = findBestFormation(teamName);
    let bestGoalies = playerData
      .filter(player => player.team === teamName && player.position === 'goalkeeper')
      .sort(descendingPointsOrder);
    let bestDefenders = playerData
      .filter(player => player.team === teamName && player.position === 'defender')
      .sort(descendingPointsOrder);
    let bestMidfielders = playerData
      .filter(player => player.team === teamName && player.position === 'midfielder')
      .sort(descendingPointsOrder);
    let bestForwards = playerData
      .filter(player => player.team === teamName && player.position === 'forward')
      .sort(descendingPointsOrder);
    squad.push(bestGoalies[0]);
    squad.push(...bestDefenders.slice(0, parseInt(formation.charAt(0))));
    squad.push(...bestMidfielders.slice(0, parseInt(formation.charAt(2))));
    squad.push(...bestForwards.slice(0, parseInt(formation.charAt(4))));
    return squad;
  }

  function onClose1() {
    setPlayerModalState(false);
  }

  function onClose2() {
    setPlayerModalState2(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
  }

  function closeBoard() {
    setBoardState(false);
  }

  function onSelectModalClose() {
    setPlayerSelectState(false);
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
    setChosenTeam(chosenTeam1);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
    setSaveButtonState(false);
  }

  useEffect(() => {
    if (clicks % 4 === 0 && !boardState) showInterstitial();
  }, [clicks, boardState]);

  function openBoard() {
    setBoardState(true);
    setClicks(clicks + 1);
  }

  function onSelect1() {
    playerInfo[currentIndex] = getPlayerData();
    setPlayerModalState(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
  }

  function onSelect2() {
    setPlayerModalState2(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
    let newKey = getPlayerData().playerKey;
    if (chosenTeam === chosenTeam1) {
      for (let i = 0; i < team1.length; i++) {
        if (team1[i].key === currentKey) {
          team1[i] = {
            available: findPlayerInfo(newKey, 'available', playerData),
            id: findPlayerInfo(newKey, 'id', playerData),
            index: findPlayerInfo(newKey, 'index', playerData),
            key: newKey,
            playerName: findPlayerInfo(newKey, 'playerName', playerData),
            points: findPlayerInfo(newKey, 'points', playerData),
            position: findPlayerInfo(newKey, 'position', playerData),
            team: findPlayerInfo(newKey, 'team', playerData),
          };
        }
      }
    } else if (chosenTeam === chosenTeam2) {
      for (let i = 0; i < team2.length; i++) {
        if (team2[i].key === currentKey) {
          team2[i] = {
            available: findPlayerInfo(newKey, 'available', playerData),
            id: findPlayerInfo(newKey, 'id', playerData),
            index: findPlayerInfo(newKey, 'index', playerData),
            key: newKey,
            playerName: findPlayerInfo(newKey, 'playerName', playerData),
            points: findPlayerInfo(newKey, 'points', playerData),
            position: findPlayerInfo(newKey, 'position', playerData),
            team: findPlayerInfo(newKey, 'team', playerData),
          };
        }
      }
    }
  }

  function chooseSquad() {
    setChosenTeam(chosenTeam1);
    setPlayerSelectState(true);
  }

  function playerCommand(team, key) {
    setChosenTeam(team);
    setCurrentKey(key);
    setChosenPosition(`${capitalize(playerData.find(item => item.key === key).position)}s`);
    setPlayerModalState2(true);
  }

  async function showInterstitial() {
    await AdMobInterstitial.setAdUnitID('ca-app-pub-7152054343360573/2734540598');
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true }).catch(err => null);
    await AdMobInterstitial.showAdAsync().catch(err => null);
  }

  return (
    <View style={styles.mainView}>
      <Modal visible={playerSelectState} onRequestClose={onSelectModalClose} transparent={true}>
        <View style={styles.mainViewSelect}>
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
            onRequestClose={onClose1}
            onSelectPlayer={onSelect1}
            posPickerEnabled={false}
            teamPickerEnabled={false}
            key={`${chosenPosition}${chosenTeam}`}
          />
          <AlertBox
            visible={alertState}
            title={alertComponents.title}
            message={alertComponents.message}
            buttons={alertComponents.buttons}
            onRequestClose={alertComponents.onCloseAlert}
          />
          <View style={styles.headerViewSelect}>
            <PickerBox
              selectedValue={chosenFormation}
              extraStyles={{ width: '30%', height: '50%' }}
              enabled={true}
              list={fieldConstants.formations}
              onPickerClose={() => {
                let selectedValue = getSelectedItem();
                setChosenFormation(selectedValue);
                changeFormationHandler(selectedValue);
              }}
            />
          </View>
          <View style={styles.bodyViewSelect}>
            <ImageBackground
              imageStyle={styles.imageBackgroundStyle}
              source={
                typeof fieldImage == 'string'
                  ? { uri: fieldImage, headers: { Accept: '*/*' } }
                  : fieldImage
              }
              style={styles.imgViewStyle}
            >
              {buildGoalkeeperFrame()}
              {buildDefenderFrame()}
              {buildMidfielderFrame()}
              {buildForwardFrame()}
            </ImageBackground>
            {buildFilter()}
          </View>
          <View style={styles.admobContainer}>
            {0.23 * 0.5 * deviceHeight >= defaultAdHeight ? (
              <AdMobBanner
                style={styles.admobView}
                bannerSize='smartBannerLandscape'
                servePersonalizedAds={true}
                adUnitID='ca-app-pub-7152054343360573/9830430705'
                onDidFailToReceiveAdWithError={null}
              />
            ) : (
              <View style={styles.admobView} />
            )}
            <View style={styles.bottomView}>{buildBottomView()}</View>
          </View>
        </View>
      </Modal>

      <PlayerSelectModal
        visible={playerModalState2}
        currentIndex={currentIndex}
        teams={teams}
        playerKit={playerKit}
        goalieKit={goalieKit}
        playerData={playerData}
        playerInfo={chosenTeam === chosenTeam1 ? team1 : team2}
        nextOpponent={nextOpponent}
        TeamAbbreviations={TeamAbbreviations}
        chosenPosition={chosenPosition}
        chosenTeam={chosenTeam}
        onRequestClose={onClose2}
        onSelectPlayer={onSelect2}
        posPickerEnabled={false}
        teamPickerEnabled={false}
        key={`${chosenPosition}${chosenTeam}`}
      />

      <SimulationBoard
        team1={team1}
        team2={team2}
        playerData={playerData}
        TeamAbbreviations={TeamAbbreviations}
        StandardRatings={StandardRatings}
        visible={boardState}
        teamName1={chosenTeam1}
        teamName2={chosenTeam2}
        onRequestClose={closeBoard}
      />

      <View style={styles.headerView}>
        <PickerBox
          selectedValue={chosenTeam1}
          extraStyles={{ width: '45%' }}
          enabled={playerData.length > 0}
          list={teams.sort()}
          extraListStyles={{ top: '1.5%', left: '5%', width: '40.3%', marginBottom: '35%' }}
          onPickerClose={() => setChosenTeam1(getSelectedItem())}
        />
        <Text allowFontScaling={false} style={styles.textStyle}>
          Vs
        </Text>
        <PickerBox
          selectedValue={chosenTeam2}
          extraStyles={{ width: '45%' }}
          enabled={playerData.length > 0}
          list={teams.sort()}
          extraListStyles={{ top: '1.5%', left: '54.6%', width: '40.5%', marginBottom: '35%' }}
          onPickerClose={() => setChosenTeam2(getSelectedItem())}
        />
      </View>
      <View style={styles.bodyView}>
        <View style={styles.chooseSquadButton}>
          <Button
            enabled={simulationButtonState}
            command={chooseSquad}
            buttonColor={colors.secondary}
            buttonTextColor={colors.white}
            buttonText={'Choose Squads'}
            extraStyles={{ width: '95%' }}
            extraTextStyles={{ fontSize: findFontSize(15) }}
          />
        </View>
        <View style={styles.squadView}>
          <View style={{ ...styles.listStyle, paddingRight: '0.5%' }}>
            {team1.map(player => (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{ ...styles.touchView, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                key={player.key}
                onPress={() => playerCommand(chosenTeam1, player.key)}
              >
                <Text allowFontScaling={false} style={styles.textStyle2}>
                  {player.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ ...styles.listStyle, paddingLeft: '0.5%' }}>
            {team2.map(player => (
              <TouchableOpacity
                activeOpacity={0.6}
                style={{ ...styles.touchView, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                key={player.key}
                onPress={() => playerCommand(chosenTeam2, player.key)}
              >
                <Text allowFontScaling={false} style={styles.textStyle2}>
                  {player.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footerView}>
        <Button
          enabled={simulationButtonState}
          command={openBoard}
          buttonColor={colors.secondary}
          buttonText={'SIMULATE'}
          buttonTextColor={colors.white}
          extraStyles={{ width: '40%' }}
          extraTextStyles={{ fontSize: findFontSize(17) }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '100%', height: '92%' },
  headerView: {
    flexDirection: 'row',
    width: '100%',
    height: '10%',
    backgroundColor: colors.forward,
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  bodyView: { width: '100%', height: '80%', backgroundColor: colors.white },
  footerView: {
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
    textAlignVertical: 'center',
    fontSize: findFontSize(13),
    fontFamily: 'PoppinsBold',
  },
  chooseSquadButton: {
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squadView: {
    flexDirection: 'row',
    width: '100%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStyle: { width: '47.5%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  touchView: {
    width: '97%',
    height: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '1%',
    borderRadius: 5,
    backgroundColor: colors.skyBlue,
  },
  textStyle2: {
    width: '100%',
    height: '100%',
    textAlignVertical: 'center',
    textAlign: 'center',
    color: colors.darkBlue,
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(12),
  },

  //styles for inbuilt player SelectPage
  mainViewSelect: { width: '100%', height: '100%', backgroundColor: colors.white, elevation: 10 },
  headerViewSelect: {
    width: '100%',
    height: '12%',
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyViewSelect: { width: '100%', height: '65%', backgroundColor: colors.secondary },
  bottomView: { width: '100%', height: '50%', alignItems: 'center', justifyContent: 'center' },
  imgViewStyle: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: '5%',
  },
  playerFrame: {
    flexDirection: 'row',
    width: '100%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  filterView: {
    flexDirection: 'row',
    width: '100%',
    height: '10%',
    paddingHorizontal: '2%',
    backgroundColor: colors.secondary,
  },
  iconView: { width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  imageBackgroundStyle: {
    resizeMode: 'cover',
    width: undefined,
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center',
  },
  admobContainer: { width: '100%', height: '23%', alignItems: 'center', justifyContent: 'center' },
  admobView: { width: '100%', height: '50%', backgroundColor: colors.grey },
});

export default React.memo(SimulationPage);
