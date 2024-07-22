#import <RCTAppDelegate.h>
#import <WebEngage/WebEngage.h>
#import <UIKit/UIKit.h>
#import <WEGWebEngageBridge.h>

#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate, UNUserNotificationCenterDelegate>
// use weBridge instead of bridge
@property (nonatomic, strong) WEGWebEngageBridge *weBridge;
@property (nonatomic, strong) NSString *pushToken;


- (void)registerRemotePushManually;
@end
