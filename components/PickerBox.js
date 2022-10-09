import React, { useState, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
// import { Picker } from "@react-native-community/picker";

import { colors } from '../constants';
import { deviceHeight, findFontSize } from '../utilities';

const PickerBox = ({
  list,
  enabled,
  extraStyles,
  selectedValue,
  extraListStyles,
  extraTextItemStyles,
  selectedItemHandler,
  extraSelectedValueStyles,
}) => {
  const [opened, setOpened] = useState(false);

  const openPicker = () => {
    if (enabled) setOpened(!opened);
  };

  const onChange = item => {
    selectedItemHandler(item);
    setOpened(false);
  };

  return (
    <TouchableOpacity
      onPress={openPicker}
      activeOpacity={enabled ? 0.9 : 1}
      style={{ ...styles.mainView, ...extraStyles }}
    >
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          ...styles.selectedValueStyle,
          backgroundColor: enabled ? colors.white : colors.grey,
          ...extraSelectedValueStyles,
        }}
      >
        {selectedValue}
      </Text>

      <Modal visible={opened && enabled} onRequestClose={() => setOpened(false)} transparent={true}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpened(false)}
          style={styles.modalViewContainer}
        >
          <View style={{ ...styles.listViewStyle, ...extraListStyles }}>
            <ScrollView>
              {list.map(item => (
                <TouchableOpacity
                  activeOpacity={item === selectedValue ? 1 : 0.8}
                  style={{
                    ...styles.listItemStyle,
                    backgroundColor: item === selectedValue ? colors.grey : colors.white,
                  }}
                  onPress={item === selectedValue ? null : () => onChange(item)}
                  key={item}
                >
                  <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={{ ...styles.textItemStyle, ...extraTextItemStyles }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};
// <Picker
//   selectedValue={selectedValue}
//   enabled={enabled ? enabled : false}
//   mode={mode ? mode : "dialog"}
//   onValueChange={enabled ? props.onValueChange : null}
// >
//   {list.map(item => (
//     <Picker.Item label={item} value={item} key={item} />
//   ))}
// </Picker>

const styles = StyleSheet.create({
  mainView: { width: '45%', height: '70%', alignItems: 'center', justifyContent: 'center' },
  selectedValueStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    textAlign: 'center',
    color: colors.secondary,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.white,
  },
  listViewStyle: {
    top: '2.5%',
    left: '35%',
    width: '30%',
    elevation: 5,
    height: undefined,
    marginBottom: '20%',
    position: 'relative',
    backgroundColor: colors.white,
  },
  listItemStyle: { width: '100%', height: deviceHeight * 0.07 },
  textItemStyle: {
    width: '100%',
    height: '100%',
    textAlign: 'left',
    color: colors.secondary,
    paddingHorizontal: '10%',
    fontSize: findFontSize(12),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  modalViewContainer: { width: '100%', height: '100%' },
});

export default memo(PickerBox);
