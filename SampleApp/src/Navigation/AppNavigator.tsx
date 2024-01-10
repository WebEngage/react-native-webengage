import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './NavigationService';

import ProfileScreen from '../screens/ProfileScreen';
import EventsScreen from '../screens/EventsScreen';
import HomeScreen from '../screens/HomeScreen';
import InlineScreen from '../screens/InlineScreen';
import {StyleSheet} from 'react-native';
import COLORS from '../Styles/Colors';
import CONSTANTS from '../Utils/Constants';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={CONSTANTS.SCREEN_NAMES.HOME}>
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.HOME}
          component={HomeScreen}
          options={{
            title: 'Home',
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.PROFILE}
          component={ProfileScreen}
          options={{
            title: 'Profile',
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.EVENTS}
          component={EventsScreen}
          options={{
            title: 'Events',
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.INLINE}
          component={InlineScreen}
          options={{
            title: 'Inline',
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
  buttonContainer: {
    backgroundColor: COLORS.purple,
  },
  buttonText: {
    fontSize: 18,
  },
  headerStyle: {
    backgroundColor: COLORS.purple,
  },
  headerTextStyle: {
    fontWeight: 'bold',
  },
});

export default AppNavigator;
