//
//  WebEngage.h
//
//  Created by Saumitra R. Bhave on 15/06/15.
//  Copyright (c) 2015 Webklipper Technologies Pvt Ltd. All rights reserved.
//
#import <UIKit/UIKit.h>
#import "WEGAnalytics.h"
#import "WEGUser.h"
#import "WEGInAppNotificationProtocol.h"
#import "WEGAppDelegate.h"

FOUNDATION_EXPORT double WebEngageVersionNumber;

FOUNDATION_EXPORT const unsigned char WebEngageVersionString[];

/**
 *  @interface WebEngage
 *  This is an umbrella header for WebEngage SDK. This facade will provide the app with all the features of WebEngage.
 */
@interface WebEngage : NSObject
/**
 *  Get an instance of WEGAnalytics which provide different APIs for event tracking and analytics.
 *  
 *  @warning : Application must initialize the SDK first by calling application:didFinishLaunchingWithOptions: or one of its overloads before accessing this property.
 */
@property (readonly, nonatomic, strong) id<WEGAnalytics> analytics;
/**
 *  Get an instance of WEGUser which provide different APIs for user identification and user level attributes.
 *
 *  @warning : Application must initialize the SDK first by calling application:didFinishLaunchingWithOptions: or one
 *  of its overloads before accessing this property.
 */
@property (readonly, nonatomic, strong) WEGUser* user;
/**
 *  Provides access to a Single Managed Instance of WebEngage.
 *
 *  @return A Single Global WebEngage object.
 *  
 *  @warning Application should use only this method to get an instance of WebEngage and never call alloc or init on
 *  the class.
 */
+(instancetype) sharedInstance;
/**
 *  Initialize the SDK after validating the Info Plist WebEngage keys. App can access user or analytics after calling this method. This must be called from application delegate's application:didFinishLaunchingWithOptions: method (hence the same selector name) and preferably as the last statement of implementation.
 *
 *  @param application   The instance of application received in UIApplicationDelegate's callback.
 *  @param launchOptions The launchOptions dictionary received in UIApplicationDelegate's callback.
 *
 *  @return YES if the initialization was successful and SDK is ready to use. NO otherwise
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
/**
 *  Initialize the SDK after validating the Info Plist WebEngage keys. App can access user or analytics after calling this method. This must be called from application delegate's application:didFinishLaunchingWithOptions: method (hence the same selector name) and preferably as the last statement of implementation.
 *
 *  @param application The instance of application received in UIApplicationDelegate's callback.
 *  @param launchOptions        The launchOptions dictionary received in UIApplicationDelegate's callback.
 *  @param apnRegister          If SDK should register for Push Notifications automatically after setup is complete, pass NO if app wants to perform registration on its own, for Eg. after showing some UI to the user.
 *
 *  @return YES if the initialization was successful and SDK is ready to use. NO otherwise
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions autoRegister:(BOOL)apnRegister;
/**
 *  Initialize the SDK after validating the Info Plist WebEngage keys. App can access user or analytics after calling this method. This must be called from application delegate's application:didFinishLaunchingWithOptions: method (hence the same selector name) and preferably as the last statement of implementation.
 *
 *  @param application The instance of application received in UIApplicationDelegate's callback.
 *  @param launchOptions        The launchOptions dictionary received in UIApplicationDelegate's callback.
 *  @param notificationDelegate A reference to an implementation of WEGInAppNotificationProtocol. @warning SDK keeps only a week reference to notificationDelegate, its application's responsibility to maintain the ownership of this class and keep it in memory.
 *
 *  @return YES if the initialization was successful and SDK is ready to use. NO otherwise
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions notificationDelegate:(id<WEGInAppNotificationProtocol>)notificationDelegate;
/**
 *  Initialize the SDK after validating the Info Plist WebEngage keys. App can access user or analytics after calling this method. This must be called from application delegate's application:didFinishLaunchingWithOptions: method (hence the same selector name) and preferably as the last statement of implementation.
 *
 *  @param application The instance of application received in UIApplicationDelegate's callback.
 *  @param launchOptions        The launchOptions dictionary received in UIApplicationDelegate's callback.
 *  @param notificationDelegate A reference to an implementation of WEGInAppNotificationProtocol. @warning SDK keeps only a week reference to notificationDelegate, its application's responsibility to maintain the ownership of this class and keep it in memory.
 *  @param apnRegister          If SDK should register for Push Notifications automatically after setup is complete, pass NO if app wants to perform registration on its own, for Eg. after showing some UI to the user.
 *
 *  @return YES if the initialization was successful and SDK is ready to use. NO otherwise
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions notificationDelegate:(id<WEGInAppNotificationProtocol>)notificationDelegate autoRegister:(BOOL)apnRegister;

@end
