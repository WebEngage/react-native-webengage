#import <RCTAppDelegate.h>
#import <WebEngage/WebEngage.h>
#import <UIKit/UIKit.h>
#import <WEGWebEngageBridge.h>
#import <Firebase.h>
@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate>
// use weBridge instead of bridge
@property (nonatomic, strong) WEGWebEngageBridge *weBridge;
@end
