/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';

import WebEngage from 'react-native-webengage';
const webengage = new WebEngage();
messaging().setBackgroundMessageHandler(async remoteMessage => {

  webengage.push.onMessageReceived(remoteMessage)
  console.log('Firebase: Message Received in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
