import React, { useEffect, useState } from 'react'
import { View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,KeyboardAvoidingView,Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'

export default function SignInScreen(){
  const router=useRouter()
  const [mode,setMode]=useState<'signin'|'signup'>('signin')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      if(data.session) router.replace('/(tabs)/feed')
    })
  },[router])

  const submit=async () => {
    if(!email.trim() || password.length < 8 || (mode === 'signup' && name.trim().length < 2)){
      Alert.alert('Check your details',mode === 'signup' ? 'Enter your name, email, and a password of at least 8 characters.' : 'Enter your email and a password of at least 8 characters.')
      return
    }
    setLoading(true)
    try{
      if(mode === 'signin'){
        const {error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password})
        if(error) throw error
        router.replace('/(tabs)/feed')
      }else{
        const {data,error}=await supabase.auth.signUp({email:email.trim().toLowerCase(),password,options:{data:{name:name.trim()}}})
        if(error) throw error
        if(data.session) router.replace('/(tabs)/feed')
        else Alert.alert('Check your email','Confirm your DadConnect account, then return here to sign in.')
      }
    }catch(error){
      Alert.alert(mode === 'signin' ? 'Could not sign in' : 'Could not create account',error instanceof Error ? error.message : 'Try again.')
    }finally{setLoading(false)}
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>DadConnect</Text>
        <Text style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</Text>
        {mode === 'signup' && <TextInput value={name} onChangeText={setName} placeholder="Name" autoCapitalize="words" style={styles.input} />}
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password (8+ characters)" secureTextEntry style={styles.input} />
        <TouchableOpacity disabled={loading} style={styles.primary} onPress={submit}><Text style={styles.primaryText}>{loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setMode(current => current === 'signin' ? 'signup' : 'signin')}><Text style={styles.switch}>{mode === 'signin' ? 'New to DadConnect? Create an account' : 'Already have an account? Sign in'}</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles=StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#f4f6f8'},card:{backgroundColor:'white',padding:22,borderRadius:16,gap:12},
  brand:{fontSize:14,fontWeight:'700',color:'#1473e6',textTransform:'uppercase',letterSpacing:1.2},title:{fontSize:26,fontWeight:'700',color:'#222',marginBottom:5},
  input:{borderWidth:1,borderColor:'#ddd',borderRadius:10,paddingHorizontal:13,paddingVertical:12,fontSize:16},primary:{backgroundColor:'#1473e6',padding:13,borderRadius:10,alignItems:'center',marginTop:4},
  primaryText:{color:'white',fontWeight:'700'},switch:{textAlign:'center',color:'#1473e6',fontWeight:'600',paddingTop:8}
})
