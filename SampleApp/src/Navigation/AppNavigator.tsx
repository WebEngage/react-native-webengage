import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigate, navigationRef} from './NavigationService';

import ProfileScreen from '../screens/ProfileScreen';
import EventsScreen from '../screens/EventsScreen';
import HomeScreen from '../screens/HomeScreen';
import InlineScreen from '../screens/InlineScreen';
import {Button, StyleSheet, View} from 'react-native';
// import AppInboxScreen from '../screens/AppInboxScreen';

const Stack = createStackNavigator();

const renderHeaderRight = () => {
  if (true) {
    return (
      <View style={styles.headerRight}>
        <Button title="Logout" onPress={handleLogout} color="#800080" />
      </View>
    );
  } else {
    return (
      <View style={styles.headerRight}>
        {/* <Button title="Login" onPress={toggleModal} color="#800080" /> */}
      </View>
    );
  }
};

const handleLogout = () => {
  // Clear user data from the userReducer
  // dispatch(logout());
  // AsyncStorageUtil.deleteString('userName');
  // setUserName('');
  // navigate()
};

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Main',
            headerRight: renderHeaderRight,
            headerStyle: {backgroundColor: '#800080'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Main',
            headerRight: undefined,
            headerStyle: {backgroundColor: '#800080'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
        <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{
            title: 'Main',
            headerRight: undefined,
            headerStyle: {backgroundColor: '#800080'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
        <Stack.Screen
          name="Inline"
          component={InlineScreen}
          options={{
            title: 'Main',
            headerRight: undefined,
            headerStyle: {backgroundColor: '#800080'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
        {/* <Stack.Screen name="AppInbox" component={AppInboxScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
});

export default AppNavigator;
