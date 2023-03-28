import { useEffect, useState, memo, useContext } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
// import {
//   BannerAd,
//   TestIds,
//   AdEventType,
//   BannerAdSize,
//   InterstitialAd,
// } from 'react-native-google-mobile-ads';

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
  fieldConstants,
  findPlayerInfo,
  findOpponentAbbreviation,
} from '../utilities';

import { AppContext } from '../App';

// const adUnitID = __DEV__ ? TestIds.BANNER : ADMOB_APP_ID;

// const interstitial = InterstitialAd.createForAdRequest(adUnitID, {
//   requestNonPersonalizedAdsOnly: false,
// });

interface Props {
  visible: boolean;
  type: 'fantasy' | 'scout';
}

const PlayerScreen: React.FC<Props> = ({ type, visible }) => {
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
    setAlertComponents,
  } = useContext(AppContext);

  // const [adLoaded, setAdLoaded] = useState(false);

  // componentDidMount
  // useEffect(() => {
  //   const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
  //     setAdLoaded(true);
  //   });

  //   // unsubscribe from events on unmount
  //   return unsubscribe;
  // }, []);

  const teams = teamsData?.map(({ name }) => name).sort() || [];
  // const adFitsContainer =
  //   0.92 * (type === 'fantasy' ? 0.18 : 0.17) * 0.5 * DEVICE_HEIGHT >= DEFAULT_AD_HEIGHT;

  const MAX_NUMBER_OF_PLAYERS = 11;
  const { formations } = fieldConstants;
  // const [clicks, setClicks] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenFormation, setChosenFormation] = useState<string>(
    type === 'fantasy' ? '4-4-2' : selections ? selections.formation : '4-5-1'
  );

  const [teamPredicted, setTeamPredicted] = useState(false);
  const [chosenTeam, setChosenTeam] = useState('All Teams');
  const [currentScoutIndex, setCurrentScoutIndex] = useState(-1);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [chosenPosition, setChosenPosition] = useState('All Positions');
  const [footerButtonEnabled, setFooterButtonEnabled] = useState(false);

  const numberOfGoalkeepers = 1;
  const [numberOfForwards, setNumberOfForwards] = useState(2);
  const [numberOfDefenders, setNumberOfDefenders] = useState(4);
  const [numberOfMidfielders, setNumberOfMidfielders] = useState(4);
  const [playerInfo, setPlayerInfo] = useState(
    Array.from({ length: MAX_NUMBER_OF_PLAYERS }, (elm, index) => player(index))
  );

  useEffect(() => {
    // check if all players have been picked before enabling footer button
    const allPlayersSelected = playerInfo.every(({ playerName }) => playerName);
    setFooterButtonEnabled(allPlayersSelected);
  }, [playerModalVisible, footerButtonEnabled, playerInfo]);

  useEffect(() => {
    if (type === 'scout') changeFormationHandler(chosenFormation);
  }, [type]);

  useEffect(() => {
    if (currentScoutIndex < 0) return;

    const funcToRun = currentScoutIndex === MAX_NUMBER_OF_PLAYERS ? appointCaptain : fillPlayers;
    const timer = setTimeout(funcToRun, 500);
    return () => clearTimeout(timer);
  }, [currentScoutIndex]);

  const appointCaptain = () => {
    const newPlayerInfo = playerInfo;
    let captainIndex = selections?.captainIndex ?? 0;

    newPlayerInfo[captainIndex].isCaptain = true;
    setPlayerInfo([...newPlayerInfo]);
  };

  const fillPlayers = () => {
    if (currentScoutIndex < MAX_NUMBER_OF_PLAYERS) {
      const currentPlayerID = selections?.playerIDs[currentScoutIndex] ?? -1;
      const tempData = playerData?.find(({ id }) => id === currentPlayerID);

      if (tempData) {
        const { web_name, id, team } = tempData;
        const teamData = teamsData?.find(({ id }) => id === team);
        const teamID = teamData?.id ?? -1;
        const teamName = teamData?.name || '';

        playerInfo[currentScoutIndex] = {
          playerID: id,
          isCaptain: false,
          playerName: web_name,
          index: currentScoutIndex,
          playerContent: findOpponentAbbreviation(teamID, nextOpponent, teamsData),
          shirtImage:
            currentScoutIndex === 0
              ? goalieKit
                ? goalieKit[teamName]
                : unknownImage
              : playerKit
              ? playerKit[teamName]
              : unknownImage,
        };
      }
      setCurrentScoutIndex(currentScoutIndex + 1);
    }
  };

  const removePlayer = (index: number) => {
    const newPlayerInfo = playerInfo;

    newPlayerInfo[index] = {
      index,
      playerID: -1,
      playerName: '',
      isCaptain: false,
      playerContent: '',
      shirtImage: unknownImage,
    };

    setPlayerInfo([...newPlayerInfo]);
  };

  const filterPlayers = (pos: string) => {
    // get id for position argument passed into pos variable...
    const positionID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === pos)?.id ?? -1;

    const teamID = teamsData?.find(({ name }) => name === chosenTeam)?.id ?? -1;

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
    const requiredNoOfPlayers: { [key: string]: number } = {
      goalkeeper: numberOfGoalkeepers,
      defender: numberOfDefenders,
      midfielder: numberOfMidfielders,
      forward: numberOfForwards,
    };
    const positionID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === pos)?.id ?? -1;
    const teamID = teamsData?.find(({ name }) => name === chosenTeam)?.id ?? -1;

    if (chosenTeam === 'All Teams') {
      const filteredPlayersLength =
        playerData?.filter(({ element_type }) => element_type === positionID).length ?? 0;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    } else {
      const filteredPlayersLength =
        playerData?.filter(
          ({ element_type, team }) => element_type === positionID && team === teamID
        ).length ?? 0;

      return returnLength
        ? filteredPlayersLength
        : filteredPlayersLength >= requiredNoOfPlayers[pos];
    }
  };

  const addRandomPlayer = (pos: string, index: number) => {
    const possiblePlayers = filterPlayers(pos);

    if (possiblePlayers && possiblePlayers.length > 0) {
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

  const captainHandler = (index: number) => {
    const newPlayerInfo = playerInfo;
    newPlayerInfo.forEach(
      player => (player.isCaptain = player.index === index && !player.isCaptain)
    );
    setPlayerInfo([...newPlayerInfo]);

    if (teamPredicted) predictPoints();
  };

  const closeAlert = () => {
    if (setAlertVisible) setAlertVisible(false);
  };

  const removeAll = () => {
    closeAlert();
    setTeamPredicted(false);
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
    setTeamPredicted(false);
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
      const data = findData(playerID, playerData);
      const predictedPoint = data?.ep_next || '0';

      player.playerContent = ((isCaptain ? 2 : 1) * Math.round(Number(predictedPoint))).toString();
    });
    setPlayerInfo([...newPlayerInfo]);
  };

  const playerViewCommand = (pos: string, index: number) => {
    if (type === 'fantasy') {
      setChosenPosition(pos);
      setCurrentIndex(index);
      setPlayerModalVisible(true);
    }
  };

  const playerViewLongCommand = (playerName: string, index: number) => {
    if (type === 'fantasy' && playerName) {
      setCurrentIndex(index);
      captainHandler(index);
    }
  };

  // useEffect(() => {
  //   if (clicks % 5 === 0 && adLoaded) interstitial.show();
  // }, [clicks, adLoaded]);

  const onPredict = () => {
    predictPoints();
    // setClicks(clicks + 1);
    setTeamPredicted(true);
  };

  const onReveal = () => {
    fillPlayers();
    setCurrentScoutIndex(0);
  };

  const showInfo = () => {
    if (setAlertComponents && setAlertVisible) {
      setAlertComponents({
        title: 'Info',
        onCloseAlert: closeAlert,
        buttons: [{ text: 'OK', onPress: closeAlert }],
        message:
          'You can now optionally select the captain of your squad by long pressing on the player',
      });
      setAlertVisible(true);
    }
  };

  useEffect(() => changeFormationHandler(chosenFormation), [chosenFormation]);

  useEffect(() => {
    const defendersID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === 'defender')?.id ??
      -1;
    const midfieldersID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === 'midfielder')?.id ??
      -1;
    const forwardsID =
      positionData?.find(({ singular_name }) => singular_name.toLowerCase() === 'forward')?.id ??
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
      <PlayerSelectModal
        key={chosenPosition}
        playerInfo={playerInfo}
        chosenTeam={chosenTeam}
        posPickerEnabled={false}
        teamPickerEnabled={true}
        currentIndex={currentIndex}
        playerKit={playerKit || {}}
        goalieKit={goalieKit || {}}
        visible={playerModalVisible}
        playerData={playerData || []}
        setChosenTeam={setChosenTeam}
        chosenPosition={chosenPosition}
        nextOpponent={nextOpponent || []}
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
          pickerEnabled={true}
          chosenTeam={chosenTeam}
          setChosenTeam={setChosenTeam}
          teams={['All Teams', ...teams]}
          confirmRemoveAll={confirmRemoveAll}
          randomizePlayers={randomizePlayers}
        />
      </View>

      <View style={{ ...styles.footer, height: type === 'fantasy' ? '18%' : '17%' }}>
        {/* {adFitsContainer ? (
          <BannerAd
            unitId={adUnitID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          />
        ) : (
          <View style={styles.admob} />
          )} */}
        <View style={styles.admob} />

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
  footer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default memo(PlayerScreen);
