package com.webengage;

/**
 * Created by uzma on 10/25/17.
 */

import android.net.Uri;
import android.content.Context;
import android.os.Bundle;
import android.renderscript.Sampler;
import android.util.Log;
import com.webengage.sdk.android.Logger;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.webengage.sdk.android.Analytics;
import com.webengage.sdk.android.UserProfile;
import com.webengage.sdk.android.WebEngage;
import com.webengage.sdk.android.actions.render.InAppNotificationData;
import com.webengage.sdk.android.actions.render.PushNotificationData;
import com.webengage.sdk.android.callbacks.InAppNotificationCallbacks;
import com.webengage.sdk.android.callbacks.PushNotificationCallbacks;
import com.webengage.sdk.android.utils.Gender;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javax.annotation.Nullable;

public class WebengageBridge extends ReactContextBaseJavaModule implements PushNotificationCallbacks, InAppNotificationCallbacks {
    private static final String TAG = "webengageBridge";
    private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    private static final int DATE_FORMAT_LENGTH = DATE_FORMAT.replaceAll("'", "").length();

    public WebengageBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d(TAG, "Constructor called");
        WebEngage.registerPushNotificationCallback(this);
        WebEngage.registerInAppNotificationCallback(this);
    }

    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void init(boolean autoRegister) {
        WebEngage.registerPushNotificationCallback(this);
        WebEngage.registerInAppNotificationCallback(this);
    }

    private static Date getDate(String value) {
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATE_FORMAT, Locale.US);
            simpleDateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
            return simpleDateFormat.parse(value);
        } catch (Throwable t) {
        }
        return null;
    }

    @ReactMethod
    public void trackEventWithName(String name) {
        Analytics weAnalytics = WebEngage.get().analytics();
        weAnalytics.track(name);
    }

    @ReactMethod
    public void trackEventWithNameAndData(String name, ReadableMap values){
        Map<String, Object> map = recursivelyDeconstructReadableMap(values);
        WebEngage.get().analytics().track(name,map);
    }

    @ReactMethod
    public void screenNavigated(String name) {
        WebEngage.get().analytics().screenNavigated(name);
    }

    @ReactMethod
    public void screenNavigatedWithData(String name, ReadableMap userData){
        WebEngage.get().analytics().screenNavigated(name,recursivelyDeconstructReadableMap(userData));
    }

    @ReactMethod
    public void login(String userIdentifier){
        WebEngage.get().user().login(userIdentifier);
    }

    @ReactMethod
    public void setAttribute(ReadableMap readableMap) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        Map<String, Object> hashMap = recursivelyDeconstructReadableMap(readableMap);
        Logger.d(TAG, "Setting user attributes: " + hashMap);
        WebEngage.get().user().setAttributes(hashMap);
    }

    @ReactMethod
    public void deleteAttribute(String attributeName){
        WebEngage.get().user().deleteAttribute(attributeName);
    }

    @ReactMethod
    public void deleteAttributes(ReadableArray attributeNames){
        int n = attributeNames.size();
        List<String> result = new ArrayList<String>(n);
        for (int i = 0; i < n; i++) {
            ReadableType indexType = attributeNames.getType(i);
            if (indexType == ReadableType.String) {
                result.add(attributeNames.getString(i));
            } else {
                Logger.e(TAG, "Invalid data type at index " + i + ", key must be String.");
            }
        }
        WebEngage.get().user().deleteAttributes(result);
    }

    @ReactMethod
    public void setEmail(String email){
        WebEngage.get().user().setEmail(email);
    }

    @ReactMethod
    public void setHashedEmail(String hashedEmail){
        WebEngage.get().user().setHashedEmail(hashedEmail);
    }

    @ReactMethod
    public void setPhone(String phone){
        WebEngage.get().user().setPhoneNumber(phone);
    }

    @ReactMethod
    public void setHashedPhone(String hashedPhone){
        WebEngage.get().user().setHashedPhoneNumber(hashedPhone);
    }

    @ReactMethod
    public void setBirthDateString(String birthDateString){
        WebEngage.get().user().setBirthDate(birthDateString);
    }

    @ReactMethod
    public void setGender(String gender){
        WebEngage.get().user().setGender(Gender.valueByString(gender));
    }

    @ReactMethod
    public void setFirstName(String name){
        WebEngage.get().user().setFirstName(name);
    }

    @ReactMethod
    public void setLastName(String name){
        WebEngage.get().user().setLastName(name);
    }

    @ReactMethod
    public void setCompany(String company){
        WebEngage.get().user().setCompany(company);
    }

    @ReactMethod
    public void logout(){
        WebEngage.get().user().logout();
    }

    private Map<String, Object> recursivelyDeconstructReadableMap(ReadableMap readableMap) {
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        Map<String, Object> deconstructedMap = new HashMap<>();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);
            switch (type) {
                case Null:
                    deconstructedMap.put(key, null);
                    break;
                case Boolean:
                    deconstructedMap.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    deconstructedMap.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    String value = readableMap.getString(key);
                    if (value.length() == DATE_FORMAT_LENGTH) {
                        Date date = getDate(value);
                        if (date != null) {
                            deconstructedMap.put(key, date);
                        } else {
                            deconstructedMap.put(key, value);
                        }
                    } else {
                        deconstructedMap.put(key, value);
                    }
                    break;
                case Map:
                    Map<String, Object> nestedMap = recursivelyDeconstructReadableMap(readableMap.getMap(key));
                    deconstructedMap.put(key, nestedMap);
                    break;
                case Array:
                    List<Object> nestedList = recursivelyDeconstructReadableArray(readableMap.getArray(key));
                    deconstructedMap.put(key, nestedList);
                    break;
                default:
                    Logger.e(TAG, "Could not convert object with key: " + key);
            }
        }
        return deconstructedMap;
    }

    private List<Object> recursivelyDeconstructReadableArray(ReadableArray readableArray) {
        List<Object> deconstructedList = new ArrayList<>(readableArray.size());
        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType indexType = readableArray.getType(i);
            switch(indexType) {
                case Null:
                    deconstructedList.add(i, null);
                    break;
                case Boolean:
                    deconstructedList.add(i, readableArray.getBoolean(i));
                    break;
                case Number:
                    deconstructedList.add(i, readableArray.getDouble(i));
                    break;
                case String:
                    String value = readableArray.getString(i);
                    if (value.length() == DATE_FORMAT_LENGTH) {
                        Date date = getDate(value);
                        if (date != null) {
                            deconstructedList.add(i, date);
                        } else {
                            deconstructedList.add(i, value);
                        }
                    } else {
                        deconstructedList.add(i, value);
                    }
                    break;
                case Map:
                    deconstructedList.add(i, recursivelyDeconstructReadableMap(readableArray.getMap(i)));
                    break;
                case Array:
                    deconstructedList.add(i, recursivelyDeconstructReadableArray(readableArray.getArray(i)));
                    break;
                default:
                    Logger.e(TAG, "Could not convert object at index " + i);
            }
        }
        return deconstructedList;
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
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

    public static WritableArray convertJsonArrayToWriteable(JSONArray jsonArr) {
        WritableArray arr = Arguments.createArray();
        for (int i=0; i<jsonArr.length(); i++) {
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

    @Override
    public PushNotificationData onPushNotificationReceived(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        sendEvent(getReactApplicationContext(), "pushNotificationReceived", map);
        return pushNotificationData;
    }

    @Override
    public void onPushNotificationShown(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        sendEvent(getReactApplicationContext(), "pushNotificationShown", map);
    }

    @Override
    public boolean onPushNotificationClicked(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        sendEvent(getReactApplicationContext(), "pushNotificationClicked", map);
        return false;
    }

    @Override
    public void onPushNotificationDismissed(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        sendEvent(getReactApplicationContext(), "pushNotificationDismissed", map);
    }

    @Override
    public boolean onPushNotificationActionClicked(Context context, PushNotificationData pushNotificationData, String buttonId) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        sendEvent(getReactApplicationContext(), "pushNotificationClicked", map);
        return false;
    }

    @Override
    public InAppNotificationData onInAppNotificationPrepared(Context context, InAppNotificationData inAppNotificationData) {
        sendEvent(getReactApplicationContext(), "notificationPrepared", convertJsonObjectToWriteable(inAppNotificationData.getData()));
        return inAppNotificationData;
    }

    @Override
    public void onInAppNotificationShown(Context context, InAppNotificationData inAppNotificationData) {
        WritableMap map = convertJsonObjectToWriteable(inAppNotificationData.getData());
        Logger.d(TAG, "in-app notification data: " + map);
        sendEvent(getReactApplicationContext(), "notificationShown", map);
    }

    @Override
    public boolean onInAppNotificationClicked(Context context, InAppNotificationData inAppNotificationData, String actionId) {
        Logger.d(TAG, "action id: " + actionId);
        JSONObject jsonObject = inAppNotificationData.getData();
        String actionLink = null;
        try {
            JSONArray actions = jsonObject.isNull("actions") ? null : jsonObject.getJSONArray("actions");
            if (actions != null) {
                for (int i = 0; i < actions.length(); i++) {
                    JSONObject action = actions.getJSONObject(i);
                    String actionEId = action.isNull("actionEId") ? null : action.optString("actionEId");
                    if (actionEId != null && actionEId.equals(actionId)) {
                        actionLink = action.isNull("actionLink") ? null : action.getString("actionLink");
                        break;
                    }
                }

                List<String> params = null;
                try {
                    params = Uri.parse(actionLink).getPathSegments();
                } catch (Exception e) {

                }

                if (params != null && params.size() > 1) {
                    actionLink = params.get(1);
                }

                Logger.d(TAG, "action link: " + actionLink);
            }
        } catch (JSONException e) {
            Logger.e(TAG, "JSONException while getting action link from in-app notification data", e);
        }

        WritableMap map = convertJsonObjectToWriteable(jsonObject);
        map.putString("deepLink", actionLink);
        map.putString("clickId", actionId);
        sendEvent(getReactApplicationContext(), "notificationClicked", map);
        return false;
    }

    @Override
    public void onInAppNotificationDismissed(Context context, InAppNotificationData inAppNotificationData) {
        sendEvent(getReactApplicationContext(), "notificationDismissed", convertJsonObjectToWriteable(inAppNotificationData.getData()));
    }
}
