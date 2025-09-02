import { Redirect } from "expo-router"

export default function Index() {
  // TODO: route based on onboarding/auth state
  return <Redirect href="/(tabs)/feed" />
}


