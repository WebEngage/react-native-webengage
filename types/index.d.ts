declare module "react-native" {
  interface NativeModulesStatic {
    WEGWebEngageBridge: {
      /**
       * Initialize WebEngage SDK
       * @description Must be called before using any other WebEngage methods
       */
      initializeWebEngage(): void;
      
      /**
       * Track a custom event without attributes
       * @param eventName Name of the event to track
       * @example trackEventWithName('Product Viewed')
       */
      trackEventWithName(eventName: string): void;
      
      /**
       * Track a custom event with attributes
       * @param eventName Name of the event to track
       * @param data Event attributes as key-value pairs
       * @example trackEventWithNameAndData('Product Purchased', { productId: '123', price: 99.99 })
       */
      trackEventWithNameAndData(
        eventName: string,
        data: Record<string, any>
      ): void;
      
      /**
       * Track screen navigation without data
       * @param name Screen name to track
       * @example screenNavigated('Home Screen')
       */
      screenNavigated(name: string): void;
      
      /**
       * Track screen navigation with additional data
       * @param name Screen name to track
       * @param data Additional screen data
       * @example screenNavigatedWithData('Product Details', { productId: '123' })
       */
      screenNavigatedWithData(name: string, data: Record<string, any>): void;
      
      /**
       * Start Google Advertising ID tracking (Android only)
       * @description Enables GAID tracking for better attribution
       */
      startGAIDTracking(): void;
      
      /**
       * Login user with secure JWT token
       * @param userId Unique user identifier
       * @param jwtToken JWT token for secure authentication
       * @example loginWithSecureToken('user123', 'eyJhbGciOiJIUzI1NiIs...')
       */
      loginWithSecureToken(userId: string, jwtToken: string | null): void;
      
      /**
       * Login user with basic authentication
       * @param userId Unique user identifier
       * @example login('user123')
       */
      login(userId: string): void;
      
      /**
       * Set secure token for authenticated user
       * @param userId User identifier
       * @param secureToken Secure authentication token
       */
      setSecureToken(userId: string, secureToken: string): void;
      
      /**
       * Logout current user
       * @description Clears user session and data
       */
      logout(): void;
      
      /**
       * Set custom user attribute
       * @param key Attribute name
       * @param value Attribute value (string, number, boolean, Date)
       * @example setAttribute('age', 25)
       */
      setAttribute(key: string, value: any): void;
      
      /**
       * Delete a user attribute
       * @param key Attribute name to delete
       * @example deleteAttribute('age')
       */
      deleteAttribute(key: string): void;
      
      /**
       * Delete multiple user attributes
       * @param keys Array of attribute names to delete
       * @example deleteAttributes(['age', 'city'])
       */
      deleteAttributes(keys: string[]): void;
      
      /**
       * Set user email address
       * @param email User's email address
       * @example setEmail('user@example.com')
       */
      setEmail(email: string): void;
      
      /**
       * Set hashed user email
       * @param email Hashed email address
       * @description Use for privacy compliance
       */
      setHashedEmail(email: string): void;
      
      /**
       * Set user phone number
       * @param phone User's phone number
       * @example setPhone('+1234567890')
       */
      setPhone(phone: string): void;
      
      /**
       * Set hashed user phone number
       * @param phone Hashed phone number
       * @description Use for privacy compliance
       */
      setHashedPhone(phone: string): void;
      
      /**
       * Set user birth date
       * @param date Birth date in ISO format
       * @example setBirthDateString('1990-01-15T00:00:00.000Z')
       */
      setBirthDateString(date: string): void;
      
      /**
       * Set user gender
       * @param gender User's gender ('male', 'female', 'other')
       * @example setGender('male')
       */
      setGender(gender: string): void;
      
      /**
       * Set user first name
       * @param name User's first name
       * @example setFirstName('John')
       */
      setFirstName(name: string): void;
      
      /**
       * Set user location coordinates
       * @param lat Latitude (-90 to 90)
       * @param lng Longitude (-180 to 180)
       * @example setLocation(37.7749, -122.4194)
       */
      setLocation(lat: number, lng: number): void;
      
      /**
       * Set user last name
       * @param name User's last name
       * @example setLastName('Doe')
       */
      setLastName(name: string): void;
      
      /**
       * Set user company name
       * @param name Company name
       * @example setCompany('WebEngage Inc.')
       */
      setCompany(name: string): void;
      
      /**
       * Set device push notification opt-in status
       * @param status Push notification preference
       * @example setDevicePushOptIn(true)
       */
      setDevicePushOptIn(status: boolean): void;
      
      /**
       * Set channel opt-in status
       * @param channel Communication channel ('push', 'email', 'sms', 'in_app')
       * @param status Opt-in preference
       * @example setOptIn('email', true)
       */
      setOptIn(channel: string, status: boolean): void;
      
      /**
       * Update event listener count
       * @description Internal method for listener management
       */
      updateListenerCount(): void;
      
      /**
       * Send FCM token for push notifications (Android only)
       * @param token Firebase Cloud Messaging token
       * @example sendFcmToken('fhgdGhpcyBpcyBhIGZha2UgdG9rZW4=')
       */
      sendFcmToken(token: string): void;
      
      /**
       * Handle received push notification (Android only)
       * @param remoteMessage FCM remote message object
       * @description Process incoming push notifications
       */
      onMessageReceived(remoteMessage: any): void;
    };
  }
}

