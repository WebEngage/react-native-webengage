#import "WebEngageHelper.h"

@implementation WebEngageHelper

+ (instancetype)sharedInstance {
  static WebEngageHelper *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (void)initializeWebEngageWithApplication:(UIApplication *)application
                             launchOptions:(NSDictionary *)launchOptions {
  [[WebEngage sharedInstance] application:application
            didFinishLaunchingWithOptions:launchOptions notificationDelegate:nil autoRegister: false];
  [WebEngage sharedInstance].pushNotificationDelegate = self;
}

@end
