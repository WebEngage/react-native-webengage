#import "WEGWebEngageBridge.h"

#import <React/RCTLog.h>
#import <WebEngage/WebEngage.h>
#import <WebEngage/WEGAnalytics.h>
#import <React/RCTBundleURLProvider.h>
#import <WebEngage/WebEngage-Swift.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <WEGWebEngageBridgeSpec/WEGWebEngageBridgeSpec.h>
#endif

NSString * const DATE_FORMAT = @"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
int const DATE_FORMAT_LENGTH = 24;
static BOOL weHasListeners = NO;
NSString *WEGPluginVersion = @"2.1.0";

@implementation WEGWebEngageBridge

RCT_EXPORT_MODULE(WEGWebEngageBridge);
- (instancetype)init {
    if (self = [super init]) {
        self.serialQueue = dispatch_queue_create("com.reactNativeWebEngage.serialqueue", DISPATCH_QUEUE_SERIAL);
        [self initialiseWEGVersion];
    }
    return self;
}



+ (BOOL)requiresMainQueueSetup {
    return NO;
}

+ (id)allocWithZone:(NSZone *)zone {
    static WEGWebEngageBridge *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

- (void)initialiseWEGVersion {
    WegVersionKey key = WegVersionKeyRN;
    [[WebEngage sharedInstance] setVersionForChildSDK:WEGPluginVersion forKey:key];
}

- (void)queueEvent:(NSString *)eventName body:(id)body {
    dispatch_sync(self.serialQueue, ^{
        if (self.pendingEventsDict == nil) {
            self.pendingEventsDict = [NSMutableDictionary dictionary];
        }
        if (self.pendingEventsDict[eventName] == nil) {
            self.pendingEventsDict[eventName] = [NSMutableArray array];
        }
        [self.pendingEventsDict[eventName] addObject:body];
    });
}

- (void)sendOrQueueEvent:(NSString *)eventName body:(id)body {
    dispatch_sync(self.serialQueue, ^{
        if (weHasListeners) {
            [self sendEventWithName:eventName body:body];
        } else {
            if (self.pendingEventsDict == nil) {
                self.pendingEventsDict = [NSMutableDictionary dictionary];
            }
            if (self.pendingEventsDict[eventName] == nil) {
                self.pendingEventsDict[eventName] = [NSMutableArray array];
            }
            [self.pendingEventsDict[eventName] addObject:body];
        }
    });
}

- (NSDate *)getDate:(NSString *)strValue {
    NSDateFormatter * dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:DATE_FORMAT];
    [dateFormatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
    NSDate * date = [dateFormatter dateFromString:strValue];
    return date;
}

- (NSDictionary *)setDatesInDictionary:(NSMutableDictionary *)mutableDict {
    NSArray * keys = [mutableDict allKeys];
    for (id key in keys) {
        id value = mutableDict[key];
        if ([value isKindOfClass:[NSString class]] && [value length] == DATE_FORMAT_LENGTH) {
            NSDate * date = [self getDate:value];
            if (date != nil) {
                mutableDict[key] = date;
            }
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary * nestedDict = [value mutableCopy];
            mutableDict[key] = [self setDatesInDictionary:nestedDict];
        } else if ([value isKindOfClass:[NSArray class]]) {
            NSMutableArray * nestedArr = [value mutableCopy];
            mutableDict[key] = [self setDatesInArray:nestedArr];
        }
    }
    return mutableDict;
}

- (NSArray *)setDatesInArray:(NSMutableArray *)mutableArr {
    for (int i = 0; i < [mutableArr count]; i++) {
        id value = mutableArr[i];
        if ([value isKindOfClass:[NSString class]] && [value length] == DATE_FORMAT_LENGTH) {
            NSDate * date = [self getDate:value];
            if (date != nil) {
                mutableArr[i] = date;
            }
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary * nestedDict = [value mutableCopy];
            mutableArr[i] = [self setDatesInDictionary:nestedDict];
        } else if ([value isKindOfClass:[NSArray class]]) {
            NSMutableArray * nestedArr = [value mutableCopy];
            mutableArr[i] = [self setDatesInArray:nestedArr];
        }
    }
    return mutableArr;
}

RCT_EXPORT_METHOD(initializeWebEngage) {
   [WEGJWTManager shared].tokenInvalidatedCallback = ^{
       NSLog(@"webengageBridge: JWT Token is Invalid. Please send valid ");
       NSDictionary *data = @{
           @"error": @{
               @"response": @{
                   @"status": @"UID_MISMATCH",
                   @"message": @"Invalid JWT token passed"
               }
           }
       };
       [self sendOrQueueEvent:@"tokenInvalidated" body:data];
   };
}

RCT_EXPORT_METHOD(trackEventWithName:(NSString *)name){
    [[WebEngage sharedInstance].analytics trackEventWithName:name];
}

RCT_EXPORT_METHOD(trackEventWithNameAndData:(NSString *)name andValue:(NSDictionary *)value)
{
    NSMutableDictionary * mutableDict = [value mutableCopy];
    id<WEGAnalytics> weAnalytics = [WebEngage sharedInstance].analytics;
    [weAnalytics trackEventWithName:name andValue:[self setDatesInDictionary:mutableDict]];
}

RCT_EXPORT_METHOD(screenNavigated:(NSString *)screenName){
    [[WebEngage sharedInstance].analytics navigatingToScreenWithName:screenName];
}

RCT_EXPORT_METHOD(screenNavigatedWithData:(NSString*) screenName andData: (NSDictionary*) userData){
    if (userData) {
        NSMutableDictionary * mutableDict = [userData mutableCopy];
        [[WebEngage sharedInstance].analytics navigatingToScreenWithName:screenName andData:[self setDatesInDictionary:mutableDict]];
    }
}

RCT_EXPORT_METHOD(setLocation:(nonnull NSNumber *)latitude andLongitude:(nonnull NSNumber *)longitude) {
    [[WebEngage sharedInstance].user setUserLocationWithLatitude:latitude andLongitude:longitude];
}

RCT_EXPORT_METHOD(loginWithSecureToken:(NSString*)userId secureToken:(NSString*)secureToken){
    [[WebEngage sharedInstance].user login:userId jwtToken:secureToken];
}

RCT_EXPORT_METHOD(login:(NSString*)userIdentifier){
    [[WebEngage sharedInstance].user login:userIdentifier];
}

RCT_EXPORT_METHOD(setSecureToken:(NSString*)userId secureToken:(NSString*)secureToken){
    [[WebEngage sharedInstance].user setSecureToken:userId jwtToken:secureToken];
}

RCT_EXPORT_METHOD(setAndroidAttribute:(NSDictionary*)attributes){
    // Not used in iOS - Android only method
}

RCT_EXPORT_METHOD(setIosAttribute:(NSString*)attributeName value:(id)value){
    if ([value isKindOfClass:[NSString class]]) {
        if ([value length] == DATE_FORMAT_LENGTH) {
            NSDate * date = [self getDate:value];
            if (date != nil) {
                [[WebEngage sharedInstance].user setAttribute:attributeName withDateValue:date];
            } else {
                [[WebEngage sharedInstance].user setAttribute:attributeName withStringValue:value];
            }
        } else {
            [[WebEngage sharedInstance].user setAttribute:attributeName withStringValue:value];
        }
    }
    else if ([value isKindOfClass:[NSNumber class]]) {
        [[WebEngage sharedInstance].user setAttribute:attributeName withValue:value];
    }
    else if ([value isKindOfClass:[NSArray class]]) {
        [[WebEngage sharedInstance].user setAttribute:attributeName withArrayValue:value];
    }
    else if ([value isKindOfClass:[NSDictionary class]]) {
        [[WebEngage sharedInstance].user setAttribute:attributeName withDictionaryValue:value];
    }
    else if ([value isKindOfClass:[NSDate class]]) {
        [[WebEngage sharedInstance].user setAttribute:attributeName withDateValue:value];
    }
}

RCT_EXPORT_METHOD(deleteAttribute:(NSString*)attributeName){
    [[WebEngage sharedInstance].user deleteAttribute:attributeName];
}

RCT_EXPORT_METHOD(deleteAttributes:(NSArray*)attributes){
    [[WebEngage sharedInstance].user deleteAttributes:attributes];
}

RCT_EXPORT_METHOD(setEmail:(NSString*)email){
    [[WebEngage sharedInstance].user setEmail:email];
}

RCT_EXPORT_METHOD(setHashedEmail:(NSString*)hashedEmail){
    [[WebEngage sharedInstance].user setHashedEmail:hashedEmail];
}

RCT_EXPORT_METHOD(setPhone: (NSString*) phone){
    [[WebEngage sharedInstance].user setPhone:phone];
}

RCT_EXPORT_METHOD(setHashedPhone:(NSString*)hashedPhone){
    [[WebEngage sharedInstance].user setHashedPhone:hashedPhone];
}

RCT_EXPORT_METHOD(setBirthDateString:(NSString*) dobString){
    [[WebEngage sharedInstance].user setBirthDateString:dobString];
}

RCT_EXPORT_METHOD(setGender:(NSString*)gender){
    [[WebEngage sharedInstance].user setGender:gender];
}

RCT_EXPORT_METHOD(setFirstName:(NSString*)name){
    [[WebEngage sharedInstance].user setFirstName:name];
}

RCT_EXPORT_METHOD(setLastName:(NSString*)name){
    [[WebEngage sharedInstance].user setLastName:name];
}

RCT_EXPORT_METHOD(setCompany:(NSString*)company){
    [[WebEngage sharedInstance].user setCompany:company];
}

RCT_EXPORT_METHOD(sendFcmToken:(NSString*)fcmToken){
    // This is only available for Android
}

RCT_EXPORT_METHOD(onMessageReceived:(NSDictionary *)readableMap){
    // This is only available for Android
}

RCT_EXPORT_METHOD(updateListenerCount){
    // This is only available for Android
}


- (void)autoRegister:(UIApplication *)application launchOptions:(NSDictionary *)launchOptions {
    [self initializeWebEngage];
    // Initializes Push with WebEngage Bridge
    [WebEngage sharedInstance].pushNotificationDelegate = self;
    // Initializes InApp with WebEngage Bridge
    [[WebEngage sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions notificationDelegate:self];
}

RCT_EXPORT_METHOD(setDevicePushOptIn:(BOOL)optIn) {
    [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelPush status:optIn];
}

RCT_EXPORT_METHOD(startGAIDTracking) {
    // Android only - GAID tracking
}

RCT_EXPORT_METHOD(addListener:(NSString *)eventType) {
    [super addListener:eventType];
}

RCT_EXPORT_METHOD(removeListeners:(double)count) {
    [super removeListeners:count];
}

RCT_EXPORT_METHOD(setOptIn:(NSString*)channel status:(BOOL)status) {
    NSLocale* locale = [NSLocale localeWithLocaleIdentifier:@"en_US"];
    NSString* ch = [channel lowercaseStringWithLocale:locale];
    if ([ch isEqualToString:@"push"]) {
        [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelPush status:status];
    } else if ([ch isEqualToString:@"sms"]) {
        [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelSMS status:status];
    } else if ([ch isEqualToString:@"email"]) {
        [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelEmail status:status];
    } else if ([ch isEqualToString:@"in_app"]) {
        [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelInApp status:status];
    } else if ([ch isEqualToString:@"whatsapp"]) {
        [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelWhatsapp status:status];
    } else if ([ch isEqualToString:@"viber"]) {
        [[WebEngage sharedInstance].user setOptInStatusForChannel:WEGEngagementChannelViber status:status];
    } else {
        NSLog(@"WebEngage: Invalid channel: %@. Must be one of [push, sms, email, in_app, whatsapp, viber].", ch);
    }
}

RCT_EXPORT_METHOD(logout){
    [[WebEngage sharedInstance].user logout];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"notificationPrepared", @"notificationShown", @"notificationClicked", @"notificationDismissed", @"pushNotificationClicked",@"universalLinkClicked", @"tokenInvalidated",@"onAnonymousIdChanged"];
}

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
    [self sendOrQueueEvent:@"notificationClicked" body:inAppNotificationData];
}

