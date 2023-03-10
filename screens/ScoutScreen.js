import React, { memo } from 'react';

import PlayerScreen from './PlayerScreen';

const ScoutScreen = ({ visible }) => <PlayerScreen type='scout' visible={visible} />;

export default memo(ScoutScreen);
