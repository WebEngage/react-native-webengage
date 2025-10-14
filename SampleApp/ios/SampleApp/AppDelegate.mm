#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <WebEngage/WebEngage.h>
#import <WebEngage/WEGManualIntegration.h>
#import "WebEngageReact.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef RCT_NEW_ARCH_ENABLED
  // New Architecture path
  #if RCT_BRIDGELESS_ENABLED
    NSLog(@"🏗️ Architecture: New Architecture + Bridgeless");
  #else
    NSLog(@"🏗️ Architecture: New Architecture + Bridge");
  #endif
#else
  NSLog(@"🏗️ Architecture: Old Architecture");
#endif
  
  
  // Initialize WebEngage
  WebEngageReact *weManager = [WebEngageReact new];
//   [weManager setDelegates];
  [[WebEngage sharedInstance] application:application
          didFinishLaunchingWithOptions:launchOptions notificationDelegate:weManager];
  
  if (@available(iOS 10.0, *)) {
    [UNUserNotificationCenter currentNotificationCenter].delegate = (id<UNUserNotificationCenterDelegate>) self;
  }

  // Use RCTAppDelegate for New Architecture support (non-bridgeless)
  self.moduleName = @"SampleApp";
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
    
    NSLog(@"center: %@, notification: %@", center, notification);
    
    [WEGManualIntegration userNotificationCenter:center willPresentNotification:notification];
    
    completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge);
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler {
    
    NSLog(@"center: %@, response: %@", center, response);
    
    [WEGManualIntegration userNotificationCenter:center didReceiveNotificationResponse:response];
    
    completionHandler();
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL) bridgelessEnabled {
  return NO;
}


- (id<RCTBridgeDelegate>)bridgeDelegate
{
  return [WebEngageReact new];
}

- (BOOL)newArchEnabled
{
  return NO;
}

@end
