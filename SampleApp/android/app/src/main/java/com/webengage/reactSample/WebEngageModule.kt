package com.webengage.reactSample

import android.app.Application
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.webengage.sdk.android.LocationTrackingStrategy
import com.webengage.sdk.android.WebEngage
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks
import com.webengage.sdk.android.WebEngageConfig


class WebEngageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var isWebEngageInitialized = false

    override fun getName(): String {
        return MODULE_NAME
    }

    @ReactMethod
    fun initWebEngage(promise: Promise) {
        val application = reactApplicationContext.applicationContext as Application
        val activity = currentActivity
        WebEngageHelper.getInstance().initWebEngage(application,activity);
        promise.resolve(true)
    }

    companion object {
        private const val MODULE_NAME = "WebEngageModule"
    }
}