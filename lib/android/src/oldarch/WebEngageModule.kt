package com.webengage

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.webengage.sdk.android.Logger

class WebEngageModule(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {

    private val webEngageModuleImpl: WebEngageModuleImpl? = try {
        reactContext?.let { WebEngageModuleImpl(it) }
    } catch (e: Exception) {
        Logger.e("WebEngageModule", "Failed to initialize WebEngageModuleImpl", e)
        null
    }

    private fun safeExecute(action: (WebEngageModuleImpl) -> Unit) {
        webEngageModuleImpl?.let(action) ?: Logger.w("WebEngageModule", "Module not initialized")
    }

    private fun <T> safeExecuteWithReturn(action: (WebEngageModuleImpl) -> T): T? {
        return webEngageModuleImpl?.let(action)
    }

    override fun getName(): String {
        return "WEGWebEngageBridge"
    }

    @ReactMethod
    fun initializeWebEngage() {
        safeExecute { it.init() }
    }

    @ReactMethod
    fun trackEventWithName(eventName: String?) {
        eventName?.let { name -> safeExecute { it.trackEventWithName(name) } }
    }

    @ReactMethod
    fun trackEventWithNameAndData(eventName: String?, eventData: ReadableMap?) {
        if (eventName != null && eventData != null) {
            safeExecute { it.trackEventWithNameAndData(eventName, eventData) }
        }
    }

    @ReactMethod
    fun screenNavigated(screenName: String?) {
        screenName?.let { name -> safeExecute { it.screenNavigated(name) } }
    }

    @ReactMethod
    fun screenNavigatedWithData(screenName: String?, screenData: ReadableMap?) {
        if (screenName != null && screenData != null) {
            safeExecute { it.screenNavigatedWithData(screenName, screenData) }
        }
    }

    @ReactMethod
    fun login(userId: String?) {
        userId?.let { id -> safeExecute { it.login(id) } }
    }

    @ReactMethod
    fun loginWithSecureToken(userId: String?, jwtToken: String?) {
        if (userId != null && jwtToken != null) {
            safeExecute { it.loginWithSecureToken(userId, jwtToken) }
        }
    }

    @ReactMethod
    fun setSecureToken(userId: String?, secureToken: String?) {
        if (userId != null && secureToken != null) {
            safeExecute { it.setSecureToken(userId, secureToken) }
        }
    }

    @ReactMethod
    fun logout() {
        safeExecute { it.logout() }
    }

    @ReactMethod
    fun setAndroidAttribute(attributes: ReadableMap?) {
        attributes?.let { attrs -> safeExecute { it.setAttribute(attrs) } }
    }

    @ReactMethod
    fun setIosAttribute(attributeName: String?, value: ReadableMap?) {
        // Not used in Android - iOS only method
    }

    @ReactMethod
    fun deleteAttribute(attributeName: String?) {
        attributeName?.let { name -> safeExecute { it.deleteAttribute(name) } }
    }

    @ReactMethod
    fun deleteAttributes(attributeNames: ReadableArray?) {
        attributeNames?.let { names -> safeExecute { it.deleteAttributes(names) } }
    }

    @ReactMethod
    fun setEmail(email: String?) {
        email?.let { e -> safeExecute { it.setEmail(e) } }
    }

    @ReactMethod
    fun setHashedEmail(hashedEmail: String?) {
        hashedEmail?.let { e -> safeExecute { it.setHashedEmail(e) } }
    }

    @ReactMethod
    fun setPhone(phone: String?) {
        phone?.let { p -> safeExecute { it.setPhone(p) } }
    }

    @ReactMethod
    fun setHashedPhone(hashedPhone: String?) {
        hashedPhone?.let { p -> safeExecute { it.setHashedPhone(p) } }
    }

    @ReactMethod
    fun setBirthDateString(birthDate: String?) {
        birthDate?.let { date -> safeExecute { it.setBirthDateString(date) } }
    }

    @ReactMethod
    fun setGender(gender: String?) {
        gender?.let { g -> safeExecute { it.setGender(g) } }
    }

    @ReactMethod
    fun setFirstName(firstName: String?) {
        firstName?.let { name -> safeExecute { it.setFirstName(name) } }
    }

    @ReactMethod
    fun setLastName(lastName: String?) {
        lastName?.let { name -> safeExecute { it.setLastName(name) } }
    }

    @ReactMethod
    fun setCompany(company: String?) {
        company?.let { c -> safeExecute { it.setCompany(c) } }
    }

    @ReactMethod
    fun setLocation(latitude: Double, longitude: Double) {
        safeExecute { it.setLocation(latitude, longitude) }
    }

    @ReactMethod
    fun setDevicePushOptIn(optIn: Boolean) {
        safeExecute { it.setDevicePushOptIn(optIn) }
    }

    @ReactMethod
    fun setOptIn(channel: String?, optIn: Boolean) {
        channel?.let { ch -> safeExecute { it.setOptIn(ch, optIn) } }
    }

    @ReactMethod
    fun sendFcmToken(token: String?) {
        token?.let { t -> safeExecute { it.sendFcmToken(t) } }
    }

    @ReactMethod
    fun onMessageReceived(remoteMessage: ReadableMap?) {
        remoteMessage?.let { msg -> safeExecute { it.onMessageReceived(msg) } }
    }

    @ReactMethod
    fun startGAIDTracking() {
        safeExecute { it.startGAIDTracking() }
    }

    @ReactMethod
    fun updateListenerCount() {
        // Call the bridge's updateListenerCount method to maintain compatibility
        WebengageBridge.getInstance().updateListenerCount()
    }

    @ReactMethod
    fun addListener(eventType: String?) {
        // Required by NativeEventEmitter - handled by React Native
    }

    @ReactMethod
    fun removeListeners(count: Double) {
        // Required by NativeEventEmitter to avoid warnings
        // This method is called when listeners are removed
    }

    override fun getConstants(): Map<String, Any>? {
        return safeExecuteWithReturn { it.webEngageConstants }
    }
}