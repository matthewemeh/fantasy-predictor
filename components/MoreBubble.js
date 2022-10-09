import React, { useState, memo } from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { colors } from '../constants';
import { findFontSize } from '../utilities';

const MoreBubble = ({ onPress, title, iconName, expandable, expandedContent }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (expandable) setExpanded(!expanded);
    if (onPress) onPress();
  };

  const styles = StyleSheet.create({
    touchableHeaderView: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    textStyle: {
      flex: 1,
      marginLeft: '2%',
      color: colors.darkBlue,
      alignItems: 'flex-start',
      justifyContent: 'center',
      fontSize: findFontSize(13),
      textAlignVertical: 'center',
      fontFamily: 'PoppinsRegular',
    },
    viewStyle: {
      width: '100%',
      borderRadius: 5,
      marginBottom: '1%',
      alignItems: 'center',
      paddingHorizontal: '2%',
      justifyContent: 'center',
      backgroundColor: colors.skyBlue,
      paddingVertical: expandable && expanded ? 10 : 0,
      height: expandable && expanded ? undefined : 60,
    },
    iconView: { width: 25 },
    dropdownIcon: { width: 20 },
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.viewStyle}>
      <View style={styles.touchableHeaderView}>
        <Icon
          name={iconName}
          style={styles.iconView}
          type='font-awesome'
          size={findFontSize(25)}
          color={colors.darkBlue}
        />

        <Text allowFontScaling={false} style={styles.textStyle}>
          {title}
        </Text>

        {expandable && (
          <Icon
            type='font-awesome'
            size={findFontSize(25)}
            color={colors.darkBlue}
            style={styles.dropdownIcon}
            name={expanded ? 'caret-up' : 'caret-down'}
          />
        )}
      </View>

      {expanded && <View style={{ width: '100%', flex: 1 }}>{expandedContent}</View>}
    </TouchableOpacity>
  );
};

export default memo(MoreBubble);
