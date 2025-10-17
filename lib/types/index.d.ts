declare module "react-native" {
  interface NativeModulesStatic {
    WebEngageReact: {
      init(): void;
      trackEventWithName(eventName: string): void;
      trackEventWithNameAndData(
        eventName: string,
        data: Record<string, any>
      ): void;
      screenNavigated(name: string): void;
      screenNavigatedWithData(name: string, data: Record<string, any>): void;
      startGAIDTracking(): void;
      loginWithSecureToken(userId: string, jwtToken: string | null): void;
      login(userId: string): void;
      setSecureToken(userId: string, secureToken: string): void;
      logout(): void;
      setAttribute(key: string, value: any): void;
      deleteAttribute(key: string): void;
      deleteAttributes(keys: string[]): void;
      setEmail(email: string): void;
      setHashedEmail(email: string): void;
      setPhone(phone: string): void;
      setHashedPhone(phone: string): void;
      setBirthDateString(date: string): void;
      setGender(gender: string): void;
      setFirstName(name: string): void;
      setLocation(lat: number, lng: number): void;
      setLastName(name: string): void;
      setCompany(name: string): void;
      setDevicePushOptIn(status: boolean): void;
      setOptIn(channel: string, status: boolean): void;
      updateListenerCount(): void;
      sendFcmToken(token: string): void;
      onMessageReceived(remoteMessage: any): void;
    };
  }
}

// TurboModule interface for new architecture
export interface NativeWebEngageModule {
  init(): void;
  trackEventWithName(eventName: string): void;
  trackEventWithNameAndData(eventName: string, eventData: any): void;
  screenNavigated(screenName: string): void;
  screenNavigatedWithData(screenName: string, screenData: any): void;
  login(userId: string): void;
  loginWithSecureToken(userId: string, jwtToken: string): void;
  setSecureToken(userId: string, secureToken: string): void;
  logout(): void;
  setAttribute(attributes: any): void;
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
  onMessageReceived(remoteMessage: any): void;
  startGAIDTracking(): void;
  updateListenerCount(): void;
  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

declare class WebEngagePushChannel {
  onClick(callback: (notificationData: any) => void): any;
  sendFcmToken(fcmToken: string): void;
  onMessageReceived(remoteMessage: any): void;
}

declare class WebEngageUniversalLinkChannel {
  options(key: string, value: any): void;
  onClick(callback: (location: string) => void): any;
  onCallbackReceived(type: string, location: string): void;
}

declare class WebEngageUserChannel {
  login(userId: string, jwtToken?: string | null): void;
  tokenInvalidatedCallback(callback: () => void): any;
  setSecureToken(userId: string, secureToken: string): void;
  logout(): void;
  setAttribute(key: string, value: any): void;
  deleteAttribute(key: string): void;
  deleteAttributes(keys: string[]): void;
  setEmail(email: string): void;
  setHashedEmail(email: string): void;
  setPhone(phone: string): void;
  setHashedPhone(phone: string): void;
  setBirthDateString(date: string): void;
  setGender(gender: string): void;
  setFirstName(name: string): void;
  setLocation(lat: number, lng: number): void;
  setLastName(name: string): void;
  setCompany(name: string): void;
  setDevicePushOptIn(status: boolean): void;
  setOptIn(channel: string, status: boolean): void;
  onAnonymousIdChanged(
    callback: (anonymousId: string) => void
  ): any;
}

declare class WebEngageNotificationChannel {
  options(key: string, value: any): void;
  onPrepare(callback: (data: any) => void): any;
  onShown(callback: (data: any) => void): any;
  onClick(callback: (data: any, actionId: string) => void): any;
  onDismiss(callback: (data: any) => void): any;
  onCallbackReceived(
    type: string,
    notificationData: any,
    actionId: string
  ): void;
}

declare class WebEngagePlugin {
  push: WebEngagePushChannel;
  notification: WebEngageNotificationChannel;
  user: WebEngageUserChannel;
  universalLink: WebEngageUniversalLinkChannel;
  pushClickListener: any;
  tokenInvalidateLister: any;
  universalClickListener: any;
  inAppClickListener: any;
  inAppDismissedListener: any;
  inAppPreparedListener: any;
  inAppShownListener: any;
  _options: Record<string, any>;

  init(): void;
  track(eventName: string, attributes?: Record<string, any>): void;
  screen(name: string, data?: Record<string, any>): void;
  startGAIDTracking(): void;
}
export default WebEngagePlugin;
