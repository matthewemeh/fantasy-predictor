import React, { memo } from 'react';

import PlayerPage from './PlayerPage';

const FantasyPage = ({ visible }) => <PlayerPage type='fantasy' visible={visible} />;

export default memo(FantasyPage);
