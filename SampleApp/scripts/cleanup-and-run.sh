#!/bin/bash

# Comprehensive cleanup and run script for React Native architectures
# Usage: ./scripts/cleanup-and-run.sh [old|new|bridgeless] [ios|android]

ARCH_TYPE=$1
PLATFORM=$2
PROJECT_ROOT=$(dirname "$0")/..

if [ -z "$ARCH_TYPE" ] || [ -z "$PLATFORM" ]; then
    echo "Usage: $0 [old|new|bridgeless] [ios|android]"
    exit 1
fi

echo "🧹 Starting comprehensive cleanup for $ARCH_TYPE architecture on $PLATFORM..."

# Switch architecture first
echo "🔄 Switching to $ARCH_TYPE architecture..."
"$PROJECT_ROOT/scripts/switch-architecture.sh" "$ARCH_TYPE"

# Clear React Native cache
echo "🗑️  Clearing React Native cache..."
npx react-native start --reset-cache --port=8081 &
METRO_PID=$!
sleep 2
kill $METRO_PID 2>/dev/null || true

# Clear npm/yarn cache
echo "🗑️  Clearing npm/yarn cache..."
npm cache clean --force 2>/dev/null || true
yarn cache clean 2>/dev/null || true

# Clear watchman cache
echo "🗑️  Clearing Watchman cache..."
watchman watch-del-all 2>/dev/null || true

# Clear temporary directories
echo "🗑️  Clearing temporary directories..."
rm -rf /tmp/react-* 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-map-* 2>/dev/null || true

# Platform-specific cleanup
if [ "$PLATFORM" = "ios" ]; then
    echo "🍎 iOS-specific cleanup..."
    
    # Remove node_modules
    echo "🗑️  Removing node_modules..."
    rm -rf "$PROJECT_ROOT/node_modules"
    
    # Remove iOS build artifacts
    echo "🗑️  Removing iOS build artifacts..."
    rm -rf "$PROJECT_ROOT/ios/build"
    rm -rf "$PROJECT_ROOT/ios/DerivedData"
    
    # Remove Pods
    echo "🗑️  Removing Pods..."
    rm -rf "$PROJECT_ROOT/ios/Pods"
    rm -f "$PROJECT_ROOT/ios/Podfile.lock"
    
    # Clear Xcode cache
    echo "🗑️  Clearing Xcode cache..."
    rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
    rm -rf ~/Library/Caches/com.apple.dt.Xcode 2>/dev/null || true
    
    # Clear CocoaPods cache
    echo "🗑️  Clearing CocoaPods cache..."
    pod cache clean --all 2>/dev/null || true
    
    # Reinstall dependencies
    echo "📦 Reinstalling dependencies..."
    yarn install
    
    # Reinstall pods
    echo "🥥 Reinstalling CocoaPods..."
    cd "$PROJECT_ROOT/ios"
    pod deintegrate 2>/dev/null || true
    pod install --repo-update
    cd "$PROJECT_ROOT"
    
    # Clean Xcode project
    echo "🧹 Cleaning Xcode project..."
    cd "$PROJECT_ROOT/ios"
    xcodebuild clean -workspace SampleApp.xcworkspace -scheme SampleApp
    cd "$PROJECT_ROOT"
    
    # Run iOS
    echo "🚀 Running iOS with $ARCH_TYPE architecture..."
    REACT_NATIVE_ARCH="$ARCH_TYPE" npx react-native run-ios --simulator='iPhone 15 Pro'

elif [ "$PLATFORM" = "android" ]; then
    echo "🤖 Android-specific cleanup..."
    
    # Remove node_modules
    echo "🗑️  Removing node_modules..."
    rm -rf "$PROJECT_ROOT/node_modules"
    
    # Remove Android build artifacts
    echo "🗑️  Removing Android build artifacts..."
    rm -rf "$PROJECT_ROOT/android/build"
    rm -rf "$PROJECT_ROOT/android/app/build"
    rm -rf "$PROJECT_ROOT/android/.gradle"
    
    # Reinstall dependencies
    echo "📦 Reinstalling dependencies..."
    yarn install
    
    # Clean Android project
    echo "🧹 Cleaning Android project..."
    cd "$PROJECT_ROOT/android"
    ./gradlew clean
    cd "$PROJECT_ROOT"
    
    # Run Android
    echo "🚀 Running Android with $ARCH_TYPE architecture..."
    REACT_NATIVE_ARCH="$ARCH_TYPE" npx react-native run-android
fi

echo "✅ Cleanup and run completed for $ARCH_TYPE architecture on $PLATFORM!"