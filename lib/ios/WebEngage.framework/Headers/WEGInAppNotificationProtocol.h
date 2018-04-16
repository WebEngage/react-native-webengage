//
//  InAppNotificationProtocol.h
//  WebEngage
//
//  Created by Saumitra R. Bhave on 26/02/16.
//  Copyright © 2016 Saumitra R. Bhave. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol WEGInAppNotificationProtocol <NSObject>
-(NSMutableDictionary*) notificationPrepared:(NSMutableDictionary*) inAppNotificationData shouldStop:(BOOL*)stopRendering;
-(void) notificationShown:(NSMutableDictionary*) inAppNotificationData;
-(void) notification:(NSMutableDictionary*) inAppNotificationData clickedWithAction:(NSString*) actionId;
-(void) notificationDismissed:(NSMutableDictionary*) inAppNotificationData;
@end