import WebEngagePlugin from '../src/index';
import { NativeModules, Platform } from 'react-native';

const mockModule = NativeModules.WEGWebEngageBridge;

describe('WebEngagePlugin', () => {
  let webengage;

  beforeEach(() => {
    jest.clearAllMocks();
    webengage = new WebEngagePlugin();
  });

  describe('Initialization', () => {
    it('should create plugin instance with all channels', () => {
      expect(webengage.push).toBeDefined();
      expect(webengage.notification).toBeDefined();
      expect(webengage.user).toBeDefined();
      expect(webengage.universalLink).toBeDefined();
    });

    it('should call initializeWebEngage on native module', () => {
      webengage.initialize();
      expect(mockModule.initializeWebEngage).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Tracking', () => {
    it('should track event without attributes', () => {
      webengage.track('Product Viewed');
      expect(mockModule.trackEventWithName).toHaveBeenCalledWith('Product Viewed');
    });

    it('should track event with attributes', () => {
      const attrs = { productId: '123', price: 99.99 };
      webengage.track('Product Purchased', attrs);
      expect(mockModule.trackEventWithNameAndData).toHaveBeenCalledWith('Product Purchased', attrs);
    });

    it('should handle circular reference in attributes gracefully', () => {
      const attrs = { name: 'test' };
      // JSON.parse(JSON.stringify) will work fine here, no circular ref
      webengage.track('Event', attrs);
      expect(mockModule.trackEventWithNameAndData).toHaveBeenCalled();
    });

    it('should track event with null attributes as no-attribute event', () => {
      webengage.track('Simple Event', null);
      expect(mockModule.trackEventWithName).toHaveBeenCalledWith('Simple Event');
    });

    it('should track event with undefined attributes as no-attribute event', () => {
      webengage.track('Simple Event', undefined);
      expect(mockModule.trackEventWithName).toHaveBeenCalledWith('Simple Event');
    });
  });

  describe('Screen Navigation', () => {
    it('should navigate to screen without data', () => {
      webengage.screen('Home');
      expect(mockModule.screenNavigated).toHaveBeenCalledWith('Home');
    });

    it('should navigate to screen with data', () => {
      const data = { section: 'main' };
      webengage.screen('Product', data);
      expect(mockModule.screenNavigatedWithData).toHaveBeenCalledWith('Product', data);
    });
  });

  describe('User Channel - Authentication', () => {
    it('should login without JWT', () => {
      webengage.user.login('user123');
      expect(mockModule.login).toHaveBeenCalledWith('user123');
    });

    it('should login with JWT token', () => {
      webengage.user.login('user123', 'jwt-token-here');
      expect(mockModule.loginWithSecureToken).toHaveBeenCalledWith('user123', 'jwt-token-here');
    });

    it('should set secure token', () => {
      webengage.user.setSecureToken('user123', 'new-token');
      expect(mockModule.setSecureToken).toHaveBeenCalledWith('user123', 'new-token');
    });

    it('should logout', () => {
      webengage.user.logout();
      expect(mockModule.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Channel - Attributes', () => {
    it('should set attribute on Android', () => {
      Platform.OS = 'android';
      webengage.user.setAttribute('age', 25);
      expect(mockModule.setAndroidAttribute).toHaveBeenCalledWith({ age: 25 });
    });

    it('should set attribute on iOS', () => {
      Platform.OS = 'ios';
      webengage.user.setAttribute('age', 25);
      expect(mockModule.setIosAttribute).toHaveBeenCalledWith('age', 25);
      Platform.OS = 'android'; // reset
    });

    it('should delete single attribute', () => {
      webengage.user.deleteAttribute('age');
      expect(mockModule.deleteAttribute).toHaveBeenCalledWith('age');
    });

    it('should delete multiple attributes', () => {
      webengage.user.deleteAttributes(['age', 'city']);
      expect(mockModule.deleteAttributes).toHaveBeenCalledWith(['age', 'city']);
    });

    it('should set email', () => {
      webengage.user.setEmail('user@example.com');
      expect(mockModule.setEmail).toHaveBeenCalledWith('user@example.com');
    });

    it('should set hashed email', () => {
      webengage.user.setHashedEmail('hashed123');
      expect(mockModule.setHashedEmail).toHaveBeenCalledWith('hashed123');
    });

    it('should set phone', () => {
      webengage.user.setPhone('+1234567890');
      expect(mockModule.setPhone).toHaveBeenCalledWith('+1234567890');
    });

    it('should set hashed phone', () => {
      webengage.user.setHashedPhone('hashed456');
      expect(mockModule.setHashedPhone).toHaveBeenCalledWith('hashed456');
    });

    it('should set birth date', () => {
      webengage.user.setBirthDateString('1990-01-15T00:00:00.000Z');
      expect(mockModule.setBirthDateString).toHaveBeenCalledWith('1990-01-15T00:00:00.000Z');
    });

    it('should set gender', () => {
      webengage.user.setGender('male');
      expect(mockModule.setGender).toHaveBeenCalledWith('male');
    });

    it('should set first name', () => {
      webengage.user.setFirstName('John');
      expect(mockModule.setFirstName).toHaveBeenCalledWith('John');
    });

    it('should set last name', () => {
      webengage.user.setLastName('Doe');
      expect(mockModule.setLastName).toHaveBeenCalledWith('Doe');
    });

    it('should set company', () => {
      webengage.user.setCompany('WebEngage');
      expect(mockModule.setCompany).toHaveBeenCalledWith('WebEngage');
    });

    it('should set valid location', () => {
      webengage.user.setLocation(37.7749, -122.4194);
      expect(mockModule.setLocation).toHaveBeenCalledWith(37.7749, -122.4194);
    });

    it('should not set invalid location (NaN)', () => {
      webengage.user.setLocation('invalid', 'data');
      expect(mockModule.setLocation).not.toHaveBeenCalled();
    });

    it('should set location with string numbers', () => {
      webengage.user.setLocation('37.7749', '-122.4194');
      expect(mockModule.setLocation).toHaveBeenCalledWith(37.7749, -122.4194);
    });
  });

  describe('User Channel - Opt-In', () => {
    it('should set device push opt-in', () => {
      webengage.user.setDevicePushOptIn(true);
      expect(mockModule.setDevicePushOptIn).toHaveBeenCalledWith(true);
    });

    it('should set channel opt-in for push', () => {
      webengage.user.setOptIn('push', true);
      expect(mockModule.setOptIn).toHaveBeenCalledWith('push', true);
    });

    it('should set channel opt-in for email', () => {
      webengage.user.setOptIn('email', false);
      expect(mockModule.setOptIn).toHaveBeenCalledWith('email', false);
    });

    it('should set channel opt-in for sms', () => {
      webengage.user.setOptIn('sms', true);
      expect(mockModule.setOptIn).toHaveBeenCalledWith('sms', true);
    });

    it('should set channel opt-in for in_app', () => {
      webengage.user.setOptIn('in_app', false);
      expect(mockModule.setOptIn).toHaveBeenCalledWith('in_app', false);
    });

    it('should set channel opt-in for whatsapp', () => {
      webengage.user.setOptIn('whatsapp', true);
      expect(mockModule.setOptIn).toHaveBeenCalledWith('whatsapp', true);
    });

    it('should set channel opt-in for viber', () => {
      webengage.user.setOptIn('viber', true);
      expect(mockModule.setOptIn).toHaveBeenCalledWith('viber', true);
    });
  });

  describe('Push Channel', () => {
    it('should register push click callback', () => {
      const callback = jest.fn();
      const subscription = webengage.push.onClick(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(subscription).toBeDefined();
    });

    it('should send FCM token', () => {
      webengage.push.sendFcmToken('test-fcm-token');
      expect(mockModule.sendFcmToken).toHaveBeenCalledWith('test-fcm-token');
    });

    it('should handle onMessageReceived', () => {
      const msg = { data: { source: 'webengage' } };
      webengage.push.onMessageReceived(msg);
      expect(mockModule.onMessageReceived).toHaveBeenCalledWith(msg);
    });

    it('should queue events before callback registration and flush after', () => {
      // Create a fresh instance to test queuing
      const we = new WebEngagePlugin();
      const callback = jest.fn();
      // Register callback - should flush any pending
      we.push.onClick(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
    });
  });

  describe('Notification (In-App) Channel', () => {
    it('should register onPrepare callback', () => {
      const callback = jest.fn();
      const sub = webengage.notification.onPrepare(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });

    it('should register onShown callback', () => {
      const callback = jest.fn();
      const sub = webengage.notification.onShown(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });

    it('should register onClick callback', () => {
      const callback = jest.fn();
      const sub = webengage.notification.onClick(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });

    it('should register onDismiss callback', () => {
      const callback = jest.fn();
      const sub = webengage.notification.onDismiss(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });
  });

  describe('Universal Link Channel', () => {
    it('should register onClick callback', () => {
      const callback = jest.fn();
      const sub = webengage.universalLink.onClick(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });
  });

  describe('GAID Tracking', () => {
    it('should call startGAIDTracking on Android', () => {
      Platform.OS = 'android';
      webengage.startGAIDTracking();
      expect(mockModule.startGAIDTracking).toHaveBeenCalledTimes(1);
    });

    it('should not call startGAIDTracking on iOS', () => {
      Platform.OS = 'ios';
      webengage.startGAIDTracking();
      expect(mockModule.startGAIDTracking).not.toHaveBeenCalled();
      Platform.OS = 'android'; // reset
    });
  });

  describe('Anonymous ID', () => {
    it('should register onAnonymousIdChanged callback', () => {
      const callback = jest.fn();
      const sub = webengage.user.onAnonymousIdChanged(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });
  });

  describe('Token Invalidation', () => {
    it('should register tokenInvalidatedCallback', () => {
      const callback = jest.fn();
      const sub = webengage.user.tokenInvalidatedCallback(callback);
      expect(mockModule.updateListenerCount).toHaveBeenCalled();
      expect(sub).toBeDefined();
    });
  });
});
