package com.exampleapp;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ExampleApp";
    }
     @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("WebEngage-React","Activity On Create");
    }
}
