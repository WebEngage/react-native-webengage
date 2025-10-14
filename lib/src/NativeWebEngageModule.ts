import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  init(autoRegister: boolean): void;
  trackEventWithName(eventName: string): void;
  trackEventWithNameAndData(eventName: string, eventData: Object): void;
  screenNavigated(screenName: string): void;
  screenNavigatedWithData(screenName: string, screenData: Object): void;
  login(userId: string): void;
  loginWithSecureToken(userId: string, jwtToken: string): void;
  setSecureToken(userId: string, secureToken: string): void;
  logout(): void;
  setAttribute(key: string, value: Object): void;
  deleteAttribute(attributeName: string): void;
  deleteAttributes(attributeNames: string[]): void;
  setEmail(email: string): void;
  setHashedEmail(hashedEmail: string): void;
  setPhone(phone: string): void;
  setHashedPhone(hashedPhone: string): void;
  setBirthDateString(birthDate: string): void;
  setGender(gender: string): void;
  setFirstName(firstName: string): void;
  setLastName(lastName: string): void;
  setCompany(company: string): void;
  setLocation(latitude: number, longitude: number): void;
  setDevicePushOptIn(optIn: boolean): void;
  setOptIn(channel: string, optIn: boolean): void;
  sendFcmToken(token: string): void;
  onMessageReceived(remoteMessage: Object): void;
  startGAIDTracking(): void;
  updateListenerCount(): void;

  onEventListenerAdded(eventType: string): void;
  // NativeEventEmitter methods for the New Architecture.
  // The implementations are handled implicitly by React Native.
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('WebEngageReact');