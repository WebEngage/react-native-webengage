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
import {PermissionsAndroid} from 'react-native';

function App(): React.JSX.Element {
  enableDevMode();
  initWebEngage();
  initWENotificationInbox();
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
  requestAndroidPermissions();

  return <AppNavigator />;
}

export default App;
