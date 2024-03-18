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

  // webEngageManager.push.onClick(function (notificationData) {
  //   console.log(
  //     CONSTANTS.WEBENGAGE_PUSH +
  //       ' push-notification clicked with payload: ' +
  //       JSON.stringify(notificationData.userData),
  //   );
  //   // Execute code after a delay
  //   const delayedFunction = () => {
  //     console.log('push-notification Code executed after delay');
  //     Alert.alert('push called');
  //     // Put your code here that you want to execute after a delay
  //   };

  //   // Set a timeout for 3000 milliseconds (3 seconds)
  //   const delay = 10000;
  //   const timeoutId = setTimeout(delayedFunction, delay);

  //   // Clean up the timeout to avoid memory leaks
  //   return () => clearTimeout(timeoutId);
  //   // setTimeout(() => {
  //   //   console.log('push-notification timeout completed now!');
  //   //   Alert.alert('It is a Simple Alert ' + JSON.stringify(notificationData));
  //   // }, 10000);
  // });
};
