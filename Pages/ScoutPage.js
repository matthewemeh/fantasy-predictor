import React from 'react';
import PlayerPage from './PlayerPage';

function ScoutPage({
  playerData,
  selections,
  playerKit,
  goalieKit,
  fieldImage,
  teams,
  nextOpponent,
  TeamAbbreviations,
  currentGW,
}) {
  return (
    <PlayerPage
      type={'scout'}
      playerData={playerData}
      selections={selections}
      playerKit={playerKit}
      goalieKit={goalieKit}
      fieldImage={fieldImage}
      teams={teams}
      nextOpponent={nextOpponent}
      TeamAbbreviations={TeamAbbreviations}
      currentGW={currentGW}
    />
  );
}

export default React.memo(ScoutPage);