- (void)notificationDismissed:(NSMutableDictionary *)inAppNotificationData {
    [self sendOrQueueEvent:@"notificationDismissed" body:inAppNotificationData];
}

- (NSMutableDictionary *)notificationPrepared:(NSMutableDictionary *)inAppNotificationData shouldStop:(BOOL *)stopRendering {
    [self sendOrQueueEvent:@"notificationPrepared" body:inAppNotificationData];
    return inAppNotificationData;
}

- (void)notificationShown:(NSMutableDictionary *)inAppNotificationData {
    [self sendOrQueueEvent:@"notificationShown" body:inAppNotificationData];
}

-(void)WEGHandleDeeplink:(NSString *)deeplink userData:(NSDictionary *)data{
    RCTLogInfo(@"webengageBridge: push notification clicked with deeplink: %@", deeplink);
    NSDictionary *pushData = @{@"deeplink":deeplink, @"userData":data};
    [self sendOrQueueEvent:@"pushNotificationClicked" body:pushData];
}

- (void)sendUniversalLinkLocation:(NSString *)location{
    RCTLogInfo(@"webengageBridge: universal link clicked with location: %@", location);
    NSDictionary *data = @{@"location":location};
    [self sendOrQueueEvent:@"universalLinkClicked" body:data];
}

- (void)didReceiveAnonymousID:(NSString *)anonymousID forReason:(WEGReason)reason {
    NSDictionary *data = @{@"anonymousID":anonymousID};
    [self sendOrQueueEvent:@"onAnonymousIdChanged" body:data];
}


// Will be called when this module's first listener is added.
- (void)startObserving {
    __block NSDictionary *snapshot = nil;
    dispatch_sync(self.serialQueue, ^{
        weHasListeners = YES;
        if (self.pendingEventsDict != nil && self.pendingEventsDict.count > 0) {
            snapshot = [self.pendingEventsDict copy];
            [self.pendingEventsDict removeAllObjects];
        }
    });
    if (snapshot) {
        for (NSString *key in snapshot) {
            for (id event in snapshot[key]) {
                [self sendEventWithName:key body:event];
            }
        }
    }
}

- (void)stopObserving {
    dispatch_sync(self.serialQueue, ^{
        weHasListeners = NO;
    });
}

# pragma mark - Turbo Module

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeWebEngageModuleSpecJSI>(params);
}
#endif

@end