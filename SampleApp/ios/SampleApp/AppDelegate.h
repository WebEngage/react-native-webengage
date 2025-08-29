#import <React-RCTAppDelegate/RCTAppDelegate.h>
#import <WebEngage/WebEngage.h>
#import <UIKit/UIKit.h>
#import <WEGWebEngageBridge.h>

@interface AppDelegate : RCTAppDelegate
@property (nonatomic, strong) WEGWebEngageBridge *weBridge;
@end
