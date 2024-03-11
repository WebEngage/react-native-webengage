import {AppRegistry} from 'react-native';
import App from './App';
// TODO change source to exact App
import {name as appName} from './app.json';
import webEngageManager from './src/WebEngageHandler/WebEngageManager';
import CONSTANTS from './src/Utils/Constants';

// This method has to be called in index.js even before app is registered in AppRegistry
//  This handles Foreground/Killed/Background state
webEngageManager.push.onPushReceived(async function (notificationData) {
  console.log(
    CONSTANTS.WEBENGAGE_PUSH + 'Push notification received in index.js: ',
    JSON.stringify(notificationData),
  );
});
AppRegistry.registerComponent(appName, () => App);
