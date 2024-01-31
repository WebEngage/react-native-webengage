import {Alert} from 'react-native';
import WebEngage from 'react-native-webengage';
import CONSTANTS from '../Utils/Constants';

const webEngageManager = new WebEngage();

export default webEngageManager;

export const initWebEngage = () => {
  // In-app notification callbacks
  webEngageManager.notification.onPrepare(function (notificationData) {
    console.log(
      CONSTANTS.WEBENGAGE_INAPP + 'App: in-app notification prepared',
    );
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
    console.log(
      CONSTANTS.WEBENGAGE_INAPP + ' in-app notification shown with ' + message,
    );
  });

  webEngageManager.notification.onClick(function (notificationData, clickId) {
    console.log(
      CONSTANTS.WEBENGAGE_INAPP +
        ' in-app notification clicked: click-id: ' +
        clickId +
        ', deep-link: ' +
        notificationData.deeplink,
    );
  });

  webEngageManager.notification.onDismiss(function (notificationData) {
    console.log(CONSTANTS.WEBENGAGE_INAPP + ' in-app notification dismissed');
  });

  webEngageManager.push.onClick(function (notificationData) {
    console.log(
      CONSTANTS.WEBENGAGE_INAPP +
        ' push-notification clicked with payload: ' +
        JSON.stringify(notificationData.userData),
    );
    Alert.alert('It is a Simple Alert ' + JSON.stringify(notificationData));
  });
};
