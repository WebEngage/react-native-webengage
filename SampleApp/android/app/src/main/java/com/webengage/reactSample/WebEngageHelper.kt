package com.webengage.reactSample

import android.app.Activity
import android.app.Application
import android.content.Context
import android.util.Log
import com.webengage.sdk.android.LocationTrackingStrategy
import com.webengage.sdk.android.WebEngage
import com.webengage.sdk.android.WebEngageConfig
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks

class WebEngageHelper private constructor() {

    companion object {
        private var instance: WebEngageHelper? = null
        private var isWebEngageInitialized = false

        @JvmStatic
        fun getInstance(): WebEngageHelper {
            if (instance == null) {
                instance = WebEngageHelper()
            }
            return instance!!
        }
    }

    fun initWebEngage(application: Application, activity: Activity?) {
        if (isWebEngageInitialized) {
            return
        }

        isWebEngageInitialized = true

        val webEngageConfig = WebEngageConfig.Builder()
            .setWebEngageKey("YOUR_WEBENGAGE_LICENSE")
            .setAutoGCMRegistrationFlag(false)
            .setLocationTrackingStrategy(LocationTrackingStrategy.ACCURACY_BEST)
            .setDebugMode(true)
            .build()

        if (activity != null) {
            WebEngage.get().analytics().start(activity)
        }

        application.registerActivityLifecycleCallbacks(WebEngageActivityLifeCycleCallbacks(application, webEngageConfig))

        SharedPreferencesManager.getInstance(application, "app_pref")
        SharedPreferencesManager.getInstance()?.putValue(SharedPreferencesManager.IS_REAL_USER, true)
    }
}
