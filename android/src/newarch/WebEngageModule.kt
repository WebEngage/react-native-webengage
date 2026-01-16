package com.webengage

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.webengage.sdk.android.Logger
import com.webengage.bridge.NativeWebEngageModuleSpec

class WebEngageModule(reactContext: ReactApplicationContext?) :
    NativeWebEngageModuleSpec(reactContext) {

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
        return try {
            webEngageModuleImpl?.let(action)
        } catch (e: Exception) {
            Logger.e("WebEngageModule", "Error executing action with return", e)
            null
        }
    }

    override fun getName(): String {
        return "WEGWebEngageBridge"
    }

    override fun initializeWebEngage() {
        safeExecute { it.init() }
    }

    override fun trackEventWithName(eventName: String?) {
        eventName?.let { name -> safeExecute { it.trackEventWithName(name) } }
    }

    override fun trackEventWithNameAndData(eventName: String?, eventData: ReadableMap?) {
        if (eventName != null && eventData != null) {
            safeExecute { it.trackEventWithNameAndData(eventName, eventData) }
        }
    }

    override fun screenNavigated(screenName: String?) {
        screenName?.let { name -> safeExecute { it.screenNavigated(name) } }
    }

    override fun screenNavigatedWithData(screenName: String?, screenData: ReadableMap?) {
        if (screenName != null && screenData != null) {
            safeExecute { it.screenNavigatedWithData(screenName, screenData) }
        }
    }

    override fun login(userId: String?) {
        userId?.let { id -> safeExecute { it.login(id) } }
    }

    override fun loginWithSecureToken(userId: String?, jwtToken: String?) {
        if (userId != null && jwtToken != null) {
            safeExecute { it.loginWithSecureToken(userId, jwtToken) }
        }
    }

    override fun setSecureToken(userId: String?, secureToken: String?) {
        if (userId != null && secureToken != null) {
            safeExecute { it.setSecureToken(userId, secureToken) }
        }
    }

    override fun logout() {
        safeExecute { it.logout() }
    }

    override fun setAndroidAttribute(attributes: ReadableMap?) {
        attributes?.let { attrs -> safeExecute { it.setAttribute(attrs) } }
    }

    override fun setIosAttribute(attributeName: String?, value: ReadableMap?) {
        // Not used in Android - iOS only method
    }

    override fun deleteAttribute(attributeName: String?) {
        attributeName?.let { name -> safeExecute { it.deleteAttribute(name) } }
    }

    override fun deleteAttributes(attributeNames: ReadableArray?) {
        attributeNames?.let { names -> safeExecute { it.deleteAttributes(names) } }
    }

    override fun setEmail(email: String?) {
        email?.let { e -> safeExecute { it.setEmail(e) } }
    }

    override fun setHashedEmail(hashedEmail: String?) {
        hashedEmail?.let { e -> safeExecute { it.setHashedEmail(e) } }
    }

    override fun setPhone(phone: String?) {
        phone?.let { p -> safeExecute { it.setPhone(p) } }
    }

    override fun setHashedPhone(hashedPhone: String?) {
        hashedPhone?.let { p -> safeExecute { it.setHashedPhone(p) } }
    }

    override fun setBirthDateString(birthDate: String?) {
        birthDate?.let { date -> safeExecute { it.setBirthDateString(date) } }
    }

    override fun setGender(gender: String?) {
        gender?.let { g -> safeExecute { it.setGender(g) } }
    }

    override fun setFirstName(firstName: String?) {
        firstName?.let { name -> safeExecute { it.setFirstName(name) } }
    }

    override fun setLastName(lastName: String?) {
        lastName?.let { name -> safeExecute { it.setLastName(name) } }
    }

    override fun setCompany(company: String?) {
        company?.let { c -> safeExecute { it.setCompany(c) } }
    }

    override fun setLocation(latitude: Double, longitude: Double) {
        safeExecute { it.setLocation(latitude, longitude) }
    }

    override fun setDevicePushOptIn(optIn: Boolean) {
        safeExecute { it.setDevicePushOptIn(optIn) }
    }

    override fun setOptIn(channel: String?, optIn: Boolean) {
        channel?.let { ch -> safeExecute { it.setOptIn(ch, optIn) } }
    }

    override fun sendFcmToken(token: String?) {
        token?.let { t -> safeExecute { it.sendFcmToken(t) } }
    }

    override fun onMessageReceived(remoteMessage: ReadableMap?) {
        remoteMessage?.let { msg -> safeExecute { it.onMessageReceived(msg) } }
    }

    override fun startGAIDTracking() {
        safeExecute { it.startGAIDTracking() }
    }

    override fun updateListenerCount() {
        // Call the bridge's updateListenerCount method to maintain compatibility
        WebengageBridge.getInstance().updateListenerCount()
    }
    
     override fun addListener(eventType: String?) {
        // Handled by React Native
    }

    override fun removeListeners(count: Double) {
        // Handled by React Native
    }

    override fun getConstants(): Map<String, Any>? {
        return safeExecuteWithReturn { it.webEngageConstants }
    }
}