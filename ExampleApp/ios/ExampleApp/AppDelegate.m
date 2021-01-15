/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <WebEngage/WebEngage.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  
  //  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
  //                                           moduleName:@"ExampleApp"
  //                                           initialProperties:nil
  //                                           launchOptions:launchOptions];
  
  // TODO: Need to improve the SDK this so that clients don't have to make these changes as done in Android
  self.bridge = [WEGWebEngageBridge new];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self.bridge launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"ExampleApp" initialProperties:nil];
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [[WebEngage sharedInstance] application:application
            didFinishLaunchingWithOptions:launchOptions notificationDelegate:self.bridge.wegBridge];
  [WebEngage sharedInstance].pushNotificationDelegate = self.bridge.wegBridge;
  
  return YES;
}

-(BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler{
  [[WebEngage sharedInstance].deeplinkManager getAndTrackDeeplink:userActivity.webpageURL callbackBlock:^(NSString * location) {
    //send location to react
    if (!self.bridge) {
      self.bridge = [WEGWebEngageBridge new];
    }
    [self.bridge sendUniversalLinkLocation:location];
  }];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
