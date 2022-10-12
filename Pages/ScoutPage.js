import React, { memo } from 'react';

import PlayerPage from './PlayerPage';

const ScoutPage = ({
  teams,
  visible,
  playerKit,
  goalieKit,
  currentGW,
  selections,
  playerData,
  fieldImage,
  nextOpponent,
  setAlertVisible,
  TeamAbbreviations,
  setAlertComponents,
}) => (
  <PlayerPage
    type='scout'
    teams={teams}
    visible={visible}
    playerKit={playerKit}
    goalieKit={goalieKit}
    currentGW={currentGW}
    playerData={playerData}
    fieldImage={fieldImage}
    selections={selections}
    nextOpponent={nextOpponent}
    setAlertVisible={setAlertVisible}
    TeamAbbreviations={TeamAbbreviations}
    setAlertComponents={setAlertComponents}
  />
);

export default memo(ScoutPage);
