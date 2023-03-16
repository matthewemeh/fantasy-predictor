import { Dimensions } from 'react-native';
import { ElementData, TeamData, FixtureData, OpponentData, PlayerInfoData } from './interfaces';

export const DEFAULT_AD_HEIGHT = 55;
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;

const BASE_WIDTH = 376.47059527510464;
const BASE_HEIGHT = 705.0980524006648;
const SCALE_WIDTH = DEVICE_WIDTH / BASE_WIDTH;
const SCALE_HEIGHT = DEVICE_HEIGHT / BASE_HEIGHT;
const SCALE = Math.min(SCALE_WIDTH, SCALE_HEIGHT);

export const colors = {
  springGreen: '#00ff91',
  alto: '#d4d4d4',
  stratos: '#00002d',
  lemonGrass: '#94948d',
  goalkeeper: '#ebff00',
  defender: '#2afd8c',
  midfielder: '#2bf0fd',
  forward: '#e0115f',
  red: '#e00',
  white: '#fff',
  black: '#000',
  emerald: '#4fc978',
  athens: '#000000a0',
  blueRibbon: '#026fe6',
  pattensBlue: '#d9f1ff',
  nameViewColor: '#016a39',
  contentViewColor: '#01532d',
  lemonGrassLight: '#94948da0',
  alertBackground: '#000000a0',
  playingChance0: '#c0020d',
  playingChance25: '#d44401',
  playingChance50: '#ffab1b',
  playingChance75: '#ffe65b',
  playingChance100: '#01532d',
  statusBarBackground: '#00000050',
};

export const findPlayingChanceColor = (chanceOfPlayingRound: number) => {
  switch (chanceOfPlayingRound) {
    case 0:
      return colors.playingChance0;
    case 25:
      return colors.playingChance25;
    case 50:
      return colors.playingChance50;
    case 75:
      return colors.playingChance75;
    case 100:
      return colors.playingChance100;

    default:
      return colors.playingChance100;
  }
};

export const fieldConstants = {
  formations: ['3-5-2', '3-4-3', '4-4-2', '4-3-3', '4-5-1', '5-3-2', '5-2-3', '5-4-1'],
};

const navIcon: { [key: string]: any } = {
  more: require('./assets/NavigationImages/settings.webp'),
  predict: require('./assets/NavigationImages/shirt.webp'),
  scout: require('./assets/NavigationImages/selection.webp'),
  compare: require('./assets/NavigationImages/compare.webp'),
  simulate: require('./assets/NavigationImages/simulate.webp'),
};

export const findFontSize = (size: number) => Math.ceil(size * SCALE);

export const activityImage = {
  goalImage: require('./assets/Activity/goal.webp'),
  assistImage: require('./assets/Activity/assist.webp'),
  saveImage: require('./assets/Activity/gloves.webp'),
  onTargetImage: require('./assets/Activity/aim.webp'),
};

export const unknownImage = require('./assets/unknown.webp');

export const findColor = (index: number, value1: number, value2: number, type = 'forward') => {
  switch (index) {
    case 1:
      if (value1 > value2) return type === 'forward' ? colors.emerald : colors.stratos;
      return type === 'forward' ? colors.stratos : colors.emerald;
    case 2:
      if (value1 < value2) return type === 'forward' ? colors.emerald : colors.stratos;
      return type === 'forward' ? colors.stratos : colors.emerald;
    default:
      return colors.stratos;
  }
};

export const findRotationAngle = (index: number) => {
  if (index >= 8) return '0deg';
  else if (index >= 6) return '45deg';
  else if (index >= 4) return '90deg';
  else if (index >= 2) return '135deg';
  else return '180deg';
};

export const sum = (array: number[]) => (array.length > 0 ? array.reduce((x, y) => x + y) : 0);

export const average = (array: number[]) => (array.length > 0 ? sum(array) / array.length : 0);

