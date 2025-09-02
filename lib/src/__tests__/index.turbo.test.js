/**
 * New Architecture (TurboModule) Test Suite
 * Tests the WebEngage plugin when TurboModule is available and properly loaded
 */

describe('WebEngagePlugin New Architecture (TurboModule)', () => {
  let mockTurboModule;
  let WebEngagePlugin;
  let plugin;

  beforeAll(() => {
    // Set up TurboModule environment
    global.__turboModuleProxy = true;
    
    // Mock TurboModule
    mockTurboModule = {
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

    // Mock React Native
    jest.doMock('react-native', () => ({
      Platform: { OS: 'ios' },
      NativeModules: {
        webengageBridge: {}
      },
      NativeEventEmitter: jest.fn(() => ({
        addListener: jest.fn(() => ({ remove: jest.fn() }))
      })),
      StyleSheet: {},
      Text: 'Text',
      View: 'View',
      Component: class Component {},
      AppRegistry: {}
    }));

    // Mock TurboModule
    jest.doMock('../NativeWebEngageModule', () => ({
      default: mockTurboModule
    }));

    // Clear module cache and re-import
    jest.resetModules();
    WebEngagePlugin = require('../index.js').default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    plugin = new WebEngagePlugin();
  });

  afterAll(() => {
    delete global.__turboModuleProxy;
    jest.resetModules();
  });

  describe('TurboModule Architecture Detection', () => {
    it('should initialize plugin with TurboModule support', () => {
      expect(plugin).toBeInstanceOf(WebEngagePlugin);
      expect(plugin.user).toBeDefined();
      expect(plugin.push).toBeDefined();
      expect(plugin.notification).toBeDefined();
      expect(plugin.universalLink).toBeDefined();
    });
  });

  describe('TurboModule Core Methods', () => {
    it('should call TurboModule init', () => {
      plugin.init(true);
      expect(mockTurboModule.init).toHaveBeenCalledWith(true);
    });

    it('should call TurboModule track without attributes', () => {
      plugin.track('test_event');
      expect(mockTurboModule.trackEventWithName).toHaveBeenCalledWith('test_event');
    });

    it('should call TurboModule track with attributes', () => {
      const data = { key: 'value' };
      plugin.track('test_event', data);
      expect(mockTurboModule.trackEventWithNameAndData).toHaveBeenCalledWith('test_event', data);
    });

    it('should call TurboModule screen navigation', () => {
      plugin.screen('home');
      expect(mockTurboModule.screenNavigated).toHaveBeenCalledWith('home');
    });

    it('should call TurboModule screen with data', () => {
      const data = { param: 'value' };
      plugin.screen('home', data);
      expect(mockTurboModule.screenNavigatedWithData).toHaveBeenCalledWith('home', data);
    });
  });

  describe('TurboModule User Channel', () => {
    it('should call TurboModule login', () => {
      plugin.user.login('user123');
      expect(mockTurboModule.login).toHaveBeenCalledWith('user123');
    });

    it('should call TurboModule login with JWT', () => {
      plugin.user.login('user123', 'jwt_token');
      expect(mockTurboModule.loginWithSecureToken).toHaveBeenCalledWith('user123', 'jwt_token');
    });

    it('should call TurboModule logout', () => {
      plugin.user.logout();
      expect(mockTurboModule.logout).toHaveBeenCalled();
    });

    it('should call TurboModule setAttribute', () => {
      const { Platform } = require('react-native');
      Platform.OS = 'ios';
      plugin.user.setAttribute('key', 'value');
      expect(mockTurboModule.setAttribute).toHaveBeenCalledWith('key', 'value');
    });

    it('should call TurboModule setLocation', () => {
      plugin.user.setLocation('12.34', '56.78');
      expect(mockTurboModule.setLocation).toHaveBeenCalledWith(12.34, 56.78);
    });

    it('should call TurboModule setEmail', () => {
      plugin.user.setEmail('test@example.com');
      expect(mockTurboModule.setEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should call TurboModule updateListenerCount for callbacks', () => {
      const callback = jest.fn();
      plugin.user.tokenInvalidatedCallback(callback);
      expect(mockTurboModule.updateListenerCount).toHaveBeenCalled();
    });
  });

  describe('TurboModule Push Channel', () => {
    it('should call TurboModule sendFcmToken', () => {
      plugin.push.sendFcmToken('token123');
      expect(mockTurboModule.sendFcmToken).toHaveBeenCalledWith('token123');
    });

    it('should call TurboModule onMessageReceived', () => {
      const message = { data: 'test' };
      plugin.push.onMessageReceived(message);
      expect(mockTurboModule.onMessageReceived).toHaveBeenCalledWith(message);
    });

    it('should call TurboModule updateListenerCount for onClick', () => {
      const callback = jest.fn();
      plugin.push.onClick(callback);
      expect(mockTurboModule.updateListenerCount).toHaveBeenCalled();
    });
  });

  describe('TurboModule Notification Channel', () => {
    const methods = ['onPrepare', 'onShown', 'onClick', 'onDismiss'];
    
    methods.forEach(method => {
      it(`should call TurboModule updateListenerCount for ${method}`, () => {
        const callback = jest.fn();
        plugin.notification[method](callback);
        expect(mockTurboModule.updateListenerCount).toHaveBeenCalled();
      });
    });
  });

  describe('TurboModule Edge Cases', () => {
    it('should handle empty parameters', () => {
      plugin.track('');
      plugin.user.login('');
      expect(mockTurboModule.trackEventWithName).toHaveBeenCalledWith('');
      expect(mockTurboModule.login).toHaveBeenCalledWith('');
    });

    it('should handle large objects', () => {
      const largeObj = {};
      for (let i = 0; i < 50; i++) {
        largeObj[`key${i}`] = `value${i}`;
      }
      plugin.track('large_event', largeObj);
      expect(mockTurboModule.trackEventWithNameAndData).toHaveBeenCalledWith('large_event', largeObj);
    });

    it('should handle boolean values', () => {
      plugin.user.setDevicePushOptIn(true);
      plugin.user.setOptIn('email', false);
      expect(mockTurboModule.setDevicePushOptIn).toHaveBeenCalledWith(true);
      expect(mockTurboModule.setOptIn).toHaveBeenCalledWith('email', false);
    });

    it('should handle null and undefined values', () => {
      plugin.track('test_event', null);
      plugin.track('test_event', undefined);
      expect(mockTurboModule.trackEventWithName).toHaveBeenCalledTimes(2);
    });

    it('should handle JSON serialization errors', () => {
      const circularObj = {};
      circularObj.self = circularObj;
      plugin.track('test_event', circularObj);
      expect(mockTurboModule.trackEventWithNameAndData).toHaveBeenCalledWith('test_event', circularObj);
    });
  });
});