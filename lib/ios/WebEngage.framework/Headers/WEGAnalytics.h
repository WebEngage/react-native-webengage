//
//  WEGAnalytics.h
//
//  Created by Saumitra R. Bhave on 16/06/15.
//  Copyright (c) 2015 Webklipper Technologies Pvt Ltd.. All rights reserved.
//

/**
 *  @protocol WEGAnalytics
 *  
 *  Defines a protocol which provides access to different APIs related to WebEngage tracking and analytics features
 
 @warning Application should not implement this protocol, an implementation of this protocol can be retrived by calling @code [WebEngage sharedInstance].analytics @endcode
 */
@protocol WEGAnalytics <NSObject>
/**
 *  Track an event in WebEngage, an event represents an action taken by user like clicking a button, adding items to cart, searching etc. Its upto the application to decide the names and data for these events.
 *
 *  @warning Application must not change data type of any attribute within the value dictionary in case of same events being repeated or sent via different platforms(Android/Web). For Eg. if app is sending @{"Age":"13 years"} it should *never* send @{"Age": 13}. If such case arises select a different attribute name like @{"Age":"13 years", "Age2":13}
 *
 *  @see [WebEngage Docs](http://docs.webengage.com/overview/readme.html#event) and [WebEngage Docs iOS](http://docs.webengage.com/sdks/ios/events/readme.html)
 *
 *  @param eventName  The name of the event, must not be nil or empty string.
 *  @param eventValue The dictionary containing more information about the event, this must not contain a diction within this dictionary. this can contain an array only if that array contains primitives only.
 */
-(void) trackEventWithName:(NSString*)eventName andValue:(NSDictionary*)eventValue;
/**
 *  Track an event in WebEngage, an event represents an action taken by user like clicking a button, adding items to cart, searching etc. Its upto the application to decide the names and data for these events.
 *  @see [WebEngage Docs](http://docs.webengage.com/overview/readme.html#event) and [WebEngage Docs iOS](http://docs.webengage.com/sdks/ios/events/readme.html)
 *
 *  @param eventName  The name of the event, must not be nil or empty string.
 */
-(void) trackEventWithName:(NSString*)eventName;
/**
 *  Marks the Page Navigation to the target Page identified by the screenName Parameter. This is used in targeting InApp Messages inside a perticular Page. It is app's responsibility to define what page means for their app.
 *
 *  @param screenName Name of the page where the user will navigate now.
 */
-(void) navigatingToScreenWithName:(NSString*) screenName;
/**
 *  Marks the Page Navigation to the target Page identified by the screenName Parameter. This is used in targeting InApp Messages inside a perticular Page. It is app's responsibility to define what page means for their app. The custom data can be used to specify different conditions inside the Page.
 *
 *  @param screenName Name of the page where the user will navigate now.
 *  @param userData   Any custom data that is associated with this page.
 */
-(void) navigatingToScreenWithName:(NSString*) screenName andData: (NSDictionary*) userData;
/**
 *  Updates the custom data associated with current page.
 *
 *  @param userData New custom Data to be associated with current page.
 */
-(void) updateCurrentScreenData:(NSDictionary*) userData;
@end