import axios, { AxiosRequestConfig } from 'axios';

import { GeneralInfo, Fixture } from '../interfaces';

const generalInfoConfig: AxiosRequestConfig = {
  baseURL: 'https://fantasy.premierleague.com/api/',
};

axios.defaults.headers.common['User-Agent'] = 'PostmanRuntime/7.26.2';

export const fetchGeneralInfo = (
  setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfo>>,
  onError?: () => void
) => {
  axios
    .get('bootstrap-static/', generalInfoConfig)
    .then(res => setGeneralInfo(res.data))
    .catch(error => {
      if (__DEV__) {
        axios.isAxiosError(error)
          ? console.error('Failed to fetch general info data', error.message)
          : console.error('Unexpected Error: ', error);
      }

      if (onError) onError();
    });
};

export const fetchFixtures = (
  currentGameweek: number,
  setState: React.Dispatch<React.SetStateAction<Fixture[]>>,
  onError?: () => void
) => {
  axios
    .get('fixtures', { ...generalInfoConfig, params: { event: currentGameweek } })
    .then(res => setState(res.data))
    .catch(error => {
      if (__DEV__) {
        axios.isAxiosError(error)
          ? console.error('Failed to fetch general info data', error.message)
          : console.error('Unexpected Error: ', error);
      }

      if (onError) onError();
    });
};
