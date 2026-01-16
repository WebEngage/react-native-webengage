//WebEngage plugin interface class

import React from 'react';
import {
	Platform,
	NativeModules,
	NativeEventEmitter,
} from 'react-native';

// Initialize WebEngage module based on architecture
function initializeWebEngageModule() {
	if (global.__turboModuleProxy) {
		// New Architecture - try TurboModule first
		try {
			const NativeWebEngageModule = require('./NativeWebEngageModule').default;
			return NativeWebEngageModule?.initializeWebEngage ?
				NativeWebEngageModule : NativeModules.WEGWebEngageBridge;
		} catch (e) {
			// Fallback to legacy module
			return NativeModules.WEGWebEngageBridge;
		}
	}
	// Legacy Architecture
	return NativeModules.WEGWebEngageBridge;
}

const webEngageModule = initializeWebEngageModule();

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
}

WebEngagePlugin.prototype.initialize = function () {
	webEngageModule.initializeWebEngage();
};

WebEngagePlugin.prototype.track = function (eventName, attributes) {
	if (!attributes) {
		webEngageModule.trackEventWithName(eventName);
	} else {
		try {
			webEngageModule.trackEventWithNameAndData(eventName, JSON.parse(JSON.stringify(attributes)));
		} catch (err) {
			webEngageModule.trackEventWithNameAndData(eventName, attributes);
		}
	}
};

WebEngagePlugin.prototype.screen = function (name, data) {
	if (!data) {
		webEngageModule.screenNavigated(name);
	} else {
		webEngageModule.screenNavigatedWithData(name, data);
	}
};

WebEngagePlugin.prototype.startGAIDTracking = function () {
	if (Platform.OS === 'android') {
		webEngageModule.startGAIDTracking();
	}
};

function WebEngageUserChannel() {
	this.invalidTokenCallback = function () { };
	this._anonymousId = null;
	this.tokenInvalidateLister = addListenerToBridge('tokenInvalidated', (data) => this.invalidTokenCallback(data));
	this.onAnonymousIdChangedListener = addListenerToBridge('onAnonymousIdChanged', (data) => {
		const luid = data?.anonymousID || '';
		if (!this.anonymousIdChangedCallback) {
			this._anonymousId = luid;
		} else {
			this.anonymousIdChangedCallback(luid);
		}
	});
}

WebEngageUserChannel.prototype.login = function (userId, jwtToken = null) {
	if (jwtToken) {
		webEngageModule.loginWithSecureToken(userId, jwtToken);
	} else {
		webEngageModule.login(userId);
	}
};

WebEngageUserChannel.prototype.tokenInvalidatedCallback = function (callback) {
	webEngageModule.updateListenerCount();
	this.invalidTokenCallback = callback;
	return this.tokenInvalidateLister;
};

WebEngageUserChannel.prototype.setSecureToken = function (userId, secureToken) {
	webEngageModule.setSecureToken(userId, secureToken);
};

WebEngageUserChannel.prototype.logout = function () {
	webEngageModule.logout();
};

WebEngageUserChannel.prototype.setAttribute = function (key, value) {
	if (Platform.OS === 'ios') {
		webEngageModule.setIosAttribute(key, value);
	} else {
		const map = {};
		map[key] = value;
		webEngageModule.setAndroidAttribute(map);
	}
};

WebEngageUserChannel.prototype.deleteAttribute = function (key) {
	webEngageModule.deleteAttribute(key);
};

WebEngageUserChannel.prototype.deleteAttributes = function (keys) {
	webEngageModule.deleteAttributes(keys);
};

WebEngageUserChannel.prototype.setEmail = function (email) {
	webEngageModule.setEmail(email);
};

WebEngageUserChannel.prototype.setHashedEmail = function (email) {
	webEngageModule.setHashedEmail(email);
};

WebEngageUserChannel.prototype.setPhone = function (phone) {
	webEngageModule.setPhone(phone);
};

WebEngageUserChannel.prototype.setHashedPhone = function (phone) {
	webEngageModule.setHashedPhone(phone);
};

WebEngageUserChannel.prototype.setBirthDateString = function (date) {
	webEngageModule.setBirthDateString(date);
};

WebEngageUserChannel.prototype.setGender = function (gender) {
	webEngageModule.setGender(gender);
};

WebEngageUserChannel.prototype.setFirstName = function (name) {
	webEngageModule.setFirstName(name);
};

WebEngageUserChannel.prototype.setLocation = function (lat, lng) {
	const doubleLat = parseFloat(lat);
	const doubleLng = parseFloat(lng);
	if (!isNaN(doubleLat) && !isNaN(doubleLng)) {
		webEngageModule.setLocation(doubleLat, doubleLng);
	} else {
		console.log('WebEngage: Invalid Latitude or Longitude passed');
	}
};

