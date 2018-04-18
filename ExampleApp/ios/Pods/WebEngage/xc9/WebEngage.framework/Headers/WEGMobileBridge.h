//
//  WEGMobileBridge.h
//  WebEngage
//
//  Created by Uzma Sayyed on 12/12/17.
//  Copyright © 2017 Saumitra R. Bhave. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

/**
 *  @interface WEGMobileBridge
 *  This facade will provide an interface to initialize your WKWebView with WebEngage's api, so that if there's a website loaded in WKWebView has WebEngage SDK integrated, all the events in web view will be recorded from mobile rather than web.
 *  In order to achieve this bridging, it is assumed that you have followed the instructions on https://docs.webengage.com/docs/ under Mobile-Web bridge section
 */
@interface WEGMobileBridge : NSObject <WKScriptMessageHandler>

/**
 *  Enhance the configuration of your WKWebview by allowing WebEngage to add configuration.
 *  @warning : This method is to be called while initializing your WKWebView using initWithFrame:configuration, hence make sure that your web view is competely configured before you call this method on WEGMobileBridge object, because updating web view config after this method, will overwrite WebEngage's configuration.
 *
 *  @param webConfig Your WKWebViewConfiguration object
 */
-(WKWebViewConfiguration*) enhanceWebConfigForMobileWebBridge :(WKWebViewConfiguration*)webConfig;

@end
