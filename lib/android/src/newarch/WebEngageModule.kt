package com.webengage

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.webengage.sdk.android.Logger

class WebEngageModule(reactContext: ReactApplicationContext?) :
    NativeWebEngageModuleSpec(reactContext) {

    companion object {
        @JvmStatic
        fun setInitialUri(uri: android.net.Uri?) {
            // Handle initial URI if needed
        }
    }

    private val webEngageModuleImpl: WebEngageModuleImpl = WebEngageModuleImpl(reactContext!!)

    override fun getName(): String {
        Logger.d("WebEngage","Architecture: NEW architecture in android lib");

        return "WETurboModule"
    }

    override fun init(autoRegister: Boolean) {
        Logger.d("WebEngage","Architecture: NEW architecture in android lib");

        webEngageModuleImpl.init(autoRegister)
    }

    override fun trackEventWithName(eventName: String?) {
        eventName?.let { webEngageModuleImpl.trackEventWithName(it) }
    }

    override fun trackEventWithNameAndData(eventName: String?, eventData: ReadableMap?) {
        if (eventName != null && eventData != null) {
            webEngageModuleImpl.trackEventWithNameAndData(eventName, eventData)
        }
    }

    override fun screenNavigated(screenName: String?) {
        screenName?.let { webEngageModuleImpl.screenNavigated(it) }
    }

    override fun screenNavigatedWithData(screenName: String?, screenData: ReadableMap?) {
        if (screenName != null && screenData != null) {
            webEngageModuleImpl.screenNavigatedWithData(screenName, screenData)
        }
    }

    override fun login(userId: String?) {
        Logger.d("WebEngage", "login: NEW ARCH - WebEngageModule.login() called with userId: $userId")
        userId?.let { 
            Logger.d("WebEngage", "login: NEW ARCH - Delegating to WebEngageModuleImpl.login()")
            webEngageModuleImpl.login(it) 
        }
    }

    override fun loginWithSecureToken(userId: String?, jwtToken: String?) {
        Logger.d("WebEngage", "login: NEW ARCH - WebEngageModule.loginWithSecureToken() called with userId: $userId")
        if (userId != null && jwtToken != null) {
            Logger.d("WebEngage", "login: NEW ARCH - Delegating to WebEngageModuleImpl.loginWithSecureToken()")
            webEngageModuleImpl.loginWithSecureToken(userId, jwtToken)
        }
    }

    override fun setSecureToken(userId: String?, secureToken: String?) {
        if (userId != null && secureToken != null) {
            webEngageModuleImpl.setSecureToken(userId, secureToken)
        }
    }

    override fun logout() {
        webEngageModuleImpl.logout()
    }

    override fun setAttribute(attributes: ReadableMap?) {
        attributes?.let { webEngageModuleImpl.setAttribute(it) }
    }

    override fun deleteAttribute(attributeName: String?) {
        attributeName?.let { webEngageModuleImpl.deleteAttribute(it) }
    }

    override fun deleteAttributes(attributeNames: ReadableArray?) {
        attributeNames?.let { webEngageModuleImpl.deleteAttributes(it) }
    }

    override fun setEmail(email: String?) {
        email?.let { webEngageModuleImpl.setEmail(it) }
    }

    override fun setHashedEmail(hashedEmail: String?) {
        hashedEmail?.let { webEngageModuleImpl.setHashedEmail(it) }
    }

    override fun setPhone(phone: String?) {
        phone?.let { webEngageModuleImpl.setPhone(it) }
    }

    override fun setHashedPhone(hashedPhone: String?) {
        hashedPhone?.let { webEngageModuleImpl.setHashedPhone(it) }
    }

    override fun setBirthDateString(birthDate: String?) {
        birthDate?.let { webEngageModuleImpl.setBirthDateString(it) }
    }

    override fun setGender(gender: String?) {
        gender?.let { webEngageModuleImpl.setGender(it) }
    }

    override fun setFirstName(firstName: String?) {
        firstName?.let { webEngageModuleImpl.setFirstName(it) }
    }

    override fun setLastName(lastName: String?) {
        lastName?.let { webEngageModuleImpl.setLastName(it) }
    }

    override fun setCompany(company: String?) {
        company?.let { webEngageModuleImpl.setCompany(it) }
    }

    override fun setLocation(latitude: Double, longitude: Double) {
        webEngageModuleImpl.setLocation(latitude, longitude)
    }

    override fun setDevicePushOptIn(optIn: Boolean) {
        webEngageModuleImpl.setDevicePushOptIn(optIn)
    }

    override fun setOptIn(channel: String?, optIn: Boolean) {
        channel?.let { webEngageModuleImpl.setOptIn(it, optIn) }
    }

    override fun sendFcmToken(token: String?) {
        token?.let { webEngageModuleImpl.sendFcmToken(it) }
    }

    override fun onMessageReceived(remoteMessage: ReadableMap?) {
        remoteMessage?.let { webEngageModuleImpl.onMessageReceived(it) }
    }

    override fun startGAIDTracking() {
        webEngageModuleImpl.startGAIDTracking()
    }

    override fun updateListenerCount() {
        // Call the bridge's updateListenerCount method to maintain compatibility
        WebengageBridge.getInstance().updateListenerCount()
        webEngageModuleImpl.updateListenerCount()
    }

    override fun addListener(eventType: String?) {
        // Handled by React Native
    }

    override fun removeListeners(count: Double) {
        // Handled by React Native
    }

    override fun getTypedExportedConstants(): Map<String, Any> {
        return webEngageModuleImpl.webEngageConstants
    }
}