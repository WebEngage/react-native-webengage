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
  
  [[WebEngage sharedInstance].deeplinkManager setCustomDomain:@[@"test-custom"]];
  
  NSString *test = [NSString stringWithFormat:@"http://test-custom.webengage.biz/d/lw/g1.jpg?p=eyJsYyI6In43MTY4MDFhNiIsImwiOiIzYWE4MDdmNWU1Y2MyMGE1Y2Y2NzAxZmRjNjYyZDUwNCIsImMiOiJ1em1hODEyIiwiZW0iOiJ1em1hLnNheXllZEB3ZWJrbGlwcGVyLmNvbSIsImUiOiJ%2BMWFmbGo5cSIsInYiOiJ%2BMjltZzEzNSIsInMiOiJ%2BM2I0ajZnYjIyYzJiYWppX2Q2N2ZmZmViLTlmYTMtNDM5OC04MDQzLWJmMmE0MzY4OThkOToxNjA3NTExMjEyMzAxIiwiZXZlbnQiOiJlbWFpbF9jbGljayIsImN0YSI6In44YTA4NjA1NCIsInRvVVJMIjoiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyJ9"];
  
  [[WebEngage sharedInstance].deeplinkManager getAndTrackDeeplink:[NSURL URLWithString:test] callbackBlock:^(NSString * location) {
      if (!self.bridge) {
        self.bridge = [WEGWebEngageBridge new];
      }
      [self.bridge sendUniversalLinkLocation:location];
    }];
  return YES;
}

-(BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler{
  [[WebEngage sharedInstance].deeplinkManager getAndTrackDeeplink:userActivity.webpageURL callbackBlock:^(NSString * location) {
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
