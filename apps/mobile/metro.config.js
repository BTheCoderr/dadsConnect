// Expo SDK 54 automatically discovers npm workspaces and shared packages.
// Avoid overriding Metro's watchFolders / nodeModulesPaths, which can cause
// duplicate React installs and broken Router resolution in native builds.
const { getDefaultConfig } = require("expo/metro-config")

module.exports = getDefaultConfig(__dirname)
