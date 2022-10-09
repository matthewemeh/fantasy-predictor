import React, { memo } from 'react';

import PlayerPage from './PlayerPage';

const FantasyPage = ({
  teams,
  playerKit,
  goalieKit,
  currentGW,
  fieldImage,
  selections,
  playerData,
  nextOpponent,
  StandardRatings,
  TeamAbbreviations,
}) => (
  <PlayerPage
    type='fantasy'
    teams={teams}
    playerKit={playerKit}
    goalieKit={goalieKit}
    currentGW={currentGW}
    fieldImage={fieldImage}
    selections={selections}
    playerData={playerData}
    nextOpponent={nextOpponent}
    StandardRatings={StandardRatings}
    TeamAbbreviations={TeamAbbreviations}
  />
);

export default memo(FantasyPage);
