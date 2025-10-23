#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <WebEngage/WebEngage.h>
#import <React/RCTBridgeDelegate.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <WebEngageReactSpec/WebEngageReactSpec.h>
@interface WebEngageReact: RCTEventEmitter <NativeWebEngageModuleSpec, WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
#else
#import <React/RCTBridgeModule.h>
@interface WebEngageReact: RCTEventEmitter <RCTBridgeModule, WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
#endif


@property NSMutableDictionary *pendingEventsDict;
@property dispatch_queue_t serialQueue;

// Used to Initialize WebEngage SDK Automatically from client's AppDelegate
- (void)autoRegister:(UIApplication *)application launchOptions:(NSDictionary *)launchOptions;

@end
