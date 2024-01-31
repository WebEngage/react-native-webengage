import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  WEInlineWidget,
  trackClick,
  trackImpression,
  registerWECampaignCallback,
  registerWEPlaceholderCallback,
  deregisterWEPlaceholderCallback,
  deregisterWECampaignCallback,
} from 'react-native-we-personalization';

import webEngageManager from '../../WebEngageHandler/WebEngageManager';
import NavigationModal from '../../Navigation/NavigationModal';
import WETextInput from '../../CommonComponents/WETextInput';
import WEButton from '../../CommonComponents/WEButton';
import AsyncStorageUtil from '../../Utils/AsyncStorageUtils';
import CONSTANTS from '../../Utils/Constants';
import COLORS from '../../Styles/Colors';

interface DynamicScreenProps {
  navigation: any;
  route: {
    params: {
      item: {
        screenName: string;
        size: number;
        eventName: string;
        screenProperty: string;
        screenValue: string;
        isRecyclerView: boolean;
        viewData: Array<any>;
      };
    };
  };
}
interface InlineViewProps {
  position: number;
  height?: number;
  width?: number;
  isCustomView: boolean;
  propertyId: string;
}

interface WECampaignContent {
  layoutType?: string | null;
  subLayoutType: string;
  properties: Record<string, any>;
  children: WECampaignContent[];
  customData: Record<string, any>;
}

interface WECampaignDataProps {
  parserType?: string | null;
  targetViewId: string;
  content?: WECampaignContent | null;
  campaignId?: string;
  propertyId?: string | null;
  variationId?: string | null;
  shouldRender?: boolean;
  isDataOption?: boolean;
  shouldAutoTrackImpression?: boolean;

  // Additional methods
  trackImpression(attributes?: Record<string, any>): void;
  trackClick(attributes?: Record<string, any>): void;
  stopRendering(): void;
  toJSONString(): string;
}

