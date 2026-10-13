import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { supabase } from "../../../lib/supabase"

type HiddenUser={id:string;name:string}
export default function HiddenMembers() {
  const [members,setMembers]=useState<HiddenUser[]>([])
  const [loading,setLoading]=useState(true)
  const [pending,setPending]=useState<string | null>(null)
  const [userId,setUserId]=useState<string | null>(null)

  const load=async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sign in to manage hidden members.")
      setUserId(user.id)
      const {data:blocks,error}=await supabase.from("user_blocks").select("blocked_id").eq("blocker_id",user.id)
      if(error) throw error
      const ids=(blocks ?? []).map(item=>item.blocked_id)
      if(!ids.length){setMembers([]);return}
      const profiles=await supabase.from("profiles").select("id,name").in("id",ids)
      if(profiles.error) throw profiles.error
      setMembers(ids.map(id=>({id,name:profiles.data?.find(p=>p.id===id)?.name || "DadConnect member"})))
    }catch(error){ Alert.alert("Could not load hidden members",error instanceof Error?error.message:"Try again.") }
    finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[])

  const unblock=async (id:string) => {
    if(!userId || pending)return
    setPending(id)
    try {
      const result=await supabase.from("user_blocks").delete().eq("blocker_id",userId).eq("blocked_id",id)
      if(result.error)throw result.error
      setMembers(prev=>prev.filter(item=>item.id!==id))
    }catch(error){Alert.alert("Could not unhide member",error instanceof Error?error.message:"Try again.")}
    finally{setPending(null)}
  }

  return <View style={styles.page}>
    <Text style={styles.heading}>Hidden members</Text>
    <Text style={styles.note}>Messages from members you hide are filtered out of your mobile group chats. This does not remove them from shared groups.</Text>
    {loading?<ActivityIndicator style={{marginTop:30}}/>:<FlatList data={members} keyExtractor={item=>item.id}
      ListEmptyComponent={<Text style={styles.empty}>You haven't hidden anyone.</Text>}
      renderItem={({item})=><View style={styles.card}><Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity disabled={pending===item.id} onPress={()=>void unblock(item.id)} style={styles.unblock}>
          <Text style={styles.unblockText}>{pending===item.id?"Working…":"Unhide"}</Text>
        </TouchableOpacity></View>}
    />}
  </View>
}
const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:"#f6f7f9",padding:20},
  heading:{fontSize:25,fontWeight:"800",color:"#17212d"},note:{fontSize:13,color:"#667085",marginVertical:15,lineHeight:19},
  empty:{color:"#667085",textAlign:"center",marginTop:35},
  card:{flexDirection:"row",backgroundColor:"white",padding:16,borderRadius:10,alignItems:"center",justifyContent:"space-between",marginBottom:10},
  name:{color:"#17212d",fontWeight:"700",flex:1},unblock:{borderRadius:8,borderWidth:1,borderColor:"#1473e6",padding:8},
  unblockText:{color:"#1473e6",fontWeight:"700"},
})
