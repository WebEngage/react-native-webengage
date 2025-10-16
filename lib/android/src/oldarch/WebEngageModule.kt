package com.webengage

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.webengage.sdk.android.Logger

class WebEngageModule(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        @JvmStatic
        fun setInitialUri(uri: android.net.Uri?) {
            // Handle initial URI if needed
        }
    }

    private val webEngageModuleImpl: WebEngageModuleImpl = WebEngageModuleImpl(reactContext!!)

    override fun getName(): String {
        Logger.d("WebEngage","Architecture: old architecture in android lib");
        return "WebEngageReact"
    }

    @ReactMethod
    fun init(autoRegister: Boolean) {
        Logger.d("WebEngage","Architecture: old architecture in android lib");
        webEngageModuleImpl.init(autoRegister)
    }

    @ReactMethod
    fun trackEventWithName(eventName: String?) {
        eventName?.let { webEngageModuleImpl.trackEventWithName(it) }
    }

    @ReactMethod
    fun trackEventWithNameAndData(eventName: String?, eventData: ReadableMap?) {
        if (eventName != null && eventData != null) {
            webEngageModuleImpl.trackEventWithNameAndData(eventName, eventData)
        }
    }

    @ReactMethod
    fun screenNavigated(screenName: String?) {
        screenName?.let { webEngageModuleImpl.screenNavigated(it) }
    }

    @ReactMethod
    fun screenNavigatedWithData(screenName: String?, screenData: ReadableMap?) {
        if (screenName != null && screenData != null) {
            webEngageModuleImpl.screenNavigatedWithData(screenName, screenData)
        }
    }

    @ReactMethod
    fun login(userId: String?) {
        Logger.d("WebEngage", "login: OLD ARCH - WebEngageModule.login() called with userId: $userId")
        userId?.let { 
            Logger.d("WebEngage", "login: OLD ARCH - Delegating to WebEngageModuleImpl.login()")
            webEngageModuleImpl.login(it) 
        }
    }

    @ReactMethod
    fun loginWithSecureToken(userId: String?, jwtToken: String?) {
        Logger.d("WebEngage", "login: OLD ARCH - WebEngageModule.loginWithSecureToken() called with userId: $userId")
        if (userId != null && jwtToken != null) {
            Logger.d("WebEngage", "login: OLD ARCH - Delegating to WebEngageModuleImpl.loginWithSecureToken()")
            webEngageModuleImpl.loginWithSecureToken(userId, jwtToken)
        }
    }

    @ReactMethod
    fun setSecureToken(userId: String?, secureToken: String?) {
        if (userId != null && secureToken != null) {
            webEngageModuleImpl.setSecureToken(userId, secureToken)
        }
    }

    @ReactMethod
    fun logout() {
        webEngageModuleImpl.logout()
    }

    @ReactMethod
    fun setAttribute(attributes: ReadableMap?) {
        attributes?.let { webEngageModuleImpl.setAttribute(it) }
    }

    @ReactMethod
    fun setAndroidAttribute(attributes: ReadableMap?) {
        attributes?.let { webEngageModuleImpl.setAttribute(it) }
    }

    @ReactMethod
    fun setIosAttribute(attributeName: String?, value: ReadableMap?) {
        // Not used in Android - iOS only method
    }

    @ReactMethod
    fun deleteAttribute(attributeName: String?) {
        attributeName?.let { webEngageModuleImpl.deleteAttribute(it) }
    }

    @ReactMethod
    fun deleteAttributes(attributeNames: ReadableArray?) {
        attributeNames?.let { webEngageModuleImpl.deleteAttributes(it) }
    }

    @ReactMethod
    fun setEmail(email: String?) {
        email?.let { webEngageModuleImpl.setEmail(it) }
    }

    @ReactMethod
    fun setHashedEmail(hashedEmail: String?) {
        hashedEmail?.let { webEngageModuleImpl.setHashedEmail(it) }
    }

    @ReactMethod
    fun setPhone(phone: String?) {
        phone?.let { webEngageModuleImpl.setPhone(it) }
    }

    @ReactMethod
    fun setHashedPhone(hashedPhone: String?) {
        hashedPhone?.let { webEngageModuleImpl.setHashedPhone(it) }
    }

    @ReactMethod
    fun setBirthDateString(birthDate: String?) {
        birthDate?.let { webEngageModuleImpl.setBirthDateString(it) }
    }

    @ReactMethod
    fun setGender(gender: String?) {
        gender?.let { webEngageModuleImpl.setGender(it) }
    }

    @ReactMethod
    fun setFirstName(firstName: String?) {
        firstName?.let { webEngageModuleImpl.setFirstName(it) }
    }

    @ReactMethod
    fun setLastName(lastName: String?) {
        lastName?.let { webEngageModuleImpl.setLastName(it) }
    }

    @ReactMethod
    fun setCompany(company: String?) {
        company?.let { webEngageModuleImpl.setCompany(it) }
    }

    @ReactMethod
    fun setLocation(latitude: Double, longitude: Double) {
        webEngageModuleImpl.setLocation(latitude, longitude)
    }

    @ReactMethod
    fun setDevicePushOptIn(optIn: Boolean) {
        webEngageModuleImpl.setDevicePushOptIn(optIn)
    }

    @ReactMethod
    fun setOptIn(channel: String?, optIn: Boolean) {
        channel?.let { webEngageModuleImpl.setOptIn(it, optIn) }
    }

    @ReactMethod
    fun sendFcmToken(token: String?) {
        token?.let { webEngageModuleImpl.sendFcmToken(it) }
    }

    @ReactMethod
    fun onMessageReceived(remoteMessage: ReadableMap?) {
        remoteMessage?.let { webEngageModuleImpl.onMessageReceived(it) }
    }

    @ReactMethod
    fun startGAIDTracking() {
        webEngageModuleImpl.startGAIDTracking()
    }

    @ReactMethod
    fun updateListenerCount() {
        // Call the bridge's updateListenerCount method to maintain compatibility
        WebengageBridge.getInstance().updateListenerCount()
    }

    override fun getConstants(): Map<String, Any> {
        return webEngageModuleImpl.webEngageConstants
    }
}