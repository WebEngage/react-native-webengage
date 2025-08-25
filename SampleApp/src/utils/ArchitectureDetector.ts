import { NativeModules, Platform } from 'react-native';

export type ArchitectureType = 'Old Architecture' | 'New Architecture' | 'Bridgeless';

export const getArchitectureType = (): ArchitectureType => {
  // Check environment variable first
  const envArch = process.env.REACT_NATIVE_ARCH;
  if (envArch === 'old') {
    console.log('Architecture: Old Architecture (from env)');
    return 'Old Architecture';
  }
  if (envArch === 'new') {
    console.log('Architecture: New Architecture (from env)');
    return 'New Architecture';
  }
  if (envArch === 'bridgeless') {
    console.log('Architecture: Bridgeless (from env)');
    return 'Bridgeless';
  }

  // Detect based on runtime features
  try {
    // Check for bridgeless mode first
    if (global.RN$Bridgeless === true) {
      console.log('Architecture: Bridgeless (runtime detected)');
      return 'Bridgeless';
    }
    
    // Check if TurboModules are available (New Architecture)
    if (global.__turboModuleProxy) {
      console.log('Architecture: New Architecture (TurboModules detected)');
      return 'New Architecture';
    }
    
    // Check if Fabric is enabled (New Architecture)
    if (global.nativeFabricUIManager) {
      console.log('Architecture: New Architecture (Fabric detected)');
      return 'New Architecture';
    }
    
    // Default to old architecture
    console.log('Architecture: Old Architecture (default)');
    return 'Old Architecture';
  } catch (error) {
    console.warn('Error detecting architecture:', error);
    return 'Old Architecture';
  }
};

export const getArchitectureInfo = () => {
  const architecture = getArchitectureType();
  const platform = Platform.OS;
  
  const info = {
    architecture,
    platform,
    displayText: `Running on ${platform.toUpperCase()} with ${architecture}`,
  };
  
  console.log('📱 Platform Info:', info);
  return info;
};