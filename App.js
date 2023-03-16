import React, { useState, useEffect, createContext } from 'react';
import { useFonts } from 'expo-font';
import { LogBox, Linking, Platform, StatusBar, StyleSheet, KeyboardAvoidingView, } from 'react-native';
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
export const AppContext = createContext({});
export default function App() {
    StatusBar.setBackgroundColor(colors.statusBarBackground);
    LogBox.ignoreLogs(['Setting a timer', 'VirtualizedList', 'Require cycle']);
    const [fontLoaded] = useFonts({
        PoppinsBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
        PoppinsRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    });
    const appVersion = appDetails.expo.version;
    const fieldImage = require('./assets/field.png');
    const [alertVisible, setAlertVisible] = useState(false);
    const [activeNavIndex, setActiveNavIndex] = useState(0);
    const [fpl_db_loaded, set_fpl_db_loaded] = useState(false);
    const [firebaseDBLoaded, setFirebaseDBLoaded] = useState(false);
    const [connectionErrorState, setConnectionErrorState] = useState(false);
    const [alertComponents, setAlertComponents] = useState({
        title: '',
        message: '',
        buttons: [],
        onCloseAlert: () => { },
    });
    // data to be obtained from firebase db data
    const [update, setUpdate] = useState([]);
    const [shirtLinks, setShirtLinks] = useState([]);
    const [selections, setSelections] = useState([]);
    // data to be obtained from FPL API data
    const [teams, setTeams] = useState([]);
    const [currentGW, setCurrentGW] = useState(-1);
    const [teamsData, setTeamsData] = useState([]);
    const [playerData, setPlayerData] = useState([]);
    const [generalInfo, setGeneralInfo] = useState({});
    const [fixturesData, setFixturesData] = useState([]);
    const [nextOpponent, setNextOpponent] = useState([]);
    const [positionData, setPositionData] = useState([]);
    const [currentGWType, setCurrentGWType] = useState('GW');
    const [gameweekFinished, setGameweekFinished] = useState(false);
    const expectedDataFromFPL = [generalInfo, fixturesData];
    const expectedDataFromFirebase = [update, selections, shirtLinks];
    const checkForUpdate = () => {
        if (update.length > 0) {
            const { info, currentVersion, updateLink } = update[0];
            if (info && firebaseDBLoaded) {
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
                    onCloseAlert: () => { },
                    title: 'Update Available',
                    buttons: [{ text: 'UPDATE', onPress: () => Linking.openURL(updateLink) }],
                    message: 'There is an update available for this app. Please kindly update to enjoy the latest features.',
                });
                setAlertVisible(true);
            }
        }
    };
    const onError = () => setConnectionErrorState(true);
    const closeAlert = () => setAlertVisible(false);
    useEffect(checkForUpdate, [update, firebaseDBLoaded]);
    useEffect(() => {
        // check if all data expected from firebase database has been fetched
        let dbLoaded = true, expectedDataLength = expectedDataFromFirebase.length;
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
        let dbLoaded = true, expectedDataLength = expectedDataFromFPL.length;
        while (dbLoaded && expectedDataLength > 0) {
            const item = expectedDataFromFPL[expectedDataLength - 1];
            if (Array.isArray(item) && item.length === 0) {
                dbLoaded = false;
            }
            else if (typeof item === 'object' && Object.values(item).length === 0) {
                dbLoaded = false;
            }
            expectedDataLength--;
        }
        set_fpl_db_loaded(dbLoaded);
    }, expectedDataFromFPL);
    // componentDidMount
    useEffect(() => {
        if (update.length === 0)
            fetchData('updates', setUpdate);
        if (selections.length === 0)
            fetchData('selection', setSelections);
        if (shirtLinks.length === 0)
            fetchData('teamImageUrls', setShirtLinks);
        fetchGeneralInfo(setGeneralInfo);
    }, []);
    useEffect(() => {
        if (Object.keys(generalInfo).length > 0) {
            // ...then get and set basic gameweek and players/elements information
            const { events, teams, elements, element_types } = generalInfo;
            if (events) {
                // set current gameweek
                const currentGWData = events.find(({ is_current }) => is_current);
                if (currentGWData) {
                    setCurrentGW(currentGWData?.id || -1);
                    setGameweekFinished(currentGWData?.finished);
                }
            }
            if (teams) {
                // set teams and their data
                setTeamsData(teams);
                setTeams(teams.map(({ name }) => name).sort());
            }
            // set players' data
            if (elements)
                setPlayerData(elements);
            // set positions data
            if (element_types)
                setPositionData(element_types);
        }
    }, [generalInfo]);
    useEffect(() => {
        if (currentGW > 0)
            fetchFixtures(currentGW, setFixturesData, onError);
    }, [currentGW]);
    useEffect(() => {
        if (fixturesData.length > 0 && teamsData.length > 0) {
            // update current gameweek type
            setCurrentGWType(findGameweekType(fixturesData));
            // set opponents for current gameweek
            teamsData.forEach(({ id }) => {
                let newOpponent = { team: 0, opponents: [] };
                let fixtures = fixturesData.filter(({ team_a, team_h }) => team_a === id || team_h === id);
                newOpponent.team === id;
                fixtures.forEach(({ team_a, team_h, team_h_difficulty, team_a_difficulty }) => {
                    let oldOpponents = newOpponent.opponents;
                    if (team_a === id) {
                        newOpponent.opponents = [
                            ...oldOpponents,
                            { team: team_h, status: 'away', difficulty: team_a_difficulty },
                        ];
                    }
                    else if (team_h === id) {
                        newOpponent.opponents = [
                            ...oldOpponents,
                            { team: team_a, status: 'home', difficulty: team_h_difficulty },
                        ];
                    }
                });
                setNextOpponent([...nextOpponent, newOpponent]);
            });
        }
    }, [fixturesData, teamsData]);
    useEffect(() => {
        if (!(firebaseDBLoaded || fpl_db_loaded) && !connectionErrorState) {
            const timer = setTimeout(() => setConnectionErrorState(false), 20000);
            return () => clearTimeout(timer);
        }
    }, [firebaseDBLoaded, fpl_db_loaded, connectionErrorState]);
    useEffect(() => {
        if (firebaseDBLoaded && fpl_db_loaded && fontLoaded) {
            setConnectionErrorState(false);
            setActiveNavIndex(3);
        }
    }, [firebaseDBLoaded, fpl_db_loaded, fontLoaded]);
    return firebaseDBLoaded && fpl_db_loaded && fontLoaded ? (<AppContext.Provider value={{
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
            gameweekFinished,
            update: update[0],
            setAlertComponents,
            playerKit: shirtLinks[0],
            goalieKit: shirtLinks[1],
            selections: selections[0],
        }}>
      <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={0} enabled={Platform.OS === 'ios'} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar translucent={true}/>

        <ScoutScreen visible={activeNavIndex === 1}/>

        <ComparismScreen visible={activeNavIndex === 2}/>

        <FantasyScreen visible={activeNavIndex === 3}/>

        <SimulationScreen visible={activeNavIndex === 4}/>

        <MoreScreen visible={activeNavIndex === 5}/>

        <AlertBox visible={alertVisible} title={alertComponents.title} message={alertComponents.message} buttons={alertComponents.buttons} onRequestClose={alertComponents.onCloseAlert}/>

        <Navigation activeNavIndex={activeNavIndex} setActiveNavIndex={setActiveNavIndex}/>
      </KeyboardAvoidingView>
    </AppContext.Provider>) : (<LoadingScreen connectionErrorState={connectionErrorState} command={() => setConnectionErrorState(false)}/>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.white,
        paddingTop: StatusBar.currentHeight,
    },
});
