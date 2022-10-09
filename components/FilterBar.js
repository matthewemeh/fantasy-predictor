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
      <View style={styles.iconView}>
        <Icon
          name='random'
          type='font-awesome'
          color={colors.primary}
          size={findFontSize(25)}
          onPress={randomizePlayers}
        />
      </View>

      <View
        style={{ width: '70%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <PickerBox
          list={teams.sort()}
          enabled={pickerEnabled}
          selectedValue={chosenTeam}
          selectedItemHandler={setChosenTeam}
          extraStyles={{ width: '55%', height: '80%' }}
          extraTextItemStyles={{ fontSize: findFontSize(15) }}
          extraListStyles={{ top: '3%', left: '10%', width: '80%', marginBottom: '25%' }}
        />
      </View>

      <View style={styles.iconView}>
        <Icon
          name='trash'
          type='font-awesome'
          color={colors.primary}
          size={findFontSize(25)}
          onPress={confirmRemoveAll}
        />
      </View>
    </View>
  );

const styles = StyleSheet.create({
  filterView: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    paddingHorizontal: '2%',
    backgroundColor: colors.secondary,
  },
  iconView: { width: '15%', height: '100%', alignItems: 'center', justifyContent: 'center' },
});

export default memo(FilterBar);
