import React, { memo } from 'react';
import { Icon } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';

import PickerBox from './PickerBox';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const FilterBar = ({
  type,
  teams,
  chosenTeam,
  pickerEnabled,
  setChosenTeam,
  randomizePlayers,
  confirmRemoveAll,
}) =>
  type !== 'scout' && (
    <View style={styles.filterView}>
      <Icon
        name='random'
        type='font-awesome'
        color={colors.primary}
        size={findFontSize(25)}
        onPress={randomizePlayers}
      />

      <PickerBox
        list={teams.sort()}
        enabled={pickerEnabled}
        selectedValue={chosenTeam}
        selectedItemHandler={setChosenTeam}
        extraStyles={{ width: '45%', height: '80%' }}
        extraListStyles={{
          top: '10%',
          left: '30.5%',
          width: '41%',
          height: '65%',
          marginBottom: '25%',
        }}
      />

      <Icon
        name='trash'
        type='font-awesome'
        color={colors.primary}
        size={findFontSize(25)}
        onPress={confirmRemoveAll}
      />
    </View>
  );

const styles = StyleSheet.create({
  filterView: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
  },
  iconView: { width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' },
});

export default memo(FilterBar);
