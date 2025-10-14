#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>
#import <WebEngage/WebEngage.h>
#import <React/RCTBridgeDelegate.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <WebEngageReactSpec/WebEngageReactSpec.h>
// TODO - while testing check RCTBridgeDelegate will be an issue?
@interface WebEngageReact: RCTEventEmitter <NativeWebEngageModuleSpec, WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
#else
#import <React/RCTBridgeModule.h>
@interface WebEngageReact: RCTEventEmitter <RCTBridgeModule, WEGInAppNotificationProtocol, WEGAppDelegate, RCTBridgeDelegate>
#endif

// + (instancetype)sharedInstance;
+ (void)sendEventOnObserving:(NSString *)name body:(id)body;
- (void)sendUniversalLinkLocation:(NSString *)location;

// TODO - Added later
@property NSMutableDictionary *pendingEventsDict;
@property dispatch_queue_t serialQueue;
// - (void)setDelegates;

@end