export const descendingPointsOrder = (a: ElementData, b: ElementData) =>
  b.total_points - a.total_points;

export const findData = (playerID: number, playerData: ElementData[] | undefined) =>
  playerData?.find(({ id }) => id === playerID);

export const findPlayerInfo = (
  playerID: number,
  property: string,
  playerData: ElementData[] | undefined
) => {
  const player = findData(playerID, playerData) as any;

  return player && player[property];
};

export const findOpponentAbbreviation = (
  teamID: number,
  nextOpponent: OpponentData[] | undefined,
  teamsData: TeamData[] | undefined
) => {
  const { team, opponents } = nextOpponent?.find(({ team }) => team === teamID) || {};

  if (!opponents || !team) return '-';

  let newAbbreviation = '';
  opponents.forEach(({ team, status }, index) => {
    const statusSuffix = status === 'home' ? '(H)' : '(A)';
    const separator = index < opponents.length - 1 ? ',' : '';
    const shortName = teamsData?.find(({ id }) => id === team)?.short_name || '';

    newAbbreviation += `${shortName}${statusSuffix}${separator}`;
  });

  return newAbbreviation.toUpperCase();
};

export const getRndInteger = (min: number, max: number) => {
  // returns a random integer from min to (max - 1)
  return Math.floor(Math.random() * (max - min)) + min;
};

export const findNavIcon = (type: string) => navIcon[type];

export const isNumber = (text: string) => {
  const numberPattern = /^\d$/;

  if (text.length > 1) {
    for (let i = 0; i < text.length; i++) {
      if (!numberPattern.test(text[i])) return false;
    }
    return true;
  }

  return numberPattern.test(text);
};

export const numbersInString = (text: string) => {
  const sepChar = ',';
  let newString = '';

  for (let i = 0; i < text.length; i++) newString += isNumber(text[i]) ? text[i] : sepChar;

  // convert strings to numbers
  const numberArray = newString.split(sepChar).map(Number);

  // if any remove NaN, then return numbers
  return numberArray.filter(num => !isNaN(num));
};

export const shuffle = (array: any[]) => {
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

export const player = (index: number): PlayerInfoData => ({
  index,
  playerID: -1,
  playerName: '',
  isCaptain: false,
  playerContent: '',
  shirtImage: unknownImage,
});

export const findTeamNumberOfMatches = (fixturesData: FixtureData[]) => {
  let teamMatches: { [key: string]: number } = {};

  fixturesData.forEach(({ team_a, team_h }) => {
    if (team_a in teamMatches) {
      let oldCount = teamMatches[team_a];
      teamMatches[team_a] = oldCount + 1;
    } else {
      teamMatches[team_a] = 1;
    }

    if (team_h in teamMatches) {
      let oldCount = teamMatches[team_h];
      teamMatches[team_h] = oldCount + 1;
    } else {
      teamMatches[team_h] = 1;
    }
  });

  return teamMatches;
};

export const findGameweekType = (fixturesData: FixtureData[]) => {
  let numberOfGames: number[] = [];
  let highestNumberOfGames = 0;
  let teamMatches = findTeamNumberOfMatches(fixturesData);

  numberOfGames = Object.values(teamMatches);
  highestNumberOfGames = Math.max(...numberOfGames);

  if (highestNumberOfGames === 3) return 'TGW';
  else if (highestNumberOfGames === 2 && numberOfGames.filter(GW => GW === 2).length > 1)
    return 'DGW';
  else if (numberOfGames.length < 20) return 'BGW';
  return 'GW';
};

export const randomSelect = (array: any[]) => array[getRndInteger(0, array.length)];

export const findScaledFontSize = (
  text: string,
  maxTextLength: number,
  normalSize: number,
  scale: number
) => {
  return text && text.length >= maxTextLength
    ? findFontSize(normalSize) / (scale * text.length)
    : findFontSize(normalSize);
};
