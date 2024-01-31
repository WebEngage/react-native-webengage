package com.webengage.reactSample

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage
import com.webengage.sdk.android.WebEngage;
//com.webengage.reactSample.MyFirebaseMessagingService
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(s: String) {
        super.onNewToken(s)
        WebEngage.get().setRegistrationID(s)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val data: Map<String, String> = remoteMessage.data
        if (data != null) {
            if (data.containsKey("source") && "webengage" == data["source"]) {
                WebEngage.get().receive(data)
            }
        }
    }

}