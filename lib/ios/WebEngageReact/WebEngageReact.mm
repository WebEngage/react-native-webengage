#import "WebEngageReact.h"

#import <React/RCTLog.h>
#import <WebEngage/WebEngage.h>
#import <WebEngage/WEGAnalytics.h>
//#import <WebEngage/WEGJWTManager.h>
#import <React/RCTBundleURLProvider.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <WebEngageReactSpec/WebEngageReactSpec.h>
#endif

static NSDateFormatter *dateFormatter;
NSString * const DATE_FORMAT = @"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
int const DATE_FORMAT_LENGTH = 24;
NSString *WEGPluginVersion = @"1.6.2";
bool weHasListeners = NO;

// Event Constants
static NSString *const kWENotificationPrepared = @"notificationPrepared";
static NSString *const kWENotificationShown = @"notificationShown";
static NSString *const kWENotificationClicked = @"notificationClicked";
static NSString *const kWENotificationDismissed = @"notificationDismissed";
static NSString *const kWEPushNotificationClicked = @"pushNotificationClicked";
static NSString *const kWEUniversalLinkClicked = @"universalLinkClicked";
static NSString *const kWETokenInvalidated = @"tokenInvalidated";
static NSString *const kWEOnAnonymousIdChanged = @"onAnonymousIdChanged";
static NSString *const kWEProfileDidInitialize = @"WebEngageProfileDidInitialize";
static NSString *const kWEPushNotificationShown = @"pushNotificationShown";
static NSString *const kWEPushNotificationDismissed = @"pushNotificationDismissed";

@interface WebEngageReactPendingEvent : NSObject
@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) id body;
- (instancetype)initWithName:(NSString *)name body:(id)body;
@end

// TODO - review with Milind
@implementation WebEngageReactPendingEvent
- (instancetype)initWithName:(NSString *)name body:(id)body {
    self = [super init];
    if (self) {
        _name = name;
        _body = body;
    }
    return self;
}
@end

@interface WebEngageReact() <WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
@property WebEngage *webEngageInstance;
@property (nonatomic, strong) NSString *launchDeepLink;
//@property NSMutableDictionary *pendingEventsDict;
//@property dispatch_queue_t serialQueue;
@end

@implementation WebEngageReact

@synthesize webEngageInstance = _webEngageInstance;

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
    return NO;
}



- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

// initilizeWebEngage() -> 

# pragma mark - Launch

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self initialiseWEGVersion];
        self.serialQueue = dispatch_queue_create("com.reactNativeWebEngage.serialqueue", DISPATCH_QUEUE_SERIAL);
        // [self setDelegates]; // TODO - check what this does
    }
    return self;
}

// TODO - this is copied from CT might not be useful
+ (instancetype)sharedInstance {
    static WebEngageReact *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[WebEngageReact alloc] init];
    });
    return sharedInstance;
}

- (void)initialiseWEGVersion {
    WegVersionKey key = WegVersionKeyRN;
    [[WebEngage sharedInstance] setVersionForChildSDK:WEGPluginVersion forKey:key];
}

- (WebEngage *)webEngageInstance {
    if (_webEngageInstance != nil) {
        return _webEngageInstance;
    }
    return [WebEngage sharedInstance];
}

- (void)setWebEngageInstance:(WebEngage *)instance {
    _webEngageInstance = instance;
}

RCT_EXPORT_METHOD(init:(BOOL)autoRegister) {
    RCTLogInfo(@"[WebEngage init: %i]", autoRegister);
    // WebEngage initialization is typically done in AppDelegate
    // [self setDelegates];
}

// TODO - copied from CT - check if needed!
// - (void)setDelegates {
//     RCTLogInfo(@"[WebEngageReact setDelegates]");
    // WebEngage *instance = [self webEngageInstance];
    // instance.pushNotificationDelegate = self;
    
//    [WEGJWTManager shared].tokenInvalidatedCallback = ^{
//        RCTLogInfo(@"WebEngageReact: JWT Token is Invalid. Please send valid");
//        NSDictionary *data = @{
//            @"error": @{
//                @"response": @{
//                    @"status": @"UID_MISMATCH",
//                    @"message": @"Invalid JWT token passed"
//                }
//            }
//        };
//        if(weHasListeners) {
//            [self sendEventWithName:kWETokenInvalidated body:data];
//        } else {
//            if (self.pendingEventsDict == nil) {
//                self.pendingEventsDict = [NSMutableDictionary dictionary];
//            }
//            self.pendingEventsDict[kWETokenInvalidated] = data;
//        }
//    };
// }

