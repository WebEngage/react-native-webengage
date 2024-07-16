import React from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import {
  enableDevMode,
  initWENotificationInbox,
} from 'react-native-webengage-inbox';
import {
  disableWebEngagePush,
  enableWebEngagePush,
  initWebEngage,
} from './src/WebEngageHandler/WebEngageManager';
import {PermissionsAndroid, Platform} from 'react-native';
import AsyncStorageUtil from './src/utils/AsyncStorageUtils';

function App(): React.JSX.Element {
  enableDevMode();
  // Init WE Libraries only if User is LoggedIn
  // Rquesting permission for Android
  const requestAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        enableWebEngagePush();
        console.log('Android permissions granted');
      } else {
        disableWebEngagePush();
        console.log('Android permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    requestAndroidPermissions();
  }

  React.useEffect(() => {
    const checkWEInitialized = async () => {
      let isWEInitiated = await AsyncStorageUtil.getItem<Boolean>(
        'isUserLoggedIn',
      );
      if (isWEInitiated) {
        initWebEngage();
        initWENotificationInbox();
      }
      console.log('WebEngage successfully Initialized ', isWEInitiated);
    };
    checkWEInitialized();
  });

  return <AppNavigator />;
}

export default App;
