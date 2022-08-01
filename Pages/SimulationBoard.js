import React, { useEffect, useState } from 'react';
import { View, Modal, StyleSheet, Text, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';

import Timer from '../components/Timer';
import ScoreBoard from '../components/Scoreboard';
import { colors } from '../constants';
import EventActivity from '../components/EventActivity';
import {
  getRndInteger,
  findPlayerInfo,
  shuffle,
  findInfo,
  findAbbreviation,
  findFontSize,
} from '../utilities';

function SimulationBoard({
  team1,
  team2,
  visible,
  teamName1,
  teamName2,
  playerData,
  onRequestClose,
  StandardRatings,
  TeamAbbreviations,
}) {
  const [events, setEvents] = useState([]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [goals1, setGoals1] = useState([]);
  const [assists1, setAssists1] = useState([]);
  const [saves1, setSaves1] = useState([]);
  const [goals2, setGoals2] = useState([]);
  const [assists2, setAssists2] = useState([]);
  const [saves2, setSaves2] = useState([]);
  const [timeInSeconds, setTimeInSeconds] = useState(0);

  function reset() {
    setTimeInSeconds(0);
    setScore1(0);
    setScore2(0);
    setEvents([]);
    setGoals1([]);
    setAssists1([]);
    setSaves1([]);
    setGoals2([]);
    setAssists2([]);
    setSaves2([]);
    setEvents([]);
  }

  useEffect(() => {
    if (visible) {
      reset();
      initDataArrays();
    }
  }, [visible]);

  useEffect(() => {
    let eventHappen = getRndInteger(0, 4) === 1;
    let teamIndex = getRndInteger(0, 2);
    if (eventHappen) {
      if (teamIndex === 0) {
        let eventIndex = getRndInteger(0, goals1.length);
        if (goals1[eventIndex] !== '') {
          if (saves2[eventIndex] === '') {
            events.push({
              eventType: 'goal',
              goalScorer1: goals1[eventIndex],
              assistProvider1:
                assists1[eventIndex] !== '' && assists1[eventIndex] !== goals1[eventIndex]
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
          } else {
            events.push({
              eventType: 'onTarget',
              goalScorer1: '',
              assistProvider1: '',
              onTarget1: goals1[eventIndex],
              saver1: '',
              goalScorer2: '',
              assistProvider2: '',
              onTarget2: '',
              saver2: saves2[eventIndex] ? saves2[eventIndex] : '',
              timeStamp: timeInSeconds,
            });
          }
        }
      } else {
        let eventIndex = getRndInteger(0, goals2.length);
        if (goals2[eventIndex] !== '') {
          if (saves1[eventIndex] === '') {
            events.push({
              eventType: 'goal',
              goalScorer1: '',
              assistProvider1: '',
              onTarget1: '',
              saver1: '',
              goalScorer2: goals2[eventIndex],
              assistProvider2:
                assists2[eventIndex] !== '' && assists2[eventIndex] !== goals2[eventIndex]
                  ? assists2[eventIndex]
                  : 'None',
              onTarget2: '',
              saver2: '',
              timeStamp: timeInSeconds,
            });
            setScore2(score2 + 1);
          } else {
            events.push({
              eventType: 'onTarget',
              goalScorer1: '',
              assistProvider1: '',
              onTarget1: '',
              saver1: saves1[eventIndex] ? saves1[eventIndex] : '',
              goalScorer2: '',
              assistProvider2: '',
              onTarget2: goals2[eventIndex],
              saver2: '',
              timeStamp: timeInSeconds,
            });
          }
        }
      }
    }
  }, [timeInSeconds]);

  function updateTime() {
    let increment = getRndInteger(50, 100);
    if (visible) {
      if (timeInSeconds + increment < 5400) setTimeInSeconds(timeInSeconds + increment);
      else setTimeInSeconds(5400);
    }
  }

  function initDataArrays() {
    let minLength = 10;
    let data1Length = minLength + 10 * (3 - StandardRatings.teamIndex[teamName1]);
    let data2Length = minLength + 10 * (3 - StandardRatings.teamIndex[teamName2]);

    // for team1
    for (let i = 0; i < team1.length; i++) {
      let name = team1[i].playerName;
      let playerKey = team1[i].key;
      let info = findInfo(playerKey, StandardRatings, playerData);
      let truthValue =
        (findPlayerInfo(playerKey, 'position', playerData) === 'defender' && info.goals > 3) ||
        findPlayerInfo(playerKey, 'position', playerData) !== 'defender';
      if (goals1.length + info.goals <= data1Length && truthValue) {
        for (let i = 0; i < info.goals; i++) goals1.push(name);
      }
      if (assists1.length + info.assists <= data1Length) {
        for (let i = 0; i < info.assists; i++) assists1.push(name);
      }
      if (saves1.length + info.saves <= data1Length) {
        for (let i = 0; i < info.saves; i++) saves1.push(name);
      }
    }
    while (goals1.length < data1Length) goals1.push('');
    while (assists1.length < data1Length) assists1.push('');
    while (saves1.length < data1Length) saves1.push('');

    shuffle(goals1);
    shuffle(assists1);
    shuffle(saves1);

    setGoals1(goals1);
    setAssists1(assists1);
    setSaves1(saves1);

    // for team2
    for (let i = 0; i < team2.length; i++) {
      let name = team2[i].playerName;
      let playerKey = team2[i].key;
      let info = findInfo(playerKey, StandardRatings, playerData);
      let truthValue =
        (findPlayerInfo(playerKey, 'position', playerData) === 'defender' && info.goals > 3) ||
        findPlayerInfo(playerKey, 'position', playerData) !== 'defender';
      if (goals2.length + info.goals <= data2Length && truthValue) {
        for (let i = 0; i < info.goals; i++) goals2.push(name);
      }
      if (assists2.length + info.assists <= data2Length) {
        for (let i = 0; i < info.assists; i++) assists2.push(name);
      }
      if (saves2.length + info.saves <= data2Length) {
        for (let i = 0; i < info.saves; i++) saves2.push(name);
      }
    }
    while (goals2.length < data2Length) goals2.push('');
    while (assists2.length < data2Length) assists2.push('');
    while (saves2.length < data2Length) saves2.push('');

    shuffle(goals2);
    shuffle(assists2);
    shuffle(saves2);

    setGoals2(goals2);
    setAssists2(assists2);
    setSaves2(saves2);
  }

  useEffect(() => {
    const timer = setTimeout(updateTime, 300);
    return () => clearTimeout(timer);
  }, [timeInSeconds, visible]);

  function closeCommand() {
    reset();
    // additional command from outside this file
    onRequestClose();
  }

  function refresh() {
    setTimeInSeconds(0);
    setEvents([]);
    setScore1(0);
    setScore2(0);
  }

  return (
    <Modal visible={visible} onRequestClose={closeCommand}>
      <View style={styles.mainView}>
        <View style={styles.headerView}>
          <View style={styles.timerView}>
            <Timer timeInSeconds={timeInSeconds} />
          </View>
          <View style={styles.scoreBoardView}>
            <Text allowFontScaling={false} style={styles.teamTextStyle}>
              {findAbbreviation(teamName1, TeamAbbreviations)}
            </Text>
            <ScoreBoard score1={score1} score2={score2} />
            <Text allowFontScaling={false} style={styles.teamTextStyle}>
              {findAbbreviation(teamName2, TeamAbbreviations)}
            </Text>
          </View>
        </View>
        <View style={styles.bodyView}>
          <FlatList data={events} renderItem={({ item }) => <EventActivity event={item} />} />
        </View>
        <View style={styles.bottomView}>
          <Icon
            name='refresh'
            type='font-awesome'
            size={findFontSize(45)}
            color={colors.forward}
            onPress={refresh}
          />
          <Icon
            name='times'
            type='font-awesome'
            size={findFontSize(45)}
            color={colors.forward}
            onPress={closeCommand}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainView: { width: '100%', height: '100%' },
  headerView: { width: '100%', height: '20%', borderBottomWidth: 2 },
  bodyView: { width: '100%', height: '70%', backgroundColor: colors.grey },
  bottomView: {
    flexDirection: 'row',
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  timerView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
    backgroundColor: colors.forward,
  },
  scoreBoardView: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  teamTextStyle: {
    width: '25%',
    height: '100%',
    fontSize: findFontSize(19),
    color: colors.forward,
    fontFamily: 'PoppinsBold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default React.memo(SimulationBoard);
