package com.webengage;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;


import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class WebengagePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        
        // Try new architecture first, fallback to old architecture
        try {
            WebEngageModule turboModule = new WebEngageModule(reactContext);
            modules.add(turboModule);
        } catch (Exception e) {
            WebengageBridge bridgeInstance = WebengageBridge.getInstance(reactContext);
            bridgeInstance.setReactNativeContext(reactContext);
            modules.add(bridgeInstance);
        }
        
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    // For new architecture TurboModule support
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            
            // Register module info for both architectures
            moduleInfos.put(
                "WebEngageReact",
                new ReactModuleInfo(
                    "WebEngageReact",
                    "com.webengage.WebEngageModule",
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true,  // hasConstants
                    false, // isCxxModule
                    true   // isTurboModule
                )
            );
            
            return moduleInfos;
        };
    }
}
