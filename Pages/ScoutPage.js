import React, { memo } from 'react';

import PlayerPage from './PlayerPage';

const ScoutPage = ({
  teams,
  playerKit,
  goalieKit,
  currentGW,
  selections,
  playerData,
  fieldImage,
  nextOpponent,
  TeamAbbreviations,
}) => (
  <PlayerPage
    type='scout'
    teams={teams}
    playerKit={playerKit}
    goalieKit={goalieKit}
    currentGW={currentGW}
    playerData={playerData}
    fieldImage={fieldImage}
    selections={selections}
    nextOpponent={nextOpponent}
    TeamAbbreviations={TeamAbbreviations}
  />
);

export default memo(ScoutPage);
