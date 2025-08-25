import { NativeModules, Platform } from 'react-native';

export type ArchitectureType = 'Old Architecture' | 'New Architecture' | 'Bridgeless';

export const getArchitectureType = (): ArchitectureType => {
  try {
    // Check for bridgeless mode first
    if (global.RN$Bridgeless === true || global.__fbBatchedBridge === undefined) {
      console.log('🏗️ Architecture: Bridgeless (runtime detected)');
      return 'Bridgeless';
    }
    
    // Check if TurboModules are available (New Architecture)
    if (global.__turboModuleProxy) {
      console.log('🏗️ Architecture: New Architecture (TurboModules detected)');
      return 'New Architecture';
    }
    
    // Check if Fabric is enabled (New Architecture)
    if (global.nativeFabricUIManager) {
      console.log('🏗️ Architecture: New Architecture (Fabric detected)');
      return 'New Architecture';
    }
    
    // Default to old architecture
    console.log('🏗️ Architecture: Old Architecture (default)');
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