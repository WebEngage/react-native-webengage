
// NotificationService.m file
#import "NotificationService.h"
#import <WEServiceExtension/WEServiceExtension-Swift.h>

 @interface NotificationService ()
 // Step 2 : Creating Object of service Extension
 @property (nonatomic, strong) WEXPushNotificationService *serviceExtension;

 @end

 @implementation NotificationService

 // Step 3 : Pass necessary information to WebEngage
 - (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
     if (_serviceExtension == NULL){
         _serviceExtension = [[WEXPushNotificationService alloc]init];
     }
     [_serviceExtension didReceiveNotificationRequest:request
                                   withContentHandler:contentHandler];
 }

 - (void)serviceExtensionTimeWillExpire {
     // Called just before the extension will be terminated by the system.
     // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
     [_serviceExtension serviceExtensionTimeWillExpire];
 }

 @end