WebEngageUserChannel.prototype.setLastName = function (name) {
	webEngageModule.setLastName(name);
};

WebEngageUserChannel.prototype.setCompany = function (name) {
	webEngageModule.setCompany(name);
};

WebEngageUserChannel.prototype.setDevicePushOptIn = function (status) {
	webEngageModule.setDevicePushOptIn(status);
};

WebEngageUserChannel.prototype.setOptIn = function (channel, status) {
	webEngageModule.setOptIn(channel, status);
};

WebEngageUserChannel.prototype.onAnonymousIdChanged = function (callback) {
	webEngageModule.updateListenerCount();
	this.anonymousIdChangedCallback = callback;
	if (this._anonymousId) {
		this.anonymousIdChangedCallback(this._anonymousId);
		this._anonymousId = null;
	}
	return this.onAnonymousIdChangedListener;
};

function WebEngagePushChannel() {
	this.clickCallback = function () { };
	this._options = {};
	this.pushClickListener = addListenerToBridge('pushNotificationClicked', (data) => this.clickCallback(data));
}

WebEngagePushChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

// Supported only for Android
WebEngagePushChannel.prototype.sendFcmToken = function (token) {
	webEngageModule.sendFcmToken(token);
};

// Supported only for Android
WebEngagePushChannel.prototype.onMessageReceived = function (remoteMessage) {
	webEngageModule.onMessageReceived(remoteMessage);
};

WebEngagePushChannel.prototype.onClick = function (callback) {
	webEngageModule.updateListenerCount();
	this.clickCallback = callback;
	return this.pushClickListener;
};

WebEngagePushChannel.prototype.onCallbackReceived = function (type, uri, customData) {
	if (type) {
		switch (type) {
			case 'shown':
				break;
			case 'click':
				this.clickCallback(uri, customData);
				break;
			case 'dismiss':
				break;
			default:
				break;
		}
	}
};

function WebEngageUniversalLinkChannel() {
	this.clickCallback = function () { };
	this._options = {};
	this.universalClickListener = addListenerToBridge('universalLinkClicked', (location) => this.clickCallback(location));
}

WebEngageUniversalLinkChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageUniversalLinkChannel.prototype.onClick = function (callback) {
	webEngageModule.updateListenerCount();
	this.clickCallback = callback;
	return this.universalClickListener;
};

WebEngageUniversalLinkChannel.prototype.onCallbackReceived = function (type, location) {
	if (type) {
		switch (type) {
			case 'click':
				this.clickCallback(location);
				break;
			default:
				break;
		}
	}
};

function WebEngageNotificationChannel() {
	this.shownCallback = function () { };
	this.clickCallback = function () { };
	this.dismissCallback = function () { };
	this.prepareCallback = function () { };
	this._options = {};

	this.inAppClickListener = addListenerToBridge('notificationClicked', (data) => this.clickCallback(data, data.clickId));
	this.inAppDismissedListener = addListenerToBridge('notificationDismissed', (data) => this.dismissCallback(data));
	this.inAppPreparedListener = addListenerToBridge('notificationPrepared', (data) => this.prepareCallback(data));
	this.inAppShownListener = addListenerToBridge('notificationShown', (data) => this.shownCallback(data));
}

function addListenerToBridge(method, callback) {
	const webengage = new NativeEventEmitter(webEngageModule);
	return webengage.addListener(method, callback);
}

WebEngageNotificationChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageNotificationChannel.prototype.onPrepare = function (callback) {
	webEngageModule.updateListenerCount();
	this.prepareCallback = callback;
	return this.inAppPreparedListener;
};

WebEngageNotificationChannel.prototype.onShown = function (callback) {
	webEngageModule.updateListenerCount();
	this.shownCallback = callback;
	return this.inAppShownListener;
};

WebEngageNotificationChannel.prototype.onClick = function (callback) {
	webEngageModule.updateListenerCount();
	this.clickCallback = callback;
	return this.inAppClickListener;
};

WebEngageNotificationChannel.prototype.onDismiss = function (callback) {
	webEngageModule.updateListenerCount();
	this.dismissCallback = callback;
	return this.inAppDismissedListener;
};

WebEngageNotificationChannel.prototype.onCallbackReceived = function (type, notificationData, actionId) {
	switch (type) {
		case 'shown':
			this.shownCallback(notificationData);
			break;
		case 'click':
			this.clickCallback(notificationData, actionId);
			break;
		case 'dismiss':
			this.dismissCallback(notificationData);
			break;
		default:
			break;
	}
};

export default WebEngagePlugin;