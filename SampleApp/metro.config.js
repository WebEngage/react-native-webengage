const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: {sourceExts, assetExts},
} = getDefaultConfig(__dirname);

// Path to the local lib (symlinked via file:../lib)
const libPath = path.resolve(__dirname, '../lib');

const config = {
  watchFolders: [libPath],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    // Block lib's own node_modules from being resolved
    blockList: [
      new RegExp(path.resolve(libPath, 'node_modules').replace(/[/\\]/g, '[/\\\\]') + '/.*'),
    ],
    // Ensure all dependencies resolve from SampleApp's node_modules
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
  serializer: {
    getModulesRunBeforeMainModule: () => [
      require.resolve('react-native/Libraries/Core/InitializeCore'),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);