RCT_EXPORT_METHOD(trackEventWithName:(NSString*)eventName) {
    RCTLogInfo(@"[WebEngage trackEventWithName: %@]", eventName);
    [[[self webEngageInstance] analytics] trackEventWithName:eventName];
}

RCT_EXPORT_METHOD(trackEventWithNameAndData:(NSString*)eventName eventData:(NSDictionary*)eventData) {
    RCTLogInfo(@"[WebEngage trackEventWithNameAndData: %@ data: %@]", eventName, eventData);
    NSMutableDictionary *mutableDict = [eventData mutableCopy];
    [[[self webEngageInstance] analytics] trackEventWithName:eventName andValue:[self setDatesInDictionary:mutableDict]];
}

RCT_EXPORT_METHOD(screenNavigated:(NSString*)screenName) {
    RCTLogInfo(@"[WebEngage screenNavigated: %@]", screenName);
    [[[self webEngageInstance] analytics] navigatingToScreenWithName:screenName];
}

RCT_EXPORT_METHOD(screenNavigatedWithData:(NSString*)screenName screenData:(NSDictionary*)screenData) {
    RCTLogInfo(@"[WebEngage screenNavigatedWithData: %@ data: %@]", screenName, screenData);
    if (screenData) {
        NSMutableDictionary *mutableDict = [screenData mutableCopy];
        [[[self webEngageInstance] analytics] navigatingToScreenWithName:screenName andData:[self setDatesInDictionary:mutableDict]];
    }
}

RCT_EXPORT_METHOD(login:(NSString*)userId) {
    RCTLogInfo(@"[WebEngage login: %@]", userId);
    [[[self webEngageInstance] user] login:userId];
}

RCT_EXPORT_METHOD(loginWithSecureToken:(NSString*)userId jwtToken:(NSString*)jwtToken) {
    RCTLogInfo(@"[WebEngage loginWithSecureToken: %@]", userId);
    [[[self webEngageInstance] user] login:userId jwtToken:jwtToken];
}

RCT_EXPORT_METHOD(setSecureToken:(NSString*)userId secureToken:(NSString*)secureToken) {
    RCTLogInfo(@"[WebEngage setSecureToken: %@]", userId);
    [[[self webEngageInstance] user] setSecureToken:userId jwtToken:secureToken];
}

RCT_EXPORT_METHOD(logout) {
    RCTLogInfo(@"[WebEngage logout]");
    [[[self webEngageInstance] user] logout];
}

// TODO - change of signature for Android and iOS
RCT_EXPORT_METHOD(setAttribute:(NSString*)key value:(id)value) {
    RCTLogInfo(@"[WebEngage setAttribute: %@ = %@]", key, value);
    [self setAttributeForKey:key value:value];
}

// RCT_EXPORT_METHOD(setAttribute:(NSDictionary*)attributes) {
//     RCTLogInfo(@"[WebEngage setAttribute: %@]", attributes);
//     for (NSString *key in attributes) {
//         id value = attributes[key];
//         [self setAttributeForKey:key value:value];
//     }
// }

- (void)setAttributeForKey:(NSString*)attributeName value:(id)value {
    if ([value isKindOfClass:[NSString class]]) {
        if ([value length] == DATE_FORMAT_LENGTH) {
            NSDate *date = [self getDate:value];
            if (date != nil) {
                [[[self webEngageInstance] user] setAttribute:attributeName withDateValue:date];
            } else {
                [[[self webEngageInstance] user] setAttribute:attributeName withStringValue:value];
            }
        } else {
            [[[self webEngageInstance] user] setAttribute:attributeName withStringValue:value];
        }
    }
    else if ([value isKindOfClass:[NSNumber class]]) {
        [[[self webEngageInstance] user] setAttribute:attributeName withValue:value];
    }
    else if ([value isKindOfClass:[NSArray class]]) {
        [[[self webEngageInstance] user] setAttribute:attributeName withArrayValue:value];
    }
    else if ([value isKindOfClass:[NSDictionary class]]) {
        [[[self webEngageInstance] user] setAttribute:attributeName withDictionaryValue:value];
    }
    else if ([value isKindOfClass:[NSDate class]]) {
        [[[self webEngageInstance] user] setAttribute:attributeName withDateValue:value];
    }
}

