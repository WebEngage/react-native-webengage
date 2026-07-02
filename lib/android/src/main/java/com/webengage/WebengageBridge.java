package com.webengage;

/**
 * Created by uzma on 10/25/17.
 */

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.webengage.sdk.android.Logger;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

//WebEngageBridge singleton

public class WebengageBridge extends ReactContextBaseJavaModule {
    private static final String TAG = "WEGWebEngageBridge";
    private static int listenerCount = 0;
    private static volatile WebengageBridge INSTANCE = null;
    private static final Object lock = new Object();
    private static final HashMap<String, ArrayList<WritableMap>> queuedMap = new HashMap<>(); 
    private ReactApplicationContext reactApplicationContext;
    private WebEngageModuleImpl webEngageModuleImpl;

    //no parameter initialization to be called from application class during react native initialization
    public static WebengageBridge getInstance() {
        if (INSTANCE == null) {
            synchronized (lock) {
                INSTANCE = new WebengageBridge(null);
            }
        }
        return INSTANCE;
    }

    //to be called during setting up package list
    public static WebengageBridge getInstance(ReactApplicationContext reactContext) {
        if (INSTANCE == null) {
            synchronized (lock) {
                INSTANCE = new WebengageBridge(reactContext);
            }
        }
        return INSTANCE;
    }

    public void setReactNativeContext(ReactApplicationContext context) {
        listenerCount = 0;
        reactApplicationContext = context;
        if (context != null) {
            if (webEngageModuleImpl == null) {
                webEngageModuleImpl = WebEngageModuleImpl.getInstance(context);
            } else {
                webEngageModuleImpl.setContext(context);
            }
        }
    }

