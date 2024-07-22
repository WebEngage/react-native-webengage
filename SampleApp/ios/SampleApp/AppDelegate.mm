#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>
#import "WebEngageHelper.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"SampleApp";
 self.weBridge = [WEGWebEngageBridge new];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self.weBridge launchOptions:launchOptions];
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  if (launchOptions != nil) {
      NSData *launchOptionsData = [NSKeyedArchiver archivedDataWithRootObject:launchOptions requiringSecureCoding:NO error:nil];
      [[NSUserDefaults standardUserDefaults] setObject:launchOptionsData forKey:@"launchOptions"];
  }
  BOOL isWebEngageInitialized = [[NSUserDefaults standardUserDefaults] boolForKey:@"isWebEngageInitialized"];
  
    if (isWebEngageInitialized) {
      [[WebEngageHelper sharedInstance] initializeWebEngageWithApplication:application launchOptions:launchOptions];
    } else {
      NSLog(@"WebEngage: Not Initialized!!");
    }
  
  if (@available(iOS 10.0, *)) {
          [UNUserNotificationCenter currentNotificationCenter].delegate = (id<UNUserNotificationCenterDelegate>) self;
          
          UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
          [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound + UNAuthorizationOptionBadge)
                                completionHandler:^(BOOL granted, NSError * _Nullable error) {
              if (!error) {
                  dispatch_async(dispatch_get_main_queue(), ^{
                      [[UIApplication sharedApplication] registerForRemoteNotifications];
                  });
              }
          }];
      } else {
          UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound);
          UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
          [application registerUserNotificationSettings:settings];
          [application registerForRemoteNotifications];
      }
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)registerRemotePushManually {
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;

  [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge)
      completionHandler:^(BOOL granted, NSError * _Nullable error) {
          if (granted) {
              NSLog(@"Notification authorization granted");
              dispatch_async(dispatch_get_main_queue(), ^{
                  [[UIApplication sharedApplication] registerForRemoteNotifications];
              });
          } else {
              NSLog(@"Notification authorization denied");
              if (error) {
                  NSLog(@"Error: %@", error.localizedDescription);
              }
          }
  }];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"didRegisterForRemoteNotificationsWithDeviceToken: %@",deviceToken);
  const unsigned char *dataBuffer = (const unsigned char *)deviceToken.bytes;
  if (!dataBuffer) {
      return;
  }

  NSUInteger dataLength = deviceToken.length;
  NSMutableString *hexString  = [NSMutableString stringWithCapacity:(dataLength * 2)];
  for (int i = 0; i < dataLength; ++i) {
      [hexString appendString:[NSString stringWithFormat:@"%02x", dataBuffer[i]]];
  }

  self.pushToken = [hexString copy];
  NSLog(@"Device Token: %@", self.pushToken);
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
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
