# React Native Architecture Guide

This SampleApp supports three different React Native architectures:

## Architectures Supported

1. **Old Architecture** - Traditional React Native with Bridge
2. **New Architecture** - TurboModules + Fabric (New Architecture)
3. **Bridgeless** - New Architecture without the Bridge

## Quick Start Commands

### Android

```bash
# Old Architecture
npm run android:old

# New Architecture  
npm run android:new

# Bridgeless Architecture
npm run android:bridgeless
```

### iOS

```bash
# Old Architecture
npm run ios:old

# New Architecture
npm run ios:new

# Bridgeless Architecture
npm run ios:bridgeless
```

## Manual Architecture Switching

You can also manually switch architectures without running the app:

```bash
# Switch to Old Architecture
npm run switch:old

# Switch to New Architecture
npm run switch:new

# Switch to Bridgeless Architecture
npm run switch:bridgeless
```

## Architecture Detection

The app automatically detects and displays the current architecture on the HomeScreen. The architecture information is shown in a purple banner at the top of the screen.

## What Changes Between Architectures

### Old Architecture
- `newArchEnabled=false` in Android gradle.properties
- Standard AppDelegate.mm for iOS
- Uses traditional React Native Bridge

### New Architecture
- `newArchEnabled=true` in Android gradle.properties
- `fabricEnabled=YES` in iOS AppDelegate
- Enables TurboModules and Fabric renderer

### Bridgeless Architecture
- `newArchEnabled=true` + `bridgelessEnabled=true` in Android
- `fabricEnabled=YES` + `bridgelessEnabled=YES` in iOS
- Removes the React Native Bridge entirely

## Files Modified

### Android
- `android/gradle.properties` - Architecture configuration
- Backup files: `gradle.properties.old`, `gradle.properties.new`, `gradle.properties.bridgeless`

### iOS
- `ios/SampleApp/AppDelegate.mm` - Native configuration
- Backup files: `AppDelegate.old.mm`, `AppDelegate.new.mm`, `AppDelegate.bridgeless.mm`

### JavaScript
- `src/utils/ArchitectureDetector.ts` - Runtime architecture detection
- `src/screens/HomeScreen.tsx` - Architecture display UI

## Troubleshooting

1. **Clean builds after switching**: Always clean your build after switching architectures
   ```bash
   # Android
   cd android && ./gradlew clean
   
   # iOS
   cd ios && xcodebuild clean -workspace SampleApp.xcworkspace -scheme SampleApp
   ```

2. **Metro cache**: Clear Metro cache if you encounter issues
   ```bash
   npx react-native start --reset-cache
   ```

3. **Pod install**: Re-run pod install for iOS after architecture changes
   ```bash
   cd ios && pod install
   ```

## Architecture Detection Logic

The app uses the following detection methods:

1. **Environment Variable**: `REACT_NATIVE_ARCH` (set by npm scripts)
2. **Runtime Detection**: 
   - `global.__turboModuleProxy` - New Architecture
   - `global.nativeFabricUIManager` - New Architecture  
   - `global.RN$Bridgeless` - Bridgeless mode
3. **Fallback**: Old Architecture (default)

The detected architecture is displayed in the HomeScreen banner and logged to console.