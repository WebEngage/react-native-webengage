const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname);

// Path to the local lib that react-native-webengage symlinks to
const webengageLib = path.resolve(__dirname, '../lib');

const config = {
  watchFolders: [webengageLib],
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
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
  serializer: {
    getModulesRunBeforeMainModule: () => [
      require.resolve('react-native/Libraries/Core/InitializeCore'),
    ],
  },
};

if (process.env.REACT_NATIVE_ARCH) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

module.exports = mergeConfig(defaultConfig, config);
