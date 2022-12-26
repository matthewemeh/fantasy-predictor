import regression from 'regression';
import { Dimensions } from 'react-native';
import { colors, navIcon } from './constants';

export const defaultAdHeight = 55;
export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

const baseWidth = 376.47059527510464;
const baseHeight = 705.0980524006648;
const scaleWidth = deviceWidth / baseWidth;
const scaleHeight = deviceHeight / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const findFontSize = size => Math.ceil(size * scale);

export const activityImage = {
  goalImage: require('./assets/Activity/goal.webp'),
  assistImage: require('./assets/Activity/assist.webp'),
  saveImage: require('./assets/Activity/gloves.webp'),
  onTargetImage: require('./assets/Activity/aim.webp'),
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

export const findRotationAngle = index => {
  if (index >= 8) return '0deg';
  else if (index >= 6) return '45deg';
  else if (index >= 4) return '90deg';
  else if (index >= 2) return '135deg';
  else return '180deg';
};

export const sum = array => (array.length > 0 ? array.reduce((x, y) => x + y) : 0);

export const average = array => (array.length > 0 ? sum(array) / array.length : 0);

export const findAverageOfOpponentIndex = (fixtures, teamIndices) => {
  const opponents = fixtures.split(',');
  const opponentIndices = opponents.map(opponent => {
    const bracketIndex = opponent.indexOf('(');
    const opponentFullName = opponent.substring(0, bracketIndex);

    return teamIndices[opponentFullName];
  });

  return average(opponentIndices).toFixed(1);
};

const getPointsData = array => array.map((point, index) => [index + 1, point]);

export const predict = (playerDetails, StandardRatings, nextOpponent, gameweek) => {
  const { available, team, index, points } = playerDetails;
  const opponent = nextOpponent[team];

  if (!available || opponent === 'No Opponent') return 0;

  const { teamIndex } = StandardRatings;
  const teamRating = teamIndex[team];
  const pointsRange = -gameweek;
  const pointsData = getPointsData(points.slice(pointsRange));
  const results = regression.linear(pointsData);

  const [, pointsAverage] = results.predict(gameweek);
  const opponentIndex = findAverageOfOpponentIndex(opponent, teamIndex);

  const predictedPoint =
    0.8 * pointsAverage - Math.E ** (0.5 * opponentIndex) + teamRating + 0.1 * index;

  return predictedPoint > 0 ? Math.ceil(predictedPoint) : 0;
};

export const descendingPointsOrder = (a, b) => sum(b.points.slice(-3)) - sum(a.points.slice(-3));

export const findData = (playerKey, playerData) => playerData.find(({ key }) => key === playerKey);

export const findPlayerInfo = (playerKey, property, playerData) => {
  const player = findData(playerKey, playerData);
  return player && player[property];
};

export const findReturns = (playerKey, StandardRatings, playerData, pointsRange = -3) => {
  const points = findPlayerInfo(playerKey, 'points', playerData).slice(pointsRange);
  const position = findPlayerInfo(playerKey, 'position', playerData);
  const {
    goalPoint,
    assistPoint,
    savesPerPoint,
    minBonusPoint,
    maxBonusPoint,
    appearancePoint,
    cleanSheetPoint,
    savedPenaltyPoint,
  } = StandardRatings;
  let goals = 0,
    assists = 0,
    saves = 0,
    bonus = 0;

  for (let i = 0; i < points.length; i++) {
    let pts = points[i] - appearancePoint;
    let tempGoals = 0,
      tempAssists = 0,
      tempSaves = 0,
      tempBonus = 0;

    while (pts > 0) {
      if (position === 'goalkeeper') {
        if (pts >= cleanSheetPoint[position]) {
          pts -= cleanSheetPoint[position];
          tempSaves += 1;
        }
        if (pts >= savedPenaltyPoint) {
          tempSaves += 1;
          pts -= savedPenaltyPoint;
        }
        if (pts >= 1) {
          tempSaves += savesPerPoint[position];
          pts -= 1;
        }
        if (pts >= assistPoint[position]) {
          tempAssists += 1;
          pts -= assistPoint[position];
        }
        if (pts >= minBonusPoint && tempBonus < maxBonusPoint) {
          tempBonus += minBonusPoint;
          pts -= minBonusPoint;
        }
        if (pts >= goalPoint[position]) {
          tempGoals += 1;
          pts -= goalPoint[position];
        }
      } else {
        if (pts >= cleanSheetPoint[position]) pts -= cleanSheetPoint[position];
        if (pts >= goalPoint[position]) {
          tempGoals += 1;
          pts -= goalPoint[position];
        }
        if (pts >= assistPoint[position]) {
          tempAssists += 1;
          pts -= assistPoint[position];
        }
        if (pts >= minBonusPoint && tempBonus < maxBonusPoint) {
          tempBonus += minBonusPoint;
          pts -= minBonusPoint;
        }
      }
    }

    goals += tempGoals;
    assists += tempAssists;
    saves += tempSaves;
    bonus += tempBonus;
  }

  return { goals, assists, saves, bonus };
};

export const findAbbreviation = (teamName, TeamAbbreviations) =>
  teamName === 'All Teams' ? 'null' : TeamAbbreviations[teamName];

export const findOpponentAbbreviation = (team, nextOpponent, TeamAbbreviations) => {
  const opponent = nextOpponent[team];

  if (opponent === 'No Opponent') return '-';

  const opponents = opponent.split(',');
  const opponentAbbreviations = opponents.map(opponent => {
    const bracketIndex = opponent.indexOf('(');
    const teamName = opponent.substring(0, bracketIndex);
    const teamAbbName = TeamAbbreviations[teamName];
    const playingGround = opponent.substring(bracketIndex);

    return `${teamAbbName}${playingGround}`.toUpperCase();
  });

  return opponentAbbreviations.join(',');
};

export const getRndInteger = (min, max) => {
  // returns a random integer from min to (max - 1)
  return Math.floor(Math.random() * (max - min)) + min;
};

export const findNavIcon = type => navIcon[type];

export const isNumber = string => {
  const numberPattern = /^\d$/;

  if (string.length > 1) {
    for (let i = 0; i < string.length; i++) {
      if (!numberPattern.test(string[i])) return false;
    }
    return true;
  }

  return numberPattern.test(string);
};

export const numbersInString = string => {
  const sepChar = ',';
  let newString = '';

  for (let i = 0; i < string.length; i++) newString += isNumber(string[i]) ? string[i] : sepChar;

  // convert strings to numbers
  const numberArray = newString.split(sepChar).map(Number);

  // if any remove NaN, then return numbers
  return numberArray.filter(num => !isNaN(num));
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
    key: key,
    playerKey: '',
    captain: false,
    playerName: '',
    playerContent: '',
    shirtImage: unknownImage,
  };
};

export const randomSelect = array => array[getRndInteger(0, array.length)];

export const findGameweekNumber = string => {
  let stringNumber = '0';

  for (let i = 0; i < string.length; i++) {
    if (isNumber(string[i])) stringNumber += string[i];
  }

  return parseInt(stringNumber);
};

export const findScaledFontSize = (text, maxTextLength, normalSize, scale) => {
  return text && text.length >= maxTextLength
    ? findFontSize(normalSize) / (scale * text.length)
    : findFontSize(normalSize);
};

export const isDocumentValid = (document, requiredKeys) => {
  const docKeys = Object.keys(document);
  const docValues = Object.values(document);

  const docKeysLength = docKeys.length;
  const requiredKeysLength = requiredKeys.length;

  if (docKeysLength < requiredKeysLength) return false;

  // check if all required keys are in document
  for (let i = 0; i < requiredKeysLength; i++) {
    if (!docKeys.includes(requiredKeys[i])) return false;
  }

  // check if all values in document are defined
  for (let j = 0; j < docKeysLength; j++) {
    if (docValues[j] === undefined) return false;
  }

  return true;
};