RCT_EXPORT_METHOD(deleteAttribute:(NSString*)attributeName) {
    RCTLogInfo(@"[WebEngage deleteAttribute: %@]", attributeName);
    [[[self webEngageInstance] user] deleteAttribute:attributeName];
}

RCT_EXPORT_METHOD(deleteAttributes:(NSArray*)attributeNames) {
    RCTLogInfo(@"[WebEngage deleteAttributes: %@]", attributeNames);
    [[[self webEngageInstance] user] deleteAttributes:attributeNames];
}

RCT_EXPORT_METHOD(setEmail:(NSString*)email) {
    RCTLogInfo(@"[WebEngage setEmail: %@]", email);
    [[[self webEngageInstance] user] setEmail:email];
}

RCT_EXPORT_METHOD(setHashedEmail:(NSString*)hashedEmail) {
    RCTLogInfo(@"[WebEngage setHashedEmail]");
    [[[self webEngageInstance] user] setHashedEmail:hashedEmail];
}

RCT_EXPORT_METHOD(setPhone:(NSString*)phone) {
    RCTLogInfo(@"[WebEngage setPhone: %@]", phone);
    [[[self webEngageInstance] user] setPhone:phone];
}

RCT_EXPORT_METHOD(setHashedPhone:(NSString*)hashedPhone) {
    RCTLogInfo(@"[WebEngage setHashedPhone]");
    [[[self webEngageInstance] user] setHashedPhone:hashedPhone];
}

RCT_EXPORT_METHOD(setBirthDateString:(NSString*)birthDate) {
    RCTLogInfo(@"[WebEngage setBirthDateString: %@]", birthDate);
    [[[self webEngageInstance] user] setBirthDateString:birthDate];
}

RCT_EXPORT_METHOD(setGender:(NSString*)gender) {
    RCTLogInfo(@"[WebEngage setGender: %@]", gender);
    [[[self webEngageInstance] user] setGender:gender];
}

RCT_EXPORT_METHOD(setFirstName:(NSString*)firstName) {
    RCTLogInfo(@"[WebEngage setFirstName: %@]", firstName);
    [[[self webEngageInstance] user] setFirstName:firstName];
}

RCT_EXPORT_METHOD(setLastName:(NSString*)lastName) {
    RCTLogInfo(@"[WebEngage setLastName: %@]", lastName);
    [[[self webEngageInstance] user] setLastName:lastName];
}

RCT_EXPORT_METHOD(setCompany:(NSString*)company) {
    RCTLogInfo(@"[WebEngage setCompany: %@]", company);
    [[[self webEngageInstance] user] setCompany:company];
}

RCT_EXPORT_METHOD(setLocation:(double)latitude longitude:(double)longitude) {
    RCTLogInfo(@"[WebEngage setLocation: %f %f]", latitude, longitude);
    [[[self webEngageInstance] user] setUserLocationWithLatitude:@(latitude) andLongitude:@(longitude)];
}

RCT_EXPORT_METHOD(setDevicePushOptIn:(BOOL)optIn) {
    RCTLogInfo(@"[WebEngage setDevicePushOptIn: %i]", optIn);
    // iOS specific implementation if needed
}

