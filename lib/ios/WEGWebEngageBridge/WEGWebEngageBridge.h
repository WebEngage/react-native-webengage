#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <WebEngage/WebEngage.h>
#import <React/RCTBridgeDelegate.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <WEGWebEngageBridgeSpec/WEGWebEngageBridgeSpec.h>
@interface WEGWebEngageBridge: RCTEventEmitter <NativeWebEngageModuleSpec, WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
#else
#import <React/RCTBridgeModule.h>
@interface WEGWebEngageBridge: RCTEventEmitter <RCTBridgeModule, WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
#endif

@property NSMutableDictionary<NSString *, NSMutableArray *> *pendingEventsDict;
@property dispatch_queue_t serialQueue;

// Used to Initialize WebEngage SDK Automatically from client's AppDelegate
- (void)autoRegister:(UIApplication *)application launchOptions:(NSDictionary *)launchOptions;

// Forwards resolved universal link deeplink to JS via 'universalLinkClicked' event.
- (void)sendUniversalLinkLocation:(NSString *)location;
@end