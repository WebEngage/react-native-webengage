# React Native WebEngage SampleApp Architecture Guide

This SampleApp demonstrates WebEngage React Native SDK integration across three React Native architectures, showcasing how the SDK adapts to different architectural patterns.

## Supported Architectures

### 1. Old Architecture (Legacy)
- Traditional React Native with JavaScript Bridge
- Uses NativeModules for native communication
- Bridge-based event handling

### 2. New Architecture + Bridge
- TurboModules + Fabric renderer
- Maintains JavaScript Bridge for compatibility
- Enhanced performance with new components

### 3. New Architecture + Bridgeless
- TurboModules + Fabric renderer
- Eliminates JavaScript Bridge entirely
- Direct JavaScript-to-native communication

## Quick Start Commands

### Android
```bash
npm run android:old        # Old Architecture
npm run android:new        # New Architecture + Bridge
npm run android:bridgeless # New Architecture + Bridgeless
```

### iOS
```bash
npm run ios:old        # Old Architecture
npm run ios:new        # New Architecture + Bridge  
npm run ios:bridgeless # New Architecture + Bridgeless
```

### Manual Architecture Switching
```bash
npm run switch:old        # Switch to Old Architecture
npm run switch:new        # Switch to New Architecture + Bridge
npm run switch:bridgeless # Switch to New Architecture + Bridgeless
```

## Architecture Configuration

### Android Configuration Files

**gradle.properties.old**
```properties
newArchEnabled=false
hermesEnabled=true
```

**gradle.properties.new**
```properties
newArchEnabled=true
hermesEnabled=true
```

**gradle.properties.bridgeless**
```properties
newArchEnabled=true
bridgelessEnabled=true
hermesEnabled=true
```

### iOS Configuration Files

**AppDelegate Methods**
- `newArchEnabled`: Returns `NO` for old, `YES` for new architectures
- `bridgelessEnabled`: Returns `NO` for bridge mode, `YES` for bridgeless

## WebEngage SDK Architecture Adaptation

### Module Initialization Logic
```javascript
// lib/src/index.js
function initializeWebEngageModule() {
  if (global.__turboModuleProxy) {
    // New Architecture - try TurboModule first
    try {
      const NativeWebEngageModule = require('./NativeWebEngageModule').default;
      return NativeWebEngageModule?.initializeWebEngage ?
        NativeWebEngageModule : NativeModules.WebEngageReact;
    } catch (e) {
      // Fallback to legacy module
      return NativeModules.WebEngageReact;
    }
  }
  // Legacy Architecture
  return NativeModules.WebEngageReact;
}
```

### TurboModule Specification
- **File**: `lib/src/NativeWebEngageModule.ts`
- **Purpose**: Defines TypeScript interface for New Architecture
- **Features**: Type-safe native method definitions, event emitter support

## Runtime Architecture Detection

### Detection Logic (`src/utils/ArchitectureDetector.ts`)
```typescript
export const getArchitectureType = (): ArchitectureType => {
  const hasNewArch = global.__turboModuleProxy || global.nativeFabricUIManager;
  const isBridgeless = global.RN$Bridgeless === true || global.__fbBatchedBridge === undefined;
  
  if (hasNewArch && isBridgeless) {
    return 'New Architecture + Bridgeless';
  }
  if (hasNewArch && !isBridgeless) {
    return 'New Architecture + Bridge';
  }
  return 'Old Architecture';
};
```

### Visual Indicator
- Purple banner on HomeScreen displays current architecture
- Real-time detection without app restart
- Console logging for debugging

## Key Files and Structure

```
SampleApp/
├── android/
│   ├── gradle.properties           # Active configuration
│   ├── gradle.properties.old       # Old Architecture backup
│   ├── gradle.properties.new       # New Architecture backup
│   └── gradle.properties.bridgeless # Bridgeless backup
├── ios/
│   └── SampleApp/
│       ├── AppDelegate.mm          # Active configuration
│       ├── AppDelegate.old.mm      # Old Architecture backup
│       ├── AppDelegate.new.mm      # New Architecture backup
│       └── AppDelegate.bridgeless.mm # Bridgeless backup
├── src/
│   ├── utils/
│   │   └── ArchitectureDetector.ts # Runtime detection
│   └── screens/
│       └── HomeScreen.tsx          # Architecture display
└── scripts/
    └── switch-architecture.sh      # Architecture switching script
```

## WebEngage Features Across Architectures

### Core Features (All Architectures)
- User identification and attributes
- Event tracking
- Screen navigation tracking
- Push notifications
- In-app notifications
- Universal links

### Architecture-Specific Optimizations
- **Old**: Bridge-based communication
- **New + Bridge**: TurboModule performance with bridge compatibility
- **New + Bridgeless**: Direct native communication, maximum performance

## Development Workflow

### 1. Architecture Switching
```bash
# Switch architecture
npm run switch:bridgeless

# Clean builds (required after switching)
cd android && ./gradlew clean
cd ios && xcodebuild clean -workspace SampleApp.xcworkspace -scheme SampleApp

# Run app
npm run android:bridgeless
```

### 2. Testing Different Architectures
- Each architecture runs independently
- WebEngage SDK automatically adapts
- No code changes required in application layer

### 3. Debugging
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear iOS build cache
cd ios && pod install

# Clear Android cache
cd android && ./gradlew clean
```

## Performance Characteristics

| Architecture | Bridge | TurboModules | Performance | Compatibility |
|-------------|--------|--------------|-------------|---------------|
| Old | ✅ | ❌ | Baseline | High |
| New + Bridge | ✅ | ✅ | Better | High |
| New + Bridgeless | ❌ | ✅ | Best | Moderate |

## Migration Path

1. **Start**: Old Architecture (maximum compatibility)
2. **Intermediate**: New Architecture + Bridge (performance gains, compatibility maintained)
3. **Target**: New Architecture + Bridgeless (maximum performance)

## Troubleshooting

### Common Issues
1. **Build failures after switching**: Always clean builds
2. **Module not found**: Clear Metro cache
3. **iOS compilation errors**: Re-run `pod install`
4. **Architecture detection incorrect**: Check global variables in debugger

### Debug Commands
```bash
# Full cleanup
npm run clear:android
npm run clear:ios
npx react-native start --reset-cache

# Verify current architecture
# Check purple banner in app or console logs
```

This architecture demonstrates WebEngage SDK's forward compatibility and React Native's evolution toward improved performance and developer experience.