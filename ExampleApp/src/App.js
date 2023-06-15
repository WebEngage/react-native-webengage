import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MainScreen from './screens/MainScreen';
import WEModal from './WEModal';
import AsyncStorageUtil from './utils/AsyncStorageUtils';

const Stack = createStackNavigator();
// TODO Actual App.js is in previous path use that
const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = React.useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userValue = await AsyncStorageUtil.getString('userName');
        console.log('Retrieved string:', userValue);
        setUserName(userValue);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const loginUser = userData => {
    const {userName: loggedInUser} = userData;
    // dispatch(login(userName));
    AsyncStorageUtil.storeString('userName', loggedInUser);
    setUserName(loggedInUser);
  };

  const handleLogout = () => {
    // Clear user data from the userReducer
    // dispatch(logout());
    AsyncStorageUtil.deleteString("userName");
    setUserName("")

  };

  const renderHeaderRight = () => {


    if (userName) {
      return (
        <View style={styles.headerRight}>
          <Button title="Logout" onPress={handleLogout} color="#800080" />
        </View>
      );
    } else {
      return (
        <View style={styles.headerRight}>
          <Button title="Login" onPress={toggleModal} color="#800080" />
        </View>
      );
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            title: 'Main',
            headerRight: renderHeaderRight,
            headerStyle: {backgroundColor: '#800080'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},
          }}
        />
      </Stack.Navigator>
      <WEModal
        visible={isModalVisible}
        onClose={toggleModal}
        onLogin={loginUser}
      />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 10,
  },
});

export default App;
