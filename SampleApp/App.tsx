import React, {useState} from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import {
  enableDevMode,
  // initWENotificationInbox,
} from 'react-native-webengage-inbox';
import webEngageManager, {
  initWebEngage,
} from './src/WebEngageHandler/WebEngageManager';
import SplashScreen from 'react-native-splash-screen';
import WebEngagePlugin from 'react-native-webengage';
import {Alert, Text, View} from 'react-native';

function App(): React.JSX.Element {
  enableDevMode();
  initWebEngage();
  const [data, setData] = useState(null);

  // initWENotificationInbox();

  webEngageManager.push.onClick(function (notificationData) {
    console.log(
      'WebEngage Push' +
        'push-notification clicked with payload: ' +
        JSON.stringify(notificationData.userData),
    );
    // setData(notificationData);
    // Execute code after a delay
    const delayedFunction = () => {
      console.log('push-notification Code executed after delay');
      Alert.alert('push called');
      // Put your code here that you want to execute after a delay
    };

    // Set a timeout for 3000 milliseconds (3 seconds)
    const delay = 10000;
    const timeoutId = setTimeout(delayedFunction, delay);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
    // setTimeout(() => {
    //   console.log('push-notification timeout completed now!');
    //   Alert.alert('It is a Simple Alert ' + JSON.stringify(notificationData));
    // }, 10000);
  });

  React.useEffect(() => {
    console.log('App is mounted');
    SplashScreen.hide();
    // const webEngageManager = new WebEngagePlugin();
    // webEngageManager.push.onClick(function (notificationData) {
    //   console.log(
    //     'WebEngage:App' +
    //       ' push-notification clicked with payload: ' +
    //       JSON.stringify(notificationData.userData),
    //   );
    //   Alert.alert('It is a Simple Alert ' + JSON.stringify(notificationData));
    // });
    console.log('App splash hidden');
  }, []);

  // return (
  //   <View>
  //     <Text> App.js</Text>
  //     {data ? <Text>{JSON.stringify(data)}</Text> : null}
  //   </View>
  // );
  return <AppNavigator />;
}

export default App;
