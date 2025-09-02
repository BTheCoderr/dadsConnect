const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const config = getDefaultConfig(__dirname)

// Enable workspace symlinks and watch shared package
config.resolver.unstable_enableSymlinks = true
config.watchFolders = [path.resolve(__dirname, "../../packages")]
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
]

module.exports = config


