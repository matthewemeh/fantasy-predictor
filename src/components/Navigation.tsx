import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../utilities';

import NavigationButton from './NavigationButton';

interface Props {
  activeNavIndex: number;
  setActiveNavIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Navigation: React.FC<Props> = ({ activeNavIndex, setActiveNavIndex }) => (
  <View style={styles.bottomView}>
    <LinearGradient colors={[colors.alto, colors.black]} style={styles.gradientView} />

    <View style={styles.navBar}>
      <NavigationButton
        title='scout'
        active={activeNavIndex === 1}
        command={() => setActiveNavIndex(1)}
      />
      <NavigationButton
        title='compare'
        active={activeNavIndex === 2}
        command={() => setActiveNavIndex(2)}
      />
      <NavigationButton
        title='predict'
        active={activeNavIndex === 3}
        command={() => setActiveNavIndex(3)}
      />
      <NavigationButton
        title='simulate'
        active={activeNavIndex === 4}
        command={() => setActiveNavIndex(4)}
      />
      <NavigationButton
        title='more'
        active={activeNavIndex === 5}
        command={() => setActiveNavIndex(5)}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  bottomView: { height: '8%', width: '100%' },
  gradientView: { height: '10%', width: '100%' },
  navBar: { flexDirection: 'row', height: '90%', width: '100%' },
});

export default memo(Navigation);
