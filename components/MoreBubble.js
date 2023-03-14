import React, { useState, useRef, memo } from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet, View, Text } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';

import { findFontSize, colors } from '../utilities';

const MoreBubble = ({ onPress, title, iconName, expandable, expandedContent, expandedHeight }) => {
  const bubble = useRef();
  const dropdownIcon = useRef();
  const [expanded, setExpanded] = useState(false);

  const animations = {
    expand: {
      from: { paddingVertical: 0, height: 60 },
      to: { paddingVertical: 10, height: expandedHeight || 60 },
    },
    collapse: {
      from: { paddingVertical: 10, height: expandedHeight || 60 },
      to: { paddingVertical: 0, height: 60 },
    },
    rotate180: {
      from: { transform: [{ rotate: '0deg' }] },
      to: { transform: [{ rotate: '180deg' }] },
    },
    rotate0: {
      from: { transform: [{ rotate: '180deg' }] },
      to: { transform: [{ rotate: '0deg' }] },
    },
  };

  const handlePress = () => {
    if (expandable) {
      if (expanded) {
        dropdownIcon.current.animate(animations.rotate0);
        bubble.current.animate(animations.collapse);
      } else {
        dropdownIcon.current.animate(animations.rotate180);
        bubble.current.animate(animations.expand);
      }

      setExpanded(!expanded);
    }
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
      color: colors.blueRibbon,
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
      backgroundColor: colors.pattensBlue,
      paddingVertical: expandable && expanded ? 10 : 0,
      height: expandable && expanded ? expandedHeight || 60 : 60,
    },
    iconView: { width: 25 },
    dropdownIcon: { width: 20 },
  });

  return (
    <AnimatableView
      ref={bubble}
      duration={400}
      activeOpacity={1}
      onPress={handlePress}
      style={styles.viewStyle}
      onTouchStart={handlePress}
    >
      <View style={styles.touchableHeaderView}>
        <Icon
          name={iconName}
          type='font-awesome'
          style={styles.iconView}
          size={findFontSize(25)}
          color={colors.blueRibbon}
        />

        <Text allowFontScaling={false} style={styles.textStyle}>
          {title}
        </Text>

        {expandable && (
          <AnimatableView duration={400} ref={dropdownIcon}>
            <Icon
              name='caret-down'
              type='font-awesome'
              size={findFontSize(25)}
              color={colors.blueRibbon}
              style={styles.dropdownIcon}
            />
          </AnimatableView>
        )}
      </View>

      {expanded && <View style={{ width: '100%', flex: 1 }}>{expandedContent}</View>}
    </AnimatableView>
  );
};

export default memo(MoreBubble);
