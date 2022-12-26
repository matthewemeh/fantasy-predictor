import React, { useState, useEffect, createContext } from 'react';
import { useFonts } from 'expo-font';
import {
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
import Navigation from './components/Navigation';
import ComparismPage from './Pages/ComparismPage';
import SimulationPage from './Pages/SimulationPage';

import { colors } from './constants';
import { numbersInString, sum } from './utilities';

import { getAll } from './api/server';
import db from './firebase';
import { onSnapshot, collection, query, where } from 'firebase/firestore';

export const AppContext = createContext();

export default function App() {
  LogBox.ignoreLogs(['Setting a timer', 'VirtualizedList', 'Require cycle']);

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

  const appVersion = '2023-2024_11';
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
  const URI =
    'mongodb+srv://mongo:hmj6QdfRGLOl2f2W@cluster0.lex5a.mongodb.net/app_data?retryWrites=true&w=majority';

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
    getAll(URI, 'players').then(res => setPlayerData(res));
  }, []);

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
    if (loadedData < 9 && !connectionErrorState) {
      const timer = setTimeout(() => setConnectionErrorState(loadedData < 9), 15000);
      return () => clearTimeout(timer);
    }
  }, [loadedData, connectionErrorState]);

  useEffect(() => {
    if (loadedData === 9 && fontLoaded) {
      setConnectionErrorState(false);
      setActiveNavIndex(3);
    }
  }, [loadedData, fontLoaded]);

  const closeAlert = () => setAlertVisible(false);

  StatusBar.setBackgroundColor('#00000050');

  return loadedData === 9 && fontLoaded ? (
    <AppContext.Provider
      value={{
        playerData,
        fieldImage,
        appVersion,
        alertVisible,
        setAlertVisible,
        update: update[0],
        setAlertComponents,
        teams: teams[0].teams,
        playerKit: shirtLinks[0],
        goalieKit: shirtLinks[1],
        selections: selections[0],
        nextOpponent: nextOpponent[0],
        currentGW: update[0].currentGW,
        StandardRatings: StandardRatings[0],
        TeamAbbreviations: TeamAbbreviations[0],
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={0}
        enabled={Platform.OS === 'ios'}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar translucent={true} />

        <ScoutPage visible={activeNavIndex === 1} />

        <ComparismPage visible={activeNavIndex === 2} />

        <FantasyPage visible={activeNavIndex === 3} />

        <SimulationPage visible={activeNavIndex === 4} />

        <MorePage visible={activeNavIndex === 5} />

        <AlertBox
          visible={alertVisible}
          title={alertComponents.title}
          message={alertComponents.message}
          buttons={alertComponents.buttons}
          onRequestClose={alertComponents.onCloseAlert}
        />

        <Navigation activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex} />
      </KeyboardAvoidingView>
    </AppContext.Provider>
  ) : (
    <LoadingPage
      connectionErrorState={connectionErrorState}
      command={() => setConnectionErrorState(false)}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
    paddingTop: StatusBar.currentHeight,
  },
});
