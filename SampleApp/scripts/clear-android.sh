#!/bin/bash

# Android-specific cache and build cleanup script
PROJECT_ROOT=$(dirname "$0")/..

echo "🤖 Clearing Android cache and build artifacts..."

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

echo "✅ Android cleanup completed!"