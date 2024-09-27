// EventsScreen.js
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import COLORS from '../../Styles/Colors';
import {WebView} from 'react-native-webview';
import {handleWebEngageBridgeCall} from './WEGWebBridge';

const WebviewScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <WebView
          source={{uri: 'https://milindwebengage.github.io/sample_web_page/'}}
          style={{marginTop: 20}}
          onMessage={event => {
            handleWebEngageBridgeCall(event.nativeEvent.data);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 200,
  },
  hyperlink: {
    color: COLORS.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    borderWidth: 1,
    marginVertical: 20,
    borderColor: COLORS.grey,
  },
  picker: {
    height: 50,
    width: 100,
    marginBottom: 10,
  },
  trackButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  trackButtonText: {
    color: 'white',
  },
  rowList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 2,
  },
  keyText: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 14,
  },
  valueText: {
    marginLeft: 4,
    fontSize: 14,
  },
  modalContainer: {},
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  attributeTextbox: {
    width: 200,
    padding: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

export default WebviewScreen;
