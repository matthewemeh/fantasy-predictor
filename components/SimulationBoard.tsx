import { Icon } from 'react-native-elements';
import { useEffect, useState, memo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Modal, StyleSheet, FlatList, Text } from 'react-native';

import Timer from './Timer';
import ScoreBoard from './Scoreboard';
import EventActivity from './EventActivity';

import {
  colors,
  shuffle,
  findFontSize,
  randomSelect,
  DEVICE_HEIGHT,
  getRndInteger,
} from '../utilities';

import { Team, EventData } from '../interfaces';
import { EventIndex, SquadDataType } from '../types';

interface Props {
  visible: boolean;
  teamsData: Team[];
  teamName1: string;
  teamName2: string;
  shortTeamName1: string;
  shortTeamName2: string;
  squad2: SquadDataType[];
  squad1: SquadDataType[];
  setBoardVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimulationBoard: React.FC<Props> = ({
  squad1,
  squad2,
  visible,
  teamsData,
  teamName1,
  teamName2,
  shortTeamName1,
  shortTeamName2,
  setBoardVisible,
}) => {
  const MAX_GAMEWEEKS = 3;
  const MIN_DATA_LENGTH = 15;
  const MAX_TEAM_STRENGTH = 5;
  const MATCH_DURATION = 90 * 60;

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [events, setEvents] = useState<EventData[]>([]);
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [indexPool, setIndexPool] = useState<EventIndex[]>([]);

  const [savers1, setSavers1] = useState<string[]>([]);
  const [savers2, setSavers2] = useState<string[]>([]);
  const [goalScorers1, setGoalScorers1] = useState<string[]>([]);
  const [goalScorers2, setGoalScorers2] = useState<string[]>([]);
  const [assistProviders1, setAssistProviders1] = useState<string[]>([]);
  const [assistProviders2, setAssistProviders2] = useState<string[]>([]);
  const strengthHome = teamsData.find(({ name }) => name === teamName1)?.strength ?? 0;
  const strengthAway = teamsData.find(({ name }) => name === teamName2)?.strength ?? 0;

  const reset = () => {
    setTimeInSeconds(0);
    setScore1(0);
    setScore2(0);
    setEvents([]);
    setSavers1([]);
    setSavers2([]);
    setGoalScorers1([]);
    setGoalScorers2([]);
    setAssistProviders1([]);
    setAssistProviders2([]);
  };

  useEffect(() => {
    reset();

    if (visible) {
      const newIndexPool: EventIndex[] = [];
      const dataLength1 = Math.round(MIN_DATA_LENGTH + MAX_TEAM_STRENGTH * strengthHome);
      const dataLength2 = Math.round(MIN_DATA_LENGTH + MAX_TEAM_STRENGTH * strengthAway);

      for (let i = 0; i < dataLength1; i++) newIndexPool.push(0);
      for (let i = 0; i < dataLength2; i++) newIndexPool.push(1);

      shuffle(newIndexPool);
      setIndexPool(newIndexPool);

      initDataArrays();
    }
  }, [visible]);

  useEffect(() => {
    const timer = setTimeout(updateTime, 300);
    return () => clearTimeout(timer);
  }, [timeInSeconds, visible]);

  useEffect(() => {
    // update events as match time passes
    const matchStarted = timeInSeconds > 0;
    const eventHappens = getRndInteger(0, 3) === 1; // randomly decide if event happens or not
    const eventIndex: EventIndex = randomSelect(indexPool); // ...then choose which team has registered a match event
    const newEvent: EventData = {
      saver1: '',
      saver2: '',
      eventType: '',
      onTarget1: '',
      onTarget2: '',
      goalScorer1: '',
      goalScorer2: '',
      assistProvider1: '',
      assistProvider2: '',
      timeStamp: timeInSeconds,
    };

    if (visible && matchStarted && eventHappens) {
      if (eventIndex === 0) {
        const eventPlayerIndex = getRndInteger(0, goalScorers1.length); // choose which player made that match event
        const newSaver = savers2[eventPlayerIndex];
        const newGoalScorer = goalScorers1[eventPlayerIndex];
        const newAssistProvider = assistProviders1[eventPlayerIndex];

        if (newGoalScorer) {
          if (newSaver) {
            newEvent.saver2 = newSaver;
            newEvent.eventType = 'onTarget';
            newEvent.onTarget1 = newGoalScorer;
          } else {
            newEvent.eventType = 'goal';
            newEvent.goalScorer1 = newGoalScorer;
            newEvent.assistProvider1 = newAssistProvider !== newGoalScorer ? newAssistProvider : '';
            setScore1(score1 + 1);
          }
          events.push(newEvent);
        }
      } else {
        const eventPlayerIndex = getRndInteger(0, goalScorers2.length); // choose which player made that match event
        const newSaver = savers1[eventPlayerIndex];
        const newGoalScorer = goalScorers2[eventPlayerIndex];
        const newAssistProvider = assistProviders2[eventPlayerIndex];

        if (newGoalScorer) {
          if (newSaver) {
            newEvent.saver1 = newSaver;
            newEvent.eventType = 'onTarget';
            newEvent.onTarget2 = newGoalScorer;
          } else {
            newEvent.eventType = 'goal';
            newEvent.goalScorer2 = newGoalScorer;
            newEvent.assistProvider2 = newAssistProvider !== newGoalScorer ? newAssistProvider : '';
            setScore2(score2 + 1);
          }
          events.push(newEvent);
        }
      }
    }
  }, [timeInSeconds]);

  const updateTime = () => {
    const increment = getRndInteger(50, 100);

    if (visible) {
      if (timeInSeconds + increment < MATCH_DURATION) setTimeInSeconds(timeInSeconds + increment);
      else setTimeInSeconds(MATCH_DURATION);
    }
  };

  const initDataArrays = () => {
    const dataLength1 = Math.round(MIN_DATA_LENGTH + 10 * (MAX_TEAM_STRENGTH - strengthHome));
    const dataLength2 = Math.round(MIN_DATA_LENGTH + 10 * (MAX_TEAM_STRENGTH - strengthAway));

    const newSavers1: string[] = [];
    const newSavers2: string[] = [];
    const newGoalScorers1: string[] = [];
    const newGoalScorers2: string[] = [];
    const newAssistProviders1: string[] = [];
    const newAssistProviders2: string[] = [];

    // for team1
    squad1.forEach(player => {
      if (player) {
        const { web_name, saves_per_90, expected_goals_per_90, expected_assists_per_90 } = player;

        let saves = Math.round(MAX_GAMEWEEKS * saves_per_90);
        let assists = Math.round(MAX_GAMEWEEKS * expected_assists_per_90);
        let goals_scored = Math.round(MAX_GAMEWEEKS * expected_goals_per_90);

        while (newSavers1.length < dataLength1 && saves > 0) {
          newSavers1.push(web_name);
          saves--;
        }
        while (newAssistProviders1.length < dataLength1 && assists > 0) {
          newAssistProviders1.push(web_name);
          assists--;
        }
        while (newGoalScorers1.length < dataLength1 && goals_scored > 0) {
          newGoalScorers1.push(web_name);
          goals_scored--;
        }
      }
    });

    // fill up remaining data slots until length equals required lengths for each team
    while (newSavers1.length < dataLength1) newSavers1.push('');
    while (newGoalScorers1.length < dataLength1) newGoalScorers1.push('');
    while (newAssistProviders1.length < dataLength1) newAssistProviders1.push('');

    shuffle(newSavers1);
    shuffle(newGoalScorers1);
    shuffle(newAssistProviders1);

    setSavers1(newSavers1);
    setGoalScorers1(newGoalScorers1);
    setAssistProviders1(newAssistProviders1);

    // for team2
    squad2.forEach(player => {
      if (player) {
        const { web_name, saves_per_90, expected_goals_per_90, expected_assists_per_90 } = player;

        let saves = Math.round(MAX_GAMEWEEKS * saves_per_90);
        let assists = Math.round(MAX_GAMEWEEKS * expected_assists_per_90);
        let goals_scored = Math.round(MAX_GAMEWEEKS * expected_goals_per_90);

        while (newSavers2.length < dataLength2 && saves > 0) {
          newSavers2.push(web_name);
          saves--;
        }
        while (newAssistProviders2.length < dataLength2 && assists > 0) {
          newAssistProviders2.push(web_name);
          assists--;
        }
        while (newGoalScorers2.length < dataLength2 && goals_scored > 0) {
          newGoalScorers2.push(web_name);
          goals_scored--;
        }
      }
    });

    // fill up remaining data slots until length equals required lengths for each team
    while (newSavers2.length < dataLength2) newSavers2.push('');
    while (newGoalScorers2.length < dataLength2) newGoalScorers2.push('');
    while (newAssistProviders2.length < dataLength2) newAssistProviders2.push('');

    shuffle(newSavers2);
    shuffle(newGoalScorers2);
    shuffle(newAssistProviders2);

    setSavers2(newSavers2);
    setGoalScorers2(newGoalScorers2);
    setAssistProviders2(newAssistProviders2);
  };

  const onRequestClose = () => setBoardVisible(false);

  const refresh = () => {
    setScore1(0);
    setScore2(0);
    setEvents([]);
    setTimeInSeconds(0);
  };

  const PLAYER_ITEM_HEIGHT = DEVICE_HEIGHT * 0.085;

  const separator = () => <View style={styles.separator} />;

  const listEmptyComponent = () => (
    <View style={styles.listEmptyComponentView}>
      <Icon name='futbol-o' type='font-awesome' color={colors.gray} size={findFontSize(45)} />
      <Text style={styles.listEmptyComponentText}>
        Match events will be displayed here once they are available
      </Text>
    </View>
  );

  const getItemLayout = (data: any, index: number) => ({
    length: PLAYER_ITEM_HEIGHT,
    offset: PLAYER_ITEM_HEIGHT * index,
    index,
  });

  const renderItem = ({ item }: { item: EventData }) => <EventActivity event={item} />;

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Timer timeInSeconds={timeInSeconds} />

          <ScoreBoard
            score1={score1}
            score2={score2}
            shortTeamName1={shortTeamName1}
            shortTeamName2={shortTeamName2}
          />
        </View>

        <LinearGradient colors={[colors.athens, colors.alto]} style={styles.gradientView} />

        <FlatList
          data={events}
          style={styles.body}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={separator}
          ListEmptyComponent={listEmptyComponent}
        />

        <LinearGradient colors={[colors.alto, colors.athens]} style={styles.gradientView} />

        <View style={styles.bottom}>
          <Icon
            name='undo'
            onPress={refresh}
            type='font-awesome'
            color={colors.forward}
            size={findFontSize(45)}
          />
          <Icon
            name='times'
            type='font-awesome'
            color={colors.forward}
            size={findFontSize(45)}
            onPress={onRequestClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: { width: '100%', height: '100%' },
  gradientView: { height: '0.5%', width: '100%' },
  header: { width: '100%', height: '20%' },
  body: { width: '100%', height: '69%', backgroundColor: colors.alto },
  bottom: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  separator: { width: '100%', height: DEVICE_HEIGHT * 0.005 },
  listEmptyComponentView: {
    rowGap: 10,
    height: '100%',
    display: 'flex',
    paddingTop: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '16%',
  },
  listEmptyComponentText: {
    fontSize: 14.5,
    color: colors.gray,
    textAlign: 'center',
    fontFamily: 'PoppinsBold',
  },
});

export default memo(SimulationBoard);
