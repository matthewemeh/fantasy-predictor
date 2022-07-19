import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  LogBox,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

import { numbersInString, sum } from './utilities';
import { colors } from './constants';
import AlertBox from './components/AlertBox';
import NavigationButton from './components/NavigationButton';
import FantasyPage from './Pages/FantasyPage';
import MorePage from './Pages/MorePage';
import ScoutPage from './Pages/ScoutPage';
import SimulationPage from './Pages/SimulationPage';
import LoadingPage from './Pages/LoadingPage';
import ConnectionErrorPage from './Pages/ConnectionErrorPage';
import db from './firebase';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import ComparismPage from './Pages/ComparismPage';

export default function App() {
  LogBox.ignoreLogs(['Setting a timer', 'VirtualizedList']);
  const [fontLoaded] = useFonts({
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });
  const fieldImage = require('./assets/field.png');
  const [button1_state, setButton1_state] = useState(false);
  const [button2_state, setButton2_state] = useState(false);
  const [button3_state, setButton3_state] = useState(true);
  const [button4_state, setButton4_state] = useState(false);
  const [button5_state, setButton5_state] = useState(false);
  const [loadedData, setLoadedData] = useState(0);
  const [alertState, setAlertState] = useState(false);
  const [alertComponents, setAlertComponents] = useState({
    title: '',
    message: '',
    buttons: [],
    onCloseAlert: null,
  });
  const appVersion = '2023-2024_2';
  const [queryComplete, setQueryComplete] = useState(false);
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

  function getPlayerData(relegatedTeams) {
    // relegated teams' array length must be at least 1 and should never exceed 10!!!
    if (relegatedTeams.length === 0) relegatedTeams = [''];
    while (relegatedTeams.length > 10) relegatedTeams.pop();

    if (playerData.length === 0) {
      const q = query(collection(db, 'players'), where('team', 'not-in', relegatedTeams));
      onSnapshot(q, querySnapshot => querySnapshot.forEach(doc => playerData.push(doc.data())));
      setQueryComplete(true);
    }
  }

  function getTeams() {
    onSnapshot(collection(db, 'teams'), snapshot => setTeams(snapshot.docs.map(doc => doc.data())));
  }

  function getRatings() {
    onSnapshot(collection(db, 'StandardRatings'), snapshot =>
      setStandardRatings(snapshot.docs.map(doc => doc.data()))
    );
  }

  function getNextOpponents() {
    onSnapshot(collection(db, 'nextOpponent'), snapshot =>
      setNextOpponent(snapshot.docs.map(doc => doc.data()))
    );
  }

  function getAbbreviations() {
    onSnapshot(collection(db, 'abbreviations'), snapshot =>
      setTeamAbbreviations(snapshot.docs.map(doc => doc.data()))
    );
  }

  function getSelections() {
    onSnapshot(collection(db, 'selection'), snapshot =>
      setSelections(snapshot.docs.map(doc => doc.data()))
    );
  }

  function getRelegatedTeams() {
    onSnapshot(collection(db, 'relegatedTeams'), snapshot =>
      setRelegatedTeams(snapshot.docs.map(doc => doc.data()))
    );
  }

  function getUpdates() {
    onSnapshot(collection(db, 'updates'), snapshot =>
      setUpdate(snapshot.docs.map(doc => doc.data()))
    );
  }

  function checkForUpdate() {
    if (update.length !== 0) {
      if (update[0].info !== '') {
        setAlertComponents({
          title: 'Info',
          message: `${update[0].info}`,
          buttons: [['OK', closeAlert]],
          onCloseAlert: closeAlert,
        });
        setAlertState(true);
      }
      if (sum(numbersInString(update[0].currentVersion)) > sum(numbersInString(appVersion))) {
        setAlertComponents({
          title: 'Update Available',
          message:
            'There is an update available for this app. Please kindly update to enjoy the latest features.',
          buttons: [['UPDATE', () => Linking.openURL(update[0].updateLink)]],
          onCloseAlert: null,
        });
        setAlertState(true);
      }
    }
  }

  function getShirtLinks() {
    onSnapshot(collection(db, 'teamImageUrls'), snapshot => {
      setShirtLinks(snapshot.docs.map(doc => doc.data()));
    });
  }

  useEffect(checkForUpdate, [update]);

  useEffect(() => {
    let tempLoadedData = 0;
    [
      teams,
      selections,
      relegatedTeams,
      TeamAbbreviations,
      nextOpponent,
      StandardRatings,
      update,
      shirtLinks,
    ].map(item => (tempLoadedData += item.length > 0));
    setLoadedData(tempLoadedData + queryComplete);
  }, [
    playerData,
    teams,
    selections,
    relegatedTeams,
    TeamAbbreviations,
    nextOpponent,
    StandardRatings,
    update,
    shirtLinks,
    queryComplete,
  ]);

  useEffect(() => {
    if (relegatedTeams.length > 0) getPlayerData(relegatedTeams[0].relegatedTeams);
  }, [relegatedTeams]);

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
      switchActiveButton(3);
      setContent(
        <FantasyPage
          playerData={playerData}
          teams={teams[0].teams}
          playerKit={shirtLinks[0]}
          goalieKit={shirtLinks[1]}
          fieldImage={fieldImage}
          nextOpponent={nextOpponent[0]}
          TeamAbbreviations={TeamAbbreviations[0]}
          StandardRatings={StandardRatings[0]}
        />
      );
    }
  }, [loadedData, fontLoaded]);

  function switchActiveButton(n) {
    setButton1_state(false);
    setButton2_state(false);
    setButton3_state(false);
    setButton4_state(false);
    setButton5_state(false);
    switch (n) {
      case 1:
        setButton1_state(true);
        break;
      case 2:
        setButton2_state(true);
        break;
      case 3:
        setButton3_state(true);
        break;
      case 4:
        setButton4_state(true);
        break;
      case 5:
        setButton5_state(true);
        break;
    }
  }

  function closeAlert() {
    setAlertState(false);
  }

  const [content, setContent] = useState(<LoadingPage />);

  StatusBar.setBackgroundColor('#00000050');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
      enabled={Platform.OS === 'ios' ? true : false}
    >
      <StatusBar translucent={true}></StatusBar>

      {content}

      <ConnectionErrorPage
        visible={connectionErrorState && fontLoaded}
        command={() => setConnectionErrorState(false)}
      />

      <AlertBox
        visible={alertState}
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
              title={'Scout'}
              type={'selection'}
              active={button1_state}
              command={() => {
                switchActiveButton(1);
                setContent(
                  <ScoutPage
                    playerData={playerData}
                    playerKit={shirtLinks[0]}
                    goalieKit={shirtLinks[1]}
                    selections={selections[0]}
                    fieldImage={fieldImage}
                    teams={teams[0].teams}
                    nextOpponent={nextOpponent[0]}
                    TeamAbbreviations={TeamAbbreviations[0]}
                    currentGW={update[0].currentGW}
                  />
                );
              }}
            />
            <NavigationButton
              title={'Compare'}
              type={'compare'}
              active={button2_state}
              command={() => {
                switchActiveButton(2);
                setContent(
                  <ComparismPage
                    playerData={playerData}
                    teams={teams[0].teams}
                    playerKit={shirtLinks[0]}
                    goalieKit={shirtLinks[1]}
                    nextOpponent={nextOpponent[0]}
                    TeamAbbreviations={TeamAbbreviations[0]}
                    StandardRatings={StandardRatings[0]}
                  />
                );
              }}
            />
            <NavigationButton
              title={'Predict'}
              type={'shirt'}
              active={button3_state}
              command={() => {
                switchActiveButton(3);
                setContent(
                  <FantasyPage
                    playerData={playerData}
                    teams={teams[0].teams}
                    playerKit={shirtLinks[0]}
                    goalieKit={shirtLinks[1]}
                    fieldImage={fieldImage}
                    nextOpponent={nextOpponent[0]}
                    selections={selections[0]}
                    TeamAbbreviations={TeamAbbreviations[0]}
                    StandardRatings={StandardRatings[0]}
                  />
                );
              }}
            />
            <NavigationButton
              title={'Simulate'}
              type={'simulate'}
              active={button4_state}
              command={() => {
                switchActiveButton(4);
                setContent(
                  <SimulationPage
                    playerData={playerData}
                    teams={teams[0].teams}
                    playerKit={shirtLinks[0]}
                    goalieKit={shirtLinks[1]}
                    fieldImage={fieldImage}
                    nextOpponent={nextOpponent[0]}
                    TeamAbbreviations={TeamAbbreviations[0]}
                    StandardRatings={StandardRatings[0]}
                  />
                );
              }}
            />
            <NavigationButton
              title={'More'}
              type={'settings'}
              active={button5_state}
              command={() => {
                switchActiveButton(5);
                setContent(<MorePage update={update[0]} appVersion={appVersion} />);
              }}
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
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.white,
    justifyContent: 'flex-end',
  },
  navBar: { flexDirection: 'row', height: '90%', width: '100%' },
  bottomView: { height: '8%', width: '100%' },
  gradientView: { height: '10%', width: '100%' },
});
