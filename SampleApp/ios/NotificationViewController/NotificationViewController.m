#import "NotificationViewController.h"
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>

// Step 1 : Importing WEContentExtension
#import <WEContentExtension/WEContentExtension-Swift.h>

@interface NotificationViewController () <UNNotificationContentExtension>

@property IBOutlet UILabel *label;
// Step 2 : Creating Object of content Extension
@property WEXRichPushNotificationViewController *weRichPushVC;

@end

@implementation NotificationViewController

// Step 3 : Pass necessary information to WebEngage
- (void)viewDidLoad {
    if (_weRichPushVC == NULL){
        _weRichPushVC = [[WEXRichPushNotificationViewController alloc]init];
    }
    [_weRichPushVC setUpViewsWithParentVC:self];
    [super viewDidLoad];

}

- (void)didReceiveNotification:(UNNotification *)notification {
    [_weRichPushVC didReceiveNotification:notification];
}

- (void)didReceiveNotificationResponse:(UNNotificationResponse *)response completionHandler:(void (^)(UNNotificationContentExtensionResponseOption))completion{
    [_weRichPushVC didReceiveNotificationResponse:response completionHandler:completion];
}
@end