RCT_EXPORT_METHOD(setOptIn:(NSString*)channel optIn:(BOOL)optIn) {
    RCTLogInfo(@"[WebEngage setOptIn: %@ optIn: %i]", channel, optIn);
    NSLocale *locale = [NSLocale localeWithLocaleIdentifier:@"en_US"];
    NSString *ch = [channel lowercaseStringWithLocale:locale];
    if ([ch isEqualToString:@"push"]) {
        [[[self webEngageInstance] user] setOptInStatusForChannel:WEGEngagementChannelPush status:optIn];
    } else if ([ch isEqualToString:@"sms"]) {
        [[[self webEngageInstance] user] setOptInStatusForChannel:WEGEngagementChannelSMS status:optIn];
    } else if ([ch isEqualToString:@"email"]) {
        [[[self webEngageInstance] user] setOptInStatusForChannel:WEGEngagementChannelEmail status:optIn];
    } else if ([ch isEqualToString:@"in_app"]) {
        [[[self webEngageInstance] user] setOptInStatusForChannel:WEGEngagementChannelInApp status:optIn];
    } else if ([ch isEqualToString:@"whatsapp"]) {
        [[[self webEngageInstance] user] setOptInStatusForChannel:WEGEngagementChannelWhatsapp status:optIn];
    } else if ([ch isEqualToString:@"viber"]) {
        [[[self webEngageInstance] user] setOptInStatusForChannel:WEGEngagementChannelViber status:optIn];
    } else {
        RCTLogWarn(@"WebEngage: Invalid channel: %@. Must be one of [push, sms, email, in_app, whatsapp, viber].", ch);
    }
}



RCT_EXPORT_METHOD(sendFcmToken:(NSString*)token) {
    // No-op on iOS - FCM tokens handled differently
    RCTLogInfo(@"[WebEngage sendFcmToken is no-op in iOS]");
}

RCT_EXPORT_METHOD(onMessageReceived:(NSDictionary*)remoteMessage) {
    // No-op on iOS - message handling done through delegates
    RCTLogInfo(@"[WebEngage onMessageReceived is no-op in iOS]");
}

RCT_EXPORT_METHOD(startGAIDTracking) {
    // No-op on iOS - GAID is Android-specific
    RCTLogInfo(@"[WebEngage startGAIDTracking is no-op in iOS]");
}

RCT_EXPORT_METHOD(updateListenerCount) {
    // No-op on iOS - listener count managed automatically
    RCTLogInfo(@"[WebEngage updateListenerCount is no-op in iOS]");
}

#pragma mark - Private/Helpers

- (NSDate *)getDate:(NSString *)strValue {
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:DATE_FORMAT];
    [dateFormatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    NSDate *date = [dateFormatter dateFromString:strValue];
    return date;
}

- (NSDictionary *)setDatesInDictionary:(NSMutableDictionary *)mutableDict {
    NSArray *keys = [mutableDict allKeys];
    for (id key in keys) {
        id value = mutableDict[key];
        if ([value isKindOfClass:[NSString class]] && [value length] == DATE_FORMAT_LENGTH) {
            NSDate *date = [self getDate:value];
            if (date != nil) {
                mutableDict[key] = date;
            }
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary *nestedDict = [value mutableCopy];
            mutableDict[key] = [self setDatesInDictionary:nestedDict];
        } else if ([value isKindOfClass:[NSArray class]]) {
            NSMutableArray *nestedArr = [value mutableCopy];
            mutableDict[key] = [self setDatesInArray:nestedArr];
        }
    }
    return mutableDict;
}

- (NSArray *)setDatesInArray:(NSMutableArray *)mutableArr {
    for (int i = 0; i < [mutableArr count]; i++) {
        id value = mutableArr[i];
        if ([value isKindOfClass:[NSString class]] && [value length] == DATE_FORMAT_LENGTH) {
            NSDate *date = [self getDate:value];
            if (date != nil) {
                mutableArr[i] = date;
            }
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary *nestedDict = [value mutableCopy];
            mutableArr[i] = [self setDatesInDictionary:nestedDict];
        } else if ([value isKindOfClass:[NSArray class]]) {
            NSMutableArray *nestedArr = [value mutableCopy];
            mutableArr[i] = [self setDatesInArray:nestedArr];
        }
    }
    return mutableArr;
}

# pragma mark - Event emitter

/// A collection of events sent before ReactNative has started observing events.
static NSMutableDictionary<NSString *, NSMutableArray<WebEngageReactPendingEvent *> *> *pendingEvents = [NSMutableDictionary dictionary];

/// Indicates if ``startObserving`` has been called which means a listener/observer has been added.
static BOOL isObserving;

/// A set of event names that a listener/observer has been added for.
static NSMutableSet<NSString *> *observedEvents = [NSMutableSet set];

