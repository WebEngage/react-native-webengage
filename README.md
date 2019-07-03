
[![Version](https://img.shields.io/npm/v/react-native-webengage.svg)](https://www.npmjs.com/package/react-native-webengage)
[![License](https://img.shields.io/cocoapods/l/WebEngage.svg?style=flat)](https://github.com/WebEngage/react-native-webengage/blob/master/LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://docs.webengage.com/docs/react-native-getting-started)
[![LastUpdated](https://img.shields.io/github/last-commit/WebEngage/react-native-webengage.svg)](https://docs.webengage.com/docs/react-native-getting-started)

This project contains WebEngage React Native SDK(lib) and a Sample Project(ExampleApp).

# Sample Project

To run Sample Project please follow below steps:

1. Navigate to ExampleApp folder

2.  npm install --save

3.  For Android, replace ```YOUR_LICENSE_CODE``` with your WebEngage license code and ```YOUR_PUSH_PROJECT_NUMBER``` with your push project number in [MainApplication.java](https://github.com/WebEngage/react-native-webengage/blob/master/ExampleApp/android/app/src/main/java/com/exampleapp/MainApplication.java) file.

4. For iOS, replace ```YOUR_LICENSE_CODE``` with your WebEngage license code in [info.plist](https://github.com/WebEngage/react-native-webengage/blob/master/ExampleApp/ios/ExampleApp/Info.plist) file.

5. Now run you project using ```react-native run-android``` or ```react-native run-ios```.


# WebEngage React Native SDK

For complete integration guide please refer to our [official documentation](https://docs.webengage.com/docs/react-native-getting-started).


## Installation

1. Install React Native WebEngage SDK.

```shell
npm install react-native-webengage --save
```

2. Link the React Native WebEngage SDK.

```shell
react-native link react-native-webengage
```


## Integration

### Integration for Android

1. Add Native WebEngage dependency in app-level build.gradle file at `android/app/build.gradle`.

```gradle
dependencies {
    ...
    implementation 'com.webengage:android-sdk:3.+'
    implementation 'com.google.android.gms:play-services-ads:15.0.1'
}
```

2. Initialise WebEngage SDK in `android/app/src/main/java/[your/package]/MainApplication.java` file.

```java
...
import com.webengage.sdk.android.WebEngageConfig;
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import com.webengage.sdk.android.WebEngage;

public class MainApplication extends Application implements ReactApplication {
    ...

    @Override
    public void onCreate() {
        ...
        WebEngageConfig webEngageConfig = new WebEngageConfig.Builder()
                .setWebEngageKey(YOUR_LICENSE_CODE)
                .setAutoGCMRegistrationFlag(false)
                .setDebugMode(true)  // only in development mode
                .build();
        registerActivityLifecycleCallbacks(new WebEngageActivityLifeCycleCallbacks(this, webEngageConfig));
    }
}
```

**Note**: Replace YOUR_LICENSE_CODE with your WebEngage license code.

3. Attribution Tracking (Optional)

If you need to track app installs and user acquisition attributes, then add the following receiver tag in your `android/app/src/main/AndroidManifest.xml` file.

```xml
<manifest
    ...>
    <application ...>
        ...
        <receiver
            android:name="com.webengage.sdk.android.InstallTracker"
            android:exported="true">
            <intent-filter>
                <action android:name="com.android.vending.INSTALL_REFERRER" />
            </intent-filter>
        </receiver>
    </application>
</manifest>
```


### Integration for iOS

1. Install WebEngage pod in `ios/` directory.

Install cocoapods (only if not already installed).

```shell
sudo gem install cocoapods
```

Create Podfile by executing the following command in `ios` directory.

```shell
pod init
```

Add pod WebEngage under your target app in the newly created Podfile.

```
target 'YourAppTarget' do
  ...
  pod 'WebEngage'
  ...
end
```

Install pod by running the following command.

```shell
pod install
```

2. Configure Info.plist.

Open YourProject.xcworkspace in Xcode and then add your license code in the `Info.plist` file.

WEGLicenseCode : YOUR_LICENSE_CODE

**Note**: Replace YOUR_LICENSE_CODE with your WebEngage license code.

3. Initialize WebEngage SDK in `AppDelegate.m` file.

```objective-c
...
#import <WebEngage/WebEngage.h>

@implementation AppDelegate

...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ...

  [[WebEngage sharedInstance] application:application
            didFinishLaunchingWithOptions:launchOptions];

  return YES;
}

@end
```

If you are getting the error: 'react/rctbundleurlprovider.h' file not found, then simply exit Xcode and then run the command 'npm install' in your project's root directory.


## Initialisation

In your `App.js` file, initialise WebEngage bridge as shown.

```javascript
...
import WebEngage from 'react-native-webengage';
...

var webengage = new WebEngage();

export default class App extends Component<Props> {
    ...
}
...
```


## Push Notifications

### Push Notifications for Android using FCM

1. Register your app in Firebase Console.

Add your app in [Firebase console](https://console.firebase.google.com) and then download the generated google-services.json file. Copy and paste this google-services.json file in android/app/ directory.

2. Add Google repository in project-level build gradle `android/build.gradle` file.

```gradle
buildscript {
    ...
    repositories {
        google()
        jcenter()
    }
    dependencies {
        ...
        classpath 'com.google.gms:google-services:4.0.1'
    }
}

allprojects {
    repositories {
        mavenLocal()
        google()
        jcenter()
        ...
    }
}
```

**Note**: Make sure that you have google() repository is placed above jcenter().

3. Add firebase messaging dependency in app-level build gradle `android/app/build.gradle` file.

```gradle
...
dependencies {
    ...
    implementation 'com.google.firebase:firebase-messaging:17.3.4'
}
...

apply plugin: 'com.google.gms.google-services'
```

4. Add `MyFirebaseMessagingService.java` file in `android/app/src/main/java/[your-package-name]/`. This file must be parallel to `MainActivity.java` and `MainApplication.java` files.

```java
package your.package;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.webengage.sdk.android.WebEngage;
import java.util.Map;

class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        if (data != null) {
            if (data.containsKey("source") && "webengage".equals(data.get("source"))) {
                WebEngage.get().receive(data);
            }
        }
    }

    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
        WebEngage.get().setRegistrationID(s);
    }
}
```

**Note**: Replace your.package with your package name in the first line of MyFirebaseMessagingService.java file. This line should be same as in your MainActivity and MainApplication files.

5. Add this Firebase Messaging service in the `AndroidManifest.xml` file.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="your.package">
    ...
    <application
        ...>

        ...

        <service android:name=".MyFirebaseMessagingService">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

    </application>

</manifest>
```

**Note**: Replace 'your.package' for package attribute in manifest tag with your package name.

6. Send the FCM token to WebEngage in `MainActivity.java` file as shown below.

```java
...
import android.os.Bundle;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.webengage.sdk.android.WebEngage;

public class MainActivity extends ReactActivity {
    ...

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener(this, new OnSuccessListener<InstanceIdResult>() {
                @Override
                public void onSuccess(InstanceIdResult instanceIdResult) {
                    String token = instanceIdResult.getToken();
                    WebEngage.get().setRegistrationID(token);
                }
            });
        } catch (Exception e) {
            // Handle exception
        }
    }
}
```

7. Set Auto GCM Registration Flag to false in WebEngageConfig in `MainApplication.java` file as shown below.

```java
...
public class MainApplication extends Application implements ReactApplication {
  ...
  @Override
  public void onCreate() {
    ...
    WebEngageConfig webEngageConfig = new WebEngageConfig.Builder()
              ...
              .setAutoGCMRegistrationFlag(false)
              ...
              .build();
    registerActivityLifecycleCallbacks(new WebEngageActivityLifeCycleCallbacks(this, webEngageConfig));
  }
}
```
