import {Alert} from 'react-native';
import WebEngage from 'react-native-webengage';

const webEngageManager = new WebEngage();

export default webEngageManager;

export const initWebEngage = () => {
  // In-app notification callbacks
  webEngageManager.notification.onPrepare(function (notificationData) {
    console.log('App: in-app notification prepared');
  });

  webEngageManager.notification.onShown(function (notificationData) {
    var message;
    if (notificationData.title && notificationData.title !== null) {
      message = 'title: ' + notificationData.title;
    } else if (
      notificationData.description &&
      notificationData.description !== null
    ) {
      message = 'description: ' + notificationData.description;
    }
    console.log('App: in-app notification shown with ' + message);
  });

  webEngageManager.notification.onClick(function (notificationData, clickId) {
    console.log(
      'App: in-app notification clicked: click-id: ' +
        clickId +
        ', deep-link: ' +
        notificationData.deeplink,
    );
  });

  webEngageManager.notification.onDismiss(function (notificationData) {
    console.log('App: in-app notification dismissed');
  });

  webEngageManager.push.onClick(function (notificationData) {
    console.log(
      'MyLogs App: push-notiifcation clicked with deeplink: ' +
        notificationData.deeplink,
    );
    console.log(
      'MyLogs App: push-notiifcation clicked with payload: ' +
        JSON.stringify(notificationData.userData),
    );
    Alert.alert('It is a Simple Alert ' + notificationData.deeplink);
  });
  webEngageManager.universalLink.onClick(function (location) {
    console.log('App: universal link clicked with location: ' + location);
  });
};
