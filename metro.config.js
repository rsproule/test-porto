const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure resolver to handle .js imports that should resolve to .ts files (for ox package)
// and to polyfill Node.js core modules
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'mjs'],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    crypto: path.resolve(__dirname, 'crypto-shim.js'),
  },
  resolveRequest: (context, moduleName, platform) => {
    // Handle crypto module polyfill
    if (moduleName === 'crypto') {
      return {
        filePath: path.resolve(__dirname, 'crypto-shim.js'),
        type: 'sourceFile',
      };
    }

    // Handle imports with .js extension that should resolve to TypeScript files
    if (moduleName.endsWith('.js')) {
      const tsModule = moduleName.replace(/\.js$/, '.ts');

      try {
        const result = context.resolveRequest(context, tsModule, platform);
        if (result) return result;
      } catch (e) {
        // Continue to default resolution
      }
    }

    // Use default resolver
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
