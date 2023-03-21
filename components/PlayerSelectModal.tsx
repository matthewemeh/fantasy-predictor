import { Icon } from 'react-native-elements';
import { useState, memo, useContext } from 'react';
import { View as AnimatableView } from 'react-native-animatable';
import { View, StyleSheet, Modal, FlatList, TextInput, StatusBar } from 'react-native';

import PickerBox from './PickerBox';
import PlayerItem from './PlayerItem';

import {
  colors,
  findData,
  findFontSize,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  descendingPointsOrder,
  findOpponentAbbreviation,
} from '../utilities';

import { AppContext } from '../App';

import { SquadDataType } from '../types';
import { PlayerInfoData, Element, OpponentData, KitData } from '../interfaces';

interface Props {
  visible: boolean;
  playerKit: KitData;
  goalieKit: KitData;
  chosenTeam: string;
  currentIndex: number;
  playerData: Element[];
  chosenPosition: string;
  posPickerEnabled: boolean;
  teamPickerEnabled: boolean;
  squadInfo?: SquadDataType[];
  nextOpponent: OpponentData[];
  playerInfo?: PlayerInfoData[];
  setChosenTeam: React.Dispatch<React.SetStateAction<string>>;
  setChosenPosition: React.Dispatch<React.SetStateAction<string>>;
  setTeamPredicted?: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayerModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayerSelectModal: React.FC<Props> = ({
  visible,
  playerKit,
  squadInfo,
  goalieKit,
  playerData,
  chosenTeam,
  playerInfo,
  nextOpponent,
  currentIndex,
  setChosenTeam,
  chosenPosition,
  setTeamPredicted,
  posPickerEnabled,
  setChosenPosition,
  teamPickerEnabled,
  setPlayerModalVisible,
}) => {
  const { teamsData, positionData } = useContext(AppContext);

  const [searchValue, setSearchValue] = useState('');
  const teams = teamsData?.map(({ name }) => name).sort() || [];
  const positions = positionData?.map(({ plural_name }) => plural_name) || [];

  const changeTextHandler = (input: string) => {
    setSearchValue(input);
    setChosenTeam(input && teamPickerEnabled ? 'All Teams' : chosenTeam);
    setChosenPosition(input && posPickerEnabled ? 'All Positions' : chosenPosition);
  };

  const findPlayers = () => {
    let filteredPlayerList = [];
    const searchToLower = searchValue.toLowerCase();

    const teamID = teamsData?.find(({ name }) => name === chosenTeam)?.id || -1;
    const positionID =
      positionData?.find(
        ({ plural_name }) => plural_name.toLowerCase() === chosenPosition.toLowerCase()
      )?.id || -1;

    if (searchValue) {
      if (chosenTeam === 'All Teams' && chosenPosition !== 'All Positions') {
        filteredPlayerList = playerData.filter(
          ({ web_name, element_type }) =>
            web_name.toLowerCase().includes(searchToLower) && element_type === positionID
        );
      } else if (chosenTeam !== 'All Teams' && chosenPosition === 'All Positions') {
        filteredPlayerList = playerData.filter(
          ({ web_name, team }) => web_name.toLowerCase().includes(searchToLower) && team === teamID
        );
      } else if (chosenTeam !== 'All Teams' && chosenPosition !== 'All Positions') {
        filteredPlayerList = playerData.filter(
          ({ web_name, team, element_type }) =>
            web_name.toLowerCase().includes(searchToLower) &&
            team === teamID &&
            element_type === positionID
        );
      } else {
        filteredPlayerList = playerData.filter(({ web_name }) =>
          web_name.toLowerCase().includes(searchToLower)
        );
      }
    } else if (chosenTeam === 'All Teams' && chosenPosition !== 'All Positions') {
      filteredPlayerList = playerData.filter(({ element_type }) => element_type === positionID);
    } else if (chosenTeam !== 'All Teams' && chosenPosition === 'All Positions') {
      filteredPlayerList = playerData.filter(({ team }) => team === teamID);
    } else if (chosenTeam !== 'All Teams' && chosenPosition !== 'All Positions') {
      filteredPlayerList = playerData.filter(
        ({ team, element_type }) => team === teamID && element_type === positionID
      );
    } else filteredPlayerList = playerData;

    return filteredPlayerList.sort(descendingPointsOrder);
  };

  const closeCommand = () => {
    setSearchValue('');
    setPlayerModalVisible(false);
  };

  const onSelectCommand = (newPlayerInfo?: PlayerInfoData, newSquadInfo?: SquadDataType) => {
    // update current player details
    if (newPlayerInfo) {
      if (playerInfo) playerInfo[currentIndex] = newPlayerInfo;
    } else if (newSquadInfo) {
      if (squadInfo) squadInfo[currentIndex] = newSquadInfo;
    }

    setSearchValue('');
    setPlayerModalVisible(false);
    if (setTeamPredicted) setTeamPredicted(false);
  };

  const separator = () => <View style={styles.separator} />;

  const PLAYER_ITEM_HEIGHT = DEVICE_HEIGHT * 0.085;

  const getItemLayout = (data: any, index: number) => ({
    length: PLAYER_ITEM_HEIGHT,
    offset: PLAYER_ITEM_HEIGHT * index,
    index,
  });

  const renderItem = ({ item }: { item: Element }) => {
    const { team, form, web_name, element_type, id } = item;
    const teamName = teamsData?.find(({ id }) => id === team)?.name || '';
    const position = positionData
      ?.find(({ id }) => id === element_type)
      ?.singular_name.toLowerCase();

    let selected = true;
    if (playerInfo) {
      selected = playerInfo.some(({ playerID }) => playerID === id);
    } else if (squadInfo) {
      selected = squadInfo.some(player => player?.id === id);
    }

    return (
      <PlayerItem
        activeOpacity={0.7}
        teamName={teamName}
        enabled={!selected}
        playerName={web_name}
        playerIndex={Number(form)}
        shirtImage={position === 'goalkeeper' ? goalieKit[teamName] : playerKit[teamName]}
        command={() => {
          if (playerInfo) {
            onSelectCommand({
              playerID: id,
              index: currentIndex,
              playerName: web_name,
              playerContent: findOpponentAbbreviation(team, nextOpponent, teamsData),
              isCaptain: (playerInfo && playerInfo[currentIndex]?.isCaptain) || false,
              shirtImage: position === 'goalkeeper' ? goalieKit[teamName] : playerKit[teamName],
            });
          } else if (squadInfo) {
            onSelectCommand(undefined, findData(id, playerData));
          }
        }}
      />
    );
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
              selectionColor={colors.stratos}
              placeholderTextColor={colors.alto}
              onChangeText={input => changeTextHandler(input)}
            />
          </View>

          <View style={styles.pickerView}>
            <PickerBox
              selectedValue={chosenPosition}
              list={['All Positions', ...positions]}
              selectedItemHandler={setChosenPosition}
              enabled={posPickerEnabled && !searchValue}
              extraTextItemStyles={{ textTransform: 'capitalize' }}
              extraSelectedValueStyles={{ textTransform: 'capitalize' }}
              extraListStyles={{ top: '11.5%', left: '7.5%', width: '38.4%' }}
            />
            <PickerBox
              selectedValue={chosenTeam}
              list={['All Teams', ...teams]}
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
          initialNumToRender={Math.ceil(DEVICE_HEIGHT / 36)}
          maxToRenderPerBatch={Math.ceil(DEVICE_HEIGHT / 18)}
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
    color: colors.stratos,
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
  bodyModalView: { width: '100%', height: '80%', backgroundColor: colors.alto },
  close: {
    elevation: 7,
    right: '8%',
    bottom: '8%',
    position: 'absolute',
    width: 0.15 * DEVICE_WIDTH,
    height: 0.15 * DEVICE_WIDTH,
    backgroundColor: colors.forward,
    borderRadius: 0.075 * DEVICE_WIDTH,
  },
  closeIcon: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: { width: '100%', height: DEVICE_HEIGHT * 0.005 },
});

export default memo(PlayerSelectModal);
