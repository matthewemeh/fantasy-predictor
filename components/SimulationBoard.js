import React, { useEffect, useState, memo } from 'react';
import { Icon } from 'react-native-elements';
import { View, Modal, StyleSheet, FlatList } from 'react-native';

import Timer from './Timer';
import ScoreBoard from './Scoreboard';
import EventActivity from './EventActivity';

import { colors } from '../constants';
import {
  shuffle,
  findData,
  findReturns,
  findFontSize,
  randomSelect,
  getRndInteger,
} from '../utilities';

const SimulationBoard = ({
  squad1,
  squad2,
  visible,
  teamName1,
  teamName2,
  playerData,
  StandardRatings,
  setBoardVisible,
  TeamAbbreviations,
}) => {
  const minLength = 10;
  const { teamIndex } = StandardRatings;
  const [events, setEvents] = useState([]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [goals1, setGoals1] = useState([]);
  const [goals2, setGoals2] = useState([]);
  const [saves1, setSaves1] = useState([]);
  const [saves2, setSaves2] = useState([]);
  const [assists1, setAssists1] = useState([]);
  const [assists2, setAssists2] = useState([]);
  const [indexPool, setIndexPool] = useState([]);
  const [timeInSeconds, setTimeInSeconds] = useState(0);

  const reset = () => {
    setTimeInSeconds(0);
    setScore1(0);
    setScore2(0);
    setEvents([]);
    setGoals1([]);
    setGoals2([]);
    setSaves1([]);
    setSaves2([]);
    setAssists1([]);
    setAssists2([]);
  };

  useEffect(() => {
    reset();

    if (visible) {
      const newIndexPool = [];
      const data1Length = Math.round(minLength + 10 * teamIndex[teamName1]);
      const data2Length = Math.round(minLength + 10 * teamIndex[teamName2]);

      for (let i = 0; i < data1Length; i++) newIndexPool.push(0);
      for (let i = 0; i < data2Length; i++) newIndexPool.push(1);

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
    const index = randomSelect(indexPool);
    const eventHappen = getRndInteger(0, 4) === 1;

    if (eventHappen && visible && timeInSeconds !== 0) {
      if (index === 0) {
        const eventIndex = getRndInteger(0, goals1.length);
        if (goals1[eventIndex]) {
          if (saves2[eventIndex]) {
            events.push({
              eventType: 'onTarget',
              goalScorer1: '',
              assistProvider1: '',
              onTarget1: goals1[eventIndex],
              saver1: '',
              goalScorer2: '',
              assistProvider2: '',
              onTarget2: '',
              saver2: saves2[eventIndex] || '',
              timeStamp: timeInSeconds,
            });
          } else {
            events.push({
              eventType: 'goal',
              goalScorer1: goals1[eventIndex],
              assistProvider1:
                assists1[eventIndex] && assists1[eventIndex] !== goals1[eventIndex]
                  ? assists1[eventIndex]
                  : 'None',
              onTarget1: '',
              saver1: '',
              goalScorer2: '',
              assistProvider2: '',
              onTarget2: '',
              saver2: '',
              timeStamp: timeInSeconds,
            });
            setScore1(score1 + 1);
          }
        }
      } else {
        const eventIndex = getRndInteger(0, goals2.length);
        if (goals2[eventIndex]) {
          if (saves1[eventIndex]) {
            events.push({
              eventType: 'onTarget',
              goalScorer1: '',
              assistProvider1: '',
              onTarget1: '',
              saver1: saves1[eventIndex] || '',
              goalScorer2: '',
              assistProvider2: '',
              onTarget2: goals2[eventIndex],
              saver2: '',
              timeStamp: timeInSeconds,
            });
          } else {
            events.push({
              eventType: 'goal',
              goalScorer1: '',
              assistProvider1: '',
              onTarget1: '',
              saver1: '',
              goalScorer2: goals2[eventIndex],
              assistProvider2:
                assists2[eventIndex] && assists2[eventIndex] !== goals2[eventIndex]
                  ? assists2[eventIndex]
                  : 'None',
              onTarget2: '',
              saver2: '',
              timeStamp: timeInSeconds,
            });
            setScore2(score2 + 1);
          }
        }
      }
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
    const data1Length = Math.round(minLength + 10 * (3 - teamIndex[teamName1]));
    const data2Length = Math.round(minLength + 10 * (3 - teamIndex[teamName2]));

    // for team1
    for (let i = 0; i < squad1.length; i++) {
      const { playerName, key } = squad1[i];
      const { position } = findData(key, playerData);
      const { goals, assists, saves } = findReturns(key, StandardRatings, playerData);
      const truthValue = (position === 'defender' && goals > 3) || position !== 'defender';

      if (goals1.length + goals <= data1Length && truthValue) {
        for (let i = 0; i < goals; i++) goals1.push(playerName);
      }
      if (assists1.length + assists <= data1Length) {
        for (let i = 0; i < assists; i++) assists1.push(playerName);
      }
      if (saves1.length + saves <= data1Length) {
        for (let i = 0; i < saves; i++) saves1.push(playerName);
      }
    }

    // fill up remaining data slots until length equals required lengths
    while (goals1.length < data1Length) goals1.push('');
    while (saves1.length < data1Length) saves1.push('');
    while (assists1.length < data1Length) assists1.push('');

    shuffle(goals1);
    shuffle(saves1);
    shuffle(assists1);

    setGoals1(goals1);
    setSaves1(saves1);
    setAssists1(assists1);

    // for team2
    for (let i = 0; i < squad2.length; i++) {
      const { playerName, key } = squad2[i];
      const { position } = findData(key, playerData);
      const { goals, assists, saves } = findReturns(key, StandardRatings, playerData);
      const truthValue = (position === 'defender' && goals > 3) || position !== 'defender';

      if (goals2.length + goals <= data2Length && truthValue) {
        for (let i = 0; i < goals; i++) goals2.push(playerName);
      }
      if (assists2.length + assists <= data2Length) {
        for (let i = 0; i < assists; i++) assists2.push(playerName);
      }
      if (saves2.length + saves <= data2Length) {
        for (let i = 0; i < saves; i++) saves2.push(playerName);
      }
    }

    // fill up remaining data slots until length equals required lengths
    while (goals2.length < data2Length) goals2.push('');
    while (saves2.length < data2Length) saves2.push('');
    while (assists2.length < data2Length) assists2.push('');

    shuffle(goals2);
    shuffle(saves2);
    shuffle(assists2);

    setGoals2(goals2);
    setSaves2(saves2);
    setAssists2(assists2);
  };

  const onRequestClose = () => setBoardVisible(false);

  const refresh = () => {
    setTimeInSeconds(0);
    setEvents([]);
    setScore1(0);
    setScore2(0);
  };

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.main}>
        <View style={styles.header}>
          <Timer timeInSeconds={timeInSeconds} />

          <ScoreBoard
            score1={score1}
            score2={score2}
            teamName1={teamName1}
            teamName2={teamName2}
            TeamAbbreviations={TeamAbbreviations}
          />
        </View>

        <View style={styles.body}>
          <FlatList data={events} renderItem={({ item }) => <EventActivity event={item} />} />
        </View>

        <View style={styles.bottom}>
          <Icon
            name='refresh'
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
  header: { width: '100%', height: '20%', borderBottomWidth: 2 },
  body: { width: '100%', height: '70%', backgroundColor: colors.grey },
  bottom: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default memo(SimulationBoard);
