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

public class MainApplication extends Application implements ReactApplication {

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
        WebengageBridge.getInstance();
        WebEngageConfig webEngageConfig = new WebEngageConfig.Builder()
                .setWebEngageKey("~47b66161")
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
        //WebEngage.registerPushNotificationCallback(this);
    }
//
//  @Override
//  public PushNotificationData onPushNotificationReceived(Context context, PushNotificationData pushNotificationData) {
//    WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
//    // sendEvent(getReactApplicationContext(), "pushNotificationReceived", map);
//    return pushNotificationData;
//  }
//
//  @Override
//  public void onPushNotificationShown(Context context, PushNotificationData pushNotificationData) {
//    WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
//    // sendEvent(getReactApplicationContext(), "pushNotificationShown", map);
//  }
//
//  @Override
//  public boolean onPushNotificationClicked(Context context, PushNotificationData pushNotificationData) {
//    Log.e("TAG", "MyLogs WebengageBridge onPushNotificationClicked: ");
//    WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
//    sendEvent(context, "pushNotificationClicked", map);
//    return false;
//  }
//
//  @Override
//  public void onPushNotificationDismissed(Context context, PushNotificationData pushNotificationData) {
//    WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
//    sendEvent(context, "pushNotificationDismissed", map);
//  }
//
//  @Override
//  public boolean onPushNotificationActionClicked(Context context, PushNotificationData pushNotificationData, String buttonId) {
//    return false;
//  }
//
//  private void sendEvent(Context context, String eventName, @Nullable WritableMap params) {
//    Handler handler = new Handler(Looper.getMainLooper());
//    handler.post(new Runnable() {
//      public void run() {
//        final ReactInstanceManager mReactInstanceManager = ((ReactApplication)
//                context.getApplicationContext()).getReactNativeHost().getReactInstanceManager();
//        ReactContext context = mReactInstanceManager.getCurrentReactContext();
//        if (context != null) {
//          Log.d("Clicker", "Context Available. Emitting event to RCT.");
//          // emitEvent(context, WE_PUSH_CLICK_EVENT, map);
//        } else {
//          Log.d("Clicker", "Waiting for context creation.");
//          mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
//            public void onReactContextInitialized(ReactContext context) {
//              Log.d("Clicker", "Emitting event to RCT.");
//              emitEvent(context, eventName, params);
//              mReactInstanceManager.removeReactInstanceEventListener(this);
//            }
//          });
//          if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
//            Log.d("Clicker", "Creating context in background");
//            mReactInstanceManager.createReactContextInBackground();
//          }
//        }
//      }
//    });
//  }
//
//  private void emitEvent(ReactContext reactContext, String eventName, @Nullable
//          WritableMap params) {
//    if (reactContext.hasActiveCatalystInstance()) {
//      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//              .emit(eventName, params);
//    }
//  }

}
