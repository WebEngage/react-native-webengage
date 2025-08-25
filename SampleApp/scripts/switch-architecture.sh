#!/bin/bash

# Script to switch between React Native architectures
# Usage: ./scripts/switch-architecture.sh [old|new|bridgeless]

ARCH_TYPE=$1
PROJECT_ROOT=$(dirname "$0")/..

if [ -z "$ARCH_TYPE" ]; then
    echo "Usage: $0 [old|new|bridgeless]"
    exit 1
fi

case $ARCH_TYPE in
    "old")
        echo "Switching to Old Architecture..."
        # Android
        cp "$PROJECT_ROOT/android/gradle.properties.old" "$PROJECT_ROOT/android/gradle.properties"
        # iOS
        cp "$PROJECT_ROOT/ios/SampleApp/AppDelegate.old.mm" "$PROJECT_ROOT/ios/SampleApp/AppDelegate.mm"
        echo "✅ Switched to Old Architecture"
        ;;
    "new")
        echo "Switching to New Architecture..."
        # Android
        cp "$PROJECT_ROOT/android/gradle.properties.new" "$PROJECT_ROOT/android/gradle.properties"
        # iOS
        cp "$PROJECT_ROOT/ios/SampleApp/AppDelegate.new.mm" "$PROJECT_ROOT/ios/SampleApp/AppDelegate.mm"
        echo "✅ Switched to New Architecture"
        ;;
    "bridgeless")
        echo "Switching to Bridgeless Architecture..."
        # Android
        cp "$PROJECT_ROOT/android/gradle.properties.bridgeless" "$PROJECT_ROOT/android/gradle.properties"
        # iOS
        cp "$PROJECT_ROOT/ios/SampleApp/AppDelegate.bridgeless.mm" "$PROJECT_ROOT/ios/SampleApp/AppDelegate.mm"
        echo "✅ Switched to Bridgeless Architecture"
        ;;
    *)
        echo "Invalid architecture type. Use: old, new, or bridgeless"
        exit 1
        ;;
esac

echo "Architecture switched to: $ARCH_TYPE"
echo "Please clean and rebuild your project:"
echo "  Android: cd android && ./gradlew clean"
echo "  iOS: cd ios && xcodebuild clean -workspace SampleApp.xcworkspace -scheme SampleApp"