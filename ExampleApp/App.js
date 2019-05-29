/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Linking
} from 'react-native';
import { AsyncStorage } from "react-native";
import WebEngage from 'react-native-webengage';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

var webengage = new WebEngage();

type Props = {};
export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      userId: null,
      userIdInput: null,
      loginButtonText: 'LOGIN',
      event: ''
    }
    this.login = this.login.bind(this);
    this.track = this.track.bind(this);
    this.buy = this.buy.bind(this);
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);

    try {
      AsyncStorage.getItem('userid')
        .then((user_id) => {
          console.log("user id: " + user_id);
          if (user_id && user_id !== null && user_id !== '') {
            console.log("logged in user id: " + user_id);
            this.setState({
              userId: user_id,
              userIdInput: user_id,
              loginButtonText: "LOGOUT"
            })
          } else {
            this.setState({
              loginButtonText: "LOGIN"
            })
          }
        });
    } catch (error) {
        console.log(error);
    }

    // In-app notification callbacks
    webengage.notification.onPrepare(function(notificationData) {
      console.log("App: in-app notification prepared");
    });

    webengage.notification.onShown(function(notificationData) {
      var message;
      if (notificationData["title"] && notificationData["title"] !== null) {
        message = "title: " + notificationData["title"];
      } else if (notificationData["description"] && notificationData["description"] !== null) {
        message = "description: " + notificationData["description"];
      }
      console.log("App: in-app notification shown with " + message);
    });

    webengage.notification.onClick(function(notificationData, clickId) {
      console.log("App: in-app notification clicked: click-id: " + clickId + ", deep-link: " + notificationData["deepLink"]);
    });

    webengage.notification.onDismiss(function(notificationData) {
      console.log("App: in-app notification dismissed");
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {
    console.log("App: launch URL: " + event.url);
  }

  render() {
    console.log("App: Render called");
    return (
        <View style={styles.container}>
          <TextInput
            style={{width: 250,height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10}}
            onChangeText={(text) => this.setState({userIdInput: text})}
            value={this.state.userIdInput}
          />

          <TouchableHighlight style={styles.button}
            onPress={this.login}>
            <Text>{this.state.loginButtonText}</Text>
          </TouchableHighlight>

          <TextInput
            style={{width: 250,height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 50, marginBottom: 10}}
            onChangeText={(text) => this.setState({event: text})}
            value={this.state.event}
          />

          <TouchableHighlight style={styles.button}
            onPress={this.track}>
            <Text>TRACK</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button}
            onPress={this.buy}>
            <Text>BUY NOW</Text>
          </TouchableHighlight>
        </View>
    );
  }

  login() {
    if (this.state.userId === undefined || this.state.userId === null) {
      // Login
      var newUserId = this.state.userIdInput;
      if (newUserId && newUserId !== null && newUserId !== '') {
        webengage.user.login(newUserId);

        AsyncStorage.setItem('userid', newUserId);

        this.setState({
          userId: newUserId,
          loginButtonText: "LOGOUT"
        })

        console.log("App: Login called");
      } else {
        console.log("App: Invalid user id");
      }
    } else {
      // Logout
      webengage.user.logout();

      AsyncStorage.setItem('userid', '');

      this.setState({
        userId: null,
        userIdInput: '',
        loginButtonText: "LOGIN"
      })

      console.log("App: Logout called");
    }
  }

  track() {
    if (this.state.event && this.state.event !== null && this.state.event != '') {
      webengage.track(this.state.event);
    }
  }

  buy() {
    var event = "Product Purchased";
    var attributes = {
      "Amount": 2300,
      //"Delivery Date": new Date("2017-01-09T00:00:00.000Z"),
      "Delivery Date": new Date(),
      "Products" : [
        {
            "SKU Code": "UHUH799",
            "Product Name": "Armani Jeans",
            "Price": 300.49,
            "Details": {
                "Size": "L"
            }
        },
        {
            "SKU Code": "FBHG746",
            "Product Name": "Hugo Boss Jacket",
            "Price": 507.99,
            "Details": {
                "Size": "L",
            }
        },
      ],
      "Delivery Address": {
        "City": "San Francisco",
        "ZIP": "94121"
      },
      "Coupons Applied": [
        "BOGO17"
      ]
    };
    webengage.track(event, attributes);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    width: 150,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 25
  }
});
