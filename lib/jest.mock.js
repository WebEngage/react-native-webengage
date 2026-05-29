// Mock react-native for unit tests
const NativeEventEmitter = class {
  addListener(event, callback) {
    return { remove: () => {} };
  }
  removeAllListeners() {}
};

module.exports = {
  Platform: { OS: 'android', select: (obj) => obj.android },
  NativeModules: {
    WEGWebEngageBridge: {
      initializeWebEngage: jest.fn(),
      trackEventWithName: jest.fn(),
      trackEventWithNameAndData: jest.fn(),
      screenNavigated: jest.fn(),
      screenNavigatedWithData: jest.fn(),
      login: jest.fn(),
      loginWithSecureToken: jest.fn(),
      setSecureToken: jest.fn(),
      logout: jest.fn(),
      setAndroidAttribute: jest.fn(),
      setIosAttribute: jest.fn(),
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
      startGAIDTracking: jest.fn(),
      updateListenerCount: jest.fn(),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  },
  NativeEventEmitter,
};