    private WebengageBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        if (reactContext != null) {
            webEngageModuleImpl = WebEngageModuleImpl.getInstance(reactContext);
        } else {
            webEngageModuleImpl = WebEngageModuleImpl.getInstance();
        }
        listenerCount = 0;
    }


    @ReactMethod
    public void updateListenerCount() {
        ArrayList<Map.Entry<String, ArrayList<WritableMap>>> eventsToFlush;
        synchronized (lock) {
            listenerCount++;
            if (queuedMap.isEmpty()) {
                return;
            }
            eventsToFlush = new ArrayList<>(queuedMap.entrySet());
            queuedMap.clear();
        }
        for (Map.Entry<String, ArrayList<WritableMap>> entry : eventsToFlush) {
            String eventName = entry.getKey();
            ArrayList<WritableMap> events = entry.getValue();
            Logger.d(TAG, "Flushing " + events.size() + " queued events for: " + eventName);
            for (WritableMap event : events) {
                try {
                    if (reactApplicationContext != null) {
                        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(eventName, event);
                        Logger.d(TAG, "Flushed event: " + eventName);
                    } else {
                        Logger.d(TAG, "ReactContext null during flush, dropping event: " + eventName);
                    }
                } catch (Throwable e) {
                    Logger.d(TAG, "Failed to flush event: " + eventName + ", dropping. Error: " + e.getMessage());
                }
            }
        }
    }

    @ReactMethod
    public void addListener(String eventType) {
        // Required by NativeEventEmitter - handled by React Native
    }

    @ReactMethod
    public void removeListeners(double count) {
        // Required by NativeEventEmitter to avoid warnings
        // This method is called when listeners are removed
    }

    @Override
    public String getName() {
        return "WEGWebEngageBridge";
    }

    @ReactMethod
    public void init() {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.init();
        }
    }

    @ReactMethod
    public void trackEventWithName(String name) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.trackEventWithName(name);
        }
    }

    @ReactMethod
    public void trackEventWithNameAndData(String name, ReadableMap values) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.trackEventWithNameAndData(name, values);
        }
    }

    @ReactMethod
    public void screenNavigated(String name) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.screenNavigated(name);
        }
    }

    @ReactMethod
    public void screenNavigatedWithData(String name, ReadableMap userData) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.screenNavigatedWithData(name, userData);
        }
    }

    @ReactMethod
    public void login(String userIdentifier) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.login(userIdentifier);
        }
    }

    @ReactMethod
    public void loginWithSecureToken(String userIdentifier, String jwtToken) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.loginWithSecureToken(userIdentifier, jwtToken);
        }
    }

    @ReactMethod
    public void setSecureToken(String cuid, String secureToken) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setSecureToken(cuid, secureToken);
        }
    }

    @ReactMethod
    public void setAttribute(ReadableMap readableMap) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setAttribute(readableMap);
        }
    }

    @ReactMethod
    public void deleteAttribute(String attributeName) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.deleteAttribute(attributeName);
        }
    }

    @ReactMethod
    public void deleteAttributes(ReadableArray attributeNames) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.deleteAttributes(attributeNames);
        }
    }

    @ReactMethod
    public void setEmail(String email) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setEmail(email);
        }
    }

    @ReactMethod
    public void setHashedEmail(String hashedEmail) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setHashedEmail(hashedEmail);
        }
    }

    @ReactMethod
    public void setPhone(String phone) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setPhone(phone);
        }
    }

    @ReactMethod
    public void setHashedPhone(String hashedPhone) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setHashedPhone(hashedPhone);
        }
    }

    @ReactMethod
    public void setBirthDateString(String birthDateString) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setBirthDateString(birthDateString);
        }
    }

    @ReactMethod
    public void setGender(String gender) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setGender(gender);
        }
    }

    @ReactMethod
    public void setFirstName(String name) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setFirstName(name);
        }
    }
    
    @ReactMethod
    public void setLocation(Double lat, Double lng) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setLocation(lat, lng);
        }
    }

    @ReactMethod
    public void setLastName(String name) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setLastName(name);
        }
    }

    @ReactMethod
    public void setCompany(String company) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setCompany(company);
        }
    }

    @ReactMethod
    public void setDevicePushOptIn(Boolean state) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setDevicePushOptIn(state);
        }
    }

    @ReactMethod
    public void sendFcmToken(String fcmToken) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.sendFcmToken(fcmToken);
        }
    }

    @ReactMethod
    public void onMessageReceived(ReadableMap readableMap) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.onMessageReceived(readableMap);
        }
    }

    @ReactMethod
    public void setOptIn(String channel, boolean status) {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.setOptIn(channel, status);
        }
    }

    @ReactMethod
    public void logout() {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.logout();
        }
    }

    @ReactMethod
    public void startGAIDTracking() {
        if (webEngageModuleImpl != null) {
            webEngageModuleImpl.startGAIDTracking();
        }
    }

    // Helper methods moved to WebEngageModuleImpl

   public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    if (reactContext == null) {
        Logger.d(TAG, "ReactContext is null, queuing event: " + eventName);
        synchronized (lock) {
            if (!queuedMap.containsKey(eventName)) {
                queuedMap.put(eventName, new ArrayList<>());
            }
            queuedMap.get(eventName).add(params);
            Logger.d(TAG, "Event queued: " + eventName + " | pending=" + queuedMap.get(eventName).size());
        }
        return;
    }

    try {
        if (listenerCount > 0) {
            boolean emitted = false;

            try {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
                emitted = true;
                Logger.d(TAG, "Event emitted directly: " + eventName);
            } catch (Throwable e) {
                Logger.d(TAG, "Direct emit failed: " + eventName + " | Error: " + e.getMessage());
            }

            if (!emitted) {
                synchronized (lock) {
                    if (!queuedMap.containsKey(eventName)) {
                        queuedMap.put(eventName, new ArrayList<>());
                    }
                    queuedMap.get(eventName).add(params);
                    Logger.d(TAG, "Event queued (emit failed): " + eventName + " | pending=" + queuedMap.get(eventName).size());
                }
            }
        } else {
            synchronized (lock) {
                if (!queuedMap.containsKey(eventName)) {
                    queuedMap.put(eventName, new ArrayList<>());
                }
                queuedMap.get(eventName).add(params);
                Logger.d(TAG, "Event queued (no listeners): " + eventName + " | pending=" + queuedMap.get(eventName).size());
            }
        }
    } catch (Exception e) {
        Logger.d(TAG, "ERROR sending event: " + eventName + ", queuing. Error: " + e);
        synchronized (lock) {
            if (!queuedMap.containsKey(eventName)) {
                queuedMap.put(eventName, new ArrayList<>());
            }
            queuedMap.get(eventName).add(params);
        }
    }
}


    public static WritableMap convertJsonObjectToWriteable(JSONObject jsonObj) {
        WritableMap map = Arguments.createMap();
        Iterator<String> it = jsonObj.keys();
        while (it.hasNext()) {
            String key = it.next();
            Object obj = null;
            try {
                obj = jsonObj.get(key);
            } catch (JSONException jsonException) {
                Logger.e(TAG, "Key " + key + " should exist in " + String.valueOf(jsonObj), jsonException);
            } catch (Exception e) {
                Logger.e(TAG, "Exception while getting value for " + key, e);
            }

            if (obj instanceof JSONObject)
                map.putMap(key, convertJsonObjectToWriteable((JSONObject) obj));
            else if (obj instanceof JSONArray)
                map.putArray(key, convertJsonArrayToWriteable((JSONArray) obj));
            else if (obj instanceof String)
                map.putString(key, (String) obj);
            else if (obj instanceof Double)
                map.putDouble(key, (Double) obj);
            else if (obj instanceof Integer)
                map.putInt(key, (Integer) obj);
            else if (obj instanceof Boolean)
                map.putBoolean(key, (Boolean) obj);
            else if (obj == null || (obj == JSONObject.NULL))
                map.putNull(key);
            else
                Logger.e(TAG, "Unrecognized value for " + key + ": " + String.valueOf(obj));
        }
        return map;
    }

    public static WritableMap convertMapToWritableMap(Map<String, Object> map) {
        WritableMap writableMap = new WritableNativeMap();

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (value == null) {
                writableMap.putNull(key);
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                writableMap.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                writableMap.putString(key, (String) value);
            } else if (value instanceof Map) {
                writableMap.putMap(key, convertMapToWritableMap((Map<String, Object>) value));
            } else if (value instanceof List) {
                writableMap.putArray(key, convertListToWritableArray((List<Object>) value));
            }
        }

        return writableMap;
    }

    public static WritableArray convertListToWritableArray(List<Object> list) {
        WritableArray writableArray = new WritableNativeArray();

        for (Object item : list) {
            if (item == null) {
                writableArray.pushNull();
            } else if (item instanceof Boolean) {
                writableArray.pushBoolean((Boolean) item);
            } else if (item instanceof Integer) {
                writableArray.pushInt((Integer) item);
            } else if (item instanceof Double) {
                writableArray.pushDouble((Double) item);
            } else if (item instanceof String) {
                writableArray.pushString((String) item);
            } else if (item instanceof Map) {
                writableArray.pushMap(convertMapToWritableMap((Map<String, Object>) item));
            } else if (item instanceof List) {
                writableArray.pushArray(convertListToWritableArray((List<Object>) item));
            }
        }

        return writableArray;
    }

    public static WritableArray convertJsonArrayToWriteable(JSONArray jsonArr) {
        WritableArray arr = Arguments.createArray();
        for (int i = 0; i < jsonArr.length(); i++) {
            Object obj = null;
            try {
                obj = jsonArr.get(i);
            } catch (JSONException jsonException) {
                Logger.e(TAG, i + " should be within bounds of array " + String.valueOf(jsonArr), jsonException);
            }

            if (obj instanceof JSONObject)
                arr.pushMap(convertJsonObjectToWriteable((JSONObject) obj));
            else if (obj instanceof JSONArray)
                arr.pushArray(convertJsonArrayToWriteable((JSONArray) obj));
            else if (obj instanceof String)
                arr.pushString((String) obj);
            else if (obj instanceof Double)
                arr.pushDouble((Double) obj);
            else if (obj instanceof Integer)
                arr.pushInt((Integer) obj);
            else if (obj instanceof Boolean)
                arr.pushBoolean((Boolean) obj);
            else if (obj == null)
                arr.pushNull();
            else
                Logger.e(TAG, "Unrecognized object: " + String.valueOf(obj));
        }

        return arr;
    }
}