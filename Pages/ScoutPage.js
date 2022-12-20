import React, { memo } from 'react';

import PlayerPage from './PlayerPage';

const ScoutPage = ({ visible }) => <PlayerPage type='scout' visible={visible} />;

export default memo(ScoutPage);
