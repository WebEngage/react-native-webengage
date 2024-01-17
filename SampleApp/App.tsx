import React from 'react';
import AppNavigator from './src/Navigation/AppNavigator';
import {
  enableDevMode,
  initWENotificationInbox,
} from 'react-native-webengage-inbox';
import {initWebEngage} from './src/WebEngageHandler/WebEngageManager';

function App(): React.JSX.Element {
  enableDevMode();
  initWebEngage();
  initWENotificationInbox();

  return <AppNavigator />;
}

export default App;
