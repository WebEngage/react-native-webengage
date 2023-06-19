/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  Button,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import WebEngage from 'react-native-webengage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ScreenA from './src/ScreenA';
import ScreenB from './src/ScreenB';

const webengage = new WebEngage();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      userId: null,
      userIdInput: null,
      loginButtonText: 'LOGIN',
      event: '',
      secureToken: '',
      showInlineError: false,
      phoneNumber: '',
      isPushEnabled: true,
      isInAppEnabled: true,
      isViberEnabled: true,
      isWhatsappEnabled: true,
      channels: [
        {name: 'whatsapp', isEnabled: false, optInChannel: 'whatsapp'},
        {name: 'viber', isEnabled: false, optInChannel: 'viber'},
        {name: 'push', isEnabled: false, optInChannel: 'push'},
        {name: 'inApp', isEnabled: true, optInChannel: 'in_app'},
      ],
    };
    this.login = this.login.bind(this);
    this.track = this.track.bind(this);
    this.buy = this.buy.bind(this);
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    try {
      this.checkIUserLoggedIn();
      this.getChannels();
    } catch (error) {
      console.log(error);
    }
    this.inAppNotificationCallbacks();
    this.pushCallback();
    this.secureTokenExpiryListener = webengage.user.invalidateTokenCallback(
      this.invalidTokenCallback,
    );
  }

  componentWillUnmount() {
    this.unsubscribeListeners();
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  // Removes Listeners
  unsubscribeListeners = () => {
    if (this.inAppPreparedListener) {
      this.inAppPreparedListener.remove();
    }
    if (this.inAppShownListener) {
      this.inAppShownListener.remove();
    }
    if (this.inAppClickListener) {
      this.inAppClickListener.remove();
    }
    if (this.inAppDismissListener) {
      this.inAppDismissListener.remove();
    }
    if (this.pushClickListener) {
      this.pushClickListener.remove();
    }
    if (this.universalClickListener) {
      this.universalClickListener.remove();
    }
    if (this.secureTokenExpiryListener) {
      this.secureTokenExpiryListener.remove();
    }
  };

  checkIUserLoggedIn = () => {
    AsyncStorage.getItem('userid').then(user_id => {
      console.log('WebEngage: user- ' + user_id + ' is already LoggedIn!');
      if (user_id) {
        this.setState({
          userId: user_id,
          userIdInput: user_id,
          secureToken: '',
          loginButtonText: 'LOGOUT',
        });
      } else {
        this.setState({
          loginButtonText: 'LOGIN',
        });
      }
    });
  };

  // Checks if channels are enabled
  getChannels = () => {
    const {channels} = this.state;
    channels.map((channel, channelIndex) => {
      const {optInChannel} = channel;
      AsyncStorage.getItem(optInChannel).then(value => {
        var isPushOpted = JSON.parse(value);
        if (isPushOpted === null) {
          isPushOpted = false;
          AsyncStorage.setItem(optInChannel, JSON.stringify(true));
        }
        channels[channelIndex].isEnabled = isPushOpted;
        this.setState({
          channels,
        });
      });
    });
  };

  // In-app notification callbacks
  inAppNotificationCallbacks = () => {
    this.inAppPreparedListener = webengage.notification.onPrepare(function (
      notificationData,
    ) {
      console.log('WebEngage: InApp :  onPrepare - ', notificationData);
    });

    this.inAppShownListener = webengage.notification.onShown(function (
      notificationData,
    ) {
      const {title = '', description = ''} = notificationData;
      let message = {title: '', description: ''};
      message.title = 'title: ' + title;
      message.description = 'description: ' + description;
      console.log('WebEngage: InApp :  onShown -->' + message.title);
    });

    this.inAppClickListener = webengage.notification.onClick(function (
      notificationData,
      clickId,
    ) {
      console.log(
        'WebEngage: InApp :  onClick --> ClickId - ' +
          clickId +
          ' | data ' +
          notificationData,
      );
    });

    this.inAppDismissListener = webengage.notification.onDismiss(function (
      notificationData,
    ) {
      console.log('WebEngage: InApp :  onDismiss');
    });
  };

  pushCallback = () => {
    this.pushClickListener = webengage.push.onClick(function (
      notificationData,
    ) {
      console.log('WebEngage: Push :  onClick --> data - ' + notificationData);
    });

    this.universalClickListener = webengage.universalLink.onClick(function (
      location,
    ) {
      console.log(
        'WebEngage: universal link clicked with location: ' + location,
      );
    });
  };

  handleOpenURL(event) {
    console.log('WebEngage: handleOpenUrl called - ' + event.url);
  }

  updatePhoneNum = () => {
    const {phoneNumber} = this.state;
    webengage.user.setPhone(phoneNumber);
  };

  phoneNumberHolder() {
    const {phoneNumber} = this.state;
    return (
      <View style={styles.borders}>
        <Text style={styles.titleStyle}> Update Phone Number </Text>
        <TextInput
          style={styles.textBox}
          onChangeText={text => this.setState({phoneNumber: text})}
          placeholder="Enter Your Phone Number"
          value={phoneNumber}
        />
        <TouchableHighlight style={styles.button} onPress={this.updatePhoneNum}>
          <Text>Update Phone Number</Text>
        </TouchableHighlight>
      </View>
    );
  }

  updateSecureToken = () => {
    const {secureToken, userId} = this.state;
    if (userId) {
      this.setState({showInlineError: false});
      webengage.user.setSecurityToken(userId, secureToken);
    }
  };

  loginUser = () => {
    const {userIdInput, loginButtonText, secureToken, showInlineError} =
      this.state;

    return (
      <View style={styles.borders}>
        <Text style={styles.titleStyle}>Login Window</Text>
        <TextInput
          style={styles.textBox}
          onChangeText={text => this.setState({userIdInput: text})}
          placeholder="Enter UserName"
          autoCapitalize="none"
          autoCorrect={false}
          value={userIdInput}
        />

        <TextInput
          style={styles.secureToken}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => this.setState({secureToken: text})}
          placeholder="Enter Secure Token"
          value={secureToken}
        />
        {showInlineError && (
          <View style={styles.row}>
            <Text style={styles.inlineError}>
              Invalid User Details please enter valid data
            </Text>
            <TouchableHighlight
              style={[styles.button, styles.updateToken]}
              onPress={this.updateSecureToken}>
              <Text>Update-Token</Text>
            </TouchableHighlight>
          </View>
        )}
        <TouchableHighlight style={styles.button} onPress={this.login}>
          <Text>{loginButtonText}</Text>
        </TouchableHighlight>
      </View>
    );
  };

  trackCustomEvent = () => {
    const {event} = this.state;
    return (
      <View style={styles.borders}>
        <Text style={styles.titleStyle}> Track Custom Events </Text>
        <TextInput
          style={styles.textBox}
          onChangeText={text => this.setState({event: text})}
          placeholder="Enter Event Name!"
          value={event}
        />
        <TouchableHighlight style={styles.button} onPress={this.track}>
          <Text>TRACK</Text>
        </TouchableHighlight>
      </View>
    );
  };

  trackBuyNow = () => {
    return (
      <View style={styles.borders}>
        <Text style={styles.titleStyle}> Track Buy Now Event </Text>
        <TouchableHighlight style={styles.button} onPress={this.buy}>
          <Text>BUY NOW!!!</Text>
        </TouchableHighlight>
      </View>
    );
  };

  displayChannels = () => {
    const {channels} = this.state;
    return channels.map((channel, channelIndex) => {
      const {name, isEnabled} = channel;
      return (
        <View style={styles.channel}>
          <Text style={styles.label}>{name}</Text>
          <Switch
            trackColor={{true: 'skyblue', false: '#c4c4c4'}}
            thumbColor={isEnabled ? 'lightblue' : '#e1e1e1'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => this.handleChannel(channelIndex)}
            value={isEnabled}
          />
        </View>
      );
    });
  };

  handleChannel = index => {
    const {channels} = this.state;
    const {isEnabled, optInChannel} = channels[index];
    channels[index].isEnabled = !channels[index].isEnabled;
    this.setState({channels});

    // Update WebEngage
    webengage.user.setOptIn(optInChannel, !isEnabled);
    AsyncStorage.setItem(optInChannel, JSON.stringify(!isEnabled));
  };

  invalidTokenCallback = data => {
    console.log(
      'WebEngage: Invalid token! callback. Please update new Token using setToken Method()',
      data,
    );
    this.setState({secureToken: null, showInlineError: true});
  };

  login() {
    const {userId, userIdInput, secureToken} = this.state;
    if (!userId) {
      // Login
      var newUserId = userIdInput;
      if (newUserId) {
        webengage.user.login(newUserId, secureToken);
        AsyncStorage.setItem('userid', newUserId);
        this.setState({
          userId: newUserId,
          loginButtonText: 'LOGOUT',
          showInlineError: false,
          secureToken: '',
        });
        console.log('WebEngage: Login called!');
      } else {
        console.log('WebEngage: Invalid user id');
      }
    } else {
      // Logout
      webengage.user.logout();

      AsyncStorage.setItem('userid', '');

      this.setState({
        userId: null,
        userIdInput: '',
        loginButtonText: 'LOGIN',
        showInlineError: false,
      });

      console.log('WebEngage: Logout called');
    }
  }

  track() {
    const {event} = this.state;
    if (event) {
      webengage.track(event);
    }
    console.log('WebEngage: Tracking Event - ' + event);
  }

  buy() {
    var event = 'Product Purchased';
    var attributes = {
      Amount: 2300,
      'Delivery Date': new Date(),
      Products: [
        {
          'SKU Code': 'UHUH799',
          'Product Name': 'Armani Jeans',
          Price: 300.49,
          Details: {
            Size: 'L',
          },
        },
        {
          'SKU Code': 'FBHG746',
          'Product Name': 'Hugo Boss Jacket',
          Price: 507.99,
          Details: {
            Size: 'L',
          },
        },
      ],
      'Delivery Address': {
        City: 'San Francisco',
        ZIP: '94121',
      },
      'Coupons Applied': ['BOGO17'],
    };
    webengage.track(event, attributes);
  }

  render() {
    const Stack = createStackNavigator();

    return (
      <ScrollView>
        <View style={styles.container}>
          {this.loginUser()}

          {this.trackCustomEvent()}

          {this.trackBuyNow()}

          {this.phoneNumberHolder()}

          {this.displayChannels()}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    // marginTop: 80,
  },
  textBox: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 50,
    marginBottom: 10,
  },
  secureToken: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
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
    marginBottom: 25,
  },
  updateToken: {
    justifyContent: 'center',
  },
  inlineError: {
    color: 'red',
    margin: 10,
    justifyContent: 'center',
  },
  channel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: 144,
    marginTop: 16,
  },
  row: {
    justifyContent: 'center',
    marginVertical: 10,
  },
  label: {
    flex: 1,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  borders: {
    backgroundColor: '#cccccc',
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    margin: 20,
  },
});
