//WebEngage plugin interface class

import {
	Platform,
	NativeModules,
	NativeEventEmitter,
} from 'react-native';

const TAG = 'WebEngage';
const MAX_PENDING_EVENTS = 50;
let _debugEnabled = false;

function log(message) {
	if (_debugEnabled) {
		console.log('[' + TAG + '] ' + message);
	}
}

// Initialize WebEngage module based on architecture
function initializeWebEngageModule() {
	// Try TurboModule first, fallback to legacy
	try {
		const { TurboModuleRegistry } = require('react-native');
		const NativeWebEngageModule = TurboModuleRegistry.get('WEGWebEngageBridge');
		
		if (NativeWebEngageModule) {
			log('Using TurboModule (New Architecture)');
			return NativeWebEngageModule;
		}
	} catch (e) {
		// TurboModuleRegistry not available or module not found
	}
	
	// Fallback to legacy bridge
	log('Using Legacy Bridge');
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

WebEngagePlugin.prototype.setDebugMode = function (enabled) {
	_debugEnabled = enabled;
};

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
	this.invalidTokenCallback = callback;
	webEngageModule.updateListenerCount();
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
		log('Invalid Latitude or Longitude passed');
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
	this.anonymousIdChangedCallback = callback;
	webEngageModule.updateListenerCount();
	if (this._anonymousId) {
		this.anonymousIdChangedCallback(this._anonymousId);
		this._anonymousId = null;
	}
	return this.onAnonymousIdChangedListener;
};

// --- Push Channel with JS-level queuing ---

function WebEngagePushChannel() {
	this._callbackRegistered = false;
	this.clickCallback = function () { };
	this._pendingClickEvents = [];
	this._options = {};
	this.pushClickListener = addListenerToBridge('pushNotificationClicked', (data) => {
		if (this._callbackRegistered) {
			this.clickCallback(data);
		} else if (this._pendingClickEvents.length < MAX_PENDING_EVENTS) {
			this._pendingClickEvents.push(data);
		}
	});
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
	this.clickCallback = callback;
	this._callbackRegistered = true;
	var pending = this._pendingClickEvents;
	this._pendingClickEvents = [];
	webEngageModule.updateListenerCount();
	if (pending.length > 0) {
		log('pushNotificationClicked | flushing ' + pending.length + ' queued events');
		pending.forEach(function(data) { callback(data); });
	}
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

// --- Universal Link Channel with JS-level queuing ---

function WebEngageUniversalLinkChannel() {
	this._callbackRegistered = false;
	this.clickCallback = function () { };
	this._pendingClickEvents = [];
	this._options = {};
	this.universalClickListener = addListenerToBridge('universalLinkClicked', (location) => {
		if (this._callbackRegistered) {
			this.clickCallback(location);
		} else if (this._pendingClickEvents.length < MAX_PENDING_EVENTS) {
			this._pendingClickEvents.push(location);
		}
	});
}

WebEngageUniversalLinkChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageUniversalLinkChannel.prototype.onClick = function (callback) {
	this.clickCallback = callback;
	this._callbackRegistered = true;
	var pending = this._pendingClickEvents;
	this._pendingClickEvents = [];
	webEngageModule.updateListenerCount();
	if (pending.length > 0) {
		log('universalLinkClicked | flushing ' + pending.length + ' queued events');
		pending.forEach(function(location) { callback(location); });
	}
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

// --- Notification (In-App) Channel with JS-level queuing ---

function WebEngageNotificationChannel() {
	this._prepareRegistered = false;
	this._shownRegistered = false;
	this._clickRegistered = false;
	this._dismissRegistered = false;

	this.shownCallback = function () { };
	this.clickCallback = function () { };
	this.dismissCallback = function () { };
	this.prepareCallback = function () { };

	this._pendingPrepare = [];
	this._pendingShown = [];
	this._pendingClick = [];
	this._pendingDismiss = [];

	this._options = {};

	this.inAppClickListener = addListenerToBridge('notificationClicked', (data) => {
		if (this._clickRegistered) {
			this.clickCallback(data, data.clickId);
		} else if (this._pendingClick.length < MAX_PENDING_EVENTS) {
			this._pendingClick.push(data);
		}
	});
	this.inAppDismissedListener = addListenerToBridge('notificationDismissed', (data) => {
		if (this._dismissRegistered) {
			this.dismissCallback(data);
		} else if (this._pendingDismiss.length < MAX_PENDING_EVENTS) {
			this._pendingDismiss.push(data);
		}
	});
	this.inAppPreparedListener = addListenerToBridge('notificationPrepared', (data) => {
		if (this._prepareRegistered) {
			this.prepareCallback(data);
		} else if (this._pendingPrepare.length < MAX_PENDING_EVENTS) {
			this._pendingPrepare.push(data);
		}
	});
	this.inAppShownListener = addListenerToBridge('notificationShown', (data) => {
		if (this._shownRegistered) {
			this.shownCallback(data);
		} else if (this._pendingShown.length < MAX_PENDING_EVENTS) {
			this._pendingShown.push(data);
		}
	});
}

function addListenerToBridge(method, callback) {
	if (!webEngageModule) {
		log('Native module WEGWebEngageBridge is not available');
		return { remove: () => {} };
	}
	const webengage = new NativeEventEmitter(webEngageModule);
	return webengage.addListener(method, callback);
}

WebEngageNotificationChannel.prototype.options = function (key, value) {
	this._options[key] = value;
};

WebEngageNotificationChannel.prototype.onPrepare = function (callback) {
	this.prepareCallback = callback;
	this._prepareRegistered = true;
	var pending = this._pendingPrepare;
	this._pendingPrepare = [];
	webEngageModule.updateListenerCount();
	if (pending.length > 0) {
		log('notificationPrepared | flushing ' + pending.length + ' queued events');
		pending.forEach(function(data) { callback(data); });
	}
	return this.inAppPreparedListener;
};

WebEngageNotificationChannel.prototype.onShown = function (callback) {
	this.shownCallback = callback;
	this._shownRegistered = true;
	var pending = this._pendingShown;
	this._pendingShown = [];
	webEngageModule.updateListenerCount();
	if (pending.length > 0) {
		log('notificationShown | flushing ' + pending.length + ' queued events');
		pending.forEach(function(data) { callback(data); });
	}
	return this.inAppShownListener;
};

WebEngageNotificationChannel.prototype.onClick = function (callback) {
	this.clickCallback = callback;
	this._clickRegistered = true;
	var pending = this._pendingClick;
	this._pendingClick = [];
	webEngageModule.updateListenerCount();
	if (pending.length > 0) {
		log('notificationClicked | flushing ' + pending.length + ' queued events');
		pending.forEach(function(data) { callback(data, data.clickId); });
	}
	return this.inAppClickListener;
};

WebEngageNotificationChannel.prototype.onDismiss = function (callback) {
	this.dismissCallback = callback;
	this._dismissRegistered = true;
	var pending = this._pendingDismiss;
	this._pendingDismiss = [];
	webEngageModule.updateListenerCount();
	if (pending.length > 0) {
		log('notificationDismissed | flushing ' + pending.length + ' queued events');
		pending.forEach(function(data) { callback(data); });
	}
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
