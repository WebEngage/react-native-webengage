import WebEngagePlugin from '../index.js';

// Mock React Native modules
jest.mock('react-native', () => {
  const mockBridge = {
    init: jest.fn(),
    trackEventWithName: jest.fn(),
    trackEventWithNameAndData: jest.fn(),
    screenNavigated: jest.fn(),
    screenNavigatedWithData: jest.fn(),
    startGAIDTracking: jest.fn(),
    login: jest.fn(),
    loginWithSecureToken: jest.fn(),
    setSecureToken: jest.fn(),
    logout: jest.fn(),
    setAttribute: jest.fn(),
    deleteAttribute: jest.fn(),
    deleteAttributes: jest.fn(),
    setEmail: jest.fn(),
    setHashedEmail: jest.fn(),
    setPhone: jest.fn(),
    setHashedPhone: jest.fn(),
    setBirthDateString: jest.fn(),
    setGender: jest.fn(),
    setFirstName: jest.fn(),
    setLastName: jest.fn(),
    setCompany: jest.fn(),
    setLocation: jest.fn(),
    setDevicePushOptIn: jest.fn(),
    setOptIn: jest.fn(),
    sendFcmToken: jest.fn(),
    onMessageReceived: jest.fn(),
    updateListenerCount: jest.fn(),
  };
  
  return {
    Platform: { OS: 'ios' },
    NativeModules: {
      webengageBridge: mockBridge
    },
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(() => ({ remove: jest.fn() }))
    })),
    StyleSheet: {},
    Text: 'Text',
    View: 'View',
    Component: class Component {},
    AppRegistry: {}
  };
});

// Mock TurboModule
const mockTurboModule = {
  init: jest.fn(),
  trackEventWithName: jest.fn(),
  trackEventWithNameAndData: jest.fn(),
  screenNavigated: jest.fn(),
  screenNavigatedWithData: jest.fn(),
  startGAIDTracking: jest.fn(),
  login: jest.fn(),
  loginWithSecureToken: jest.fn(),
  setSecureToken: jest.fn(),
  logout: jest.fn(),
  setAttribute: jest.fn(),
  deleteAttribute: jest.fn(),
  deleteAttributes: jest.fn(),
  setEmail: jest.fn(),
  setHashedEmail: jest.fn(),
  setPhone: jest.fn(),
  setHashedPhone: jest.fn(),
  setBirthDateString: jest.fn(),
  setGender: jest.fn(),
  setFirstName: jest.fn(),
  setLastName: jest.fn(),
  setCompany: jest.fn(),
  setLocation: jest.fn(),
  setDevicePushOptIn: jest.fn(),
  setOptIn: jest.fn(),
  sendFcmToken: jest.fn(),
  onMessageReceived: jest.fn(),
  updateListenerCount: jest.fn(),
};

jest.mock('../NativeWebEngageModule', () => ({
  default: mockTurboModule
}));

// Get reference to mocked modules
const { Platform, NativeModules, NativeEventEmitter } = require('react-native');
let mockBridgeModule;

describe('WebEngagePlugin Architecture Detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete global.__turboModuleProxy;
    mockBridgeModule = NativeModules.webengageBridge;
  });

  it('should initialize plugin successfully', () => {
    const plugin = new WebEngagePlugin();
    expect(plugin).toBeInstanceOf(WebEngagePlugin);
    expect(plugin.user).toBeDefined();
    expect(plugin.push).toBeDefined();
    expect(plugin.notification).toBeDefined();
    expect(plugin.universalLink).toBeDefined();
  });

  it('should use bridge module by default', () => {
    const plugin = new WebEngagePlugin();
    plugin.init(true);
    expect(mockBridgeModule.init).toHaveBeenCalledWith(true);
  });
});

