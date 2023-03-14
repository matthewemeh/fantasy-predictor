import React, { useState, memo } from 'react';
import { Text as AnimatableText } from 'react-native-animatable';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';

import { DEVICE_HEIGHT, findFontSize, colors } from '../utilities';

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

  const togglePicker = () => {
    if (enabled) setOpened(!opened);
  };

  const closePicker = () => setOpened(false);

  const onChange = item => {
    selectedItemHandler(item);
    closePicker();
  };

  const animations = {
    pickerDisabled: {
      from: { backgroundColor: colors.white },
      to: { backgroundColor: colors.alto },
    },
  };

  return (
    <TouchableOpacity
      onPress={togglePicker}
      activeOpacity={enabled ? 0.9 : 1}
      style={{ ...styles.mainView, ...extraStyles }}
    >
      <AnimatableText
        duration={400}
        numberOfLines={1}
        allowFontScaling={false}
        animation={enabled ? null : animations.pickerDisabled}
        style={{
          ...styles.selectedValueStyle,
          backgroundColor: enabled ? colors.white : colors.alto,
          ...extraSelectedValueStyles,
        }}
      >
        {selectedValue}
      </AnimatableText>

      <Modal visible={opened && enabled} onRequestClose={closePicker} transparent={true}>
        <TouchableOpacity activeOpacity={1} onPress={closePicker} style={styles.modalView}>
          <View style={{ ...styles.listView, ...extraListStyles }}>
            <ScrollView>
              {list.map(item => (
                <TouchableOpacity
                  key={item}
                  activeOpacity={item === selectedValue ? 1 : 0.8}
                  onPress={item === selectedValue ? null : () => onChange(item)}
                  style={{
                    ...styles.listItem,
                    backgroundColor: item === selectedValue ? colors.alto : colors.white,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    allowFontScaling={false}
                    style={{ ...styles.textItem, ...extraTextItemStyles }}
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

const styles = StyleSheet.create({
  mainView: { width: '45%', height: '70%', alignItems: 'center', justifyContent: 'center' },
  selectedValueStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    textAlign: 'center',
    color: colors.stratos,
    fontSize: findFontSize(13),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
    backgroundColor: colors.white,
  },
  listView: {
    top: '2.5%',
    left: '35%',
    width: '30%',
    elevation: 5,
    marginBottom: '20%',
    position: 'relative',
    backgroundColor: colors.white,
  },
  listItem: { width: '100%', height: DEVICE_HEIGHT * 0.07 },
  textItem: {
    width: '100%',
    height: '100%',
    color: colors.stratos,
    paddingHorizontal: '10%',
    fontSize: findFontSize(12),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  modalView: { width: '100%', height: '100%' },
});

export default memo(PickerBox);
