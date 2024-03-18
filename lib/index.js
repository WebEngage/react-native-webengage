//WebEngage plugin interface class

import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	NativeModules,
	NativeEventEmitter
} from 'react-native';

const WebEngage = NativeModules.webengageBridge;

function WebEngagePlugin() {
	this.push = new WebEngagePushChannel();
	this.notification = new WebEngageNotificationChannel();
	this.user = new WebEngageUserChannel();
	this.universalLink = new WebEngageUniversalLinkChannel();
	this.pushClickListener = null;
	this.tokenInvalidateLister = null;
	this.universalClickListener = null;
	this.inAppClickListener = null;
	this.inAppDismissedListener = null;
	this.inAppPreparedListener = null;
	this.inAppShownListener = null;
	this._options = {};
};

WebEngagePlugin.prototype.init = function(autoRegister) {
	WebEngage.init(autoRegister);
};

WebEngagePlugin.prototype.track = function(eventName, attributes) {
	if (attributes === undefined || attributes === null) {
		WebEngage.trackEventWithName(eventName);
	} else {
		try {
			WebEngage.trackEventWithNameAndData(eventName, JSON.parse(JSON.stringify(attributes)));
		} catch (err) {
			WebEngage.trackEventWithNameAndData(eventName, attributes);
		}
	}
};

WebEngagePlugin.prototype.screen = function(name, data){
	if (data === undefined) {
		WebEngage.screenNavigated(name);
	} else {
		WebEngage.screenNavigatedWithData(name, data);
	}
}

WebEngagePlugin.prototype.startGAIDTracking = function(){
	if(Platform.OS === "android"){
		WebEngage.startGAIDTracking();
	}}

function WebEngageUserChannel() {
	this.invalidTokenCallback = function(){};
	this.tokenInvalidateLister = addListenerToBridge('tokenInvalidated', (data) => this.invalidTokenCallback(data));
}

WebEngageUserChannel.prototype.login = function(userId, jwtToken = null) {
	if(jwtToken) {
		WebEngage.loginWithSecureToken(userId, jwtToken);
	} else {
		WebEngage.login(userId);
	}
};

WebEngageUserChannel.prototype.tokenInvalidatedCallback = function(callback) {
	WebEngage.updateListenerCount()
	this.invalidTokenCallback = callback;
	return this.tokenInvalidateLister;
};


WebEngageUserChannel.prototype.setSecureToken = function(userId, secureToken) {
	WebEngage.setSecureToken(userId, secureToken);
};

WebEngageUserChannel.prototype.logout = function() {
	WebEngage.logout();
};

WebEngageUserChannel.prototype.setAttribute = function(key, value) {
	if (Platform.OS === 'ios') {
		WebEngage.setAttribute(key, value);
	} else {
		var map = new Object(); // or var map = {};
		map[key] = value;
		WebEngage.setAttribute(map);
	}
};

WebEngageUserChannel.prototype.deleteAttribute = function(key) {
	WebEngage.deleteAttribute(key);
};

WebEngageUserChannel.prototype.deleteAttributes = function(keys) {
	WebEngage.deleteAttributes(keys);
};

WebEngageUserChannel.prototype.setEmail = function(email) {
	WebEngage.setEmail(email);
};

WebEngageUserChannel.prototype.setHashedEmail = function(email) {
	WebEngage.setHashedEmail(email);
};

WebEngageUserChannel.prototype.setPhone = function(phone) {
	WebEngage.setPhone(phone);
};

WebEngageUserChannel.prototype.setHashedPhone = function(phone) {
	WebEngage.setHashedPhone(phone);
};

WebEngageUserChannel.prototype.setBirthDateString = function(date) {
	WebEngage.setBirthDateString(date);
};

WebEngageUserChannel.prototype.setGender = function(gender) {
	WebEngage.setGender(gender);
};

WebEngageUserChannel.prototype.setFirstName = function(name) {
	WebEngage.setFirstName(name);
};

WebEngageUserChannel.prototype.setLocation = function(lat,lng) {
	const doubleLat = parseFloat(lat)
	const doubleLng = parseFloat(lng)
	if(!isNaN(doubleLat) && !isNaN(doubleLng)) {
		WebEngage.setLocation(doubleLat,doubleLng);
	} else {
		console.log("WebEngage: Invalid Latitude or Longitude passed");
	}
};

WebEngageUserChannel.prototype.setLastName = function(name) {
	WebEngage.setLastName(name);
};

WebEngageUserChannel.prototype.setCompany = function(name) {
	WebEngage.setCompany(name);
};