describe('WebEngagePlugin Core Methods', () => {
  let plugin;

  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    plugin = new WebEngagePlugin();
    mockBridgeModule = NativeModules.webengageBridge;
  });

  describe('init', () => {
    it('should call init with autoRegister true', () => {
      plugin.init(true);
      expect(mockBridgeModule.init).toHaveBeenCalledWith(true);
    });

    it('should call init with autoRegister false', () => {
      plugin.init(false);
      expect(mockBridgeModule.init).toHaveBeenCalledWith(false);
    });

    it('should call init with undefined', () => {
      plugin.init();
      expect(mockBridgeModule.init).toHaveBeenCalledWith(undefined);
    });
  });

  describe('track', () => {
    it('should track event without attributes', () => {
      plugin.track('test_event');
      expect(mockBridgeModule.trackEventWithName).toHaveBeenCalledWith('test_event');
    });

    it('should track event with null attributes', () => {
      plugin.track('test_event', null);
      expect(mockBridgeModule.trackEventWithName).toHaveBeenCalledWith('test_event');
    });

    it('should track event with undefined attributes', () => {
      plugin.track('test_event', undefined);
      expect(mockBridgeModule.trackEventWithName).toHaveBeenCalledWith('test_event');
    });

    it('should track event with valid attributes', () => {
      const attributes = { key: 'value', number: 123 };
      plugin.track('test_event', attributes);
      expect(mockBridgeModule.trackEventWithNameAndData).toHaveBeenCalledWith('test_event', attributes);
    });

    it('should handle JSON serialization error', () => {
      const circularObj = {};
      circularObj.self = circularObj;
      
      plugin.track('test_event', circularObj);
      expect(mockBridgeModule.trackEventWithNameAndData).toHaveBeenCalledWith('test_event', circularObj);
    });
  });

  describe('screen', () => {
    it('should navigate screen without data', () => {
      plugin.screen('home');
      expect(mockBridgeModule.screenNavigated).toHaveBeenCalledWith('home');
    });

    it('should navigate screen with data', () => {
      const data = { param: 'value' };
      plugin.screen('home', data);
      expect(mockBridgeModule.screenNavigatedWithData).toHaveBeenCalledWith('home', data);
    });

    it('should handle undefined data', () => {
      plugin.screen('home', undefined);
      expect(mockBridgeModule.screenNavigated).toHaveBeenCalledWith('home');
    });
  });

  describe('startGAIDTracking', () => {
    it('should start GAID tracking on Android', () => {
      Platform.OS = 'android';
      plugin.startGAIDTracking();
      expect(mockBridgeModule.startGAIDTracking).toHaveBeenCalled();
    });

    it('should not start GAID tracking on iOS', () => {
      Platform.OS = 'ios';
      plugin.startGAIDTracking();
      expect(mockBridgeModule.startGAIDTracking).not.toHaveBeenCalled();
    });
  });
});

describe('WebEngageUserChannel', () => {
  let plugin;

  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    plugin = new WebEngagePlugin();
    mockBridgeModule = NativeModules.webengageBridge;
  });

  describe('login', () => {
    it('should login without JWT token', () => {
      plugin.user.login('user123');
      expect(mockBridgeModule.login).toHaveBeenCalledWith('user123');
    });

    it('should login with JWT token', () => {
      plugin.user.login('user123', 'jwt_token');
      expect(mockBridgeModule.loginWithSecureToken).toHaveBeenCalledWith('user123', 'jwt_token');
    });

    it('should login with null JWT token', () => {
      plugin.user.login('user123', null);
      expect(mockBridgeModule.login).toHaveBeenCalledWith('user123');
    });
  });

  describe('setAttribute', () => {
    it('should set attribute on iOS', () => {
      Platform.OS = 'ios';
      plugin.user.setAttribute('key', 'value');
      expect(mockBridgeModule.setAttribute).toHaveBeenCalledWith('key', 'value');
    });

    it('should set attribute on Android', () => {
      Platform.OS = 'android';
      plugin.user.setAttribute('key', 'value');
      expect(mockBridgeModule.setAttribute).toHaveBeenCalledWith({ key: 'value' });
    });
  });

  describe('setLocation', () => {
    it('should set valid location', () => {
      plugin.user.setLocation('12.34', '56.78');
      expect(mockBridgeModule.setLocation).toHaveBeenCalledWith(12.34, 56.78);
    });

    it('should set location with numbers', () => {
      plugin.user.setLocation(12.34, 56.78);
      expect(mockBridgeModule.setLocation).toHaveBeenCalledWith(12.34, 56.78);
    });

    it('should handle invalid latitude', () => {
      console.log = jest.fn();
      plugin.user.setLocation('invalid', '56.78');
      expect(mockBridgeModule.setLocation).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('WebEngage: Invalid Latitude or Longitude passed');
    });

    it('should handle invalid longitude', () => {
      console.log = jest.fn();
      plugin.user.setLocation('12.34', 'invalid');
      expect(mockBridgeModule.setLocation).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('WebEngage: Invalid Latitude or Longitude passed');
    });

    it('should handle both invalid coordinates', () => {
      console.log = jest.fn();
      plugin.user.setLocation('invalid', 'invalid');
      expect(mockBridgeModule.setLocation).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('WebEngage: Invalid Latitude or Longitude passed');
    });
  });

  describe('tokenInvalidatedCallback', () => {
    it('should set token invalidated callback', () => {
      const callback = jest.fn();
      const listener = plugin.user.tokenInvalidatedCallback(callback);
      expect(mockBridgeModule.updateListenerCount).toHaveBeenCalled();
      expect(listener).toBeDefined();
    });
  });

  describe('onAnonymousIdChanged', () => {
    it('should set anonymous ID changed callback', () => {
      const callback = jest.fn();
      const listener = plugin.user.onAnonymousIdChanged(callback);
      expect(mockBridgeModule.updateListenerCount).toHaveBeenCalled();
      expect(listener).toBeDefined();
    });

    it('should call callback with cached anonymous ID', () => {
      const callback = jest.fn();
      plugin.user._anonymousId = 'cached_id';
      plugin.user.onAnonymousIdChanged(callback);
      expect(callback).toHaveBeenCalledWith('cached_id');
      expect(plugin.user._anonymousId).toBeNull();
    });
  });

  describe('user methods', () => {
    const methods = [
      ['logout', []],
      ['deleteAttribute', ['key']],
      ['deleteAttributes', [['key1', 'key2']]],
      ['setEmail', ['test@example.com']],
      ['setHashedEmail', ['hashed_email']],
      ['setPhone', ['+1234567890']],
      ['setHashedPhone', ['hashed_phone']],
      ['setBirthDateString', ['1990-01-01']],
      ['setGender', ['male']],
      ['setFirstName', ['John']],
      ['setLastName', ['Doe']],
      ['setCompany', ['Company']],
      ['setDevicePushOptIn', [true]],
      ['setOptIn', ['email', true]],
      ['setSecureToken', ['user123', 'token']]
    ];

    methods.forEach(([method, args]) => {
      it(`should call ${method}`, () => {
        plugin.user[method](...args);
        expect(mockBridgeModule[method]).toHaveBeenCalledWith(...args);
      });
    });
  });
});

