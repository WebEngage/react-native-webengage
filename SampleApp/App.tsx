import React, {useEffect} from 'react';

import {Alert, PermissionsAndroid, Platform} from 'react-native';
import WebEngage from 'react-native-webengage';
import {
  enableDevMode,
  initWENotificationInbox,
} from 'react-native-webengage-inbox';
import {initWebEngage} from './src/WebEngageHandler/WebEngageManager';
import messaging from '@react-native-firebase/messaging';
import AppNavigator from './src/Navigation/AppNavigator';

function App(): React.JSX.Element {
  const webengage = new WebEngage();
  useEffect(() => {
    enableDevMode();
    initWebEngage();
    initWENotificationInbox();
    // Listen to messages in the foreground
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage: any) => {
        console.log('Firebase: Foreground Message Received:', remoteMessage);
        webengage.push.onMessageReceived(remoteMessage);
        Alert.alert(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );
      },
    );

    // Request user permission for notifications
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('PushAuthorization status:', authStatus);
      }
    };

    requestUserPermission();

    // Request Android permissions for notifications
    const requestAndroidPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          webengage.user.setDevicePushOptIn(true);
          console.log('Android permissions granted');
        } else {
          webengage.user.setDevicePushOptIn(false);
          console.log('Android permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    if (Platform.OS === 'android' && Platform.Version >= 31) {
      requestAndroidPermissions();
    }

    // Register device for remote messages required only if messaging_ios_auto_register_for_remote_messages is false from firebase.json
    const registerDeviceForRemoteMessages = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        getToken();
        console.log('Device registered for remote messages');
      } catch (error) {
        console.error('Error registering device for remote messages:', error);
      }
    };

    // registerDeviceForRemoteMessages();

    // Get FCM token
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM token:', token);
        // Pass token to webengage
        webengage.push.sendFcmToken(token);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    getToken();

    // Handle initial notification // Killed state
    const handleInitialNotification = async () => {
      try {
        const initialNotification = await messaging().getInitialNotification();
        console.log('Firebase: Initial Notification:', initialNotification);
      } catch (error) {
        console.error('Firebase: Error handling initial notification:', error);
      }
    };

    handleInitialNotification();

    // Handle notification opened while app is in background
    const handleNotificationOpenedApp = async () => {
      try {
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log(
            'Firebase: Notification opened while app is in background:',
            remoteMessage,
          );
          // You can perform actions here based on the opened notification
        });
      } catch (error) {
        console.error(
          'Firebase: Error handling notification opened while app is in background:',
          error,
        );
      }
    };

    handleNotificationOpenedApp();

    return () => {
      unsubscribeForeground();
      console.log('Cleanup for user permission request');
      console.log('Cleanup for Android permissions request');
    };
  }, []);

  return <AppNavigator />;
}

export default App;
