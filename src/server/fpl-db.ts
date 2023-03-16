import axios from 'axios';

const BASE_URL = 'https://fantasy.premierleague.com/api';

import { GeneralInfo, FixtureData } from '../interfaces';

export const fetchGeneralInfo = (
  setState: React.Dispatch<React.SetStateAction<GeneralInfo>>,
  onError?: () => void
) => {
  axios
    .get(`${BASE_URL}/bootstrap-static`)
    .then(res => setState(res.data))
    .catch(err => {
      if (onError) onError();
    });
};

export const fetchFixtures = (
  currentGameweek: number,
  setState: React.Dispatch<React.SetStateAction<FixtureData[]>>,
  onError?: () => void
) => {
  axios
    .get(`${BASE_URL}/fixtures?event=${currentGameweek}`)
    .then(res => setState(res.data))
    .catch(err => {
      if (onError) onError();
    });
};
