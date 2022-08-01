import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
// import { Picker } from "@react-native-community/picker";
import { deviceHeight, findFontSize } from '../utilities';
import { colors } from '../constants';

var selectedItem = '';

function PickerBox({
  list,
  enabled,
  extraStyles,
  selectedValue,
  onPickerClose,
  extraListStyles,
  extraTextItemStyles,
}) {
  selectedItem = selectedValue;
  const [opened, setOpened] = useState(false);

  function openPicker() {
    if (enabled) setOpened(!opened);
  }

  function onChange(item) {
    setOpened(false);
    selectedItem = item;
    onPickerClose();
  }

  return (
    <TouchableOpacity
      activeOpacity={enabled ? 0.9 : 1}
      onPress={openPicker}
      style={{ ...styles.mainView, ...extraStyles }}
    >
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={{
          ...styles.selectedValueStyle,
          backgroundColor: enabled ? colors.white : colors.grey,
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
            <ScrollView alwaysBounceVertical={false}>
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
}
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
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.secondary,
    backgroundColor: colors.white,
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(13),
  },
  listViewStyle: {
    position: 'relative',
    top: '2.5%',
    left: '35%',
    width: '30%',
    height: undefined,
    marginBottom: '20%',
    elevation: 5,
    backgroundColor: colors.white,
  },
  listItemStyle: { width: '100%', height: deviceHeight * 0.07 },
  textItemStyle: {
    width: '100%',
    height: '100%',
    color: colors.secondary,
    textAlign: 'left',
    paddingHorizontal: '10%',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    fontSize: findFontSize(12),
  },
  modalViewContainer: { width: '100%', height: '100%' },
});

export const getSelectedItem = () => selectedItem;

export default React.memo(PickerBox);
