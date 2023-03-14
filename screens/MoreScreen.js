import React, { useState, useEffect, memo, useContext } from 'react';
import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';
import { View, Text, Share, Linking, StyleSheet, ToastAndroid, ScrollView } from 'react-native';

import LogNote from '../components/LogNote';
import CryptoBar from '../components/CryptoBar';
import MoreBubble from '../components/MoreBubble';

import { numbersInString, sum, findFontSize, DEFAULT_AD_HEIGHT, colors } from '../utilities';

import { AppContext } from '../App';

const MoreScreen = ({ visible }) => {
  // componentDidMount
  const initializeId = async () => await setTestDeviceIDAsync('EMULATOR');
  const { update, appVersion } = useContext(AppContext);

  useEffect(initializeId, []);

  const message = `Predict your FPL points now by downloading the FanatasyPredictor app for free on Google Playstore | ${update.rateUsUrl}`;
  const aboutMessage =
    'This app will help you in planning your team properly for gameweeks in the Fantasy Premier League. By following our regularly predicted scores and scout selections, you will arrive at the perfect XI for your team.';
  const [logModalVisible, setLogModalVisible] = useState(false);

  const onShare = async () => {
    try {
      const result = await Share.share({ message });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          ToastAndroid.show('Thanks for Sharing :)', 1000);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        // ToastAndroid.show("Dismissed", 1000);
      }
    } catch (error) {
      ToastAndroid.show('An error has occured', 2000);
    }
  };

  const checkForUpdate = () => {
    if (sum(numbersInString(update.currentVersion)) > sum(numbersInString(appVersion))) {
      if (update.updateLink) Linking.openURL(update.updateLink);
      else ToastAndroid.show('An error has occured', 2000);
    } else ToastAndroid.show('App is up to date', 1000);
  };

  const rate = () => {
    if (update.rateUsUrl) Linking.openURL(update.rateUsUrl);
    else ToastAndroid.show('An error has occured', 2000);
  };

  const handleLogs = () => setLogModalVisible(true);

  const closeLogs = () => setLogModalVisible(false);

  const buttons = [
    {
      title: 'Check for update',
      iconName: 'refresh',
      expandable: false,
      expandedContent: null,
      onPress: checkForUpdate,
    },
    {
      title: 'Rate Us',
      iconName: 'thumbs-o-up',
      expandable: false,
      expandedContent: null,
      onPress: rate,
    },
    {
      title: 'Share',
      iconName: 'share-alt',
      expandable: false,
      expandedContent: null,
      onPress: onShare,
    },
    {
      title: 'About',
      iconName: 'info-circle',
      expandable: true,
      expandedHeight: 170,
      expandedContent: (
        <View style={{ ...styles.contentView, paddingHorizontal: '3%' }}>
          <Text allowFontScaling={false} style={styles.messageTextStyle}>
            {aboutMessage}
          </Text>
          <Text allowFontScaling={false} style={styles.versionTextStyle}>
            Version: {appVersion}
          </Text>
        </View>
      ),
      onPress: null,
    },
    {
      title: 'Logs',
      iconName: 'edit',
      expandable: false,
      expandedContent: null,
      onPress: handleLogs,
    },
    {
      title: 'Support Us',
      iconName: 'bitcoin',
      expandable: true,
      expandedHeight: 240,
      expandedContent: (
        <View style={{ ...styles.contentView, marginTop: 5 }}>
          <CryptoBar name='BTC' address={update.btcAddress} />
          <CryptoBar name='ETH' address={update.ethAddress} />
          <CryptoBar name='XRP' address={update.xrpAddress} />
          <CryptoBar name='TRX' address={update.trxAddress} />
          <CryptoBar name='DOGE' address={update.dogeAddress} />
        </View>
      ),
      onPress: null,
    },
  ];

  return (
    <ScrollView style={{ ...styles.mainView, display: visible ? 'flex' : 'none' }}>
      {buttons.map(({ expandable, expandedContent, iconName, title, onPress, expandedHeight }) => (
        <MoreBubble
          key={title}
          title={title}
          onPress={onPress}
          iconName={iconName}
          expandable={expandable}
          expandedHeight={expandedHeight}
          expandedContent={expandedContent}
        />
      ))}

      <AdMobBanner
        style={styles.bottomView}
        servePersonalizedAds={true}
        bannerSize='smartBannerLandscape'
        onDidFailToReceiveAdWithError={null}
        adUnitID='ca-app-pub-7152054343360573/9830430705'
      />

      <LogNote visible={logModalVisible} onRequestClose={closeLogs} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '92%',
    paddingTop: '1.5%',
    paddingHorizontal: '2%',
  },
  bottomView: {
    width: '100%',
    marginBottom: '20%',
    alignItems: 'center',
    height: DEFAULT_AD_HEIGHT,
    justifyContent: 'flex-end',
  },
  messageTextStyle: {
    width: '100%',
    marginBottom: '3%',
    paddingLeft: '6.5%',
    color: colors.blueRibbon,
    fontSize: findFontSize(11),
    textAlignVertical: 'bottom',
    fontFamily: 'PoppinsRegular',
  },
  versionTextStyle: {
    width: '100%',
    paddingLeft: '6.5%',
    color: colors.blueRibbon,
    fontSize: findFontSize(12),
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  contentView: { width: '100%', height: '100%', alignItems: 'center' },
});

export default memo(MoreScreen);
