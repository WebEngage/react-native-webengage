package com.webengage;

import android.content.Context;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;

import com.webengage.sdk.android.Analytics;
import com.webengage.sdk.android.Logger;

import com.webengage.sdk.android.WebEngage;
import com.webengage.sdk.android.actions.render.InAppNotificationData;
import com.webengage.sdk.android.actions.render.PushNotificationData;
import com.webengage.sdk.android.callbacks.InAppNotificationCallbacks;
import com.webengage.sdk.android.callbacks.PushNotificationCallbacks;
import com.webengage.sdk.android.callbacks.StateChangeCallbacks;
import com.webengage.sdk.android.callbacks.WESecurityCallback;
import com.webengage.sdk.android.utils.Gender;
import com.webengage.sdk.android.Channel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

public class WebEngageModuleImpl implements PushNotificationCallbacks, InAppNotificationCallbacks, WESecurityCallback {
    private static final String TAG = "WEGWebEngageBridge";
    private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    private static final int DATE_FORMAT_LENGTH = DATE_FORMAT.replaceAll("'", "").length();

    private static volatile WebEngageModuleImpl INSTANCE = null;
    private static final Object lock = new Object();
    private volatile ReactApplicationContext context;

    public static WebEngageModuleImpl getInstance(ReactApplicationContext reactContext) {
        if (INSTANCE == null) {
            synchronized (lock) {
                if (INSTANCE == null) {
                    INSTANCE = new WebEngageModuleImpl(reactContext);
                }
            }
        }
        if (reactContext != null && INSTANCE.context != reactContext) {
            INSTANCE.setContext(reactContext);
        }
        return INSTANCE;
    }

    public static WebEngageModuleImpl getInstance() {
        if (INSTANCE == null) {
            synchronized (lock) {
                if (INSTANCE == null) {
                    INSTANCE = new WebEngageModuleImpl(null);
                }
            }
        }
        return INSTANCE;
    }

    public void setContext(ReactApplicationContext reactContext) {
        this.context = reactContext;
        registerStateChangeCallback();
    }

    private WebEngageModuleImpl(ReactApplicationContext reactContext) {
        this.context = reactContext;
        WebEngage.registerPushNotificationCallback(this);
        WebEngage.registerInAppNotificationCallback(this);
        WebEngage.registerWESecurityCallback(this);
        if (reactContext != null) {
            registerStateChangeCallback();
        }
    }

