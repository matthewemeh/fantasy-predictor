import { memo } from 'react';

import PlayerScreen from './PlayerScreen';

interface Props {
  visible: boolean;
}

const FantasyScreen: React.FC<Props> = ({ visible }) => (
  <PlayerScreen type='fantasy' visible={visible} />
);

export default memo(FantasyScreen);
