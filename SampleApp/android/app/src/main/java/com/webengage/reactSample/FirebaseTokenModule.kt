package com.webengage.reactSample

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.firebase.messaging.FirebaseMessaging

class FirebaseTokenModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "FirebaseTokenModule"
        const val NAME = "FirebaseTokenModule"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun deletePushToken(promise: Promise) {
        FirebaseMessaging.getInstance().deleteToken()
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Log.d(TAG, "Push token deleted successfully")
                    promise.resolve("Push token deleted successfully")
                } else {
                    Log.e(TAG, "Failed to delete push token", task.exception)
                    promise.reject("DELETE_TOKEN_ERROR", "Failed to delete push token", task.exception)
                }
            }
    }

    @ReactMethod
    fun generatePushToken(promise: Promise) {
        FirebaseMessaging.getInstance().token
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val token = task.result
                    Log.d(TAG, "Push token generated: $token")
                    promise.resolve(token)
                } else {
                    Log.e(TAG, "Failed to generate push token", task.exception)
                    promise.reject("GENERATE_TOKEN_ERROR", "Failed to generate push token", task.exception)
                }
            }
    }
}
