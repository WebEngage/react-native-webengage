import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';

import Modal from 'react-native-modal';
import WEModal from '../WEModal';

const MainScreen = ({navigation}) => {

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Profile"
          onPress={() => navigation.navigate('Profile')}
          color="#800080" // Purple color
        />
        <Button
          title="Events"
          onPress={() => navigation.navigate('Events')}
          color="#800080" // Purple color
        />
        <Button
          title="Inline"
          onPress={() => navigation.navigate('Inline')}
          color="#800080" // Purple color
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    // backgroundColor: '#800080', // Purple color
    borderRadius: 15,
  },
  closeButtonText: {
    // color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainScreen;