// TurboModule interface for new architecture
export interface NativeWebEngageModule {
  /** Initialize WebEngage SDK */
  initializeWebEngage(): void;
  /** Track event without attributes */
  trackEventWithName(eventName: string): void;
  /** Track event with attributes */
  trackEventWithNameAndData(eventName: string, eventData: any): void;
  /** Track screen navigation */
  screenNavigated(screenName: string): void;
  /** Track screen with data */
  screenNavigatedWithData(screenName: string, screenData: any): void;
  /** Login user */
  login(userId: string): void;
  /** Login with JWT token */
  loginWithSecureToken(userId: string, jwtToken: string): void;
  /** Set secure token */
  setSecureToken(userId: string, secureToken: string): void;
  /** Logout user */
  logout(): void;
  /** Set user attributes */
  setAttribute(attributes: any): void;
  /** Delete attribute */
  deleteAttribute(attributeName: string): void;
  /** Delete multiple attributes */
  deleteAttributes(attributeNames: string[]): void;
  /** Set user email */
  setEmail(email: string): void;
  /** Set hashed email */
  setHashedEmail(hashedEmail: string): void;
  /** Set user phone */
  setPhone(phone: string): void;
  /** Set hashed phone */
  setHashedPhone(hashedPhone: string): void;
  /** Set birth date */
  setBirthDateString(birthDate: string): void;
  /** Set user gender */
  setGender(gender: string): void;
  /** Set first name */
  setFirstName(firstName: string): void;
  /** Set last name */
  setLastName(lastName: string): void;
  /** Set company name */
  setCompany(company: string): void;
  /** Set location coordinates */
  setLocation(latitude: number, longitude: number): void;
  /** Set push opt-in status */
  setDevicePushOptIn(optIn: boolean): void;
  /** Set channel opt-in */
  setOptIn(channel: string, optIn: boolean): void;
  /** Send FCM token */
  sendFcmToken(token: string): void;
  /** Handle push message */
  onMessageReceived(remoteMessage: any): void;
  /** Start GAID tracking (Android) */
  startGAIDTracking(): void;
  /** Update listener count */
  updateListenerCount(): void;
  /** Add event listener */
  addListener: (eventType: string) => void;
  /** Remove event listeners */
  removeListeners: (count: number) => void;
}

/**
 * Push notification channel for handling push-related functionality
 */
declare class WebEngagePushChannel {
  /**
   * Set push notification click callback
   * @param callback Function called when push notification is clicked
   * @example webengage.push.onClick((data) => console.log('Push clicked:', data))
   */
  onClick(callback: (notificationData: any) => void): any;
  
  /**
   * Send FCM token for push notifications (Android only)
   * @param fcmToken Firebase Cloud Messaging token
   * @example webengage.push.sendFcmToken('your-fcm-token')
   */
  sendFcmToken(fcmToken: string): void;
  
