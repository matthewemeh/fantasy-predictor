import { useState, useEffect, createContext } from 'react';
import { useFonts } from 'expo-font';
import {
  LogBox,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import appDetails from './app.json';

import AlertBox from './components/AlertBox';
import Navigation from './components/Navigation';

import MoreScreen from './screens/MoreScreen';
import ScoutScreen from './screens/ScoutScreen';
import FantasyScreen from './screens/FantasyScreen';
import LoadingScreen from './screens/LoadingScreen';
import ComparismScreen from './screens/ComparismScreen';
import SimulationScreen from './screens/SimulationScreen';

import { numbersInString, sum, findGameweekType, colors } from './utilities';

import { fetchData } from './server/firebase-db';
import { fetchFixtures, fetchGeneralInfo } from './server/fpl-db';

import {
  Team,
  KitData,
  Element,
  Fixture,
  AlertData,
  UpdateData,
  GeneralInfo,
  ElementType,
  OpponentData,
  SelectionData,
  AppContextData,
} from './interfaces';
import { GameweekType } from './types';

export const AppContext = createContext<AppContextData>({});

export default function App() {
  StatusBar.setBackgroundColor(colors.statusBarBackground);
  LogBox.ignoreLogs(['Setting a timer', 'VirtualizedList', 'Require cycle']);

  const [fontLoaded] = useFonts({
    PoppinsBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
  });
  const TIMEOUT = 10000;
  const appVersion = appDetails.expo.version;
  const fieldImage = require('./assets/field.png');
  const [alertVisible, setAlertVisible] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [fpl_db_loaded, set_fpl_db_loaded] = useState(false);
  const [firebaseDBLoaded, setFirebaseDBLoaded] = useState(false);
  const [connectionErrorOccured, setConnectionErrorOccured] = useState(false);
  const [alertComponents, setAlertComponents] = useState<AlertData>({
    title: '',
    message: '',
    buttons: [],
    onCloseAlert: () => {},
  });

  // data to be obtained from firebase db data
  const [update, setUpdate] = useState<UpdateData[]>([]);
  const [shirtLinks, setShirtLinks] = useState<KitData[]>([]);
  const [selections, setSelections] = useState<SelectionData[]>([]);

  // data to be obtained from FPL API data
  const [teams, setTeams] = useState<string[]>([]);
  const [currentGW, setCurrentGW] = useState(-1);
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [playerData, setPlayerData] = useState<Element[]>([]);
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({});
  const [fixturesData, setFixturesData] = useState<Fixture[]>([]);
  const [nextOpponent, setNextOpponent] = useState<OpponentData[]>([]);
  const [positionData, setPositionData] = useState<ElementType[]>([]);
  const [currentGWType, setCurrentGWType] = useState<GameweekType>('GW');

  const expectedDataFromFPL = [generalInfo, fixturesData];
  const expectedDataFromFirebase = [update, selections, shirtLinks];

  const closeAlert = () => setAlertVisible(false);

  const checkForInfoMessage = (info: string) => {
    if (info) {
      setAlertComponents({
        title: 'Info',
        message: info,
        onCloseAlert: closeAlert,
        buttons: [{ text: 'OK', onPress: closeAlert }],
      });
      setAlertVisible(true);
    }
  };

  const checkForUpdate = (
    currentVersion: string,
    updateLink: string,
    forceCurrentVersion: boolean
  ) => {
    if (sum(numbersInString(currentVersion)) > sum(numbersInString(appVersion))) {
      setAlertComponents({
        title: 'Update Available',
        onCloseAlert: forceCurrentVersion ? () => {} : closeAlert,
        buttons: [{ text: 'UPDATE', onPress: () => Linking.openURL(updateLink) }],
        message:
          'There is an update available for this app. Please kindly update to enjoy the latest features.',
      });
      setAlertVisible(true);
    }
  };

  const onError = () => setConnectionErrorOccured(true);

  const retry = () => {
    setConnectionErrorOccured(false);
    if (!fpl_db_loaded) fetchGeneralInfo(setGeneralInfo, onError);
  };

  useEffect(() => {
    if (update.length > 0) {
      const { currentVersion, updateLink, forceCurrentVersion, info } = update[0];

      checkForInfoMessage(info); // check for any messages to be shown to clients
      checkForUpdate(currentVersion, updateLink, forceCurrentVersion);
    }
  }, [update]);

  useEffect(() => {
    // check if all data expected from firebase database has been fetched
    let dbLoaded = true,
      expectedDataLength = expectedDataFromFirebase.length;

    while (dbLoaded && expectedDataLength > 0) {
      if (expectedDataFromFirebase[expectedDataLength - 1].length === 0) {
        dbLoaded = false;
      }
      expectedDataLength--;
    }

    setFirebaseDBLoaded(dbLoaded);
  }, expectedDataFromFirebase);

  useEffect(() => {
    // check if all data expected from fpl api has been fetched
    let dbLoaded = true,
      expectedDataLength = expectedDataFromFPL.length;

    while (dbLoaded && expectedDataLength > 0) {
      const item = expectedDataFromFPL[expectedDataLength - 1];

      if (Array.isArray(item) && item.length === 0) {
        dbLoaded = false;
      } else if (typeof item === 'object' && Object.values(item).length === 0) {
        dbLoaded = false;
      }
      expectedDataLength--;
    }

    set_fpl_db_loaded(dbLoaded);
  }, expectedDataFromFPL);

  // componentDidMount
  useEffect(() => {
    if (update.length === 0) fetchData('updates', setUpdate);
    if (selections.length === 0) fetchData('selection', setSelections);
    if (shirtLinks.length === 0) fetchData('teamImageUrls', setShirtLinks);

    fetchGeneralInfo(setGeneralInfo, onError);
  }, []);

  useEffect(() => {
    if (Object.keys(generalInfo).length > 0) {
      // ...then get and set basic gameweek and players/elements information
      const { events, teams, elements, element_types } = generalInfo;

      if (events) {
        // set current gameweek
        const currentGWData = events.find(
          ({ is_current, is_next, finished }) => (is_current && !finished) || is_next
        );
        if (currentGWData) setCurrentGW(currentGWData?.id || -1);
      }

      if (teams) {
        // set teams and their data
        setTeamsData(teams);
        setTeams(teams.map(({ name }) => name).sort());
      }

      // set players' data
      if (elements) setPlayerData(elements);

      // set positions data
      if (element_types) setPositionData(element_types);
    }
  }, [generalInfo]);

  useEffect(() => {
    if (currentGW > 0) fetchFixtures(currentGW, setFixturesData, onError);
  }, [currentGW]);

  useEffect(() => {
    if (fixturesData.length > 0 && teamsData.length > 0) {
      // update current gameweek type
      setCurrentGWType(findGameweekType(fixturesData));

      // set opponents for current gameweek
      let newNextOpponent: OpponentData[] = [];

      teamsData.forEach(({ id }) => {
        let opponent: OpponentData = { team: 0, opponents: [] };
        let fixtures = fixturesData.filter(({ team_a, team_h }) => team_a === id || team_h === id);

        opponent.team = id;
        fixtures.forEach(({ team_a, team_h, team_h_difficulty, team_a_difficulty }) => {
          let oldOpponents = opponent.opponents;

          if (team_a === id) {
            opponent.opponents = [
              ...oldOpponents,
              { team: team_h, status: 'away', difficulty: team_a_difficulty },
            ];
          } else if (team_h === id) {
            opponent.opponents = [
              ...oldOpponents,
              { team: team_a, status: 'home', difficulty: team_h_difficulty },
            ];
          }
        });
        newNextOpponent.push(opponent);
      });
      setNextOpponent([...newNextOpponent]);
    }
  }, [fixturesData, teamsData]);

  useEffect(() => {
    if (!firebaseDBLoaded || !fpl_db_loaded) {
      const timer = setTimeout(() => setConnectionErrorOccured(true), TIMEOUT);
      return () => clearTimeout(timer);
    } else if (firebaseDBLoaded && fpl_db_loaded && fontLoaded) {
      setConnectionErrorOccured(false);
      setActiveNavIndex(3);
    }
  }, [firebaseDBLoaded, fpl_db_loaded, fontLoaded, connectionErrorOccured]);

  return firebaseDBLoaded && fpl_db_loaded && fontLoaded ? (
    <AppContext.Provider
      value={{
        teams,
        teamsData,
        currentGW,
        playerData,
        fieldImage,
        appVersion,
        fixturesData,
        positionData,
        nextOpponent,
        alertVisible,
        currentGWType,
        setAlertVisible,
        update: update[0],
        setAlertComponents,
        playerKit: shirtLinks[0],
        goalieKit: shirtLinks[1],
        selections: selections[0],
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={0}
        enabled={Platform.OS === 'ios'}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar translucent={true} />

        <ScoutScreen visible={activeNavIndex === 1} />

        <ComparismScreen visible={activeNavIndex === 2} />

        <FantasyScreen visible={activeNavIndex === 3} />

        <SimulationScreen visible={activeNavIndex === 4} />

        <MoreScreen visible={activeNavIndex === 5} />

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
    <LoadingScreen
      command={retry}
      fontLoaded={fontLoaded}
      connectionErrorOccured={connectionErrorOccured}
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
