import React, { useState } from 'react';
import { View, StyleSheet, Modal, FlatList, TextInput, StatusBar } from 'react-native';
import { colors, fieldConstants } from '../constants';
import PlayerItem from './PlayerItem';
import PickerBox, { getSelectedItem } from './PickerBox';
import { findOpponentAbbreviation, descendingPointsOrder, deviceHeight } from '../utilities';

var selectedPlayerData = {};
var selectedTeam = '';
var selectedPosition = '';

function PlayerSelectModal(props) {
  const teams = props.teams;
  const playerKit = props.playerKit;
  const goalieKit = props.goalieKit;
  const playerData = props.playerData;
  const playerInfo = props.playerInfo;
  const currentIndex = props.currentIndex;
  const nextOpponent = props.nextOpponent;
  const posPickerEnabled = props.posPickerEnabled;
  const teamPickerEnabled = props.teamPickerEnabled;
  const TeamAbbreviations = props.TeamAbbreviations;
  const [searchValue, setSearchValue] = useState('');
  const [manualFilter, setManualFilter] = useState(false);
  const [chosenTeam, setChosenTeam] = useState(`${props.chosenTeam}`);
  const [chosenPosition, setChosenPosition] = useState(`${props.chosenPosition}`);
  selectedTeam = chosenTeam;
  selectedPosition = chosenPosition;

  const changeTextHandler = input => {
    selectedTeam = input.length > 0 && teamPickerEnabled ? 'All Teams' : chosenTeam;
    selectedPosition = input.length > 0 && posPickerEnabled ? 'All Positions' : chosenPosition;
    setManualFilter(input.length > 0);
    setChosenTeam(selectedTeam);
    setChosenPosition(selectedPosition);
    setSearchValue(input);
  };

  const findPlayers = () => {
    let filteredPlayerList = [];
    let pos = `${chosenPosition.charAt(0).toLowerCase()}${chosenPosition.substring(
      1,
      chosenPosition.length - 1
    )}`;
    if (manualFilter) {
      if (chosenTeam === 'All Teams' && chosenPosition !== 'All Positions')
        filteredPlayerList = playerData.filter(
          item =>
            item.playerName.toLowerCase().includes(searchValue.toLowerCase()) &&
            item.position === pos
        );
      else if (chosenTeam !== 'All Teams' && chosenPosition === 'All Positions')
        filteredPlayerList = playerData.filter(
          item =>
            item.playerName.toLowerCase().includes(searchValue.toLowerCase()) &&
            item.team === chosenTeam
        );
      else if (chosenTeam !== 'All Teams' && chosenPosition !== 'All Positions')
        filteredPlayerList = playerData.filter(
          item =>
            item.playerName.toLowerCase().includes(searchValue.toLowerCase()) &&
            item.team === chosenTeam &&
            item.position === pos
        );
      else
        filteredPlayerList = playerData.filter(item =>
          item.playerName.toLowerCase().includes(searchValue.toLowerCase())
        );
    } else if (chosenTeam === 'All Teams' && chosenPosition !== 'All Positions')
      filteredPlayerList = playerData.filter(item => item.position === pos);
    else if (chosenTeam !== 'All Teams' && chosenPosition === 'All Positions')
      filteredPlayerList = playerData.filter(item => item.team === chosenTeam);
    else if (chosenTeam !== 'All Teams' && chosenPosition !== 'All Positions')
      filteredPlayerList = playerData.filter(
        item => item.team === chosenTeam && item.position === pos
      );
    else filteredPlayerList = playerData;
    return filteredPlayerList.sort(descendingPointsOrder);
  };

  function closeCommand() {
    props.onRequestClose();
    setSearchValue('');
    setManualFilter(false);
  }

  function onSelectCommand(item) {
    selectedPlayerData = item;
    setSearchValue('');
    setManualFilter(false);
    props.onSelectPlayer();
  }

  function separator() {
    return (
      <View style={{ backgroundColor: colors.grey, width: '100%', height: deviceHeight * 0.007 }} />
    );
  }

  return (
    <Modal
      visible={props.visible}
      animationType={'slide'}
      onRequestClose={closeCommand}
      statusBarTranslucent={true}
    >
      <View style={styles.mainModalView}>
        <View style={styles.headerModalView}>
          <View style={styles.inputView}>
            <TextInput
              allowFontScaling={false}
              style={styles.input}
              blurOnSubmit
              autoCorrect={false}
              maxLength={30}
              placeholder={'Search'}
              placeholderTextColor={colors.grey}
              onChangeText={input => changeTextHandler(input)}
              value={searchValue}
            />
          </View>
          <View style={styles.pickerView}>
            <PickerBox
              selectedValue={chosenPosition}
              enabled={posPickerEnabled && !manualFilter}
              list={fieldConstants.positions}
              extraListStyles={{ top: '11.5%', left: '7.5%', width: '38.4%' }}
              onPickerClose={() => setChosenPosition(getSelectedItem())}
            />
            <PickerBox
              selectedValue={chosenTeam}
              enabled={teamPickerEnabled && !manualFilter}
              list={teams.sort()}
              extraListStyles={{ top: '11.5%', left: '54%', width: '38.4%', marginBottom: '25%' }}
              onPickerClose={() => setChosenTeam(getSelectedItem())}
            />
          </View>
        </View>
        <View style={styles.bodyModalView}>
          <FlatList
            initialNumToRender={Math.ceil(deviceHeight / 36)}
            maxToRenderPerBatch={Math.ceil(deviceHeight / 18)}
            ItemSeparatorComponent={separator}
            data={findPlayers()}
            renderItem={({ item }) => (
              <PlayerItem
                playerName={item.playerName}
                team={item.team}
                playerIndex={item.index}
                shirtImage={
                  item.position === 'goalkeeper' ? goalieKit[item.team] : playerKit[item.team]
                }
                enabled={
                  !playerInfo.find(
                    player => player.playerKey === item.key || player.key === item.key
                  )
                }
                command={() =>
                  onSelectCommand({
                    playerName: item.playerName,
                    playerKey: item.key,
                    key: currentIndex,
                    shirtImage:
                      item.position === 'goalkeeper' ? goalieKit[item.team] : playerKit[item.team],
                    playerContent: findOpponentAbbreviation(
                      item.team,
                      nextOpponent,
                      TeamAbbreviations
                    ),
                    captain: playerInfo[currentIndex].captain,
                  })
                }
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputView: { width: '85%', height: '50%', justifyContent: 'center' },
  pickerView: {
    flexDirection: 'row',
    width: '85%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: '65%',
    borderRadius: 4,
    paddingHorizontal: '5%',
    backgroundColor: colors.white,
    color: colors.secondary,
    fontFamily: 'PoppinsRegular',
  },
  mainModalView: { width: '100%', height: '100%', paddingTop: StatusBar.currentHeight },
  headerModalView: {
    width: '100%',
    height: '20%',
    backgroundColor: colors.forward,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyModalView: { width: '100%', height: '80%', backgroundColor: colors.grey },
});

export const getPlayerData = () => selectedPlayerData;

export const getChosenPosition = () => selectedPosition;

export const getChosenTeam = () => selectedTeam;

export default React.memo(PlayerSelectModal);
