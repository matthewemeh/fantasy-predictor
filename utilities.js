import { Dimensions } from 'react-native';
import { colors, activeNavButton, inactiveNavButton } from './constants';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
export const defaultAdHeight = 55;

const product = array => {
  let prod = 1;
  array.map(point => (prod *= point > 0 ? point : 1));
  return prod;
};

const baseWidth = 376.47059527510464;
const baseHeight = 705.0980524006648;
const scaleWidth = deviceWidth / baseWidth;
const scaleHeight = deviceHeight / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const findFontSize = size => Math.ceil(size * scale);

export const activity = {
  goal: require('./assets/Activity/goal.webp'),
  assist: require('./assets/Activity/assist.webp'),
  save: require('./assets/Activity/gloves.webp'),
  onTarget: require('./assets/Activity/aim.webp'),
};

export const unknownImage = require('./assets/unknown.webp');

export const findColor = (index, value1, value2, type = 'forward') => {
  switch (index) {
    case 1:
      if (value1 > value2) return type === 'forward' ? colors.emerald : colors.secondary;
      return type === 'forward' ? colors.secondary : colors.emerald;
    case 2:
      if (value1 < value2) return type === 'forward' ? colors.emerald : colors.secondary;
      return type === 'forward' ? colors.secondary : colors.emerald;
    default:
      return colors.secondary;
  }
};

export const findArrow = index => {
  if (index > 0 && index <= 2) return require('./assets/Arrows/arrowDown.webp');
  else if (index > 2 && index <= 4) return require('./assets/Arrows/arrowDownRight.webp');
  else if (index > 4 && index <= 6) return require('./assets/Arrows/arrowRight.webp');
  else if (index > 6 && index <= 8) return require('./assets/Arrows/arrowUpRight.webp');
  else if (index > 8 && index <= 10) return require('./assets/Arrows/arrowUp.webp');
  return require('./assets/Arrows/arrowDown.webp');
};

export const findAverageOfOpponentIndex = (opponent, ratings) => {
  let opponentList = opponent.split(',');
  let opponentIndexList = [];
  opponentList.map(item =>
    opponentIndexList.push(ratings.teamIndex[item.substring(0, item.indexOf('('))])
  );
  return (sum(opponentIndexList) / opponentIndexList.length).toFixed(1);
};

export const predict = (playerInfo, StandardRatings, nextOpponent) => {
  let points = playerInfo.points.slice(-3);
  let team = playerInfo.team;
  let index = playerInfo.index;
  // let teamRating = StandardRatings.teamIndex[playerInfo.team];
  let opponent = nextOpponent[team];
  if (!playerInfo.available || opponent === 'No Opponent') return 0;
  let opponentIndex = findAverageOfOpponentIndex(opponent, StandardRatings);
  let predictedPoint = Math.pow(product(points), 1 / points.length);
  predictedPoint -= opponentIndex * 1.5;
  predictedPoint += index / 2;
  predictedPoint = Math.floor(predictedPoint);

  return predictedPoint >= 0 ? predictedPoint : 2;
};

export const sum = numberList => numberList.reduce((x, y) => x + y);

export const descendingPointsOrder = (a, b) => sum(a.points.slice(-3)) < sum(b.points.slice(-3));

export const findPlayerInfo = (playerKey, property, playerData) => {
  let player = playerData.find(player => player.key === playerKey);
  if (playerKey === '') return true;
  return player[property];
};

