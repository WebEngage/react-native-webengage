package com.exampleapp;

import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = MyFirebaseMessagingService.class.getSimpleName();

    private boolean includesWebEngage() {
        try {
            Class.forName("com.webengage.sdk.android.WebEngage");
            return true;
        } catch (ClassNotFoundException e) {
        }
        return false;
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d("TAG", TAG + " > onMessageReceived() > remote msg: " + remoteMessage);
        Map<String, String> data = remoteMessage.getData();
        if (data != null) {
            if (includesWebEngage()) {
                if (data.containsKey("source") && "webengage".equals(data.get("source"))) {
                    com.webengage.sdk.android.WebEngage.get().receive(data);
                }
            }
        }
    }

    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
        if (includesWebEngage()) {
            com.webengage.sdk.android.WebEngage.get().setRegistrationID(s);
        }
    }
}
