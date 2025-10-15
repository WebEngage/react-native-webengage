#import <React-RCTAppDelegate/RCTAppDelegate.h>
#import <WebEngage/WebEngage.h>
#import <UIKit/UIKit.h>
#import "WebEngageReact.h"

@interface AppDelegate : RCTAppDelegate
@property (nonatomic, strong) WebEngageReact *weManager; // Docs: Add this line to Docs
@end
