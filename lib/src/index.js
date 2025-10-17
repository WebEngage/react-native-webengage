//WebEngage plugin interface class

import React from 'react';
import {
	Platform,
	NativeModules,
	NativeEventEmitter,
} from 'react-native';
let WebEngageModule;

if (global.__turboModuleProxy) {
	// New Architecture runtime is enabled
	try {
		// Attempt to require the TurboModule
		const NativeWebEngageModule = require('./NativeWebEngageModule').default;
		if (NativeWebEngageModule && typeof NativeWebEngageModule.init === 'function') {
			// TurboModule is available and is being used
			WebEngageModule = NativeWebEngageModule;
		} else {
			throw new Error('TurboModule not available');
		}
	} catch (e) {
		// Fallback to the old NativeModule if TurboModule is not available
		WebEngageModule = NativeModules.WebEngageReact;
	}
} else {
	// legacy mode is opted, since new architecture is not available
	WebEngageModule = NativeModules.WebEngageReact;
}


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
	this.onAnonymousIdChangedListener = null;
	this._options = {};
};

WebEngagePlugin.prototype.init = function() {
	WebEngageModule.init();
};

WebEngagePlugin.prototype.track = function(eventName, attributes) {
	if (!attributes) {
		WebEngageModule.trackEventWithName(eventName);
	} else {
		try {
			WebEngageModule.trackEventWithNameAndData(eventName, JSON.parse(JSON.stringify(attributes)));
		} catch (err) {
			WebEngageModule.trackEventWithNameAndData(eventName, attributes);
		}
	}
};

WebEngagePlugin.prototype.screen = function(name, data){
	if (!data) {
		WebEngageModule.screenNavigated(name);
	} else {
		WebEngageModule.screenNavigatedWithData(name, data);
	}
}

WebEngagePlugin.prototype.startGAIDTracking = function(){
	if(Platform.OS === "android"){
		WebEngageModule.startGAIDTracking();
	}
}

function WebEngageUserChannel() {
	this.invalidTokenCallback = function () { };
	this._anonymousId = null;
	this.tokenInvalidateLister = addListenerToBridge('tokenInvalidated', (data) => this.invalidTokenCallback(data));
	this.onAnonymousIdChangedListener = addListenerToBridge('onAnonymousIdChanged', (data) => {
		const luid = data?.anonymousID || "";
		if (!this.anonymousIdChangedCallback ) {
			this._anonymousId = luid;
		} else {
			this.anonymousIdChangedCallback(luid);
		}
	});
}

WebEngageUserChannel.prototype.login = function(userId, jwtToken = null) {
	if(jwtToken) {
		WebEngageModule.loginWithSecureToken(userId, jwtToken);
	} else {
		WebEngageModule.login(userId);
	}
};

WebEngageUserChannel.prototype.tokenInvalidatedCallback = function(callback) {
	WebEngageModule.updateListenerCount();
	this.invalidTokenCallback = callback;
	return this.tokenInvalidateLister;
};


WebEngageUserChannel.prototype.setSecureToken = function(userId, secureToken) {
	WebEngageModule.setSecureToken(userId, secureToken);
};

WebEngageUserChannel.prototype.logout = function() {
	WebEngageModule.logout();
};

WebEngageUserChannel.prototype.setAttribute = function(key, value) {
	if (Platform.OS === 'ios') {
		WebEngageModule.setIosAttribute(key, value);
	} else {
		var map = new Object(); // or var map = {};
		map[key] = value;
		WebEngageModule.setAndroidAttribute(map);
	}
};

WebEngageUserChannel.prototype.deleteAttribute = function(key) {
	WebEngageModule.deleteAttribute(key);
};

WebEngageUserChannel.prototype.deleteAttributes = function(keys) {
	WebEngageModule.deleteAttributes(keys);
};

WebEngageUserChannel.prototype.setEmail = function(email) {
	WebEngageModule.setEmail(email);
};

WebEngageUserChannel.prototype.setHashedEmail = function(email) {
	WebEngageModule.setHashedEmail(email);
};

