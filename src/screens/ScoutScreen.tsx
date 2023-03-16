import React, { memo } from 'react';

import PlayerScreen from './PlayerScreen';

interface Props {
  visible: boolean;
}

const ScoutScreen: React.FC<Props> = ({ visible }) => (
  <PlayerScreen type='scout' visible={visible} />
);

export default memo(ScoutScreen);
