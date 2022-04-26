package com.exampleapp;

import android.app.Application;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.webengage.WebengageBridge;
import com.webengage.WebengagePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.webengage.sdk.android.WebEngageConfig;
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import com.webengage.sdk.android.WebEngage;
import com.webengage.sdk.android.actions.render.PushNotificationData;
import com.webengage.sdk.android.callbacks.PushNotificationCallbacks;

import javax.annotation.Nullable;

public class MainApplication extends Application implements ReactApplication , PushNotificationCallbacks{
    private ReactApplicationContext mReactAppContext;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new AsyncStoragePackage(),
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
        final ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();

//        mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
//            public void onReactContextInitialized(ReactContext context) {
//                Log.d("Clicker", "Emitting event to RCT.");
//                WebengageBridge.getInstance((ReactApplicationContext) context);
//                mReactInstanceManager.removeReactInstanceEventListener(this);
//            }
//        });

        WebEngageConfig webEngageConfig = new WebEngageConfig.Builder()
                .setWebEngageKey("8261782b")
                .setDebugMode(true)  // only in development mode
                .build();
        registerActivityLifecycleCallbacks(new WebEngageActivityLifeCycleCallbacks(this, webEngageConfig));

        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
            @Override
            public void onComplete(@NonNull Task<String> task) {
                try {
                    String token = task.getResult();
                    WebEngage.get().setRegistrationID(token);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        mReactAppContext = new ReactApplicationContext(getApplicationContext());
        WebEngage.registerPushNotificationCallback(this);
    }

    @Override
    public PushNotificationData onPushNotificationReceived(Context context, PushNotificationData pushNotificationData) {
      return WebengageBridge.getInstance(mReactAppContext).onPushNotificationReceived(context,pushNotificationData);
    }
  
    @Override
    public void onPushNotificationShown(Context context, PushNotificationData pushNotificationData) {
      WebengageBridge.getInstance(mReactAppContext).onPushNotificationShown(context,pushNotificationData);
    }
  
    @Override
    public boolean onPushNotificationClicked(Context context, PushNotificationData pushNotificationData) {
      return  WebengageBridge.getInstance(mReactAppContext).onPushNotificationClicked(context,pushNotificationData);
    }
  
    @Override
    public void onPushNotificationDismissed(Context context, PushNotificationData pushNotificationData) {
      WebengageBridge.getInstance(mReactAppContext).onPushNotificationDismissed(context,pushNotificationData);
    }
  
    @Override
    public boolean onPushNotificationActionClicked(Context context, PushNotificationData pushNotificationData, String buttonId) {
      return  WebengageBridge.getInstance(mReactAppContext).onPushNotificationActionClicked(context,pushNotificationData,buttonId);
    }

}