export const findInfo = (playerKey, StandardRatings, playerData) => {
  let points = findPlayerInfo(playerKey, 'points', playerData).slice(-3);
  let pos = findPlayerInfo(playerKey, 'position', playerData);
  let goals = 0;
  let assists = 0;
  let saves = 0;
  let bonus = 0;
  for (let i = 0; i < points.length; i++) {
    let pts = points[i] - StandardRatings.appearancePoint;
    let tempGoals = 0;
    let tempAssists = 0;
    let tempSaves = 0;
    let tempBonus = 0;
    while (pts > 0) {
      if (pos === 'goalkeeper') {
        if (pts >= StandardRatings.cleanSheetPoint[pos]) {
          pts -= StandardRatings.cleanSheetPoint[pos];
          tempSaves += 1;
        }
        if (pts >= StandardRatings.savedPenaltyPoint) {
          tempSaves += 1;
          pts -= StandardRatings.savedPenaltyPoint;
        }
        if (pts >= 1) {
          tempSaves += StandardRatings.savesPerPoint[pos];
          pts -= 1;
        }
        if (pts >= StandardRatings.goalPoint[pos]) {
          tempGoals += 1;
          pts -= StandardRatings.goalPoint[pos];
        }
        if (pts >= StandardRatings.assistPoint[pos]) {
          tempAssists += 1;
          pts -= StandardRatings.assistPoint[pos];
        }
        if (pts >= StandardRatings.minBonusPoint && tempBonus < StandardRatings.maxBonusPoint) {
          tempBonus += StandardRatings.minBonusPoint;
          pts -= StandardRatings.minBonusPoint;
        }
      } else {
        if (pts >= StandardRatings.cleanSheetPoint[pos])
          pts -= StandardRatings.cleanSheetPoint[pos];
        if (pts >= StandardRatings.goalPoint[pos]) {
          tempGoals += 1;
          pts -= StandardRatings.goalPoint[pos];
        }
        if (pts >= StandardRatings.assistPoint[pos]) {
          tempAssists += 1;
          pts -= StandardRatings.assistPoint[pos];
        }
        if (pts >= StandardRatings.minBonusPoint && tempBonus < StandardRatings.maxBonusPoint) {
          tempBonus += StandardRatings.minBonusPoint;
          pts -= StandardRatings.minBonusPoint;
        }
      }
    }
    goals += tempGoals;
    assists += tempAssists;
    saves += tempSaves;
    bonus += tempBonus;
  }
  return { goals: goals, assists: assists, saves: saves, bonus: bonus };
};

export const findAbbreviation = (teamName, TeamAbbreviations) =>
  teamName !== 'All Teams' ? TeamAbbreviations[teamName] : 'null';

// export const isRelegated = (playerTeam, relegatedTeams) =>
//   relegatedTeams.some(team => team === playerTeam);

export const findData = (playerKey, playerData) =>
  playerData.find(player => player.key === playerKey);

export const findOpponentAbbreviation = (team, nextOpponent, TeamAbbreviations) => {
  let opponent = nextOpponent[team];
  if (opponent === 'No Opponent') return '-';
  let tempTeams = opponent.split(',');
  let tempTeamsLength = tempTeams.length;
  let opponentAbbreviation = '';
  tempTeams.map(
    team =>
      (opponentAbbreviation += `${
        TeamAbbreviations[team.substring(0, team.indexOf('('))]
      }${team.substring(team.indexOf('('))}${
        team !== tempTeams[tempTeamsLength - 1] ? ',' : ''
      }`.toUpperCase())
  );
  return opponentAbbreviation;
};

export const getRndInteger = (min, max) => {
  // returns a random integer from min to (max - 1)
  return Math.floor(Math.random() * (max - min)) + min;
};

export const sumOfPoints = playerInfo => {
  let sum = 0;
  playerInfo.map(item => (sum += item.playerContent));
  return sum;
};

export const averageOfPoints = playerInfo =>
  Math.round(sumOfPoints(playerInfo) / playerInfo.length);

export const highestPoint = playerInfo => {
  let points = [];
  playerInfo.map(item => points.push(item.playerContent));
  return Math.max(...points);
};

export const findImage = (isActive, type) =>
  isActive ? activeNavButton[type] : inactiveNavButton[type];

export const numbersInString = string => {
  const sepChar = ',';
  let newString = '';

  // version string should not contain dots(.) to avoid unexpected results!!!!
  for (let i = 0; i < string.length; i++) newString += isNaN(string[i]) ? sepChar : string[i];

  // convert strings to numbers
  newString = newString.split(sepChar).map(num => parseInt(num));

  return newString;
};

export const shuffle = array => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

export const player = key => {
  return {
    playerName: '',
    playerKey: '',
    key: key,
    shirtImage: unknownImage,
    playerContent: '',
    captain: false,
  };
};

export const capitalize = word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