  /**
   * Handle received push message (Android only)
   * @param remoteMessage FCM remote message object
   * @example webengage.push.onMessageReceived(remoteMessage)
   */
  onMessageReceived(remoteMessage: any): void;
}

/**
 * Universal link channel for handling deep link functionality
 */
declare class WebEngageUniversalLinkChannel {
  /**
   * Set universal link options
   * @param key Option key
   * @param value Option value
   */
  options(key: string, value: any): void;
  
  /**
   * Set universal link click callback
   * @param callback Function called when universal link is clicked
   * @example webengage.universalLink.onClick((location) => console.log('Link:', location))
   */
  onClick(callback: (location: string) => void): any;
  
  /**
   * Handle universal link callback
   * @param type Callback type
   * @param location Link location
   */
  onCallbackReceived(type: string, location: string): void;
}

/**
 * User channel for managing user data and authentication
 */
declare class WebEngageUserChannel {
  /**
   * Login user with optional JWT token
   * @param userId Unique user identifier
   * @param jwtToken Optional JWT token for secure authentication
   * @example webengage.user.login('user123', 'jwt-token')
   */
  login(userId: string, jwtToken?: string | null): void;
  
  /**
   * Set callback for token invalidation
   * @param callback Function called when token is invalidated
   * @example webengage.user.tokenInvalidatedCallback(() => console.log('Token invalid'))
   */
  tokenInvalidatedCallback(callback: () => void): any;
  
  /**
   * Set secure token for user
   * @param userId User identifier
   * @param secureToken Secure authentication token
   */
  setSecureToken(userId: string, secureToken: string): void;
  
  /**
   * Logout current user
   * @example webengage.user.logout()
   */
  logout(): void;
  
  /**
   * Set custom user attribute
   * @param key Attribute name
   * @param value Attribute value
   * @example webengage.user.setAttribute('age', 25)
   */
  setAttribute(key: string, value: any): void;
  
  /**
   * Delete user attribute
   * @param key Attribute name to delete
   * @example webengage.user.deleteAttribute('age')
   */
  deleteAttribute(key: string): void;
  
  /**
   * Delete multiple user attributes
   * @param keys Array of attribute names
   * @example webengage.user.deleteAttributes(['age', 'city'])
   */
  deleteAttributes(keys: string[]): void;
  
  /**
   * Set user email address
   * @param email User's email
   * @example webengage.user.setEmail('user@example.com')
   */
  setEmail(email: string): void;
  
  /**
   * Set hashed user email
   * @param email Hashed email address
   */
  setHashedEmail(email: string): void;
  
  /**
   * Set user phone number
   * @param phone User's phone number
   * @example webengage.user.setPhone('+1234567890')
   */
  setPhone(phone: string): void;
  
  /**
   * Set hashed user phone
   * @param phone Hashed phone number
   */
  setHashedPhone(phone: string): void;
  
  /**
   * Set user birth date
   * @param date Birth date in ISO format
   * @example webengage.user.setBirthDateString('1990-01-15T00:00:00.000Z')
   */
  setBirthDateString(date: string): void;
  
  /**
   * Set user gender
   * @param gender User's gender
   * @example webengage.user.setGender('male')
   */
  setGender(gender: string): void;
  
  /**
   * Set user first name
   * @param name User's first name
   * @example webengage.user.setFirstName('John')
   */
  setFirstName(name: string): void;
  
  /**
   * Set user location
   * @param lat Latitude (-90 to 90)
   * @param lng Longitude (-180 to 180)
   * @example webengage.user.setLocation(37.7749, -122.4194)
   */
  setLocation(lat: number, lng: number): void;
  
  /**
   * Set user last name
   * @param name User's last name
   * @example webengage.user.setLastName('Doe')
   */
  setLastName(name: string): void;
  
  /**
   * Set user company
   * @param name Company name
   * @example webengage.user.setCompany('WebEngage Inc.')
   */
  setCompany(name: string): void;
  
