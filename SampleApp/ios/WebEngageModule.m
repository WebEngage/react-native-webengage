#import "WebEngageModule.h"
#import <React/RCTLog.h>
#import <WebEngage/WebEngage.h>

@implementation WebEngageModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initWebEngage:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [[WebEngageHelper sharedInstance] initializeWebEngageWithApplication:[UIApplication sharedApplication] launchOptions:nil];
    
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"isWebEngageInitialized"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    resolve(@(YES));
  });
}

@end