/// A set of event names that needs to be observed since they can be sent before ReactNative has started observing events.
static NSMutableSet<NSString *> *observableEvents = [NSMutableSet setWithObjects:
                                                     kWEProfileDidInitialize,
                                                     kWENotificationPrepared,
                                                     kWENotificationShown,
                                                     kWENotificationClicked,
                                                     kWENotificationDismissed,
                                                     kWEPushNotificationShown,
                                                     kWEPushNotificationClicked,
                                                     kWEPushNotificationDismissed,
                                                     kWEUniversalLinkClicked,
                                                     kWETokenInvalidated,
                                                     kWEOnAnonymousIdChanged, nil];

/// Time out in seconds, after which pending events are cleared.
/// See ``startObserving`` for details.
const int PENDING_EVENTS_TIME_OUT = 5;

/// Called when a observer/listener is added for the event.
/// Post the pending events for the event name.
///
/// @param name The name of the observed event.
RCT_EXPORT_METHOD(onEventListenerAdded:(NSString*)name) {
    [observedEvents addObject:name];
    NSArray *pendingEventsForName = pendingEvents[name];
    if (pendingEventsForName) {
        RCTLogInfo(@"[WebEngage: Posting pending events for event: %@]", name);
        // for (WebEngageReactPendingEvent *event in pendingEventsForName) {
        //     RCTLogInfo(@"[WebEngage: posting pending event: %@ with body: %@]", event.name, event.body);
        //     [[NSNotificationCenter defaultCenter] postNotificationName:event.name object:nil userInfo:event.body];
        // }
    }
}

/// Send event when ReactNative has started observing events.
/// This happens when the first observer/listener is added in ReactNative.
/// If events are sent before that, the events are queued.
/// Events expected to be queued are specified in ``observableEvents``.
/// If ReactNative has started observing and the event is observed, see ``observedEvents``, the events are emitted directly.
///
/// @param name The event name.
/// @param body The event body parameters.
+ (void)sendEventOnObserving:(NSString *)name body:(id)body {
    if (!isObserving && ![observableEvents containsObject:name]) {
        RCTLogWarn(@"[WebEngage: %@ is sent before observing and is not part of the observable events]", name);
        [observableEvents addObject:name];
    }
    
    if ([observableEvents containsObject:name] && ![observedEvents containsObject:name]) {
        if (!pendingEvents[name]) {
            pendingEvents[name] = [NSMutableArray array];
        }
        
        WebEngageReactPendingEvent *event = [[WebEngageReactPendingEvent alloc] initWithName:name body:body];
        [pendingEvents[name] addObject:event];
        return;
    }
    
    // [[NSNotificationCenter defaultCenter] postNotificationName:name object:nil userInfo:body];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[kWENotificationPrepared, kWENotificationShown, kWENotificationClicked, kWENotificationDismissed, kWEPushNotificationClicked, kWEUniversalLinkClicked, kWETokenInvalidated, kWEOnAnonymousIdChanged];
}

// TODO - verify with existing implementation
- (void)startObserving {
    RCTLogInfo(@"[WebEngage startObserving]");
    weHasListeners = YES;
    if (self.pendingEventsDict != nil) {
        for (id key in [self getObserversNonMutable]) {
            [self sendEventWithName:key body:self.pendingEventsDict[key]];
            [self.pendingEventsDict removeObjectForKey: key];
        }
    }
    
    NSArray *eventNames = [self supportedEvents];
    for (NSString *eventName in eventNames) {
        // [[NSNotificationCenter defaultCenter] addObserver:self
        //                                          selector:@selector(emitEventInternal:)
        //                                              name:eventName
        //                                            object:nil];
    }
    
    isObserving = YES;
    
    // Clear the pending events that no listeners were added for.
    // Clear the events after PENDING_EVENTS_TIME_OUT of when the first observer is added.
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(PENDING_EVENTS_TIME_OUT * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        RCTLogInfo(@"[WebEngage: Removing pending events which were not observed]");
        [WebEngageReact clearPendingEvents];
    });
}

// This code is for creation of singleton instance
//+ (instancetype)sharedInstance {
//    static WebEngageReact *sharedInstance = nil;
//    static dispatch_once_t onceToken;
//    dispatch_once(&onceToken, ^{
//        sharedInstance = [[WebEngageReact alloc] init];
//    });
//    return sharedInstance;
//}
// TODO while accessing this use below code
// WebEngageReact *webEngageInstance = [WebEngageReact sharedInstance];


