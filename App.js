import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import {
  View,
  LogBox,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';

import MorePage from './Pages/MorePage';
import ScoutPage from './Pages/ScoutPage';
import AlertBox from './components/AlertBox';
import LoadingPage from './Pages/LoadingPage';
import FantasyPage from './Pages/FantasyPage';
import ComparismPage from './Pages/ComparismPage';
import SimulationPage from './Pages/SimulationPage';
import NavigationButton from './components/NavigationButton';
import ConnectionErrorPage from './Pages/ConnectionErrorPage';

import { colors } from './constants';
import { numbersInString, sum } from './utilities';

import db from './firebase';
import { onSnapshot, collection, query, where } from 'firebase/firestore';

export default function App() {
  LogBox.ignoreLogs(['Setting a timer', 'VirtualizedList']);

  const [fontLoaded] = useFonts({
    PoppinsBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
  });
  const fieldImage = require('./assets/field.png');
  const [loadedData, setLoadedData] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [alertComponents, setAlertComponents] = useState({
    title: '',
    message: '',
    buttons: [],
    onCloseAlert: null,
  });

  const appVersion = '2023-2024_9';
  const [teams, setTeams] = useState([]);
  const [update, setUpdate] = useState([]);
  const [selections, setSelections] = useState([]);
  const [shirtLinks, setShirtLinks] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [nextOpponent, setNextOpponent] = useState([]);
  const [relegatedTeams, setRelegatedTeams] = useState([]);
  const [StandardRatings, setStandardRatings] = useState([]);
  const [TeamAbbreviations, setTeamAbbreviations] = useState([]);
  const [connectionErrorState, setConnectionErrorState] = useState(false);

  const getPlayerData = relegatedTeams => {
    if (playerData.length > 0) return;

    let correctedRelegatedTeams = relegatedTeams;

    // relegated teams' array length must be at least 1 and should never exceed 10!!!
    if (correctedRelegatedTeams.length === 0) correctedRelegatedTeams = [''];
    while (correctedRelegatedTeams.length > 10) correctedRelegatedTeams.pop();

    const collectionRef = collection(db, 'players');
    const q = query(collectionRef, where('team', 'not-in', correctedRelegatedTeams));

    onSnapshot(q, snapshot => setPlayerData(snapshot.docs.map(doc => doc.data())));
  };

  const getTeams = () => {
    onSnapshot(collection(db, 'teams'), snapshot => setTeams(snapshot.docs.map(doc => doc.data())));
  };

  const getRatings = () => {
    onSnapshot(collection(db, 'StandardRatings'), snapshot =>
      setStandardRatings(snapshot.docs.map(doc => doc.data()))
    );
  };

  const getNextOpponents = () => {
    onSnapshot(collection(db, 'nextOpponent'), snapshot =>
      setNextOpponent(snapshot.docs.map(doc => doc.data()))
    );
  };

  const getAbbreviations = () => {
    onSnapshot(collection(db, 'abbreviations'), snapshot =>
      setTeamAbbreviations(snapshot.docs.map(doc => doc.data()))
    );
  };

  const getSelections = () => {
    onSnapshot(collection(db, 'selection'), snapshot =>
      setSelections(snapshot.docs.map(doc => doc.data()))
    );
  };

  const getRelegatedTeams = () => {
    onSnapshot(collection(db, 'relegatedTeams'), snapshot =>
      setRelegatedTeams(snapshot.docs.map(doc => doc.data()))
    );
  };

  const getUpdates = () => {
    onSnapshot(collection(db, 'updates'), snapshot =>
      setUpdate(snapshot.docs.map(doc => doc.data()))
    );
  };

  const getShirtLinks = () => {
    onSnapshot(collection(db, 'teamImageUrls'), snapshot => {
      setShirtLinks(snapshot.docs.map(doc => doc.data()));
    });
  };

  const checkForUpdate = () => {
    if (update.length > 0) {
      const { info, currentVersion, updateLink } = update[0];

      if (info && loadedData === 9) {
        setAlertComponents({
          title: 'Info',
          message: info,
          onCloseAlert: closeAlert,
          buttons: [{ text: 'OK', onPress: closeAlert }],
        });
        setAlertVisible(true);
      }

      if (sum(numbersInString(currentVersion)) > sum(numbersInString(appVersion))) {
        setAlertComponents({
          onCloseAlert: null,
          title: 'Update Available',
          buttons: [{ text: 'UPDATE', onPress: () => Linking.openURL(updateLink) }],
          message:
            'There is an update available for this app. Please kindly update to enjoy the latest features.',
        });
        setAlertVisible(true);
      }
    }
  };

  useEffect(checkForUpdate, [update, loadedData]);

  useEffect(() => {
    let tempLoadedData = 0;
    [
      teams,
      update,
      playerData,
      shirtLinks,
      selections,
      nextOpponent,
      relegatedTeams,
      StandardRatings,
      TeamAbbreviations,
    ].forEach(item => (tempLoadedData += item.length > 0));
    setLoadedData(tempLoadedData);
  }, [
    teams,
    update,
    playerData,
    selections,
    shirtLinks,
    nextOpponent,
    relegatedTeams,
    StandardRatings,
    TeamAbbreviations,
  ]);

  useEffect(() => {
    if (relegatedTeams.length > 0) getPlayerData(relegatedTeams[0].relegatedTeams);
  }, [relegatedTeams]);

  // componentDidMount
  useEffect(() => {
    if (teams.length === 0) getTeams();
    if (update.length === 0) getUpdates();
    if (shirtLinks.length === 0) getShirtLinks();
    if (selections.length === 0) getSelections();
    if (StandardRatings.length === 0) getRatings();
    if (nextOpponent.length === 0) getNextOpponents();
    if (relegatedTeams.length === 0) getRelegatedTeams();
    if (TeamAbbreviations.length === 0) getAbbreviations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setConnectionErrorState(loadedData < 9), 15000);
    return () => clearTimeout(timer);
  }, [loadedData]);

  useEffect(() => {
    if (loadedData === 9 && fontLoaded) {
      setConnectionErrorState(false);
      setActiveNavIndex(3);
    }
  }, [loadedData, fontLoaded]);

  const closeAlert = () => setAlertVisible(false);

  StatusBar.setBackgroundColor('#00000050');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={0}
      enabled={Platform.OS === 'ios'}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar translucent={true} />

      {loadedData === 9 && fontLoaded ? null : <LoadingPage />}

      {loadedData === 9 && fontLoaded ? (
        <ScoutPage
          teams={teams[0].teams}
          playerData={playerData}
          fieldImage={fieldImage}
          playerKit={shirtLinks[0]}
          goalieKit={shirtLinks[1]}
          selections={selections[0]}
          visible={activeNavIndex === 1}
          nextOpponent={nextOpponent[0]}
          currentGW={update[0].currentGW}
          setAlertVisible={setAlertVisible}
          setAlertComponents={setAlertComponents}
          TeamAbbreviations={TeamAbbreviations[0]}
        />
      ) : null}

      {loadedData === 9 && fontLoaded ? (
        <ComparismPage
          teams={teams[0].teams}
          playerData={playerData}
          playerKit={shirtLinks[0]}
          goalieKit={shirtLinks[1]}
          visible={activeNavIndex === 2}
          nextOpponent={nextOpponent[0]}
          currentGW={update[0].currentGW}
          StandardRatings={StandardRatings[0]}
          TeamAbbreviations={TeamAbbreviations[0]}
        />
      ) : null}

      {loadedData === 9 && fontLoaded ? (
        <FantasyPage
          teams={teams[0].teams}
          playerData={playerData}
          fieldImage={fieldImage}
          playerKit={shirtLinks[0]}
          goalieKit={shirtLinks[1]}
          visible={activeNavIndex === 3}
          nextOpponent={nextOpponent[0]}
          currentGW={update[0].currentGW}
          setAlertVisible={setAlertVisible}
          StandardRatings={StandardRatings[0]}
          setAlertComponents={setAlertComponents}
          TeamAbbreviations={TeamAbbreviations[0]}
        />
      ) : null}

      {loadedData === 9 && fontLoaded ? (
        <SimulationPage
          teams={teams[0].teams}
          playerData={playerData}
          fieldImage={fieldImage}
          playerKit={shirtLinks[0]}
          goalieKit={shirtLinks[1]}
          visible={activeNavIndex === 4}
          nextOpponent={nextOpponent[0]}
          setAlertVisible={setAlertVisible}
          StandardRatings={StandardRatings[0]}
          setAlertComponents={setAlertComponents}
          TeamAbbreviations={TeamAbbreviations[0]}
        />
      ) : null}

      {loadedData === 9 && fontLoaded ? (
        <MorePage update={update[0]} appVersion={appVersion} visible={activeNavIndex === 5} />
      ) : null}

      {fontLoaded && (
        <ConnectionErrorPage
          visible={connectionErrorState}
          command={() => setConnectionErrorState(false)}
        />
      )}

      <AlertBox
        visible={alertVisible}
        title={alertComponents.title}
        message={alertComponents.message}
        buttons={alertComponents.buttons}
        onRequestClose={alertComponents.onCloseAlert}
      />

      {fontLoaded && (
        <View style={styles.bottomView}>
          <LinearGradient colors={[colors.grey, colors.black]} style={styles.gradientView} />

          <View style={styles.navBar}>
            <NavigationButton
              title='scout'
              active={activeNavIndex === 1}
              command={() => setActiveNavIndex(1)}
            />
            <NavigationButton
              title='compare'
              active={activeNavIndex === 2}
              command={() => setActiveNavIndex(2)}
            />
            <NavigationButton
              title='predict'
              active={activeNavIndex === 3}
              command={() => setActiveNavIndex(3)}
            />
            <NavigationButton
              title='simulate'
              active={activeNavIndex === 4}
              command={() => setActiveNavIndex(4)}
            />
            <NavigationButton
              title='more'
              active={activeNavIndex === 5}
              command={() => setActiveNavIndex(5)}
            />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingTop: StatusBar.currentHeight,
  },
  bottomView: { height: '8%', width: '100%' },
  gradientView: { height: '10%', width: '100%' },
  navBar: { flexDirection: 'row', height: '90%', width: '100%' },
});
