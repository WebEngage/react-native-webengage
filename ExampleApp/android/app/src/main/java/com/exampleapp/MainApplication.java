package com.exampleapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.webengage.WebengagePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.webengage.sdk.android.callbacks.PushNotificationCallbacks;
import com.webengage.sdk.android.callbacks.LifeCycleCallbacks;

import java.util.Arrays;
import java.util.List;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import com.webengage.sdk.android.WebEngageConfig;
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import com.webengage.sdk.android.WebEngage;

public class MainApplication extends Application implements ReactApplication,LifeCycleCallbacks {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new WebengagePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Log.d("WebEngage-React","Application on onCreate");
    WebEngageConfig webEngageConfig = new WebEngageConfig.Builder()
              .setWebEngageKey("~134105268")
              .setAutoGCMRegistrationFlag(true)
              .setGCMProjectNumber("299770535209")
              .setDebugMode(true) // only in development mode
              .build();
  registerActivityLifecycleCallbacks(new WebEngageActivityLifeCycleCallbacks(this, webEngageConfig));
  WebEngage.registerLifeCycleCallback(this);

  }

  @Override
    public void onGCMRegistered(Context context, String regID) {
        Log.d("WebEngage-React", "GCM reg id: " + regID);

//        Utils.track("onGCMRegistered_Callback", regID);
    }


    @Override
    public void onGCMMessageReceived(Context context, Intent intent) {
        Log.d("WebEngage-React", intent.getExtras().toString());
    }

    @Override
    public void onAppInstalled(Context context, Intent intent) {
        Log.d("WebEngage-React" + "Install Referrer", intent.getExtras().getString("referrer"));
    }

    @Override
    public void onAppUpgraded(Context context, int oldVersion, int newVersion) {
        
    }
}
