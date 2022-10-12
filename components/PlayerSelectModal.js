import React, { useState, memo } from 'react';
import { Icon } from 'react-native-elements';
import { View as AnimatableView } from 'react-native-animatable';
import { View, StyleSheet, Modal, FlatList, TextInput, StatusBar } from 'react-native';

import PickerBox from './PickerBox';
import PlayerItem from './PlayerItem';

import { colors, fieldConstants } from '../constants';
import {
  deviceWidth,
  deviceHeight,
  findFontSize,
  descendingPointsOrder,
  findOpponentAbbreviation,
} from '../utilities';

const PlayerSelectModal = ({
  teams,
  visible,
  playerKit,
  goalieKit,
  playerData,
  chosenTeam,
  playerInfo,
  nextOpponent,
  currentIndex,
  setChosenTeam,
  onSelectPlayer,
  chosenPosition,
  setTeamPredicted,
  posPickerEnabled,
  setChosenPosition,
  TeamAbbreviations,
  teamPickerEnabled,
  setPlayerModalVisible,
}) => {
  const { positions } = fieldConstants;
  const [searchValue, setSearchValue] = useState('');

  const changeTextHandler = input => {
    setSearchValue(input);
    setChosenTeam(input && teamPickerEnabled ? 'All Teams' : chosenTeam);
    setChosenPosition(input && posPickerEnabled ? 'All Positions' : chosenPosition);
  };

  const findPlayers = () => {
    let filteredPlayerList = [];
    const searchToLower = searchValue.toLowerCase();
    const pos = chosenPosition.substring(0, chosenPosition.length - 1);

    if (searchValue) {
      if (chosenTeam === 'All Teams' && chosenPosition !== 'All Positions') {
        filteredPlayerList = playerData.filter(
          ({ playerName, position }) =>
            playerName.toLowerCase().includes(searchToLower) && position === pos
        );
      } else if (chosenTeam !== 'All Teams' && chosenPosition === 'All Positions') {
        filteredPlayerList = playerData.filter(
          ({ playerName, team }) =>
            playerName.toLowerCase().includes(searchToLower) && team === chosenTeam
        );
      } else if (chosenTeam !== 'All Teams' && chosenPosition !== 'All Positions') {
        filteredPlayerList = playerData.filter(
          ({ playerName, team, position }) =>
            playerName.toLowerCase().includes(searchToLower) &&
            team === chosenTeam &&
            position === pos
        );
      } else {
        filteredPlayerList = playerData.filter(({ playerName }) =>
          playerName.toLowerCase().includes(searchToLower)
        );
      }
    } else if (chosenTeam === 'All Teams' && chosenPosition !== 'All Positions') {
      filteredPlayerList = playerData.filter(({ position }) => position === pos);
    } else if (chosenTeam !== 'All Teams' && chosenPosition === 'All Positions') {
      filteredPlayerList = playerData.filter(({ team }) => team === chosenTeam);
    } else if (chosenTeam !== 'All Teams' && chosenPosition !== 'All Positions') {
      filteredPlayerList = playerData.filter(
        ({ team, position }) => team === chosenTeam && position === pos
      );
    } else filteredPlayerList = playerData;

    return filteredPlayerList.sort(descendingPointsOrder);
  };

  const closeCommand = () => {
    setSearchValue('');
    setPlayerModalVisible(false);
  };

  const onSelectCommand = newDetails => {
    const { playerKey } = newDetails;

    setSearchValue('');

    // update current player details
    playerInfo[currentIndex] = newDetails;
    setPlayerModalVisible(false);

    if (setTeamPredicted) setTeamPredicted(false);
    if (onSelectPlayer) onSelectPlayer(playerKey);
  };

  const separator = () => <View style={styles.separator} />;

  const PLAYER_ITEM_HEIGHT = deviceHeight * 0.085;

  const getItemLayout = (data, index) => ({
    length: PLAYER_ITEM_HEIGHT,
    offset: PLAYER_ITEM_HEIGHT * index,
    index,
  });

  const renderItem = ({ item }) => {
    const { team, index, playerName, position, key } = item;

    return (
      <PlayerItem
        team={team}
        activeOpacity={0.7}
        playerIndex={index}
        playerName={playerName}
        shirtImage={position === 'goalkeeper' ? goalieKit[team] : playerKit[team]}
        enabled={!playerInfo.find(player => player.playerKey === key || player.key === key)}
        command={() =>
          onSelectCommand({
            playerName,
            playerKey: key,
            key: currentIndex,
            captain: playerInfo[currentIndex].captain,
            playerContent: findOpponentAbbreviation(team, nextOpponent, TeamAbbreviations),
            shirtImage: position === 'goalkeeper' ? goalieKit[team] : playerKit[team],
          })
        }
      />
    );
  };

  const animations = {
    popIn: { from: { right: '-50%' }, to: { right: '8%' } },
    popOut: { from: { right: '8%' }, to: { right: '-50%' } },
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      statusBarTranslucent={true}
      onRequestClose={closeCommand}
    >
      <View style={styles.mainModalView}>
        <View style={styles.headerModalView}>
          <View style={styles.inputView}>
            <TextInput
              blurOnSubmit
              maxLength={30}
              value={searchValue}
              style={styles.input}
              placeholder='Search'
              allowFontScaling={false}
              selectionColor={colors.secondary}
              placeholderTextColor={colors.grey}
              onChangeText={input => changeTextHandler(input)}
            />
          </View>

          <View style={styles.pickerView}>
            <PickerBox
              list={positions}
              selectedValue={chosenPosition}
              selectedItemHandler={setChosenPosition}
              enabled={posPickerEnabled && !searchValue}
              extraTextItemStyles={{ textTransform: 'capitalize' }}
              extraSelectedValueStyles={{ textTransform: 'capitalize' }}
              extraListStyles={{ top: '11.5%', left: '7.5%', width: '38.4%' }}
            />
            <PickerBox
              list={teams.sort()}
              selectedValue={chosenTeam}
              selectedItemHandler={setChosenTeam}
              enabled={teamPickerEnabled && !searchValue}
              extraTextItemStyles={{ textTransform: 'capitalize' }}
              extraSelectedValueStyles={{ textTransform: 'capitalize' }}
              extraListStyles={{ top: '11.5%', left: '54%', width: '38.4%', marginBottom: '25%' }}
            />
          </View>
        </View>

        <FlatList
          data={findPlayers()}
          renderItem={renderItem}
          style={styles.bodyModalView}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={separator}
          initialNumToRender={Math.ceil(deviceHeight / 36)}
          maxToRenderPerBatch={Math.ceil(deviceHeight / 18)}
        />

        <AnimatableView duration={400} style={styles.close} onTouchStart={closeCommand}>
          <Icon
            name='times'
            type='font-awesome'
            color={colors.white}
            size={findFontSize(27)}
            style={styles.closeIcon}
          />
        </AnimatableView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputView: { width: '85%', height: '50%', justifyContent: 'center' },
  pickerView: {
    width: '85%',
    height: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: '65%',
    borderRadius: 4,
    paddingHorizontal: '5%',
    color: colors.secondary,
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.white,
  },
  mainModalView: { width: '100%', height: '100%', paddingTop: StatusBar.currentHeight },
  headerModalView: {
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.forward,
  },
  bodyModalView: { width: '100%', height: '80%', backgroundColor: colors.grey },
  close: {
    elevation: 7,
    right: '8%',
    bottom: '8%',
    position: 'absolute',
    width: 0.15 * deviceWidth,
    height: 0.15 * deviceWidth,
    backgroundColor: colors.forward,
    borderRadius: 0.075 * deviceWidth,
  },
  closeIcon: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: { width: '100%', height: deviceHeight * 0.005 },
});

export default memo(PlayerSelectModal);
