import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  ToastAndroid,
  Share,
} from 'react-native';
import { Icon } from 'react-native-elements';
// import { AdMobBanner, setTestDeviceIDAsync } from 'expo-ads-admob';

import { colors } from '../constants';
import CryptoBar from '../components/CryptoBar';
import LogPage from './LogPage';
import { numbersInString, sum, findFontSize } from '../utilities';

function MorePage({ update, appVersion }) {
  // async function initializeId() {
  //   await setTestDeviceIDAsync('EMULATOR');
  // }
  // useEffect(initializeId, []);

  const message = `This app will help you in planning your team properly for gameweeks in the Fantasy Premier League. By following our regularly predicted scores and scout selections, you will arrive at the perfect XI for your team.`;
  const [arrowDirectionAbout, setArrowDirectionAbout] = useState(false);
  const [arrowDirectionSupport, setArrowDirectionSupport] = useState(false);
  const [logModalState, setLogModalState] = useState(false);
  async function onShare() {
    try {
      const result = await Share.share({
        message: `Predict your FPL points now by downloading the FanatasyPredictor app for free on Google Playstore | ${update.rateUsUrl}`,
      });
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
      ToastAndroid.show(`${error.message}`, 2000);
    }
  }
  function findContent(title) {
    if (title === 'About') {
      return (
        <View style={{ ...styles.contentView, paddingHorizontal: '3%' }}>
          <Text allowFontScaling={false} style={styles.messageTextStyle}>
            {message}
          </Text>
          <Text
            allowFontScaling={false}
            style={styles.versionTextStyle}
          >{`Version: ${appVersion}`}</Text>
        </View>
      );
    }
    return (
      <View style={styles.contentView}>
        <CryptoBar name={'BTC'} address={update.btcAddress} />
        <CryptoBar name={'ETH'} address={update.ethAddress} />
        <CryptoBar name={'XRP'} address={update.xrpAddress} />
        <CryptoBar name={'TRX'} address={update.trxAddress} />
        <CryptoBar name={'DOGE'} address={update.dogeAddress} />
      </View>
    );
  }

  function checkForUpdate() {
    if (sum(numbersInString(update.currentVersion)) > sum(numbersInString(appVersion))) {
      if (update.updateLink === '') ToastAndroid.show('An error has occured', 2000);
      else Linking.openURL(update.updateLink);
    } else ToastAndroid.show('App is up to date', 1000);
  }

  function rate() {
    if (update.rateUsUrl === '') ToastAndroid.show('An error has occured', 2000);
    else Linking.openURL(update.rateUsUrl);
  }

  function handleAbout() {
    setArrowDirectionSupport(false);
    setArrowDirectionAbout(!arrowDirectionAbout);
  }

  function handleLogs() {
    setLogModalState(true);
  }

  function closeLogs() {
    setLogModalState(false);
  }

  function handleSupport() {
    setArrowDirectionAbout(false);
    setArrowDirectionSupport(!arrowDirectionSupport);
  }

  const itemNames = [
    {
      title: 'Check for update',
      iconName: 'refresh',
      expandable: false,
      onPress: checkForUpdate,
    },
    {
      title: 'Rate Us',
      iconName: 'thumbs-o-up',
      expandable: false,
      onPress: rate,
    },
    {
      title: 'Share',
      iconName: 'share-alt',
      expandable: false,
      onPress: onShare,
    },
    {
      title: 'About',
      iconName: 'info-circle',
      expandable: true,
      iconState: arrowDirectionAbout,
      onPress: handleAbout,
    },
    {
      title: 'Logs',
      iconName: 'edit',
      expandable: false,
      onPress: handleLogs,
    },
    {
      title: 'Support Us',
      iconName: 'bitcoin',
      expandable: true,
      iconState: arrowDirectionSupport,
      onPress: handleSupport,
    },
  ];
  return (
    <View style={styles.mainView}>
      <View style={styles.headerView}>
        {itemNames.map(item => (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              ...styles.viewStyle,
              height:
                item.expandable && item.iconState
                  ? item.title === 'About'
                    ? '37%'
                    : '55%'
                  : '12%',
            }}
            key={item.title}
            onPress={item.onPress}
          >
            <View
              style={{ ...styles.touchableHeaderView, height: item.iconState ? '20%' : '100%' }}
            >
              <View style={styles.iconView}>
                <Icon
                  name={item.iconName}
                  type='font-awesome'
                  size={findFontSize(25)}
                  color={colors.darkBlue}
                />
              </View>
              <View style={styles.textView}>
                <Text allowFontScaling={false} style={styles.textStyle}>
                  {item.title}
                </Text>
              </View>
              <View style={styles.iconView}>
                {item.expandable ? (
                  <Icon
                    name={item.iconState ? 'caret-up' : 'caret-down'}
                    type='font-awesome'
                    size={findFontSize(25)}
                    color={colors.darkBlue}
                  />
                ) : null}
              </View>
            </View>
            {item.iconState ? (
              <View style={{ width: '100%', height: '80%', paddingHorizontal: '3%' }}>
                {findContent(item.title)}
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
      {/* <AdMobBanner
        bannerSize='smartBannerLandscape'
        servePersonalizedAds={true}
        adUnitID='ca-app-pub-7152054343360573/9830430705'
        onDidFailToReceiveAdWithError={null}
      /> */}
      <LogPage visible={logModalState} onRequestClose={closeLogs} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '1.5%',
  },
  headerView: { width: '100%', height: '80%', alignItems: 'center', justifyContent: 'flex-start' },
  // bottomView: {
  //   width: "100%",
  //   height: "20%",
  //   alignItems: "center",
  //   justifyContent: "flex-end",
  // },
  touchableHeaderView: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  viewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skyBlue,
    width: '96%',
    height: '12%',
    borderRadius: 5,
    marginBottom: '1%',
  },
  textView: {
    width: '80%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: '2%',
  },
  textStyle: {
    color: colors.darkBlue,
    fontSize: findFontSize(13),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
  iconView: { width: '10%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  contentView: { width: '100%', height: '100%', alignItems: 'center' },
  messageTextStyle: {
    width: '100%',
    height: '75%',
    fontSize: findFontSize(11),
    color: colors.darkBlue,
    textAlign: 'left',
    textAlignVertical: 'top',
    fontFamily: 'PoppinsRegular',
  },
  versionTextStyle: {
    width: '100%',
    height: '25%',
    fontSize: findFontSize(12),
    color: colors.darkBlue,
    textAlign: 'left',
    textAlignVertical: 'center',
    fontFamily: 'PoppinsRegular',
  },
});

export default React.memo(MorePage);
