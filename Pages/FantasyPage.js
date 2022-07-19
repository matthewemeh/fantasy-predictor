import React from 'react';
import PlayerPage from './PlayerPage';

function FantasyPage({
  playerData,
  teams,
  selections,
  playerKit,
  goalieKit,
  fieldImage,
  nextOpponent,
  TeamAbbreviations,
  StandardRatings,
}) {
  return (
    <PlayerPage
      type={'fantasy'}
      playerData={playerData}
      teams={teams}
      selections={selections}
      playerKit={playerKit}
      goalieKit={goalieKit}
      fieldImage={fieldImage}
      nextOpponent={nextOpponent}
      TeamAbbreviations={TeamAbbreviations}
      StandardRatings={StandardRatings}
    />
  );
}

export default React.memo(FantasyPage);
