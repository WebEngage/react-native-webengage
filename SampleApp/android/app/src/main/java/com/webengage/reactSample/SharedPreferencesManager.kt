package com.webengage.reactSample

import android.content.Context
import android.content.SharedPreferences


class SharedPreferencesManager private constructor(context: Context, prefName: String) {
    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences(prefName, Context.MODE_PRIVATE)

    fun putValue(key: String?, value: Boolean) {
        sharedPreferences.edit().putBoolean(key, value).apply()
    }

    fun getValue(key: String?, defaultValue: Boolean): Boolean {
        return sharedPreferences.getBoolean(key, defaultValue)
    }

    companion object {
        private var instance: SharedPreferencesManager? = null
        public val IS_REAL_USER: String = "IS_REAL_USER";

        @Synchronized
        fun getInstance(context: Context, prefName: String): SharedPreferencesManager? {
            if (instance == null) {
                instance = SharedPreferencesManager(context, prefName)
            }
            return instance
        }

        @Synchronized
        fun getInstance(): SharedPreferencesManager? {
            checkNotNull(instance) { "SharedPreferencesManager not initialized. Call getInstance(context, prefName) first." }
            return instance
        }
    }
}