const DynamicScreen: React.FC<DynamicScreenProps> = props => {
  const {navigation = {}, route: {params: {item = {} as any} = {}} = {}} =
    props;

  const {
    screenName = '',
    size = 0,
    eventName = '',
    screenProperty = '',
    screenValue = '',
    isRecyclerView = false,
    viewData = [],
  } = item;

  const arr: Array<any> = [];
  const customPropertyList: Array<any> = [];

  for (let i = 0; i < size; i++) {
    const id = `item-${i}`;
    arr.push({id: id});
  }

  const [screenList, setScreenList] = React.useState([]);
  const screenListRef = useRef(null);
  const [customViewLabel, setCustomViewLabel] = React.useState({});
  const [showNavigation, setShowNavigation] = React.useState(false);

  const clickRef = useRef(null);
  const [exceptionLable, setExceptionLable] = React.useState('No Exception');
  const [eventNameToTrigger, setEventNameToTrigger] = React.useState('');

  useEffect(() => {
    if (screenName) {
      if (screenProperty && screenValue) {
        console.log(
          CONSTANTS.WEBENGAGE_INLINE +
            '  navigating to ' +
            screenName +
            ' with data',
          {[screenProperty]: screenValue},
        );
        webEngageManager.screen(screenName, {
          [screenProperty]: parseInt(screenValue),
        });
      } else {
        console.log(
          CONSTANTS.WEBENGAGE_INLINE +
            '  navigating to ' +
            screenName +
            ' without data',
        );
        webEngageManager.screen(screenName);
      }
    }
    if (eventName) {
      webEngageManager.track(eventName);
    }
    checkForCustomView();

    return () => {
      console.log(
        CONSTANTS.WEBENGAGE_INLINE +
          ` Screen ${screenName} is unmounted. You can clean up here if needed.`,
      );
    };
  }, [screenName]);

  React.useEffect(() => {
    (async () => {
      const screenListData = await AsyncStorageUtil.getItem('screenData');
      const screenArrData = JSON.parse(screenListData);
      setScreenList(screenArrData);
      screenListRef.current = screenArrData;
    })();

    const WECampaignCallback = {
      onCampaignPrepared,
      onCampaignShown,
      onCampaignClicked,
      onCampaignException,
    };
    registerWECampaignCallback(WECampaignCallback);

    return () => {
      deregisterWECampaignCallback();
      removeCustomViews();
    };
  }, []);

  const removeCustomViews = () => {
    customPropertyList.map(property => {
      const androidPropertyId = property;
      const iosPropertyId = property;
      deregisterWEPlaceholderCallback(
        androidPropertyId,
        iosPropertyId,
        screenName,
      );
    });
    customPropertyList?.splice(0, customPropertyList.length);
  };

  const checkForCustomView = () => {
    let customLabels = {};
    viewData.map(viewItem => {
      const {isCustomView = false, propertyId: viewPropertyId} = viewItem;
      customLabels = {
        ...customLabels,
        [viewPropertyId]:
          'Custom View: Either campaign not Running / onRendered not triggered',
      };
      const iosPropertyId = viewPropertyId;
      const androidPropertyId = viewPropertyId;
      const propertyId =
        Platform.OS === 'ios' ? iosPropertyId : androidPropertyId;
      if (isCustomView) {
        customPropertyList.push(propertyId);
        registerWEPlaceholderCallback(
          androidPropertyId,
          iosPropertyId,
          screenName,
          onCustomDataReceived,
          onCustomPlaceholderException,
        );
      }
    });
    setCustomViewLabel(customLabels);
  };

  const onCampaignClicked = data => {
    const {deepLink = ''} = data;
    const deepLinkArr = deepLink.split('/');

    if (
      clickRef.current &&
      deepLinkArr.length > 3 &&
      deepLinkArr[2] === 'www.webengage.com'
    ) {
      const navigateScreen = deepLinkArr[3];
      const screenListArr = screenListRef.current;

      screenListArr?.forEach(screenData => {
        if (screenData.screenName === navigateScreen) {
          navigation.navigate(navigateScreen, {item: screenData});
        }
      });
    }
  };

  const onCampaignPrepared = (weCampaignData: WECampaignDataProps) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE + '  dynamic: onCampaignPrepared ',
      weCampaignData,
    );
  };

  const onCampaignShown = (weCampaignData: WECampaignDataProps) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE + '  dynamic: onCampaignShown ',
      weCampaignData,
    );
  };

  const onCampaignException = (weCampaignData: WECampaignDataProps) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE + '  dynamic: onCampaignException ',
      weCampaignData,
    );
  };

  const onRendered1 = (weCampaignData: WECampaignDataProps) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE + '  Dynamic onRendered triggered for -',
      weCampaignData?.targetViewId,
      weCampaignData,
    );
  };

  const onDataReceived1 = (weCampaignData: WECampaignDataProps) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE + '  Dynamic onDataReceived triggered for ',
      weCampaignData?.targetViewId,
      weCampaignData,
    );
  };

  const onPlaceholderException1 = (weCampaignData: WECampaignDataProps) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE +
        '  Dynamic onPlaceholderException triggered for ',
      weCampaignData?.targetViewId,
      weCampaignData,
    );
    const exceptionText =
      'Exception occured for id - ' +
      weCampaignData?.targetViewId +
      ' Exception - ' +
      weCampaignData?.exception;
    setExceptionLable(exceptionText);
  };

  const onCustomDataReceived = (weCampaignData: WECampaignDataProps) => {
    const {targetViewId} = weCampaignData;
    setCustomViewLabel(prevState => ({
      ...prevState,
      [targetViewId]: JSON.stringify(weCampaignData),
    }));
    console.log(
      CONSTANTS.WEBENGAGE_INLINE + '  custom onDataReceived!!! triggered for ',
      weCampaignData?.targetViewId,
      weCampaignData,
      customViewLabel,
    );
  };

  const onCustomPlaceholderException = (
    weCampaignData: WECampaignDataProps,
  ) => {
    console.log(
      CONSTANTS.WEBENGAGE_INLINE +
        '  custom onPlaceholderException triggered for ',
      weCampaignData?.targetViewId,
      weCampaignData,
    );
    const exceptionText =
      'Exception occured for id - ' +
      weCampaignData?.targetViewId +
      ' Exception - ' +
      weCampaignData?.exception;
    setExceptionLable(exceptionText);
  };

  const trackImpressions = (propertyId: WECampaignDataProps['propertyId']) => {
    trackImpression(propertyId, null);
  };

  const trackClicks = (propertyId: WECampaignDataProps['propertyId']) => {
    trackClick(propertyId, null);
  };

  const renderRecycler = ({item, index}) => {
    let inlineView: InlineViewProps | null = null;
    let isCustomView = false;
    viewData?.forEach(viewItem => {
      const {position} = viewItem;
      if (position === index) {
        inlineView = viewItem;
        isCustomView = viewItem.isCustomView;
      }
    });
    const styleList = isRecyclerView ? styles.flatColor : [];
    if (inlineView) {
      const inlineHeight = inlineView.height || 250;
      const inlineWidth = inlineView.width || Dimensions.get('window').width;
      if (isCustomView) {
        return (
          <View>
            <Text> {customViewLabel[inlineView.propertyId]} </Text>
            <View style={styles.rowLine}>
              <WEButton
                buttonText="Impression"
                onPress={() => trackImpressions(inlineView.propertyId)}
                buttonStyle={styles.customButton}
              />
              <WEButton
                buttonText="Click"
                onPress={() => trackClicks(inlineView.propertyId)}
                buttonStyle={styles.customButton}
              />
            </View>
          </View>
        );
      } else {
        return (
          <WEInlineWidget
            style={[styles.box, {height: inlineHeight, width: inlineWidth}]}
            screenName={screenName}
            androidPropertyId={inlineView.propertyId}
            iosPropertyId={inlineView.propertyId}
            onRendered={onRendered1}
            onDataReceived={onDataReceived1}
            onPlaceholderException={onPlaceholderException1}
          />
        );
      }
    }
    return (
      <View style={[styles.card, styleList]}>
        <Text style={styles.textStyle}> {index}th Item</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        data={arr}
        keyExtractor={item => item.id}
        renderItem={renderRecycler}
      />
    );
  };

  const renderRegularScreen = () => {
    return arr.map((item, index) => {
      return renderRecycler({item, index});
    });
  };

  const renderScreen = () => {
    if (isRecyclerView) {
      return renderFlatList();
    } else {
      return <ScrollView>{renderRegularScreen()}</ScrollView>;
    }
  };

  const openNavigation = () => {
    setShowNavigation(true);
  };

  const trackEvent = () => {
    webEngageManager.track(eventNameToTrigger);
  };

  const sendNavigation = navItem => {
    const {screenName: navigateScreen} = navItem;
    navigation.navigate(CONSTANTS.SCREEN_NAMES.DYNAMIC_SCREEN, {
      item: navItem,
      screenId: navigateScreen,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowLine}>
        <WEButton
          buttonText="Navigate"
          onPress={openNavigation}
          buttonStyle={styles.button}
        />
      </View>
      <Text> {exceptionLable}</Text>
      <View style={[styles.rowItem, styles.border]}>
        <WETextInput
          customStyle={styles.textInput}
          placeholderText="Enter Event Name"
          value={eventNameToTrigger}
          onChangeText={text => setEventNameToTrigger(text)}
        />
        <WEButton
          buttonText="Track"
          onPress={trackEvent}
          buttonStyle={styles.trackButton}
          buttonTextStyle={styles.trackText}
        />
      </View>
      <NavigationModal
        screenList={screenList}
        currentScreen={screenName}
        showModal={showNavigation}
        changeModalStatus={setShowNavigation}
        sendNavigation={sendNavigation}
      />
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: 100,
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    margin: 20,
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 25,
    backgroundColor: COLORS.darkGreen,
    borderWidth: 1,
    width: 100,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 25,
    marginBottom: 20,
  },
  customButton: {
    marginTop: 25,
    backgroundColor: COLORS.error_red,
    borderWidth: 1,
    width: 100,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 25,
    marginBottom: 20,
  },
  rowItem: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  flatColor: {
    backgroundColor: COLORS.peach,
  },
  textStyle: {
    fontSize: 20,
  },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  textInput: {
    height: 45,
    width: 200,
    borderBottomWidth: 2,
    marginBottom: 2,
    marginHorizontal: 20,
    borderBottomColor: COLORS.white,
  },
  trackButton: {
    height: 30,
    width: 100,
    backgroundColor: COLORS.goldenRod,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  trackText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  box: {
    width: Dimensions.get('window').width,
    height: 200,
  },
});

DynamicScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default DynamicScreen;
