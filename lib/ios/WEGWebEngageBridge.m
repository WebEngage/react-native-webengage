//
//  webengageBridge.m
//  testReact1
//
//  Created by Uzma Sayyed on 10/16/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "WEGWebEngageBridge.h"
#import <React/RCTLog.h>
#import <WebEngage/WebEngage.h>
#import <WebEngage/WEGAnalytics.h>
@import UserNotifications;

@implementation WEGWebEngageBridge
RCT_EXPORT_MODULE(webengageBridge);

RCT_EXPORT_METHOD(init:(BOOL)autoRegister) {
    
    UNUserNotificationCenter* center = [UNUserNotificationCenter  currentNotificationCenter];
    center.delegate = self;
    [[WebEngage sharedInstance] application:[UIApplication sharedApplication] didFinishLaunchingWithOptions:@{} notificationDelegate:self autoRegister:YES];
}

RCT_EXPORT_METHOD(trackEventWithName:(NSString *)name){
    [[WebEngage sharedInstance].analytics trackEventWithName:name];
}

RCT_EXPORT_METHOD(trackEventWithNameAndData:(NSString *)name andValue:(NSDictionary *)value)
{
    id<WEGAnalytics> weAnalytics = [WebEngage sharedInstance].analytics;
    [weAnalytics trackEventWithName:name andValue:value];
}


RCT_EXPORT_METHOD(screenNavigated:(NSString *)screenName){
    [[WebEngage sharedInstance].analytics navigatingToScreenWithName:screenName];
}

RCT_EXPORT_METHOD(screenNavigatedWithData:(NSString*) screenName andData: (NSDictionary*) userData){
    if (userData) {
        [[WebEngage sharedInstance].analytics navigatingToScreenWithName:screenName andData:userData];
    }
}

RCT_EXPORT_METHOD(login:(NSString*)userIdentifier){
    [[WebEngage sharedInstance].user login:userIdentifier];
}

RCT_EXPORT_METHOD(setAttribute:(NSString*)attributeName value:(id)value){
    if ([value isKindOfClass:[NSString class]]) {
        [[WebEngage sharedInstance].user setAttribute:attributeName withStringValue:value];
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

RCT_EXPORT_METHOD(logout){
    [[WebEngage sharedInstance].user logout];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"notificationPrepared",@"notificationShown",@"notificationClicked",@"notificationDismissed",@"pushNotificationClicked"];
}

- (void)notification:(NSMutableDictionary *)inAppNotificationData clickedWithAction:(NSString *)actionId {
    [self sendEventWithName:@"notificationClicked" body:inAppNotificationData];
}

- (void)notificationDismissed:(NSMutableDictionary *)inAppNotificationData {
    [self sendEventWithName:@"notificationDismissed" body:inAppNotificationData];
}

- (NSMutableDictionary *)notificationPrepared:(NSMutableDictionary *)inAppNotificationData shouldStop:(BOOL *)stopRendering {
    [self sendEventWithName:@"notificationPrepared" body:inAppNotificationData];
    return inAppNotificationData;
}

- (void)notificationShown:(NSMutableDictionary *)inAppNotificationData {
    [self sendEventWithName:@"notificationShown" body:inAppNotificationData];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
  [self sendEventWithName:@"pushNotificationClicked" body:response.notification.request.content.userInfo];
}

@end