describe('WebEngagePushChannel', () => {
  let plugin;

  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    plugin = new WebEngagePlugin();
    mockBridgeModule = NativeModules.webengageBridge;
  });

  describe('options', () => {
    it('should set options', () => {
      plugin.push.options('key', 'value');
      expect(plugin.push._options.key).toBe('value');
    });
  });

  describe('sendFcmToken', () => {
    it('should send FCM token', () => {
      plugin.push.sendFcmToken('token123');
      expect(mockBridgeModule.sendFcmToken).toHaveBeenCalledWith('token123');
    });
  });

  describe('onMessageReceived', () => {
    it('should handle message received', () => {
      const message = { data: 'test' };
      plugin.push.onMessageReceived(message);
      expect(mockBridgeModule.onMessageReceived).toHaveBeenCalledWith(message);
    });
  });

  describe('onClick', () => {
    it('should set click callback', () => {
      const callback = jest.fn();
      const listener = plugin.push.onClick(callback);
      expect(mockBridgeModule.updateListenerCount).toHaveBeenCalled();
      expect(listener).toBeDefined();
    });
  });

  describe('onCallbackReceived', () => {
    it('should handle click callback', () => {
      const callback = jest.fn();
      plugin.push.clickCallback = callback;
      plugin.push.onCallbackReceived('click', 'uri', { custom: 'data' });
      expect(callback).toHaveBeenCalledWith('uri', { custom: 'data' });
    });

    it('should ignore non-click callbacks', () => {
      const callback = jest.fn();
      plugin.push.clickCallback = callback;
      plugin.push.onCallbackReceived('shown', 'uri', { custom: 'data' });
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle null type', () => {
      const callback = jest.fn();
      plugin.push.clickCallback = callback;
      plugin.push.onCallbackReceived(null, 'uri', { custom: 'data' });
      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe('WebEngageUniversalLinkChannel', () => {
  let plugin;

  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    plugin = new WebEngagePlugin();
    mockBridgeModule = NativeModules.webengageBridge;
  });

  describe('options', () => {
    it('should set options', () => {
      plugin.universalLink.options('key', 'value');
      expect(plugin.universalLink._options.key).toBe('value');
    });
  });

  describe('onClick', () => {
    it('should set click callback', () => {
      const callback = jest.fn();
      const listener = plugin.universalLink.onClick(callback);
      expect(mockBridgeModule.updateListenerCount).toHaveBeenCalled();
      expect(listener).toBeDefined();
    });
  });
});

describe('WebEngageNotificationChannel', () => {
  let plugin;

  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    plugin = new WebEngagePlugin();
    mockBridgeModule = NativeModules.webengageBridge;
  });

  describe('options', () => {
    it('should set options', () => {
      plugin.notification.options('key', 'value');
      expect(plugin.notification._options.key).toBe('value');
    });
  });

  describe('callback methods', () => {
    const methods = ['onPrepare', 'onShown', 'onClick', 'onDismiss'];
    
    methods.forEach(method => {
      it(`should set ${method} callback`, () => {
        const callback = jest.fn();
        const listener = plugin.notification[method](callback);
        expect(mockBridgeModule.updateListenerCount).toHaveBeenCalled();
        expect(listener).toBeDefined();
      });
    });
  });

  describe('onCallbackReceived', () => {
    it('should handle shown callback', () => {
      const callback = jest.fn();
      plugin.notification.shownCallback = callback;
      const data = { id: '123' };
      plugin.notification.onCallbackReceived('shown', data);
      expect(callback).toHaveBeenCalledWith(data);
    });

    it('should handle click callback', () => {
      const callback = jest.fn();
      plugin.notification.clickCallback = callback;
      const data = { id: '123' };
      plugin.notification.onCallbackReceived('click', data, 'action1');
      expect(callback).toHaveBeenCalledWith(data, 'action1');
    });

    it('should handle dismiss callback', () => {
      const callback = jest.fn();
      plugin.notification.dismissCallback = callback;
      const data = { id: '123' };
      plugin.notification.onCallbackReceived('dismiss', data);
      expect(callback).toHaveBeenCalledWith(data);
    });

    it('should handle null type', () => {
      const callbacks = {
        shownCallback: jest.fn(),
        clickCallback: jest.fn(),
        dismissCallback: jest.fn()
      };
      Object.assign(plugin.notification, callbacks);
      
      plugin.notification.onCallbackReceived(null, { id: '123' });
      Object.values(callbacks).forEach(callback => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});

describe('Event Listeners', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    mockBridgeModule = NativeModules.webengageBridge;
  });

  describe('Android listeners', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should create Android event listeners', () => {
      const plugin = new WebEngagePlugin();
      expect(NativeEventEmitter).toHaveBeenCalledWith();
    });
  });

  describe('iOS listeners', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    it('should create iOS event listeners', () => {
      const plugin = new WebEngagePlugin();
      expect(NativeEventEmitter).toHaveBeenCalledWith(NativeModules.webengageBridge);
    });
  });
});