    public Map<String, Object> getWebEngageConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put("WebEngageProfileDidInitialize", "WebEngageProfileDidInitialize");
        constants.put("WebEngageNotificationPrepared", "notificationPrepared");
        constants.put("WebEngageNotificationShown", "notificationShown");
        constants.put("WebEngageNotificationClicked", "notificationClicked");
        constants.put("WebEngageNotificationDismissed", "notificationDismissed");
        constants.put("WebEngagePushNotificationShown", "pushNotificationShown");
        constants.put("WebEngagePushNotificationClicked", "pushNotificationClicked");
        constants.put("WebEngagePushNotificationDismissed", "pushNotificationDismissed");
        constants.put("WebEngageUniversalLinkClicked", "universalLinkClicked");
        constants.put("WebEngageTokenInvalidated", "tokenInvalidated");
        constants.put("WebEngageOnAnonymousIdChanged", "onAnonymousIdChanged");
        return constants;
    }

    private void registerStateChangeCallback() {
        if (context != null) {
            WebEngage.registerStateChangeCallback(new StateChangeCallbacks() {
                @Override
                public void onAnonymousIdChanged(Context context, String anonymousUserID) {
                    WritableMap map = Arguments.createMap();
                    map.putString("anonymousID", anonymousUserID);
                    WebengageBridge.sendEvent(WebEngageModuleImpl.this.context, "onAnonymousIdChanged", map);
                }
            });
        }
    }

    public void init() {
    }

    public void trackEventWithName(String name) {
        Analytics weAnalytics = WebEngage.get().analytics();
        weAnalytics.track(name);
    }

    public void trackEventWithNameAndData(String name, ReadableMap values) {
        Map<String, Object> map = recursivelyDeconstructReadableMap(values);
        WebEngage.get().analytics().track(name, map);
    }

    public void screenNavigated(String name) {
        WebEngage.get().analytics().screenNavigated(name);
    }

    public void screenNavigatedWithData(String name, ReadableMap userData) {
        WebEngage.get().analytics().screenNavigated(name, recursivelyDeconstructReadableMap(userData));
    }

    public void login(String userIdentifier) {
        WebEngage.get().user().login(userIdentifier);
    }

    public void loginWithSecureToken(String userIdentifier, String jwtToken) {
        WebEngage.get().user().login(userIdentifier, jwtToken);
    }

    public void setSecureToken(String cuid, String secureToken) {
        WebEngage.get().setSecurityToken(cuid, secureToken);
    }

    public void logout() {
        WebEngage.get().user().logout();
    }

    public void setAttribute(ReadableMap readableMap) {
        Map<String, Object> hashMap = recursivelyDeconstructReadableMap(readableMap);
        WebEngage.get().user().setAttributes(hashMap);
    }

    public void deleteAttribute(String attributeName) {
        WebEngage.get().user().deleteAttribute(attributeName);
    }

    public void deleteAttributes(ReadableArray attributeNames) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < attributeNames.size(); i++) {
            if (attributeNames.getType(i) == ReadableType.String) {
                result.add(attributeNames.getString(i));
            }
        }
        WebEngage.get().user().deleteAttributes(result);
    }

    public void setEmail(String email) {
        WebEngage.get().user().setEmail(email);
    }

    public void setHashedEmail(String hashedEmail) {
        WebEngage.get().user().setHashedEmail(hashedEmail);
    }

    public void setPhone(String phone) {
        WebEngage.get().user().setPhoneNumber(phone);
    }

    public void setHashedPhone(String hashedPhone) {
        WebEngage.get().user().setHashedPhoneNumber(hashedPhone);
    }

    public void setBirthDateString(String birthDateString) {
        WebEngage.get().user().setBirthDate(birthDateString);
    }

    public void setGender(String gender) {
        WebEngage.get().user().setGender(Gender.valueByString(gender));
    }

    public void setFirstName(String name) {
        WebEngage.get().user().setFirstName(name);
    }

    public void setLastName(String name) {
        WebEngage.get().user().setLastName(name);
    }

    public void setCompany(String company) {
        WebEngage.get().user().setCompany(company);
    }

    public void setLocation(Double lat, Double lng) {
        WebEngage.get().user().setLocation(lat, lng);
    }

    public void setDevicePushOptIn(Boolean state) {
        WebEngage.get().user().setDevicePushOptIn(state);
    }

    public void setOptIn(String channel, boolean status) {
        if ("push".equalsIgnoreCase(channel)) {
            WebEngage.get().user().setOptIn(Channel.PUSH, status);
        } else if ("sms".equalsIgnoreCase(channel)) {
            WebEngage.get().user().setOptIn(Channel.SMS, status);
        } else if ("email".equalsIgnoreCase(channel)) {
            WebEngage.get().user().setOptIn(Channel.EMAIL, status);
        } else if ("in_app".equalsIgnoreCase(channel)) {
            WebEngage.get().user().setOptIn(Channel.IN_APP, status);
        } else if ("whatsapp".equalsIgnoreCase(channel)) {
            WebEngage.get().user().setOptIn(Channel.WHATSAPP, status);
        } else if ("viber".equalsIgnoreCase(channel)) {
            WebEngage.get().user().setOptIn(Channel.VIBER, status);
        }
    }

    public void sendFcmToken(String fcmToken) {
        WebEngage.get().setRegistrationID(fcmToken);
    }

    public void onMessageReceived(ReadableMap readableMap) {
        Map<String, Object> hashMap = recursivelyDeconstructReadableMap(readableMap);
        Map<String, String> data = (Map<String, String>) hashMap.get("data");
        if (data != null && data.containsKey("source") && "webengage".equals(data.get("source"))) {
            WebEngage.get().receive(data);
        }
    }

    public void startGAIDTracking() {
        WebEngage.get().startGAIDTracking();
    }

    public void updateListenerCount() {
        // Implementation handled by WebengageBridge
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
            }
        }
        return deconstructedMap;
    }

    private List<Object> recursivelyDeconstructReadableArray(ReadableArray readableArray) {
        List<Object> deconstructedList = new ArrayList<>(readableArray.size());
        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType indexType = readableArray.getType(i);
            switch (indexType) {
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
            }
        }
        return deconstructedList;
    }

    private static Date getDate(String value) {
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATE_FORMAT, Locale.US);
            simpleDateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
            return simpleDateFormat.parse(value);
        } catch (Throwable t) {
            return null;
        }
    }

    // Callback implementations
    @Override
    public PushNotificationData onPushNotificationReceived(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        map.putMap("userData", WebengageBridge.convertJsonObjectToWriteable(pushNotificationData.getPushPayloadJSON()));
        map.putString("deeplink", pushNotificationData.getPrimeCallToAction().getAction());
        return pushNotificationData;
    }

    @Override
    public void onPushNotificationShown(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        map.putMap("userData", WebengageBridge.convertJsonObjectToWriteable(pushNotificationData.getPushPayloadJSON()));
        map.putString("deeplink", pushNotificationData.getPrimeCallToAction().getAction());
        WebengageBridge.sendEvent(this.context, "pushNotificationShown", map);
    }

    @Override
    public boolean onPushNotificationClicked(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        map.putMap("userData", WebengageBridge.convertJsonObjectToWriteable(pushNotificationData.getPushPayloadJSON()));
        map.putString("deeplink", pushNotificationData.getPrimeCallToAction().getAction());
        WebengageBridge.sendEvent(this.context, "pushNotificationClicked", map);
        return false;
    }

    @Override
    public void onPushNotificationDismissed(Context context, PushNotificationData pushNotificationData) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        map.putMap("userData", WebengageBridge.convertJsonObjectToWriteable(pushNotificationData.getPushPayloadJSON()));
        map.putString("deeplink", pushNotificationData.getPrimeCallToAction().getAction());
        WebengageBridge.sendEvent(this.context, "pushNotificationDismissed", map);
    }

    @Override
    public boolean onPushNotificationActionClicked(Context context, PushNotificationData pushNotificationData, String buttonId) {
        WritableMap map = Arguments.fromBundle(pushNotificationData.getCustomData());
        map.putMap("userData", WebengageBridge.convertJsonObjectToWriteable(pushNotificationData.getPushPayloadJSON()));
        map.putString("deeplink", pushNotificationData.getCallToActionById(buttonId).getAction());
        WebengageBridge.sendEvent(this.context, "pushNotificationClicked", map);
        return false;
    }

    @Override
    public InAppNotificationData onInAppNotificationPrepared(Context context, InAppNotificationData inAppNotificationData) {
        WebengageBridge.sendEvent(this.context, "notificationPrepared", WebengageBridge.convertJsonObjectToWriteable(inAppNotificationData.getData()));
        return inAppNotificationData;
    }

    @Override
    public void onInAppNotificationShown(Context context, InAppNotificationData inAppNotificationData) {
        WritableMap map = WebengageBridge.convertJsonObjectToWriteable(inAppNotificationData.getData());
        WebengageBridge.sendEvent(this.context, "notificationShown", map);
    }

    @Override
    public boolean onInAppNotificationClicked(Context context, InAppNotificationData inAppNotificationData, String actionId) {
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
            }
        } catch (JSONException e) {
            Logger.e(TAG, "JSONException while getting action link from in-app notification data", e);
        }

        WritableMap map = WebengageBridge.convertJsonObjectToWriteable(jsonObject);
        map.putString("deepLink", actionLink);
        map.putString("clickId", actionId);
        WebengageBridge.sendEvent(this.context, "notificationClicked", map);
        return false;
    }

    @Override
    public void onInAppNotificationDismissed(Context context, InAppNotificationData inAppNotificationData) {
        WebengageBridge.sendEvent(this.context, "notificationDismissed", WebengageBridge.convertJsonObjectToWriteable(inAppNotificationData.getData()));
    }

    @Override
    public void onSecurityException(Map<String, Object> map) {
        WebengageBridge.sendEvent(this.context, "tokenInvalidated", WebengageBridge.convertMapToWritableMap(map));
    }
}