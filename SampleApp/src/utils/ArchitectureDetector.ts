import { NativeModules, Platform } from 'react-native';

export type ArchitectureType = 'Old Architecture' | 'New Architecture + Bridge' | 'New Architecture + Bridgeless';

export const getArchitectureType = (): ArchitectureType => {
  try {
    const hasNewArch = global.__turboModuleProxy || global.nativeFabricUIManager;
    const isBridgeless = global.RN$Bridgeless === true || global.__fbBatchedBridge === undefined;
    
    if (hasNewArch && isBridgeless) {
      console.log('🏗️ Architecture: New Architecture + Bridgeless');
      return 'New Architecture + Bridgeless';
    }
    
    if (hasNewArch && !isBridgeless) {
      console.log('🏗️ Architecture: New Architecture + Bridge');
      return 'New Architecture + Bridge';
    }
    
    console.log('🏗️ Architecture: Old Architecture');
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