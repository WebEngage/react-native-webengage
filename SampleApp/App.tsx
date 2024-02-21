import React, {useEffect} from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import {
  enableDevMode,
  initWENotificationInbox,
} from 'react-native-webengage-inbox';
import {initWebEngage} from './src/WebEngageHandler/WebEngageManager';
import WebEngage from 'react-native-webengage';
import notifee, {EventType} from '@notifee/react-native';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

function App(): React.JSX.Element {
  React.useEffect(() => {
    const firebaseCall = async () => {
      const message = await messaging().getInitialNotification();
      if (message) {
        Alert.alert('Initial notification', JSON.stringify(message));
        console.log('Initial notification', JSON.stringify(message));
      }
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        Alert.alert('Notification caused app to open from background state:');
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
        Alert.alert('setBackgroundMessageHandler:');
        onMessageReceived(remoteMessage);
      });
    };
    firebaseCall();
  });

  notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log(
      'WebEngage: firebase: onBackgroundEvent triggered: ',
      JSON.stringify(detail),
    );
    const {notification, pressAction} = detail;

    // Check if the user pressed the "Mark as read" action
    if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
      // Update external API
      await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
        method: 'POST',
      });

      // Remove the notification
      await notifee.cancelNotification(notification.id);
    }
  });

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  async function onMessageReceived(message) {
    console.log('WebEngage: onMessageReceived: ', JSON.stringify(message));
    // notifee.displayNotification(message);
    onDisplayNotification();
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);
    requestUserPermission();

    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  enableDevMode();
  initWebEngage();
  initWENotificationInbox();

  return <AppNavigator />;
}

export default App;
