package com.webengage.reactSample

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader
import com.webengage.sdk.android.WebEngageConfig;
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import com.webengage.WebengageBridge;
import com.webengage.sdk.android.WebEngage;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    WebengageBridge.getInstance();
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    initWebEngage()
    initWEPush()
    ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }

  // WebEngage Initialization
  public fun initWebEngage() {
    val webEngageConfig = WebEngageConfig.Builder()
      .setWebEngageKey("YOUR_WEBENGAGE_LICENSE_KEY")
      .setDebugMode(true) // only in development mode
      .build()
    registerActivityLifecycleCallbacks(
      WebEngageActivityLifeCycleCallbacks(
        this,
        webEngageConfig
      )
    )
  }

  // WebEngage Push Integration
  public fun initWEPush() {
    FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
      try {
        val token: String? = task.result
        WebEngage.get().setRegistrationID(token)
      } catch (e: Exception) {
        e.printStackTrace()
      }
    }
  }
}
