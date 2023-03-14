import axios from 'axios';

const BASE_URL = 'https://fantasy.premierleague.com/api';

export const fetchGeneralInfo = (setState, onError) => {
  axios
    .get(`${BASE_URL}/bootstrap-static`)
    .then(res => setState(res.data))
    .catch(err => {
      if (onError) onError();
    });
};

export const fetchCurrentFixtures = (currentGameweek, setState, onError) => {
  axios
    .get(`${BASE_URL}/fixtures?event=${currentGameweek}`)
    .then(res => setState(res.data))
    .catch(err => {
      if (onError) onError();
    });
};
