import React, { useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useRouter } from "expo-router"
import { api } from "@dadconnect/shared"

type LibraryItem=Awaited<ReturnType<typeof api.getLibrary>>["items"][number]

export default function LibraryScreen(){
  const router=useRouter()
  const [items,setItems]=useState<LibraryItem[]>([])
  const [loading,setLoading]=useState(true)
  const [pendingId,setPendingId]=useState<string | null>(null)
  const [filter,setFilter]=useState<"all"|"unread"|"read">("all")

  const load=async () => {
    try{
      const result=await api.getLibrary()
      setItems(result.items)
    }catch(error){
      Alert.alert("Could not load library",error instanceof Error ? error.message : "Try again.")
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { void load() },[])

  const visible=useMemo(
    () => filter === "all" ? items : items.filter(item => item.read_status === filter),
    [filter,items],
  )

  const toggleRead=async (item:LibraryItem) => {
    setPendingId(item.id)
    try{
      const next=item.read_status === "read" ? "unread" : "read"
      const result=await api.updateSave(item.id,{readStatus:next})
      setItems(current => current.map(saved => saved.id === item.id ? {...saved,read_status:result.readStatus} : saved))
    }catch(error){
      Alert.alert("Could not update item",error instanceof Error ? error.message : "Try again.")
    }finally{setPendingId(null)}
  }

  const remove=async (item:LibraryItem) => {
    Alert.alert("Remove saved item",`Remove “${item.title}” from your library?`,[
      {text:"Cancel",style:"cancel"},
      {text:"Remove",style:"destructive",onPress:async () => {
        setPendingId(item.id)
        try{
          await api.removeSave(item.id)
          setItems(current => current.filter(saved => saved.id !== item.id))
        }catch(error){
          Alert.alert("Could not remove item",error instanceof Error ? error.message : "Try again.")
        }finally{setPendingId(null)}
      }},
    ])
  }

  const share=async (item:LibraryItem) => {
    try{
      await Share.share({title:item.title,message:item.url ? `${item.title}\n${item.url}` : item.title,url:item.url || undefined})
    }catch{
      Alert.alert("Could not share","Try again from the source page.")
    }
  }

  const open=async (item:LibraryItem) => {
    if(!item.url) return Alert.alert("No source link","This saved item does not have a source URL yet.")
    if(await Linking.canOpenURL(item.url)) await Linking.openURL(item.url)
    else Alert.alert("Could not open link","The source URL is not available on this device.")
  }

  if(loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text style={styles.muted}>Loading your library…</Text></View>

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Feed</Text></TouchableOpacity>
        <Text style={styles.heading}>Saved Library</Text>
        <Text style={styles.count}>{items.length}</Text>
      </View>

      <View style={styles.filters}>
        {(["all","unread","read"] as const).map(value => (
          <TouchableOpacity key={value} onPress={() => setFilter(value)} style={[styles.filter,filter === value && styles.filterActive]}>
            <Text style={[styles.filterText,filter === value && styles.filterTextActive]}>{value[0].toUpperCase()+value.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{items.length ? "Nothing in this filter" : "Your library is empty"}</Text><Text style={styles.muted}>Save useful items from Feed and they will show up here.</Text></View>}
        renderItem={({item}) => (
          <View style={styles.card}>
            {item.image ? <Image source={{uri:item.image}} style={styles.image} /> : null}
            <View style={styles.body}>
              <Text style={styles.source}>{item.source || "DadConnect"} · {item.read_time} min</Text>
              <Text style={styles.title}>{item.title}</Text>
              {item.excerpt ? <Text style={styles.excerpt}>{item.excerpt}</Text> : null}
              <Text style={styles.savedAt}>Saved {new Date(item.saved_at).toLocaleDateString()}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity disabled={pendingId === item.id} style={[styles.smallButton,item.read_status === "read" && styles.readButton]} onPress={() => toggleRead(item)}>
                  <Text style={styles.smallText}>{item.read_status === "read" ? "Read ✓" : "Mark read"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={() => open(item)}><Text style={styles.smallText}>Open</Text></TouchableOpacity>
                <TouchableOpacity style={styles.smallButton} onPress={() => share(item)}><Text style={styles.smallText}>Share</Text></TouchableOpacity>
                <TouchableOpacity disabled={pendingId === item.id} style={[styles.smallButton,styles.deleteButton]} onPress={() => remove(item)}><Text style={styles.deleteText}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#f5f5f5"},center:{flex:1,alignItems:"center",justifyContent:"center",gap:10,backgroundColor:"#f5f5f5"},
  header:{paddingHorizontal:16,paddingTop:18,paddingBottom:14,backgroundColor:"white",flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderBottomColor:"#e7e7e7"},
  back:{color:"#1473e6",fontWeight:"700"},heading:{fontSize:21,fontWeight:"800",color:"#222"},count:{minWidth:28,textAlign:"center",backgroundColor:"#eef4ff",color:"#1473e6",paddingVertical:4,borderRadius:12,fontWeight:"700"},
  filters:{flexDirection:"row",gap:7,padding:12,backgroundColor:"white"},filter:{paddingHorizontal:13,paddingVertical:7,borderRadius:15,borderWidth:1,borderColor:"#ddd"},filterActive:{backgroundColor:"#1473e6",borderColor:"#1473e6"},
  filterText:{fontSize:12,fontWeight:"700",color:"#555"},filterTextActive:{color:"white"},list:{padding:14,gap:12},card:{backgroundColor:"white",borderRadius:14,overflow:"hidden"},image:{width:"100%",height:150},
  body:{padding:14},source:{fontSize:11,fontWeight:"700",color:"#1473e6"},title:{fontSize:17,fontWeight:"800",color:"#222",marginTop:4},excerpt:{fontSize:13,color:"#555",lineHeight:19,marginTop:7},
  savedAt:{fontSize:11,color:"#888",marginTop:8},actionRow:{flexDirection:"row",flexWrap:"wrap",gap:6,marginTop:12},smallButton:{borderWidth:1,borderColor:"#ddd",paddingHorizontal:10,paddingVertical:7,borderRadius:8},
  readButton:{backgroundColor:"#eaf8f0",borderColor:"#b8e3c8"},smallText:{fontSize:11,fontWeight:"700",color:"#333"},deleteButton:{borderColor:"#efc2c2"},deleteText:{fontSize:11,fontWeight:"700",color:"#c43030"},
  empty:{paddingVertical:70,paddingHorizontal:20,alignItems:"center"},emptyTitle:{fontSize:18,fontWeight:"700",color:"#222",marginBottom:8},muted:{color:"#777",textAlign:"center"},
})
