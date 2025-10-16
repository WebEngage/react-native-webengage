package com.webengage;

import android.util.Log;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

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
        Log.d("WebEngage", "createNativeModules: " + reactContext);
        List<NativeModule> modules = new ArrayList<>();
        
        // Check if new architecture is enabled
        boolean isNewArchEnabled = false;
        try {
            Class.forName("com.facebook.react.turbomodule.core.interfaces.TurboModule");
            isNewArchEnabled = true;
            Log.d("WebEngage", "TurboModule class found - NEW ARCHITECTURE");
        } catch (ClassNotFoundException e) {
            Log.d("WebEngage", "TurboModule class not found - OLD ARCHITECTURE");
        }
        
        if (isNewArchEnabled) {
            // For new architecture, register the TurboModule
            try {
                WebEngageModule turboModule = new WebEngageModule(reactContext);
                modules.add(turboModule);
                Log.d("WebEngage", "TurboModule registered: " + turboModule.getName());
            } catch (Exception e) {
                Log.e("WebEngage", "Failed to create TurboModule, falling back to bridge", e);
                WebengageBridge bridgeInstance = WebengageBridge.getInstance(reactContext);
                bridgeInstance.setReactNativeContext(reactContext);
                modules.add(bridgeInstance);
            }
        } else {
            // Old architecture
            Log.d("WebEngage", "Registering bridge for OLD ARCHITECTURE");
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
            
            // Register TurboModule info
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
            
            // Also register bridge module for backward compatibility
            moduleInfos.put(
                "webengageBridge",
                new ReactModuleInfo(
                    "webengageBridge",
                    "com.webengage.WebengageBridge",
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    false, // hasConstants
                    false, // isCxxModule
                    false  // isTurboModule
                )
            );
            
            return moduleInfos;
        };
    }
}
