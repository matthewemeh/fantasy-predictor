import React, { useEffect, useState, memo } from 'react';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Modal, StyleSheet, FlatList } from 'react-native';

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
  player,
} from '../utilities';

import { EventType, SquadDataType } from '../types';
import { TeamData, PositionData } from '../interfaces';

interface Props {
  squad1: SquadDataType[];
  squad2: SquadDataType[];
  visible: boolean;
  teamsData: TeamData[];
  teamName1: string;
  teamName2: string;
  positionData: PositionData[];
  shortTeamName1: string;
  shortTeamName2: string;
  setBoardVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimulationBoard: React.FC<Props> = ({
  squad1,
  squad2,
  visible,
  teamsData,
  teamName1,
  teamName2,
  positionData,
  shortTeamName1,
  shortTeamName2,
  setBoardVisible,
}) => {
  const MIN_LENGTH = 15;
  const MAX_STRENGTH = 5;
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [indexPool, setIndexPool] = useState<number[]>([]);

  const [savers1, setSavers1] = useState<string[]>([]);
  const [savers2, setSavers2] = useState<string[]>([]);
  const [goalScorers1, setGoalScorers1] = useState<string[]>([]);
  const [goalScorers2, setGoalScorers2] = useState<string[]>([]);
  const [assistProviders1, setAssistProviders1] = useState<string[]>([]);
  const [assistProviders2, setAssistProviders2] = useState<string[]>([]);
  const strengthHome = teamsData.find(({ name }) => name === teamName1)?.strength || 0;
  const strengthAway = teamsData.find(({ name }) => name === teamName2)?.strength || 0;

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
      const newIndexPool: number[] = [];
      const dataLength1 = Math.round(MIN_LENGTH + 10 * strengthHome);
      const dataLength2 = Math.round(MIN_LENGTH + 10 * strengthAway);

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
    const matchStarted = timeInSeconds !== 0;
    const eventIndex = randomSelect(indexPool); // first choose which team has registered a match event...
    const eventHappens = getRndInteger(0, 3) === 1; // ...then randomly decide if event happens or not
    const newEvent = {
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
            newEvent.assistProvider1 =
              newAssistProvider && newAssistProvider !== newGoalScorer ? newAssistProvider : 'None';
            setScore1(score1 + 1);
          }
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
            newEvent.assistProvider2 =
              newAssistProvider && newAssistProvider !== newGoalScorer ? newAssistProvider : 'None';
            setScore2(score2 + 1);
          }
        }
      }

      events.push(newEvent);
    }
  }, [timeInSeconds]);

  const updateTime = () => {
    const increment = getRndInteger(50, 100);

    if (visible) {
      if (timeInSeconds + increment < 5400) setTimeInSeconds(timeInSeconds + increment);
      else setTimeInSeconds(5400);
    }
  };

  const initDataArrays = () => {
    const dataLength1 = Math.round(MIN_LENGTH + 10 * (MAX_STRENGTH - strengthHome));
    const dataLength2 = Math.round(MIN_LENGTH + 10 * (MAX_STRENGTH - strengthAway));
    const defendersID = positionData.find(
      ({ singular_name }) => singular_name.toLowerCase() === 'defender'
    )?.id;

    // for team1
    squad1.forEach(player => {
      if (player) {
        let { web_name, element_type, goals_scored, assists, saves } = player;
        // make sure that for the defenders, only those with at least 4 goals can be potential goal scorers
        const defenderGoalsAccepted =
          (element_type === defendersID && goals_scored > 3) || element_type !== defendersID;

        while (savers1.length < dataLength2 && saves > 0) {
          savers1.push(web_name);
          saves--;
        }
        while (assistProviders1.length < dataLength1 && assists > 0) {
          assistProviders1.push(web_name);
          assists--;
        }
        while (goalScorers1.length < dataLength1 && defenderGoalsAccepted && goals_scored > 0) {
          goalScorers1.push(web_name);
          goals_scored--;
        }
      }
    });

    // fill up remaining data slots until length equals required lengths for each team
    while (savers1.length < dataLength2) savers1.push('');
    while (goalScorers1.length < dataLength1) goalScorers1.push('');
    while (assistProviders1.length < dataLength1) assistProviders1.push('');

    shuffle(savers1);
    shuffle(goalScorers1);
    shuffle(assistProviders1);

    // for team2
    squad2.forEach(player => {
      if (player) {
        let { web_name, element_type, goals_scored, assists, saves } = player;
        // make sure that for the defenders, only those with at least 4 goals can be potential goal scorers
        const defenderGoalsAccepted =
          (element_type === defendersID && goals_scored > 3) || element_type !== defendersID;

        while (savers2.length < dataLength1 && saves > 0) {
          savers2.push(web_name);
          saves--;
        }
        while (assistProviders2.length < dataLength2 && assists > 0) {
          assistProviders2.push(web_name);
          assists--;
        }
        while (goalScorers2.length < dataLength2 && defenderGoalsAccepted && goals_scored > 0) {
          goalScorers2.push(web_name);
          goals_scored--;
        }
      }
    });

    // fill up remaining data slots until length equals required lengths for each team
    while (savers2.length < dataLength1) savers2.push('');
    while (goalScorers2.length < dataLength2) goalScorers2.push('');
    while (assistProviders2.length < dataLength2) assistProviders2.push('');

    shuffle(savers2);
    shuffle(goalScorers2);
    shuffle(assistProviders2);
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

  const getItemLayout = (data: any, index: number) => ({
    length: PLAYER_ITEM_HEIGHT,
    offset: PLAYER_ITEM_HEIGHT * index,
    index,
  });

  const renderItem = ({ item }: { item: EventType }) => <EventActivity event={item} />;

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
});

export default memo(SimulationBoard);
