import React, { useEffect, useState, memo, useContext } from 'react';
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

import Button from '../components/Button';
import PickerBox from '../components/PickerBox';
import FilterBar from '../components/FilterBar';
import PlayerFrame from '../components/PlayerFrame';
import SimulationBoard from '../components/SimulationBoard';
import PlayerSelectModal from '../components/PlayerSelectModal';

import {
  player,
  colors,
  findData,
  findFontSize,
  unknownImage,
  DEVICE_HEIGHT,
  randomSelect,
  fieldConstants,
  findPlayerInfo,
  DEFAULT_AD_HEIGHT,
  descendingPointsOrder,
  findOpponentAbbreviation,
} from '../utilities';

import { AppContext } from '../App';
import { SquadDataType } from '../types';

interface Props {
  visible: boolean;
}

const SimulationScreen: React.FC<Props> = ({ visible }) => {
  const initializeId = async () => await setTestDeviceIDAsync('EMULATOR');
  const {
    playerKit,
    goalieKit,
    teamsData,
    playerData,
    fieldImage,
    nextOpponent,
    positionData,
    setAlertVisible,
    setAlertComponents,
  } = useContext(AppContext);

  // componentDidMount
  useEffect(() => {
    initializeId();
  }, []);
  const teams = teamsData?.map(({ name }) => name).sort() || [];

  const type = 'simulate';
  const MAX_NUMBER_OF_PLAYERS = 11;
  const { formations } = fieldConstants;
  const [clicks, setClicks] = useState(1);
  const [squad1, setSquad1] = useState<SquadDataType[]>([]);
  const [squad2, setSquad2] = useState<SquadDataType[]>([]);
  const [boardVisible, setBoardVisible] = useState(false);
  const [chosenTeam1, setChosenTeam1] = useState('All Teams');
  const [chosenTeam2, setChosenTeam2] = useState('All Teams');
  const [playerSelectVisible, setPlayerSelectVisible] = useState(false);
  const [simulateButtonEnabled, setSimulateButtonEnabled] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenTeam, setChosenTeam] = useState(chosenTeam1);
  const [chosenFormation, setChosenFormation] = useState('4-4-2');
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [playerModalVisible1, setPlayerModalVisible1] = useState(false);
  const [playerModalVisible2, setPlayerModalVisible2] = useState(false);

  const numberOfGoalkeepers = 1;
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

  const removePlayer = (index: number) => {
    const newPlayerInfo = playerInfo;

    newPlayerInfo[index] = {
      index,
      playerID: -1,
      isCaptain: false,
      playerName: '',
      playerContent: '',
      shirtImage: unknownImage,
    };

    setPlayerInfo([...newPlayerInfo]);
  };

  const filterPlayers = (pos: string) => {
    // get id for position argument passed into pos variable...
    const positionID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === pos
    )?.id;

    const teamID = teamsData?.find(({ name }) => name === chosenTeam)?.id;

    return chosenTeam === 'All Teams'
      ? playerData?.filter(
          ({ element_type, id }) =>
            positionID === element_type && !playerInfo.some(({ playerID }) => playerID === id)
        )
      : playerData?.filter(
          ({ element_type, team, id }) =>
            teamID === team &&
            positionID === element_type &&
            !playerInfo.some(({ playerID }) => playerID === id)
        );
  };

  const playersEnough = (pos: string, returnLength?: boolean) => {
    let requiredNoOfPlayers: { [key: string]: number } = {
      goalkeeper: numberOfGoalkeepers,
      defender: numberOfDefenders,
      midfielder: numberOfMidfielders,
      forward: numberOfForwards,
    };
    const positionID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === pos)?.id || -1;
    const teamID = teamsData?.find(({ name }) => name === chosenTeam)?.id || -1;

    if (chosenTeam === 'All Teams') {
      const filteredPlayersLength =
        playerData?.filter(({ element_type }) => element_type === positionID).length || 0;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    } else {
      const filteredPlayersLength =
        playerData?.filter(
          ({ element_type, team }) => element_type === positionID && team === teamID
        ).length || 0;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    }
  };

  const addRandomPlayer = (pos: string, index: number) => {
    const possiblePlayers = filterPlayers(pos);

    if (possiblePlayers && possiblePlayers?.length > 0) {
      const newPlayerInfo = playerInfo;
      const { isCaptain } = newPlayerInfo[index];
      const { team, web_name, id } = randomSelect(possiblePlayers);
      const teamName = teamsData?.find(({ id }) => id === team)?.name || '';

      newPlayerInfo[index] = {
        index,
        isCaptain,
        playerID: id,
        playerName: web_name,
        shirtImage:
          index === 0
            ? goalieKit
              ? goalieKit[teamName]
              : unknownImage
            : playerKit
            ? playerKit[teamName]
            : unknownImage,
        playerContent: findOpponentAbbreviation(team, nextOpponent, teamsData),
      };
      setPlayerInfo([...newPlayerInfo]);
    }
  };

  const closeAlert = () => {
    if (setAlertVisible) setAlertVisible(false);
  };

  const removeSingle = (index: number) => {
    closeAlert();
    removePlayer(index);
  };

  const confirmRemoveSingle = (index: number, playerName: string) => {
    if (setAlertComponents && setAlertVisible) {
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
    }
  };

  const removeAll = () => {
    closeAlert();
    playerInfo.forEach(({ index }) => removePlayer(index));
  };

  const confirmRemoveAll = () => {
    if (setAlertComponents && setAlertVisible && playerInfo.some(({ playerName }) => playerName)) {
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

  const changeFormationHandler = (formation: string) => {
    setNumberOfDefenders(parseInt(formation.charAt(0)));
    setNumberOfMidfielders(parseInt(formation.charAt(2)));
    setNumberOfForwards(parseInt(formation.charAt(4)));
  };

  const randomizePlayers = () => {
    const defEnd = playersEnough('defender')
      ? 1 + numberOfDefenders
      : 1 + (playersEnough('defender', true) as number);

    const midStart = 1 + numberOfDefenders;
    const midEnd = playersEnough('midfielder')
      ? midStart + numberOfMidfielders
      : midStart + (playersEnough('midfielder', true) as number);

    const fwdStart = midStart + numberOfMidfielders;
    const fwdEnd = playersEnough('forward')
      ? MAX_NUMBER_OF_PLAYERS
      : fwdStart + (playersEnough('forward', true) as number);

    addRandomPlayer('goalkeeper', 0);

    for (let i = 1; i < defEnd; i++) addRandomPlayer('defender', i);

    for (let i = midStart; i < midEnd; i++) addRandomPlayer('midfielder', i);

    for (let i = fwdStart; i < fwdEnd; i++) addRandomPlayer('forward', i);
  };

  const playerViewCommand = (pos: string, index: number) => {
    setChosenPosition(pos);
    setCurrentIndex(index);
    setPlayerModalVisible1(true);
  };

  const playerViewLongCommand = (playerName: string, index: number) => {
    if (playerName) {
      setCurrentIndex(index);
      confirmRemoveSingle(index, playerName);
    }
  };

  const findPlayerDetails = () => playerInfo.map(({ playerID }) => findData(playerID, playerData));

  const save = () => {
    if (chosenTeam === chosenTeam1) {
      setSquad1(findPlayerDetails());
      ToastAndroid.show(`${chosenTeam}'s team saved`, 2000);
      playerInfo.forEach(({ index }) => removePlayer(index));
      setChosenTeam(chosenTeam2);
    } else if (chosenTeam === chosenTeam2) {
      setSquad2(findPlayerDetails());
      ToastAndroid.show(`${chosenTeam}'s team saved`, 2000);
      playerInfo.forEach(({ index }) => removePlayer(index));
      setPlayerSelectVisible(false);
    }
  };

  const teamEnough = (teamName: string) => {
    const goalkeepersID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'goalkeeper'
    )?.id;
    const defendersID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'defender'
    )?.id;
    const midfieldersID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'midfielder'
    )?.id;
    const forwardsID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'forward'
    )?.id;

    const teamID = teamsData?.find(({ name }) => name === teamName)?.id;

    if (
      (playerData?.filter(
        ({ team, element_type }) => team === teamID && element_type === goalkeepersID
      ).length || 0) < 1
    ) {
      return false;
    } else if (
      (playerData?.filter(
        ({ team, element_type }) => team === teamID && element_type === defendersID
      ).length || 0) < 4
    ) {
      return false;
    } else if (
      (playerData?.filter(
        ({ team, element_type }) => team === teamID && element_type === midfieldersID
      ).length || 0) < 5
    ) {
      return false;
    } else if (
      (playerData?.filter(
        ({ team, element_type }) => team === teamID && element_type === forwardsID
      ).length || 0) < 1
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (chosenTeam1 !== 'All Teams' && chosenTeam2 !== 'All Teams' && chosenTeam1 !== chosenTeam2) {
      if (teamEnough(chosenTeam1)) {
        setSquad1(getTeam(chosenTeam1));
      } else {
        setSquad1([]);
        ToastAndroid.show(`${chosenTeam1}'s players are not enough. Try again later`, 2000);
      }

      if (teamEnough(chosenTeam2)) {
        setSquad2(getTeam(chosenTeam2));
      } else {
        setSquad2([]);
        ToastAndroid.show(`${chosenTeam2}'s players are not enough. Try again later`, 2000);
      }
    } else {
      setSquad1([]);
      setSquad2([]);
    }
  }, [chosenTeam1, chosenTeam2]);

  useEffect(() => {
    // first check if any squad data is undefined
    const allPlayersValid = squad1.every(player => player) && squad2.every(player => player);

    if (
      allPlayersValid &&
      squad1.length === MAX_NUMBER_OF_PLAYERS &&
      squad2.length === MAX_NUMBER_OF_PLAYERS
    ) {
      setSimulateButtonEnabled(true);
    } else setSimulateButtonEnabled(false);
  }, [squad1, squad2]);

  const findBestFormation = (teamName: string) => {
    const forwardsID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'forward'
    )?.id;
    const teamID = teamsData?.find(({ name }) => name === teamName)?.id;

    return (playerData?.filter(
      ({ team, element_type }) => team === teamID && element_type === forwardsID
    ).length || 0) >= 2
      ? '4-4-2'
      : '4-5-1';
  };

  const getTeam = (teamName: string) => {
    let squad = [];
    const formation = findBestFormation(teamName);
    const teamID = teamsData?.find(({ name }) => name === teamName)?.id;
    const goalkeepersID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'goalkeeper'
    )?.id;
    const defendersID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'defender'
    )?.id;
    const midfieldersID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'midfielder'
    )?.id;
    const forwardsID = positionData?.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'forward'
    )?.id;

    const goalies = playerData
      ?.filter(({ team, element_type }) => team === teamID && element_type === goalkeepersID)
      .sort(descendingPointsOrder);
    const defenders = playerData
      ?.filter(({ team, element_type }) => team === teamID && element_type === defendersID)
      .sort(descendingPointsOrder);
    const midfielders = playerData
      ?.filter(({ team, element_type }) => team === teamID && element_type === midfieldersID)
      .sort(descendingPointsOrder);
    const forwards = playerData
      ?.filter(({ team, element_type }) => team === teamID && element_type === forwardsID)
      .sort(descendingPointsOrder);

    const bestGoalie = goalies && goalies[0];
    const bestDefenders = (defenders && defenders.slice(0, parseInt(formation.charAt(0)))) || [];
    const bestMidfielders =
      (midfielders && midfielders.slice(0, parseInt(formation.charAt(2)))) || [];
    const bestForwards = (forwards && forwards.slice(0, parseInt(formation.charAt(4)))) || [];

    squad = [bestGoalie, ...bestDefenders, ...bestMidfielders, ...bestForwards];

    return squad;
  };

  const onSelectModalClose = () => {
    setPlayerSelectVisible(false);
    playerInfo.forEach(({ index }) => removePlayer(index));
    setChosenTeam(chosenTeam1);
  };

  useEffect(() => {
    if (clicks % 5 === 0 && !boardVisible) showInterstitial();
  }, [clicks, boardVisible]);

  const openBoard = () => {
    setBoardVisible(true);
    setClicks(clicks + 1);
  };

  const chooseSquad = () => {
    setChosenTeam(chosenTeam1);
    setPlayerSelectVisible(true);
  };

  const playerCommand = (teamName: string, playerID: number, index: number) => {
    const { element_type } = findData(playerID, playerData) || {};
    const pluralName = positionData?.find(({ id }) => id === element_type)?.plural_name || '';

    setChosenTeam(teamName);
    setCurrentIndex(index);
    setChosenPosition(pluralName.toLowerCase());
    setPlayerModalVisible2(true);
  };

  const showInterstitial = async () => {
    await AdMobInterstitial.setAdUnitID('ca-app-pub-7152054343360573/2734540598');
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true }).catch(null);
    await AdMobInterstitial.showAdAsync().catch(null);
  };

  useEffect(() => changeFormationHandler(chosenFormation), [chosenFormation]);

  useEffect(() => {
    const defendersID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === 'defender')?.id ||
      -1;
    const midfieldersID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === 'midfielder')?.id ||
      -1;
    const forwardsID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === 'forward')?.id ||
      -1;

    // remove non-defenders
    const defEnd = 1 + numberOfDefenders;
    for (let i = 1; i < defEnd; i++) {
      const { playerID } = playerInfo[i];

      if (playerID >= 0 && findPlayerInfo(playerID, 'element_type', playerData) !== defendersID) {
        removePlayer(i);
      }
    }

    // remove non-midfielders
    const midEnd = defEnd + numberOfMidfielders;
    for (let i = defEnd; i < midEnd; i++) {
      const { playerID } = playerInfo[i];

      if (playerID >= 0 && findPlayerInfo(playerID, 'element_type', playerData) !== midfieldersID) {
        removePlayer(i);
      }
    }

    // remove non-forwards
    for (let i = midEnd; i < MAX_NUMBER_OF_PLAYERS; i++) {
      const { playerID } = playerInfo[i];

      if (playerID >= 0 && findPlayerInfo(playerID, 'element_type', playerData) !== forwardsID) {
        removePlayer(i);
      }
    }
  }, [numberOfDefenders, numberOfMidfielders, numberOfForwards]);

  return (
    <View style={{ ...styles.main, display: visible ? 'flex' : 'none' }}>
      <Modal visible={playerSelectVisible} onRequestClose={onSelectModalClose} transparent={true}>
        <View style={styles.mainSelect}>
          <PlayerSelectModal
            playerInfo={playerInfo}
            chosenTeam={chosenTeam}
            posPickerEnabled={false}
            teamPickerEnabled={false}
            currentIndex={currentIndex}
            playerKit={playerKit || {}}
            goalieKit={goalieKit || {}}
            playerData={playerData || []}
            visible={playerModalVisible1}
            setChosenTeam={setChosenTeam}
            chosenPosition={chosenPosition}
            nextOpponent={nextOpponent || []}
            setChosenPosition={setChosenPosition}
            key={chosenPosition.concat(chosenTeam)}
            setPlayerModalVisible={setPlayerModalVisible1}
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
              imageStyle={styles.imageBackground}
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
                positionGroup='goalkeepers'
                playerData={playerData || []}
                playerViewCommand={playerViewCommand}
                playerViewLongCommand={playerViewLongCommand}
              />
              <PlayerFrame
                type={type}
                endIndex={1 + numberOfDefenders}
                startIndex={1}
                playerInfo={playerInfo}
                positionGroup='defenders'
                playerData={playerData || []}
                playerViewCommand={playerViewCommand}
                playerViewLongCommand={playerViewLongCommand}
              />
              <PlayerFrame
                type={type}
                endIndex={1 + numberOfDefenders + numberOfMidfielders}
                startIndex={1 + numberOfDefenders}
                playerInfo={playerInfo}
                positionGroup='midfielders'
                playerData={playerData || []}
                playerViewCommand={playerViewCommand}
                playerViewLongCommand={playerViewLongCommand}
              />
              <PlayerFrame
                type={type}
                endIndex={MAX_NUMBER_OF_PLAYERS}
                startIndex={1 + numberOfDefenders + numberOfMidfielders}
                playerInfo={playerInfo}
                positionGroup='forwards'
                playerData={playerData || []}
                playerViewCommand={playerViewCommand}
                playerViewLongCommand={playerViewLongCommand}
              />
            </ImageBackground>

            <FilterBar
              type={type}
              pickerEnabled={false}
              chosenTeam={chosenTeam}
              setChosenTeam={setChosenTeam}
              teams={['All Teams', ...teams]}
              confirmRemoveAll={confirmRemoveAll}
              randomizePlayers={randomizePlayers}
            />
          </View>

          <View style={styles.admobContainer}>
            {0.23 * 0.5 * DEVICE_HEIGHT >= DEFAULT_AD_HEIGHT ? (
              <AdMobBanner
                style={styles.admobView}
                servePersonalizedAds={true}
                bannerSize='smartBannerLandscape'
                onDidFailToReceiveAdWithError={() => {}}
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
        chosenTeam={chosenTeam}
        posPickerEnabled={false}
        teamPickerEnabled={false}
        playerKit={playerKit || {}}
        goalieKit={goalieKit || {}}
        currentIndex={currentIndex}
        visible={playerModalVisible2}
        playerData={playerData || []}
        setChosenTeam={setChosenTeam}
        chosenPosition={chosenPosition}
        nextOpponent={nextOpponent || []}
        setChosenPosition={setChosenPosition}
        key={chosenPosition.concat(chosenTeam)}
        setPlayerModalVisible={setPlayerModalVisible2}
        squadInfo={chosenTeam === chosenTeam1 ? squad1 : squad2}
      />

      <SimulationBoard
        squad1={squad1}
        squad2={squad2}
        visible={boardVisible}
        teamName1={chosenTeam1}
        teamName2={chosenTeam2}
        teamsData={teamsData || []}
        positionData={positionData || []}
        setBoardVisible={setBoardVisible}
        shortTeamName1={teamsData?.find(({ name }) => name === chosenTeam1)?.short_name || ''}
        shortTeamName2={teamsData?.find(({ name }) => name === chosenTeam2)?.short_name || ''}
      />

      <View style={styles.header}>
        <PickerBox
          enabled={true}
          selectedValue={chosenTeam1}
          list={['All Teams', ...teams]}
          extraStyles={{ width: '45%' }}
          selectedItemHandler={setChosenTeam1}
          extraListStyles={{ top: '1%', left: '3%', width: '42.5%', marginBottom: '35%' }}
        />

        <Text allowFontScaling={false} style={styles.textStyle}>
          Vs
        </Text>

        <PickerBox
          enabled={true}
          selectedValue={chosenTeam2}
          list={['All Teams', ...teams]}
          extraStyles={{ width: '45%' }}
          selectedItemHandler={setChosenTeam2}
          extraListStyles={{ top: '1%', left: '54.6%', width: '42.5%', marginBottom: '35%' }}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.chooseSquadButton}>
          <Button
            command={chooseSquad}
            buttonText='Choose Squads'
            buttonColor={colors.stratos}
            buttonTextColor={colors.white}
            extraStyles={{ width: '95%' }}
            enabled={simulateButtonEnabled}
            extraTextStyles={{ fontSize: findFontSize(15) }}
          />
        </View>

        <View style={styles.squadView}>
          <View style={{ ...styles.listStyle, paddingRight: '0.5%' }}>
            {squad1.map((player, index) => {
              if (player) {
                const { id, web_name } = player;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.6}
                    onPress={() => playerCommand(chosenTeam1, id, index)}
                    style={{
                      ...styles.touchView,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.textStyle2}>
                      {web_name}
                    </Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {}}
                  activeOpacity={0.6}
                  style={{
                    ...styles.touchView,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Text allowFontScaling={false} style={styles.textStyle2}>
                    {''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ ...styles.listStyle, paddingLeft: '0.5%' }}>
            {squad2.map((player, index) => {
              if (player) {
                const { id, web_name } = player;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.6}
                    onPress={() => playerCommand(chosenTeam2, id, index)}
                    style={{
                      ...styles.touchView,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  >
                    <Text allowFontScaling={false} style={styles.textStyle2}>
                      {web_name}
                    </Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {}}
                  activeOpacity={0.6}
                  style={{
                    ...styles.touchView,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <Text allowFontScaling={false} style={styles.textStyle2}>
                    {''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          command={openBoard}
          buttonText='SIMULATE'
          buttonColor={colors.stratos}
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
    paddingHorizontal: '3%',
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
    backgroundColor: colors.pattensBlue,
  },
  textStyle2: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: colors.blueRibbon,
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
    backgroundColor: colors.stratos,
  },
  bodySelect: { width: '100%', height: '65%', backgroundColor: colors.stratos },
  bottomView: { width: '100%', height: '50%', alignItems: 'center', justifyContent: 'center' },
  imgViewStyle: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    paddingVertical: '5%',
    justifyContent: 'space-evenly',
  },
  imageBackground: {
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  admobView: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.alto,
  },
  admobContainer: { width: '100%', height: '23%', alignItems: 'center', justifyContent: 'center' },
});

export default memo(SimulationScreen);
