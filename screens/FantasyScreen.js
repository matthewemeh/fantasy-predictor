import React, { memo } from 'react';
import PlayerScreen from './PlayerScreen';
const FantasyScreen = ({ visible }) => (<PlayerScreen type='fantasy' visible={visible}/>);
export default memo(FantasyScreen);