WebEngageUserChannel.prototype.setPhone = function(phone) {
	WebEngageModule.setPhone(phone);
};

WebEngageUserChannel.prototype.setHashedPhone = function(phone) {
	WebEngageModule.setHashedPhone(phone);
};

WebEngageUserChannel.prototype.setBirthDateString = function(date) {
	WebEngageModule.setBirthDateString(date);
};

WebEngageUserChannel.prototype.setGender = function(gender) {
	WebEngageModule.setGender(gender);
};

WebEngageUserChannel.prototype.setFirstName = function(name) {
	WebEngageModule.setFirstName(name);
};

WebEngageUserChannel.prototype.setLocation = function(lat,lng) {
	const doubleLat = parseFloat(lat)
	const doubleLng = parseFloat(lng)
	if(!isNaN(doubleLat) && !isNaN(doubleLng)) {
		WebEngageModule.setLocation(doubleLat,doubleLng);
	} else {
		console.log("WebEngage: Invalid Latitude or Longitude passed");
	}
};

WebEngageUserChannel.prototype.setLastName = function(name) {
	WebEngageModule.setLastName(name);
};

WebEngageUserChannel.prototype.setCompany = function(name) {
	WebEngageModule.setCompany(name);
};

WebEngageUserChannel.prototype.setDevicePushOptIn = function(status) {
	WebEngageModule.setDevicePushOptIn(status);
};

WebEngageUserChannel.prototype.setOptIn = function(channel, status) {
	WebEngageModule.setOptIn(channel, status);
};
WebEngageUserChannel.prototype.onAnonymousIdChanged = function (callback) {
	WebEngageModule.updateListenerCount();
	this.anonymousIdChangedCallback = callback;
	if (this._anonymousId) {
		this.anonymousIdChangedCallback(this._anonymousId);
		this._anonymousId = null;
	}
	return this.onAnonymousIdChangedListener;
};

function WebEngagePushChannel () {
	this.clickCallback = function(){};
	this._options = {};
	this.pushClickListener = addListenerToBridge('pushNotificationClicked', (data) => this.clickCallback(data));
}

WebEngagePushChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};
// Supported only for Android
WebEngagePushChannel.prototype.sendFcmToken = function (token) {
  WebEngageModule.sendFcmToken(token);
};

// Supported only for Android
WebEngagePushChannel.prototype.onMessageReceived = function (remoteMessage) {
  WebEngageModule.onMessageReceived(remoteMessage);
};

WebEngagePushChannel.prototype.onClick = function (callback) {
	WebEngageModule.updateListenerCount();
	this.clickCallback = callback;
	return this.pushClickListener;
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
	this.universalClickListener = addListenerToBridge('universalLinkClicked', (location) => this.clickCallback(location));
}

WebEngageUniversalLinkChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageUniversalLinkChannel.prototype.onClick = function (callback) {
	WebEngageModule.updateListenerCount();
	this.clickCallback = callback;
	return this.universalClickListener;
};

WebEngageUniversalLinkChannel.prototype.onCallbackReceived = function(type, location) {
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
	const webengage = new NativeEventEmitter(WebEngageModule);
	return webengage.addListener(method, callback);
}

WebEngageNotificationChannel.prototype.options = function(key, value) {
	this._options[key] = value;
};

WebEngageNotificationChannel.prototype.onPrepare = function (callback) {
	WebEngageModule.updateListenerCount();
	this.prepareCallback = callback;
	return this.inAppPreparedListener;
};

WebEngageNotificationChannel.prototype.onShown = function (callback) {
	WebEngageModule.updateListenerCount();
	this.shownCallback = callback;
	return this.inAppShownListener;
};

WebEngageNotificationChannel.prototype.onClick = function (callback) {
	WebEngageModule.updateListenerCount();
	this.clickCallback = callback;
	return this.inAppClickListener;
};

WebEngageNotificationChannel.prototype.onDismiss = function(callback) {
	WebEngageModule.updateListenerCount();
	this.dismissCallback = callback;
	return this.inAppDismissedListener;
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