// TODO - NSNotificationCenter is not used earlier check why is it being used?
- (void)stopObserving {
    weHasListeners = NO;
    // [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// TODO - existing code
#pragma mark: - Helper for serialization access for observers
- (NSDictionary *)getObserversNonMutable {
    __block NSDictionary *object;
    dispatch_sync(self.serialQueue, ^{
        object = [self.pendingEventsDict copy];
    });
    return object;
}

+ (void)clearPendingEvents {
    pendingEvents = [NSMutableDictionary dictionary];
    observableEvents = [NSMutableSet set];
    observedEvents = [NSMutableSet set];
}


- (void)emitEventInternal:(NSNotification *)notification {
    [self sendEventWithName:notification.name body:notification.userInfo];
}

#pragma mark - WEGInAppNotificationProtocol

- (void)notification:(NSMutableDictionary *)inAppNotificationData clickedWithAction:(NSString *)actionId {
    RCTLogInfo(@"in-app notification clicked with action %@", actionId);
    inAppNotificationData[@"clickId"] = actionId;
    NSArray *actions = [inAppNotificationData valueForKey:@"actions"];
    if (actions != nil) {
        for (id action in actions) {
            if (action != nil) {
                NSString *actionEId = [action valueForKey:@"actionEId"];
                if ([actionEId isEqualToString: actionId]) {
                    inAppNotificationData[@"deepLink"] = [action valueForKey:@"actionLink"];
                }
            }
        }
    }
    if(weHasListeners) {
        [self sendEventWithName:kWENotificationClicked body:inAppNotificationData];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWENotificationClicked] = inAppNotificationData;
    }
}

- (void)notificationDismissed:(NSMutableDictionary *)inAppNotificationData {
    if(weHasListeners) {
        RCTLogInfo(@"webengageBridge: in-app notification dismissed");
        [self sendEventWithName:kWENotificationDismissed body:inAppNotificationData];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWENotificationDismissed] = inAppNotificationData;
    }
}

- (NSMutableDictionary *)notificationPrepared:(NSMutableDictionary *)inAppNotificationData shouldStop:(BOOL *)stopRendering {
    if (weHasListeners) {
        [self sendEventWithName:kWENotificationPrepared body:inAppNotificationData];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWENotificationPrepared] = inAppNotificationData;
    }
    return inAppNotificationData;
}

- (void)notificationShown:(NSMutableDictionary *)inAppNotificationData {
    if (weHasListeners) {
        [self sendEventWithName:kWENotificationShown body:inAppNotificationData];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWENotificationShown] = inAppNotificationData;
    }
}

#pragma mark - WEGAppDelegate

-(void)WEGHandleDeeplink:(NSString *)deeplink userData:(NSDictionary *)data{
    RCTLogInfo(@"webengageBridge: push notification clicked with deeplink: %@", deeplink);
    NSDictionary *pushData = @{@"deeplink":deeplink, @"userData":data};
    if (weHasListeners) {
        [self sendEventWithName:kWEPushNotificationClicked body:pushData];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWEPushNotificationClicked] = pushData;
    }
}

- (void)sendUniversalLinkLocation:(NSString *)location{
    RCTLogInfo(@"webengageBridge: universal link clicked with location: %@", location);
    NSDictionary *data = @{@"location":location};
    if (weHasListeners) {
        [self sendEventWithName:kWEUniversalLinkClicked body:data];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWEUniversalLinkClicked] = data;
    }
}

- (void)didReceiveAnonymousID:(NSString *)anonymousID forReason:(WEGReason)reason {
    NSDictionary *data = @{@"anonymousID":anonymousID};
    if(weHasListeners) {
        [self sendEventWithName:kWEOnAnonymousIdChanged body:data];
    } else {
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        self.pendingEventsDict[kWEOnAnonymousIdChanged] = data;
    }
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge {
    WebEngageReact *webEngageReact = [WebEngageReact sharedInstance];
    webEngageReact.bridge = bridge;
    return @[webEngageReact];
}

# pragma mark - Turbo Module

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeWebEngageModuleSpecJSI>(params);
}
#endif

@end
