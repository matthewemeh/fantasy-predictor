import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { AdMobBanner, setTestDeviceIDAsync, AdMobInterstitial } from 'expo-ads-admob';
import { Icon } from 'react-native-elements';

import { colors, fieldConstants } from '../constants';
import PlayerView from '../components/PlayerView';
import Button from '../components/Button';
import PickerBox, { getSelectedItem } from '../components/PickerBox';
import NumberTab from '../components/NumberTab';
import AlertBox from '../components/AlertBox';
import PlayerSelectModal, {
  getPlayerData,
  getChosenPosition,
  getChosenTeam,
} from '../components/PlayerSelectModal';
import {
  predict,
  findOpponentAbbreviation,
  getRndInteger,
  sumOfPoints,
  averageOfPoints,
  highestPoint,
  findData,
  findPlayerInfo,
  unknownImage,
  player,
  findFontSize,
  deviceHeight,
  defaultAdHeight,
} from '../utilities';

function PlayerPage({
  type,
  teams,
  playerKit,
  goalieKit,
  currentGW,
  selections,
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

  const [chosenFormation, setChosenFormation] = useState(
    type === 'fantasy' ? '4-4-2' : selections.formation
  );
  const [alertState, setAlertState] = useState(false);
  const [alertComponents, setAlertComponents] = useState({
    title: '',
    message: '',
    buttons: [],
    onCloseAlert: null,
  });
  const [revealButtonState, setRevealButtonState] = useState(false);
  const [currentScoutIndex, setCurrentScoutIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerModalState, setPlayerModalState] = useState(false);
  const [predictButtonState, setPredictButtonState] = useState(false);
  const [teamPredicted, setTeamPredicted] = useState(false);
  const [chosenTeam, setChosenTeam] = useState('All Teams');
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

  const [clicks, setClicks] = useState(1);

  useEffect(
    () => setPredictButtonState(!playerInfo.some(item => item.playerName === '')),
    [playerModalState, predictButtonState, playerInfo]
  );

  useEffect(() => {
    if (type !== 'fantasy') changeFormationHandler(chosenFormation);
  }, [type]);

  useEffect(() => {
    const timer = setTimeout(fillPlayers, 500);
    return () => clearTimeout(timer);
  }, [revealButtonState, currentScoutIndex]);

  useEffect(() => {
    if (currentScoutIndex === 11) {
      let tempData = playerData.find(
        player => player.key === selections.players[selections.captainIndex]
      );
      if (!tempData) return;
      playerInfo[selections.captainIndex] = {
        playerName: tempData.playerName,
        playerKey: tempData.key,
        key: selections.captainIndex,
        shirtImage:
          selections.captainIndex === 0 ? goalieKit[tempData.team] : playerKit[tempData.team],
        playerContent: findOpponentAbbreviation(tempData.team, nextOpponent, TeamAbbreviations),
        captain: true,
      };
      setPlayerModalState(currentIndex + 1);
    }
  }, [currentScoutIndex]);

  function fillPlayers() {
    if (revealButtonState && currentScoutIndex < selections.players.length) {
      let tempData = playerData.find(
        player => player.key === selections.players[currentScoutIndex]
      );
      if (tempData) {
        playerInfo[currentScoutIndex] = {
          playerName: tempData.playerName,
          playerKey: tempData.key,
          key: currentScoutIndex,
          shirtImage: currentScoutIndex === 0 ? goalieKit[tempData.team] : playerKit[tempData.team],
          playerContent: findOpponentAbbreviation(tempData.team, nextOpponent, TeamAbbreviations),
          captain: false,
        };
      }
      setCurrentScoutIndex(currentScoutIndex + 1);
    }
  }

  function removePlayer(index) {
    playerInfo[index] = {
      playerName: '',
      playerKey: '',
      key: index,
      shirtImage: unknownImage,
      playerContent: '',
      captain: false,
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
      captain: false,
    };
  }

  function captainHandler(index) {
    setPlayerModalState(true);
    playerInfo.forEach(player => {
      if (player.key === index) player.captain = !player.captain;
      else player.captain = false;
    });
    if (teamPredicted) predictPoints();
    setPlayerModalState(false);
  }

  function closeAlert() {
    setAlertState(false);
  }

  function remove() {
    closeAlert();
    setPlayerModalState(true);
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
    setTeamPredicted(false);
    setPlayerModalState(false);
    setPredictButtonState(false);
  }

  function removeAllPlayers() {
    if (playerInfo.some(player => player.playerName.length > 0)) {
      setAlertComponents({
        title: 'Confirm',
        message: 'Are you sure you want to delete team?',
        buttons: [
          ['YES', remove],
          ['NO', closeAlert],
        ],
        onCloseAlert: closeAlert,
      });
      setAlertState(true);
    }
  }

  function changeFormationHandler(formation) {
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);

    setTeamPredicted(false);
    setPredictButtonState(false);
    setNumberOfDefenders(parseInt(formation.charAt(0)));
    setNumberOfMidfielders(parseInt(formation.charAt(2)));
    setNumberOfForwards(parseInt(formation.charAt(4)));
  }

  function randomizePlayers() {
    // remove all players first
    for (let i = 0; i < playerInfo.length; i++) removePlayer(i);
    setTeamPredicted(false);
    setPredictButtonState(!predictButtonState);

    // randomize players

    // goalkeepers
    addRandomPlayer('goalkeeper', 0);

    // defenders
    if (playersEnough('defender', false)) {
      for (let i = 1; i < 1 + numberOfDefenders; i++) addRandomPlayer('defender', i);
      setPredictButtonState(!predictButtonState);
    } else {
      for (let i = 1; i < 1 + playersEnough('defender', true); i++) addRandomPlayer('defender', i);
      setPredictButtonState(!predictButtonState);
    }

    // midfielders
    if (playersEnough('midfielder', false)) {
      for (let i = 1 + numberOfDefenders; i < 1 + numberOfDefenders + numberOfMidfielders; i++)
        addRandomPlayer('midfielder', i);
      setPredictButtonState(!predictButtonState);
    } else {
      for (
        let i = 1 + numberOfDefenders;
        i < 1 + numberOfDefenders + playersEnough('midfielder', true);
        i++
      )
        addRandomPlayer('midfielder', i);
      setPredictButtonState(!predictButtonState);
    }

    // forwards
    if (playersEnough('forward', false)) {
      for (let i = 1 + numberOfDefenders + numberOfMidfielders; i < 11; i++)
        addRandomPlayer('forward', i);
      setPredictButtonState(!predictButtonState);
    } else {
      for (
        let i = 1 + numberOfDefenders + numberOfMidfielders;
        i < 1 + numberOfDefenders + numberOfMidfielders + playersEnough('forward', true);
        i++
      )
        addRandomPlayer('forward', i);
      setPredictButtonState(!predictButtonState);
    }
    setPredictButtonState(!predictButtonState);
  }

  function predictPoints() {
    for (let i = 0; i < playerInfo.length; i++) {
      playerInfo[i] = {
        playerName: playerInfo[i].playerName,
        playerKey: playerInfo[i].playerKey,
        key: playerInfo[i].key,
        shirtImage: playerInfo[i].shirtImage,
        playerContent:
          (playerInfo[i].captain ? 2 : 1) *
          predict(findData(playerInfo[i].playerKey, playerData), StandardRatings, nextOpponent),
        captain: playerInfo[i].captain,
      };
    }
    setPredictButtonState(!predictButtonState);
  }

  function playerViewCommand(pos, index) {
    if (type === 'fantasy') {
      setChosenPosition(pos);
      setCurrentIndex(index);
      setPlayerModalState(true);
    }
  }
  function playerViewLongCommand(playerName, index) {
    if (type === 'fantasy' && playerName !== '') {
      setCurrentIndex(index);
      captainHandler(index);
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
          captain={playerInfo[0].captain}
          activeOpacity={type === 'fantasy' ? 0.6 : 1}
          command={() => playerViewCommand('Goalkeepers', playerInfo[0].key)}
          longCommand={() => playerViewLongCommand(playerInfo[0].playerName, playerInfo[0].key)}
        />
      </View>
    );
  }

  function buildDefenderFrame() {
    let data = [];
    let start = numberOfGoalkeepers;
    let end = numberOfGoalkeepers + numberOfDefenders;
    for (let i = start; i < end; i++) data.push(playerInfo[i]);
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
              captain={player.captain}
              activeOpacity={type === 'fantasy' ? 0.6 : 1}
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
    let start = numberOfGoalkeepers + numberOfDefenders;
    let end = numberOfGoalkeepers + numberOfDefenders + numberOfMidfielders;
    for (let i = start; i < end; i++) data.push(playerInfo[i]);
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
              captain={player.captain}
              activeOpacity={type === 'fantasy' ? 0.6 : 1}
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
    let start = numberOfGoalkeepers + numberOfDefenders + numberOfMidfielders;
    for (let i = start; i < 11; i++) data.push(playerInfo[i]);
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
              captain={player.captain}
              activeOpacity={type === 'fantasy' ? 0.6 : 1}
              command={() => playerViewCommand('Forwards', player.key)}
              longCommand={() => playerViewLongCommand(player.playerName, player.key)}
            />
          );
        })}
      </View>
    );
  }

  function buildFilter() {
    if (type !== 'fantasy') return null;
    return (
      <View style={styles.filterView}>
        <View style={styles.iconView}>
          <Icon
            name='random'
            type='font-awesome'
            size={findFontSize(25)}
            color={colors.primary}
            onPress={playerData.length > 0 ? randomizePlayers : null}
          />
        </View>

        <View
          style={{ width: '70%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
        >
          <PickerBox
            selectedValue={chosenTeam}
            extraStyles={{ width: '55%', height: '80%' }}
            enabled={true}
            list={teams.sort()}
            extraListStyles={{ top: '3%', left: '10%', width: '80%', marginBottom: '25%' }}
            extraTextItemStyles={{ fontSize: findFontSize(15) }}
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

  useEffect(() => {
    if (clicks % 4 === 0) showInterstitial();
  }, [clicks]);

  function bottomButtonCommand() {
    if (type !== 'fantasy') {
      fillPlayers();
      setRevealButtonState(true);
    } else {
      predictPoints();
      setTeamPredicted(true);
      setClicks(clicks + 1);
    }
  }

  function buildBottomView() {
    if (type !== 'fantasy') {
      return (
        <Button
          enabled={
            type === 'fantasy'
              ? predictButtonState
              : playerInfo.every(player => player.playerName === '')
          }
          command={bottomButtonCommand}
          buttonColor={type === 'fantasy' ? colors.forward : colors.secondary}
          buttonTextColor={type === 'fantasy' ? colors.white : colors.primary}
          buttonText={type === 'fantasy' ? 'Predict' : 'Reveal'}
          extraStyles={{ width: '90%', height: '80%' }}
          extraTextStyles={{ fontSize: findFontSize(25) }}
        />
      );
    } else if (teamPredicted) {
      return (
        <NumberTab
          title1={'Average'}
          number1={averageOfPoints(playerInfo)}
          title2={'Total'}
          number2={sumOfPoints(playerInfo)}
          title3={'Highest'}
          number3={highestPoint(playerInfo)}
        />
      );
    } else {
      return (
        <Button
          enabled={
            type === 'fantasy'
              ? predictButtonState
              : playerInfo.every(player => player.playerName === '')
          }
          command={bottomButtonCommand}
          buttonColor={type === 'fantasy' ? colors.forward : colors.secondary}
          buttonTextColor={type === 'fantasy' ? colors.white : colors.primary}
          buttonText={type === 'fantasy' ? 'Predict' : 'Reveal'}
          extraStyles={{ width: '90%' }}
          extraTextStyles={{ fontSize: findFontSize(25) }}
        />
      );
    }
  }

  function onClose() {
    setPlayerModalState(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
  }

  function onSelect() {
    playerInfo[currentIndex] = getPlayerData();
    setPlayerModalState(false);
    setChosenPosition(getChosenPosition());
    setChosenTeam(getChosenTeam());
    setTeamPredicted(false);
  }

  function showInfo() {
    setAlertComponents({
      title: 'Info',
      message:
        'You can now optionally select the captain of your squad by long pressing on the player',
      buttons: [['OK', closeAlert]],
      onCloseAlert: closeAlert,
    });
    setAlertState(true);
  }

  async function showInterstitial() {
    await AdMobInterstitial.setAdUnitID('ca-app-pub-7152054343360573/2734540598');
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true }).catch(err => null);
    await AdMobInterstitial.showAdAsync().catch(err => null);
  }

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
        posPickerEnabled={false}
        teamPickerEnabled={true}
        key={chosenPosition}
      />

      <AlertBox
        visible={alertState}
        title={alertComponents.title}
        message={alertComponents.message}
        buttons={alertComponents.buttons}
        onRequestClose={alertComponents.onCloseAlert}
      />

      <View
        style={{
          ...styles.headerView,
          height: type === 'fantasy' ? '12%' : '13%',
          justifyContent: type === 'fantasy' ? 'center' : 'space-between',
          paddingBottom: type === 'fantasy' ? '0%' : '1%',
        }}
      >
        {type !== 'fantasy' ? (
          <Text
            allowFontScaling={false}
            style={styles.headerTextStyle}
          >{`Scout's Selection for ${currentGW}`}</Text>
        ) : null}
        {type === 'fantasy' ? (
          <View style={styles.infoIconStyle}>
            <Icon
              name='info-circle'
              type='font-awesome'
              size={findFontSize(20)}
              color={colors.primary}
              onPress={showInfo}
            />
          </View>
        ) : null}
        <PickerBox
          selectedValue={chosenFormation}
          extraStyles={{
            width: '30%',
            height: '50%',
            position: 'relative',
            bottom: type === 'fantasy' ? '15%' : '7%',
          }}
          enabled={type === 'fantasy'}
          list={fieldConstants.formations}
          onPickerClose={() => {
            let selectedValue = getSelectedItem();
            setChosenFormation(selectedValue);
            changeFormationHandler(selectedValue);
          }}
        />
      </View>
      <View style={styles.bodyView}>
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
      <View
        style={{
          width: '100%',
          height: type === 'fantasy' ? '18%' : '17%',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {0.92 * (type === 'fantasy' ? 0.18 : 0.17) * 0.5 * deviceHeight >= defaultAdHeight ? (
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
  );
}

const styles = StyleSheet.create({
  mainView: { width: '100%', height: '92%', backgroundColor: colors.white },
  headerView: {
    width: '100%',
    height: '12%',
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextStyle: {
    width: '100%',
    height: undefined,
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(15),
  },
  infoIconStyle: { position: 'relative', left: '45%', top: '26%' },
  bodyView: { width: '100%', height: '70%', backgroundColor: colors.secondary },
  bottomView: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
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
  admobView: { width: '100%', height: '50%', backgroundColor: colors.grey },
  imageBackgroundStyle: {
    resizeMode: 'cover',
    width: undefined,
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(PlayerPage);
