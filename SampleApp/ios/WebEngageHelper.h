#import <Foundation/Foundation.h>
#import <WebEngage/WebEngage.h>

@interface WebEngageHelper : NSObject

+ (instancetype)sharedInstance;
- (void)initializeWebEngageWithApplication:(UIApplication *)application
                      launchOptions:(NSDictionary *)launchOptions;

@end
