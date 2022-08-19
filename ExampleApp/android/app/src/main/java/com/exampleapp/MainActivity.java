package com.exampleapp;

import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.webengage.sdk.android.WebEngage;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ExampleApp";
    }
    public static final String PUSH_NOTIFICATIONS = "android.permission.POST_NOTIFICATIONS"; //Applicable from Android 13 and above

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //For App's targeting below 33
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (Build.VERSION.SDK_INT >= 33) {
                Log.d("TAG", "onResume: checking for PUSH_NOTIFICATIONS: " + (checkSelfPermission(PUSH_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED));
                if (checkSelfPermission(PUSH_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    this.requestPermissions(new String[]{PUSH_NOTIFICATIONS}, 102);
                    WebEngage.get().user().setDevicePushOptIn(false);
                } else {
                    WebEngage.get().user().setDevicePushOptIn(true);
                }
            }
        }


    }
}
