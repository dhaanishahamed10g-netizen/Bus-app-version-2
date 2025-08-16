const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Mock react-native-maps for web platform
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: require.resolve('./web-mock-react-native-maps.js'),
      type: 'sourceFile',
    };
  }
  
  // Use default resolver for all other cases
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;