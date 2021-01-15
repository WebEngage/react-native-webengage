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

function WebEngageUserChannel() {
}

WebEngageUserChannel.prototype.login = function(userId) {
	WebEngage.login(userId);
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

WebEngageUserChannel.prototype.setLastName = function(name) {
	WebEngage.setLastName(name);
};

WebEngageUserChannel.prototype.setCompany = function(name) {
	WebEngage.setCompany(name);
};

WebEngageUserChannel.prototype.setOptIn = function(channel, status) {
	WebEngage.setOptIn(channel, status);
};

function WebEngagePushChannel () {
	this.clickCallback = function(){};
	this._options = {};

	const webengage = new NativeEventEmitter(NativeModules.webengageBridge);

	webengage.addListener('pushNotificationClicked', (data) => this.clickCallback(data));
}

WebEngagePushChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngagePushChannel.prototype.onClick = function (callback) {
	this.clickCallback = callback;
};

WebEngagePushChannel.prototype.onCallbackReceived = function(type, uri, customData) {
	if (type) {
		switch(type) {
			case 'shown':
				break;

			case 'click':
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

	const webengage = new NativeEventEmitter(NativeModules.webengageBridge);

	webengage.addListener('universalLinkClicked', (location) => this.clickCallback(location));
}

WebEngageUniversalLinkChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageUniversalLinkChannel.prototype.onClick = function (callback) {
	this.clickCallback = callback;
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

	const webengage = new NativeEventEmitter(NativeModules.webengageBridge);

	webengage.addListener('notificationClicked', (data) => this.clickCallback(data, data["clickId"]));
	webengage.addListener('notificationDismissed', (data) => this.dismissCallback(data));
	webengage.addListener('notificationPrepared', (data) => this.prepareCallback(data));
	webengage.addListener('notificationShown', (data) => this.shownCallback(data));
}

WebEngageNotificationChannel.prototype.options = function(key, value) {
	this._options[key] = value;
};

WebEngageNotificationChannel.prototype.onPrepare = function (callback) {
	this.prepareCallback = callback;
};

WebEngageNotificationChannel.prototype.onShown = function (callback) {
	this.shownCallback = callback;
};

WebEngageNotificationChannel.prototype.onClick = function (callback) {
	this.clickCallback = callback;
};

WebEngageNotificationChannel.prototype.onDismiss = function(callback) {
	this.dismissCallback = callback;
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