  /**
   * Set push notification opt-in status
   * @param status Push notification preference
   * @example webengage.user.setDevicePushOptIn(true)
   */
  setDevicePushOptIn(status: boolean): void;
  
  /**
   * Set channel opt-in status
   * @param channel Communication channel ('push', 'email', 'sms', 'in_app')
   * @param status Opt-in preference
   * @example webengage.user.setOptIn('email', true)
   */
  setOptIn(channel: string, status: boolean): void;
  
  /**
   * Set callback for anonymous ID changes
   * @param callback Function called when anonymous ID changes
   * @example webengage.user.onAnonymousIdChanged((id) => console.log('New ID:', id))
   */
  onAnonymousIdChanged(
    callback: (anonymousId: string) => void
  ): any;
}

/**
 * In-app notification channel for handling in-app messages
 */
declare class WebEngageNotificationChannel {
  /**
   * Set notification options
   * @param key Option key
   * @param value Option value
   */
  options(key: string, value: any): void;
  
  /**
   * Set callback for notification preparation
   * @param callback Function called when notification is prepared
   * @example webengage.notification.onPrepare((data) => console.log('Prepared:', data))
   */
  onPrepare(callback: (data: any) => void): any;
  
  /**
   * Set callback for notification shown
   * @param callback Function called when notification is shown
   * @example webengage.notification.onShown((data) => console.log('Shown:', data))
   */
  onShown(callback: (data: any) => void): any;
  
  /**
   * Set callback for notification click
   * @param callback Function called when notification is clicked
   * @example webengage.notification.onClick((data, actionId) => console.log('Clicked:', data))
   */
  onClick(callback: (data: any, actionId: string) => void): any;
  
  /**
   * Set callback for notification dismissal
   * @param callback Function called when notification is dismissed
   * @example webengage.notification.onDismiss((data) => console.log('Dismissed:', data))
   */
  onDismiss(callback: (data: any) => void): any;
  
  /**
   * Handle notification callback
   * @param type Callback type
   * @param notificationData Notification data
   * @param actionId Action identifier
   */
  onCallbackReceived(
    type: string,
    notificationData: any,
    actionId: string
  ): void;
}

/**
 * Main WebEngage plugin class
 * @example
 * import WebEngage from 'react-native-webengage';
 * const webengage = new WebEngage();
 * webengage.initialize();
 */
declare class WebEngagePlugin {
  /** Push notification channel */
  push: WebEngagePushChannel;
  /** In-app notification channel */
  notification: WebEngageNotificationChannel;
  /** User management channel */
  user: WebEngageUserChannel;
  /** Universal link channel */
  universalLink: WebEngageUniversalLinkChannel;
  /** Push click listener reference */
  pushClickListener: any;
  /** Token invalidate listener reference */
  tokenInvalidateLister: any;
  /** Universal click listener reference */
  universalClickListener: any;
  /** In-app click listener reference */
  inAppClickListener: any;
  /** In-app dismissed listener reference */
  inAppDismissedListener: any;
  /** In-app prepared listener reference */
  inAppPreparedListener: any;
  /** In-app shown listener reference */
  inAppShownListener: any;
  /** Plugin options */
  _options: Record<string, any>;

  /**
   * Initialize WebEngage SDK
   * @description Must be called before using any other WebEngage methods
   * @example webengage.initialize()
   */
  initialize(): void;
  
  /**
   * Track custom event with optional attributes
   * @param eventName Name of the event to track
   * @param attributes Optional event attributes
   * @example webengage.track('Product Viewed', { productId: '123', price: 99.99 })
   */
  track(eventName: string, attributes?: Record<string, any>): void;
  
  /**
   * Track screen navigation with optional data
   * @param name Screen name to track
   * @param data Optional screen data
   * @example webengage.screen('Home Screen', { section: 'main' })
   */
  screen(name: string, data?: Record<string, any>): void;
  
  /**
   * Start Google Advertising ID tracking (Android only)
   * @description Enables GAID tracking for better attribution
   * @example webengage.startGAIDTracking()
   */
  startGAIDTracking(): void;
}

export default WebEngagePlugin;