WebEngageUserChannel.prototype.setDevicePushOptIn = function(status) {
	WebEngage.setDevicePushOptIn(status);
};

WebEngageUserChannel.prototype.setOptIn = function(channel, status) {
	WebEngage.setOptIn(channel, status);
};

function WebEngagePushChannel () {
	this.clickCallback = function(){};
	this._options = {};
	this.pushClickListener = addListenerToBridge('pushNotificationClicked', this.clickCallback)
	this.pushClickListener = addListenerToBridge('pushNotificationClicked', (data) =>  {
		console.log("swizzled: WebEngagePushChannel triggered in bridge");
		if(this.clickCallback) {
			console.log("swizzled: if called in callback")
			this.clickCallback(data);
		} else {
			console.log("swizzled: webengage callback in react not set")
		}
	})
}

WebEngagePushChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngagePushChannel.prototype.onClick = function (callback) {
	WebEngage.updateListenerCount()
	this.clickCallback = callback;
	return this.pushClickListener;
	
};

WebEngagePushChannel.prototype.onCallbackReceived = function(type, uri, customData) {
	console.log("swizzled! push - onCallbackReceived from index.js ")
	if (type) {
		switch(type) {
			case 'shown':
				break;

			case 'click':
				console.log("swizzled! push click -  onCallbackReceived from index.js ")
				this.clickCallback(uri, customData);
				break;

			case 'dismiss':
				break;
		}
	}
};

function WebEngageUniversalLinkChannel () {
	this.clickCallback = function(){};
	this._options = {};
	this.universalClickListener = addListenerToBridge('universalLinkClicked', (location) => 
	{
		console.log("WebEngageBridge: WebEngageUniversalLinkChannel called from JS ")
		// this.clickCallback(location));
	})
}

WebEngageUniversalLinkChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageUniversalLinkChannel.prototype.onClick = function (callback) {
	WebEngage.updateListenerCount()
	this.clickCallback = callback;
	return this.universalClickListener;
};

WebEngageUniversalLinkChannel.onCallbackReceived = function(type, location) {
	if (type) {
		switch(type) {
			case 'click':
				this.clickCallback(location);
				break;
		}
	}
};

function WebEngageNotificationChannel () {
	this.shownCallback = function(){};
	this.clickCallback = function(){};
	this.dismissCallback = function(){};
	this.prepareCallback = function(){};
	this._options = {};

	this.inAppClickListener = addListenerToBridge('notificationClicked', (data) => this.clickCallback(data, data["clickId"]));
	this.inAppDismissedListener = addListenerToBridge('notificationDismissed', (data) => this.dismissCallback(data));
	this.inAppPreparedListener = addListenerToBridge('notificationPrepared', (data) => this.prepareCallback(data));
	this.inAppShownListener = addListenerToBridge('notificationShown', (data) => this.shownCallback(data));
}

function addListenerToBridge(method, callback) {
	if(Platform.OS === 'android') {
		const webengage = new NativeEventEmitter();
		const listener = webengage.addListener(method, callback);
		return listener
	}
	if(Platform.OS === 'ios') {
		const webengage = new NativeEventEmitter(NativeModules.webengageBridge);
		const listener = webengage.addListener(method, callback);
		return listener
	}
}

WebEngageNotificationChannel.prototype.options = function(key, value) {
	this._options[key] = value;
};

WebEngageNotificationChannel.prototype.onPrepare = function (callback) {
	WebEngage.updateListenerCount()
	this.prepareCallback = callback;
	return this.inAppPreparedListener
};

WebEngageNotificationChannel.prototype.onShown = function (callback) {
	WebEngage.updateListenerCount()
	this.shownCallback = callback;
	return this.inAppShownListener
};

WebEngageNotificationChannel.prototype.onClick = function (callback) {
	WebEngage.updateListenerCount()
	this.clickCallback = callback;
	return this.inAppClickListener
};

WebEngageNotificationChannel.prototype.onDismiss = function(callback) {
	WebEngage.updateListenerCount()
	this.dismissCallback = callback;
	return this.inAppDismissedListener
};

WebEngageNotificationChannel.prototype.onCallbackReceived = function(type, notificationData, actionId) {
	if (type) {
		switch(type) {
			case 'shown':
				this.shownCallback(notificationData);
				break;

			case 'click':
				this.clickCallback(notificationData, actionId);
				break;

			case 'dismiss':
				this.dismissCallback(notificationData);
				break;
		}
	}
};

export default WebEngagePlugin;
// if(typeof module != 'undefined' && module.exports) {
// 	var WebEngagePlugin = new WebEngagePlugin();
// 	module.exports = WebEngagePlugin;
// }
