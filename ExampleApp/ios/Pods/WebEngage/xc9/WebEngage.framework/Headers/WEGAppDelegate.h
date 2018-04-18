//
//  WEGAppDelegate.h
//  WebEngage
//
//  Created by Uzma Sayyed on 1/12/18.
//  Copyright © 2018 Saumitra R. Bhave. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 *  This enum represents the different reasons for which new anonymous is generated, which are known to WebEngage and are treated in its own symantically meaningful way.
 */
typedef NS_ENUM(NSInteger, WEGReason){
    WEGNewAnonymousIDGenerated=1,
    WEGAppLaunched=2,
    WEGUserLoggedOut=3
};

@protocol WEGAppDelegate <NSObject>

/**
 *  This is a callback that gets called whenever a push notification is clicked, and provide deeplink and user data associated with the notification
 *
 *  @param : deeplink String sent for deep linking from WebEngage dashboard
 *  @param : userData User data associated with the notification
 */
- (void)WEGHandleDeeplink:(NSString*) deeplink userData:(NSDictionary*)data;

/**
 *  This is a callback that gets called every time anonymous id of user gets refreshed
 *
 *  @param : anonymousID Contains anonymous ID
 *  @param : reason Reason for which a new ID is generated
 */
- (void) didReceiveAnonymousID:(NSString*)anonymousID forReason:(WEGReason)reason;
@end
