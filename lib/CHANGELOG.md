

# React Native SDK

## Changelogs 2026

### v2.0.1 \[2 June 2026]

* Added Bridgeless Mode compatibility for `universalLinkClicked`.

### v2.0.0 \[2 June 2026]

* Added New Architecture (TurboModule) support for both Android and iOS.
* Added Bridgeless mode support.
* Introduced `setDebugMode` API to enable or disable debug logging for JavaScript logs.
* Added event queuing support for late initialization. Push and In-App callbacks are queued and flushed when listeners register.
* Upgraded security dependencies and resolved the react-native-community/cli vulnerability (Dependabot #10).
* Maintained backward compatibility with Legacy Architecture. The SDK automatically detects and uses the appropriate bridge.

## Changelogs 2025

### v1.6.2 \[8 Aug 2025]

* Added support for Gradle 8 on Android.

### v1.6.1 \[14 Jul 2025]

* Improved event transmission handling for Bridgeless Mode.

### v1.6.0 \[24 May 2025]

* Added support for Anonymous ID callback.

## Changelogs 2024

### v1.5.3 \[25 Nov 2024]

* Optimizations related to `setLocation`function.

### v1.5.1 \[24 April 2024]

* Optimizations related to `pushNotificationClicked`function.
* Optimized SDK security flow.

### v1.5.0 \[13 Feb 2024]

* Optimized SDK security flow.

## Changelogs 2023

### v1.4.1 \[19 Dec 2023]

* Viber channel dependencies added.
* GAID changes to support for Google Families Policy restriction where advertising ID cannot be tracked for users of unknown age and children.

## Changelogs 2022

### v1.3.0 \[19 Aug 2022]

Changes with respect to Android 13 update:

* Changes in relation to collecting Advertisement ID
* Collecting Push opt-ins in run time through push permission pop-up

## Changelogs 2021

### v1.2.13 \[12 July 2022]

1. Plugin updated to support latest React Native v0.69

### v1.2.12 \[13 May 2022]

1. Handling push callbacks in killed state in Android and iOS.

2. Changing name for "hasListener" in iOS bridge file.

### v1.2.10 \[24 November 2021]

1. Transitive internal react dependencies has been changed from React to React-core

2. Plugin will now work with or without ***use framework!*** in react-native iOS podfile ; ***use framework!*** static as well as dynamic linkage is working for iOS

### v1.2.9 \[4 October 2021]

Removed obsolete Gradle dependency usage

### v1.2.8 \[16 June 2021]

Push callback registration fix in the killed state.

### v1.2.7 \[11 Feb 2021]

Added support for CodePush

### v1.2.5 \[18 Jan 2021]

Minor bug fixes

### v1.2.4 \[15 Jan 2021]

Added support for deep linking via iOS Universal Links. Clicks are tracked through the [push notification callback fired in the `app.js` file](react-native-callbacks#push-notification-callbacks).

## Changelogs 2020

### v1.2.3 \[22 Sept 2020]

Added [push notification callback to get deep link URL in `app.js` file](react-native-callbacks#push-notification-callbacks)

### v1.2.1 \[24 Jun 2020]

Adds method for [channel opt-in status.](react-native-tracking-users#opt-in-status)

## Changelogs 2019

### v1.1.1 \[11 Aug 2019]

1. Fixes date object being passed as empty object due to breaking change in react-native v0.58.

2. Updates react-native android library build tools and compile SDK version to 28.

3. Updates Gradle build version to 3.4.1.

### v1.1.0 \[5 Aug 2019]

1. Adds supports react-native v0.60.X.

2. Reduces the size of the node module by removing the android build directory and iOS WebEngage framework.

### v1.0.8 \[14 Jun 2019]

1. Fixes UTC timezone in iOS date-format.

2. Fixes screen API method name misspell.

### v1.0.7 \[May 29, 2019]

1. Adds `date` object support in Android and iOS builds.

2. Fixes nested maps and lists in Android builds.

### v1.0.6 \[Jan 21, 2019]

Fixes Runtime Exception/crash while emitting event for push and in-app notification callbacks before WebEngage SDK Bridge initialization.

## Changelogs 2018

### SDK v1.0.5 (Sep 11, 2018)

Adds in-app notification callbacks.