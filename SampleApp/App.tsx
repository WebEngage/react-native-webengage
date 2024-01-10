import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import WebEngage from 'react-native-webengage';
import AppNavigator from './src/Navigation/AppNavigator';

function App(): React.JSX.Element {
  const webengage = new WebEngage();
  webengage.user.login('12345');
  return <AppNavigator />;
}

export default App;
