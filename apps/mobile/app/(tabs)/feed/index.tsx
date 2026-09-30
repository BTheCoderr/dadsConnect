import React, { useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useRouter } from "expo-router"
import type { ContentItem } from "@dadconnect/shared"
import { api } from "@dadconnect/shared"

export default function FeedScreen() {
  const router=useRouter()
  const [items,setItems]=useState<ContentItem[]>([])
  const [cursor,setCursor]=useState<string | undefined>()
  const [savedIds,setSavedIds]=useState<Set<string>>(new Set())
  const [loading,setLoading]=useState(true)
  const [loadingMore,setLoadingMore]=useState(false)
  const [savingId,setSavingId]=useState<string | null>(null)

  const load=async (reset=true) => {
    try{
      const [feedResult,libraryResult]=await Promise.all([
        api.getFeed(reset ? undefined : cursor),
        reset ? api.getLibrary() : Promise.resolve(null),
      ])

      setItems(current => reset ? feedResult.items : [
        ...current,
        ...feedResult.items.filter(item => !current.some(existing => existing.id === item.id)),
      ])
      setCursor(feedResult.nextCursor ?? undefined)

      if(libraryResult){
        setSavedIds(new Set(libraryResult.items.map(item => item.content_id)))
      }
    }catch(error){
      Alert.alert("Could not load feed",error instanceof Error ? error.message : "Try again.")
    }finally{
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => { void load(true) },[])

  const save=async (item:ContentItem) => {
    if(savedIds.has(item.id) || savingId) return
    setSavingId(item.id)
    try{
      await api.save({contentId:item.id})
      setSavedIds(current => new Set(current).add(item.id))
    }catch(error){
      Alert.alert("Could not save item",error instanceof Error ? error.message : "Try again.")
    }finally{
      setSavingId(null)
    }
  }

  const openSource=async (item:ContentItem) => {
    if(!item.url){
      Alert.alert("No source link","This feed item does not have a source URL yet.")
      return
    }
    const supported=await Linking.canOpenURL(item.url)
    if(!supported){
      Alert.alert("Could not open link","The source URL is not available on this device.")
      return
    }
    await Linking.openURL(item.url)
  }

  const topics=useMemo(() => {
    const counts=new Map<string,number>()
    items.flatMap(item => item.topics).forEach(topic => counts.set(topic,(counts.get(topic) || 0)+1))
    return [...counts.entries()].sort((a,b) => b[1]-a[1]).slice(0,6).map(([topic]) => topic)
  },[items])

  if(loading){
    return <View style={styles.center}><ActivityIndicator size="large" /><Text style={styles.muted}>Loading your feed…</Text></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>DadConnect</Text>
          <Text style={styles.subheading}>Useful reads + your community</Text>
        </View>
        <TouchableOpacity style={styles.libraryButton} onPress={() => router.push("/(tabs)/library")}>
          <Text style={styles.libraryButtonText}>Library</Text>
        </TouchableOpacity>
      </View>

      {topics.length ? (
        <View style={styles.topicRow}>
          {topics.map(topic => <Text key={topic} style={styles.topic}>{topic}</Text>)}
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => load(true)} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if(cursor && !loadingMore){
            setLoadingMore(true)
            void load(false)
          }
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No reading items yet</Text>
            <Text style={styles.muted}>Your live community is ready even while the content catalog is empty.</Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(tabs)/groups")}><Text style={styles.primaryText}>Groups</Text></TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(tabs)/meetups")}><Text style={styles.secondaryText}>Meetups</Text></TouchableOpacity>
            </View>
          </View>
        }
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{marginVertical:18}} /> : null}
        renderItem={({item}) => {
          const saved=savedIds.has(item.id)
          return (
            <View style={styles.card}>
              {item.image ? <Image source={{uri:item.image}} style={styles.image} /> : null}
              <View style={styles.cardBody}>
                <Text style={styles.source}>{item.source || "DadConnect"} · {item.readTime} min</Text>
                <Text style={styles.title}>{item.title}</Text>
                {item.excerpt ? <Text style={styles.excerpt}>{item.excerpt}</Text> : null}
                {item.topics.length ? <Text style={styles.meta}>{item.topics.slice(0,3).join(" · ")}</Text> : null}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => openSource(item)}>
                    <Text style={styles.secondaryText}>Open</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryButton,saved && styles.savedButton]}
                    disabled={saved || savingId === item.id}
                    onPress={() => save(item)}
                  >
                    <Text style={styles.primaryText}>{saved ? "Saved" : savingId === item.id ? "Saving…" : "Save"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#f5f5f5"},
  center:{flex:1,alignItems:"center",justifyContent:"center",gap:10,backgroundColor:"#f5f5f5"},
  header:{paddingHorizontal:18,paddingTop:18,paddingBottom:14,backgroundColor:"white",borderBottomWidth:1,borderBottomColor:"#e7e7e7",flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  heading:{fontSize:26,fontWeight:"800",color:"#202124"},subheading:{marginTop:3,color:"#666"},
  libraryButton:{borderWidth:1,borderColor:"#1473e6",paddingHorizontal:14,paddingVertical:9,borderRadius:9},libraryButtonText:{color:"#1473e6",fontWeight:"700"},
  topicRow:{flexDirection:"row",flexWrap:"wrap",gap:6,paddingHorizontal:16,paddingVertical:10,backgroundColor:"white"},topic:{fontSize:11,color:"#1769aa",backgroundColor:"#eaf3ff",paddingHorizontal:8,paddingVertical:4,borderRadius:12},
  list:{padding:16,gap:14},card:{backgroundColor:"white",borderRadius:15,overflow:"hidden"},image:{width:"100%",height:190},cardBody:{padding:16},
  source:{fontSize:12,fontWeight:"700",color:"#1473e6"},title:{fontSize:19,fontWeight:"800",color:"#222",marginTop:4},excerpt:{fontSize:14,color:"#555",lineHeight:20,marginTop:8},
  meta:{fontSize:11,color:"#888",marginTop:9},actions:{flexDirection:"row",gap:8,marginTop:15},primaryButton:{flex:1,backgroundColor:"#1473e6",paddingVertical:11,borderRadius:9,alignItems:"center"},
  savedButton:{backgroundColor:"#1f8f55"},primaryText:{color:"white",fontWeight:"700"},secondaryButton:{flex:1,borderWidth:1,borderColor:"#d5d5d5",paddingVertical:11,borderRadius:9,alignItems:"center"},
  secondaryText:{color:"#333",fontWeight:"700"},empty:{paddingVertical:70,paddingHorizontal:20,alignItems:"center"},emptyTitle:{fontSize:19,fontWeight:"700",color:"#222",marginBottom:8},
  emptyActions:{flexDirection:"row",gap:8,marginTop:18,width:"100%"},muted:{color:"#777",textAlign:"center"},
})