describe('Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.__turboModuleProxy = undefined;
    mockBridgeModule = NativeModules.webengageBridge;
  });

  it('should handle plugin instantiation multiple times', () => {
    const plugin1 = new WebEngagePlugin();
    const plugin2 = new WebEngagePlugin();
    
    expect(plugin1).toBeInstanceOf(WebEngagePlugin);
    expect(plugin2).toBeInstanceOf(WebEngagePlugin);
    expect(plugin1).not.toBe(plugin2);
  });

  it('should handle empty string parameters', () => {
    const plugin = new WebEngagePlugin();
    plugin.track('');
    plugin.screen('');
    plugin.user.login('');
    
    expect(mockBridgeModule.trackEventWithName).toHaveBeenCalledWith('');
    expect(mockBridgeModule.screenNavigated).toHaveBeenCalledWith('');
    expect(mockBridgeModule.login).toHaveBeenCalledWith('');
  });

  it('should handle special characters in parameters', () => {
    const plugin = new WebEngagePlugin();
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    plugin.track(specialChars);
    plugin.user.setAttribute(specialChars, specialChars);
    
    expect(mockBridgeModule.trackEventWithName).toHaveBeenCalledWith(specialChars);
  });

  it('should handle very large objects', () => {
    const plugin = new WebEngagePlugin();
    const largeObj = {};
    for (let i = 0; i < 1000; i++) {
      largeObj[`key${i}`] = `value${i}`;
    }
    
    plugin.track('large_event', largeObj);
    expect(mockBridgeModule.trackEventWithNameAndData).toHaveBeenCalledWith('large_event', largeObj);
  });

  it('should handle boolean and numeric values', () => {
    const plugin = new WebEngagePlugin();
    
    plugin.user.setDevicePushOptIn(true);
    plugin.user.setDevicePushOptIn(false);
    plugin.user.setOptIn('email', true);
    plugin.user.setOptIn('sms', false);
    
    expect(mockBridgeModule.setDevicePushOptIn).toHaveBeenCalledWith(true);
    expect(mockBridgeModule.setDevicePushOptIn).toHaveBeenCalledWith(false);
    expect(mockBridgeModule.setOptIn).toHaveBeenCalledWith('email', true);
    expect(mockBridgeModule.setOptIn).toHaveBeenCalledWith('sms', false);
  });
});