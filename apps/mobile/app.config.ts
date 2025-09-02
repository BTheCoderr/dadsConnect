import { ExpoConfig } from "expo-router/entry"

const config: ExpoConfig = {
  name: "DadConnect",
  slug: "dadconnect",
  scheme: "dadconnect",
  version: "1.0.0",
  orientation: "portrait",
  platforms: ["ios", "android", "web"],
  plugins: ["expo-router"],
  extra: {},
}

export default config


