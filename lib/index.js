// WebEngage plugin interface class
import {
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const WebEngage = NativeModules.webengageBridge;

class WebEngagePlugin {
  constructor() {
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
  }

  init(autoRegister) {
    WebEngage.init(autoRegister);
  }

  track(eventName, attributes) {
    if (attributes === undefined || attributes === null) {
      WebEngage.trackEventWithName(eventName);
    } else {
      try {
        WebEngage.trackEventWithNameAndData(
          eventName,
          JSON.parse(JSON.stringify(attributes))
        );
      } catch (err) {
        WebEngage.trackEventWithNameAndData(eventName, attributes);
      }
    }
  }

  screen(name, data) {
    if (data === undefined) {
      WebEngage.screenNavigated(name);
    } else {
      WebEngage.screenNavigatedWithData(name, data);
    }
  }

  startGAIDTracking() {
    if (Platform.OS === 'android') {
      WebEngage.startGAIDTracking();
    }
  }
}

class WebEngageUserChannel {
  constructor() {
    this.invalidTokenCallback = function () {};
    this.tokenInvalidateLister = addListenerToBridge(
      'tokenInvalidated',
      (data) => this.invalidTokenCallback(data)
    );
  }

  login(userId, jwtToken = null) {
    if (jwtToken) {
      WebEngage.loginWithSecureToken(userId, jwtToken);
    } else {
      WebEngage.login(userId);
    }
  }

  tokenInvalidatedCallback(callback) {
    console.log('Webengage: tokenInvalidatedCallback in index.js');
    WebEngage.updateListenerCount();
    this.invalidTokenCallback = callback;
    return this.tokenInvalidateLister;
  }

  setSecureToken(userId, secureToken) {
    WebEngage.setSecureToken(userId, secureToken);
  }

  logout() {
    WebEngage.logout();
  }

  setAttribute(key, value) {
    if (Platform.OS === 'ios') {
      WebEngage.setAttribute(key, value);
    } else {
      var map = {};
      map[key] = value;
      WebEngage.setAttribute(map);
    }
  }

  deleteAttribute(key) {
    WebEngage.deleteAttribute(key);
  }

  deleteAttributes(keys) {
    WebEngage.deleteAttributes(keys);
  }

  setEmail(email) {
    WebEngage.setEmail(email);
  }

  setHashedEmail(email) {
    WebEngage.setHashedEmail(email);
  }

  setPhone(phone) {
    WebEngage.setPhone(phone);
  }

  setHashedPhone(phone) {
    WebEngage.setHashedPhone(phone);
  }

  setBirthDateString(date) {
    WebEngage.setBirthDateString(date);
  }

  setGender(gender) {
    WebEngage.setGender(gender);
  }

  setFirstName(name) {
    WebEngage.setFirstName(name);
  }

  setLocation(lat, lng) {
    const doubleLat = parseFloat(lat);
    const doubleLng = parseFloat(lng);
    if (!isNaN(doubleLat) && !isNaN(doubleLng)) {
      WebEngage.setLocation(doubleLat, doubleLng);
    } else {
      console.log('WebEngage: Invalid Latitude or Longitude passed');
    }
  }

  setLastName(name) {
    WebEngage.setLastName(name);
  }

  setCompany(name) {
    WebEngage.setCompany(name);
  }

  setDevicePushOptIn(status) {
    WebEngage.setDevicePushOptIn(status);
  }

  setOptIn(channel, status) {
    WebEngage.setOptIn(channel, status);
  }
}

class WebEngagePushChannel {
  constructor() {
    this.clickCallback = function () {};
    this._options = {};
    this.pushClickListener = addListenerToBridge(
      'pushNotificationClicked',
      (data) => this.clickCallback(data)
    );
  }

  options(key, value) {
    this._options[key] = value;
  }

  onClick(callback) {
    WebEngage.updateListenerCount();
    this.clickCallback = callback;
    return this.pushClickListener;
  }

  onCallbackReceived(type, uri, customData) {
    if (type) {
      switch (type) {
        case 'shown':
          break;

        case 'click':
          this.clickCallback(uri, customData);
          break;

        case 'dismiss':
          break;
      }
    }
  }
}

class WebEngageUniversalLinkChannel {
  constructor() {
    this.clickCallback = function () {};
    this._options = {};
    this.universalClickListener = addListenerToBridge(
      'universalLinkClicked',
      (location) => this.clickCallback(location)
    );
  }

  static onCallbackReceived(type, location) {
    if (type) {
      switch (type) {
        case 'click':
          this.clickCallback(location);
          break;
      }
    }
  }

  options(key, value) {
    this._options[key] = value;
  }

  onClick(callback) {
    WebEngage.updateListenerCount();
    this.clickCallback = callback;
    return this.universalClickListener;
  }
}

class WebEngageNotificationChannel {
  constructor() {
    this.shownCallback = function () {};
    this.clickCallback = function () {};
    this.dismissCallback = function () {};
    this.prepareCallback = function () {};
    this._options = {};

    this.inAppClickListener = addListenerToBridge(
      'notificationClicked',
      (data) => this.clickCallback(data, data['clickId'])
    );
    this.inAppDismissedListener = addListenerToBridge(
      'notificationDismissed',
      (data) => this.dismissCallback(data)
    );
    this.inAppPreparedListener = addListenerToBridge(
      'notificationPrepared',
      (data) => this.prepareCallback(data)
    );
    this.inAppShownListener = addListenerToBridge(
      'notificationShown',
      (data) => this.shownCallback(data)
    );
  }

  options(key, value) {
    this._options[key] = value;
  }

  onPrepare(callback) {
    WebEngage.updateListenerCount();
    this.prepareCallback = callback;
    return this.inAppPreparedListener;
  }

  onShown(callback) {
    WebEngage.updateListenerCount();
    this.shownCallback = callback;
    return this.inAppShownListener;
  }

  onClick(callback) {
    WebEngage.updateListenerCount();
    this.clickCallback = callback;
    return this.inAppClickListener;
  }

  onDismiss(callback) {
    WebEngage.updateListenerCount();
    this.dismissCallback = callback;
    return this.inAppDismissedListener;
  }

  onCallbackReceived(type, notificationData, actionId) {
    if (type) {
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
      }
    }
  }
}

function addListenerToBridge(method, callback) {
  if (Platform.OS === 'android') {
    const webengage = new NativeEventEmitter();
    const listener = webengage.addListener(method, callback);
    return listener;
  }
  if (Platform.OS === 'ios') {
    const webengage = new NativeEventEmitter(NativeModules.webengageBridge);
    const listener = webengage.addListener(method, callback);
    return listener;
  }
}

export default WebEngagePlugin;
