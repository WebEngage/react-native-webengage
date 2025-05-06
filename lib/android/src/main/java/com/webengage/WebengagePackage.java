package com.webengage;

/**
 * Created by uzma on 10/25/17.
 */

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class WebengagePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        Log.d("WebEngage", "createNativeModules: " + reactContext);
        List<NativeModule> modules = new ArrayList<>();
        modules.add(WebengageBridge.getInstance(reactContext));
        WebengageBridge.getInstance(reactContext).setReactNativeContext(reactContext);
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
