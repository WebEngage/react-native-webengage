import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './NavigationService';

import ProfileScreen from '../screens/ProfileScreen';
import EventsScreen from '../screens/EventComponent/EventsScreen';
import HomeScreen from '../screens/HomeScreen';
import InlineScreen from '../screens/InlineScreen';
import {StyleSheet} from 'react-native';
import COLORS from '../Styles/Colors';
import CONSTANTS from '../utils/Constants';
import ScreenComponent from '../screens/ScreenComponent';
import ScreenList from '../screens/Inline/ScreenList';
import ScreenDetails from '../screens/Inline/ScreenDetails';
import DynamicScreen from '../screens/Inline/DynamicScreen';
import NotificationInbox from '../screens/NotificationInbox/NotificationInbox';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={CONSTANTS.SCREEN_NAMES.HOME}>
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.HOME}
          component={HomeScreen}
          options={{
            title: CONSTANTS.SCREEN_TITLE.HOME,
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.PROFILE}
          component={ProfileScreen}
          options={{
            title: CONSTANTS.SCREEN_TITLE.PROFILE,
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.EVENTS}
          component={EventsScreen}
          options={{
            title: CONSTANTS.SCREEN_TITLE.EVENTS,
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.INLINE}
          component={ScreenList}
          options={{
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.SCREENS}
          component={ScreenComponent}
          options={{
            title: CONSTANTS.SCREEN_TITLE.SCREENS,
            headerStyle: styles.headerStyle,
            headerTintColor: COLORS.white,
            headerTitleStyle: styles.headerTextStyle,
          }}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.SCREEN_LIST}
          options={{
            title: CONSTANTS.SCREEN_TITLE.SCREEN_LIST,
          }}
          component={ScreenList}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.SCREEN_DETAILS}
          options={{
            title: CONSTANTS.SCREEN_TITLE.SCREEN_DETAILS,
          }}
          component={ScreenDetails}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.DYNAMIC_SCREEN}
          component={DynamicScreen}
          options={({route}) => ({title: route.params.item.screenName})}
        />
        <Stack.Screen
          name={CONSTANTS.SCREEN_NAMES.NOTIFICATION_INBOX}
          component={NotificationInbox}
          options={{
            title: CONSTANTS.SCREEN_TITLE.NOTIFICATION_INBOX,
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
