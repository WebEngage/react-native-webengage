/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   View,
   TextInput,
   Switch,
   TouchableHighlight,
   Linking,
   ToastAndroid,
   Alert
 } from 'react-native';
 import AsyncStorage from '@react-native-community/async-storage';
 import WebEngage from 'react-native-webengage';
 
 const instructions = Platform.select({
   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
   android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
 });
 
 function notifyMessage(msg: string) {
   if (Platform.OS === 'android') {
     ToastAndroid.show(msg, ToastAndroid.SHORT);
   } else {
     Alert.alert(msg);
   }
 }
 const webengage = new WebEngage();
 
 type Props = {};
 export default class App extends Component<Props> {
   constructor() {
     super();
     this.state = {
       userId: null,
       userIdInput: null,
       loginButtonText: 'LOGIN',
       event: '',
       isPushEnabled: true,
       isInappEnabled: true
     }
     this.login = this.login.bind(this);
     this.track = this.track.bind(this);
     this.buy = this.buy.bind(this);
     this.togglePushSwitch = this.togglePushSwitch.bind(this);
     this.toggleInappSwitch = this.toggleInappSwitch.bind(this);
     console.log("MyLogs: In constructor")
   }
 
   componentDidMount() {
    console.log("MyLogs: In componentDidMount")

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
 
       AsyncStorage.getItem('push_optin')
         .then((value) => {
           var isEnabled = JSON.parse(value);
           console.log('Initial push_optin: ' + isEnabled);
           if (isEnabled === null) {
             isEnabled = true;
             AsyncStorage.setItem('push_optin', JSON.stringify(true));
           }
           this.setState({
               isPushEnabled: isEnabled
           });
         });
 
         AsyncStorage.getItem('inapp_optin')
           .then((value) => {
             var isEnabled = JSON.parse(value);
             console.log('Initial inapp_optin: ' + isEnabled);
             if (isEnabled === null) {
               isEnabled = true;
               AsyncStorage.setItem('inapp_optin', JSON.stringify(true));
             }
             this.setState({
               isInappEnabled: isEnabled
             });
           });
     } catch (error) {
         console.log(error);
     }
 
     // Screen
     //webengage.screen("Home");
 
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
       console.log("App: in-app notification clicked: click-id: " + clickId + ", deep-link: " + notificationData["deeplink"]);
     });
 
     webengage.notification.onDismiss(function(notificationData) {
       console.log("App: in-app notification dismissed");
     });
 
     webengage.push.onClick(function(notificationData) {
       console.log("MyLogs App: push-notiifcation clicked with deeplink: " + notificationData["deeplink"]);
       console.log("MyLogs App: push-notiifcation clicked with payload: " + JSON.stringify(notificationData["userData"]));

     });
     webengage.universalLink.onClick(function(location){
       console.log("App: universal link clicked with location: " + location);
       notifyMessage(location);
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
         <View>
           <ScrollView>
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
 
               <View style={styles.channel}>
                 <Text style={styles.label}>Push</Text>
                 <Switch
                   trackColor={{ true: "skyblue", false: "#c4c4c4" }}
                   thumbColor={this.state.isPushEnabled ? "lightblue" : "#e1e1e1"}
                   ios_backgroundColor="#3e3e3e"
                   onValueChange={this.togglePushSwitch}
                   value={this.state.isPushEnabled}
                 />
               </View>
 
               <View style={styles.channel}>
                 <Text style={styles.label}>In-app</Text>
                 <Switch
                   trackColor={{ true: "skyblue", false: "#f1f1f1" }}
                   thumbColor={this.state.isInappEnabled ? "lightblue" : "#e4e4e4"}
                   ios_backgroundColor="#3e3e3e"
                   onValueChange={this.toggleInappSwitch}
                   value={this.state.isInappEnabled}
                 />
               </View>
             </View>
           </ScrollView>
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
       //"Delivery Date": new Date("2017-01-09T16:30:00.000Z"),
       //"Delivery Date": new Date("Thu Jun 20 2019 09:30:00 GMT+0530 (India Standard Time)"),
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
 
   togglePushSwitch() {
     var isEnabled = !this.state.isPushEnabled;
     console.log('Push switch toggled: ' + isEnabled);
     this.setState({
       isPushEnabled: isEnabled
     });
     webengage.user.setOptIn("push", isEnabled);
     AsyncStorage.setItem('push_optin', JSON.stringify(isEnabled));
   }
 
   toggleInappSwitch() {
     var isEnabled = !this.state.isInappEnabled;
     console.log('In-app switch toggled: ' + isEnabled);
     this.setState({
       isInappEnabled: isEnabled
     });
     webengage.user.setOptIn("in_app", isEnabled);
     //webengage.user.setOptIn("email", isEnabled);
     //webengage.user.setOptIn("sms", isEnabled);
     //webengage.user.setOptIn("whatsapp", isEnabled);
     AsyncStorage.setItem('inapp_optin', JSON.stringify(isEnabled));
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
     marginTop: 80
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
   },
   channel: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     width: 144,
     marginTop: 16
   },
   label: {
     flex: 1
   }
 });