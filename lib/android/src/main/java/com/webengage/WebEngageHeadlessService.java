package com.webengage;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.webengage.sdk.android.Logger;


public class WebEngageHeadlessService extends HeadlessJsTaskService {
    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Logger.d("WebEngage","headlessJS Triggered");
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "WebEngageHeadless",
                    Arguments.fromBundle(extras),
                    5000, // timeout in milliseconds for the task
                    false // optional: defines whether or not the task is allowed in foreground. Default is false
            );
        }
        return null;

    }
}
