import type { ExpoConfig } from "expo/config"
const config: ExpoConfig = {
  name: "DadConnect",
  slug: "dadconnect",
  scheme: "dadconnect",
  version: "1.0.0",
  orientation: "portrait",
  platforms: ["ios", "android"],
  ios: { supportsTablet: true, bundleIdentifier: "com.bthecoderr.dadconnect", buildNumber: "1" },
  android: { package: "com.bthecoderr.dadconnect", versionCode: 1 },
  plugins: ["expo-router"],
}
export default config
