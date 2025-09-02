module.exports = {
  Platform: { OS: 'ios' },
  NativeModules: {
    webengageBridge: {
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
    }
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