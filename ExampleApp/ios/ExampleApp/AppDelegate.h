#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <WEGWebEngageBridge.h>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) WEGWebEngageBridge *bridge;

@end
