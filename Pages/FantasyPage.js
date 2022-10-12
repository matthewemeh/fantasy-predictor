import React, { memo } from 'react';

import PlayerPage from './PlayerPage';

const FantasyPage = ({
  teams,
  visible,
  playerKit,
  goalieKit,
  currentGW,
  fieldImage,
  selections,
  playerData,
  nextOpponent,
  StandardRatings,
  setAlertVisible,
  TeamAbbreviations,
  setAlertComponents,
}) => (
  <PlayerPage
    type='fantasy'
    teams={teams}
    visible={visible}
    playerKit={playerKit}
    goalieKit={goalieKit}
    currentGW={currentGW}
    fieldImage={fieldImage}
    selections={selections}
    playerData={playerData}
    nextOpponent={nextOpponent}
    setAlertVisible={setAlertVisible}
    StandardRatings={StandardRatings}
    TeamAbbreviations={TeamAbbreviations}
    setAlertComponents={setAlertComponents}
  />
);

export default memo(FantasyPage);
