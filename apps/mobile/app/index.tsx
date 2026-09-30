import { useEffect, useState } from "react"
import { Redirect } from "expo-router"
import { View, Text } from "react-native"
import { supabase } from "../lib/supabase"

export default function Index() {
  const [ready,setReady]=useState(false)
  const [signedIn,setSignedIn]=useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      setSignedIn(Boolean(data.session))
      setReady(true)
    })
  },[])

  if(!ready) return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Loading DadConnect…</Text></View>
  return <Redirect href={signedIn ? "/(tabs)/feed" : "/sign-in"} />
}
