/* app/finca.tsx */
import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, ScrollView, Modal, Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

import { HeaderCenter, FooterBar } from "./components/NavBars";
import { endpoints } from "./api";

/* --- imágenes --- */
const bgImage          = require("../assets/images/fondo.png");
const coverPlaceholder = require("../assets/images/portada.jpg");
const emptyAvatar      = require("../assets/images/avatar.png");

/* --- tipos --- */
type Gender = "M" | "F" | "O";
type TabKey = "posts" | "photos" | "videos" | "store";

interface ProfileDTO {
  id: number;
  username: string;
  email: string | null;
  display_name: string;
  bio: string;
  date_of_birth: string | null;
  gender: Gender | null;
  avatar: string | null;
  cover: string | null;
}

interface PostDTO {
  id: number;
  text:   string | null;
  image:  string | null;
  video:  string | null;
  created_at: string;
  /* compat viejo */
  content?: string | null;
}

/* ═════════════ MODAL OPCIONES PUBLICACIÓN ════════════ */
function PostOptionsModal({
  visible, onClose, onEdit, onTrash,
}: {
  visible: boolean;
  onClose: () => void;
  onEdit:  () => void;
  onTrash: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={pStyles.backdrop}>
        <View style={pStyles.sheet}>
          <TouchableOpacity style={pStyles.optBtn} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color="#C5E1A5" style={{ marginRight: 6 }} />
            <Text style={pStyles.optTxt}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={pStyles.optBtn} onPress={onTrash}>
            <Ionicons name="trash-outline" size={20} color="#E53935" style={{ marginRight: 6 }} />
            <Text style={[pStyles.optTxt, { color: "#E53935" }]}>Mover a papelera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={pStyles.cancelWrap}>
            <Text style={pStyles.cancelTxt}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ═════════════ MODAL PUBLICAR ════════════ */
function CreatePostModal({
  visible, onClose, avatar, displayName, onPublish,
}: {
  visible: boolean;
  onClose: () => void;
  avatar: string | null;
  displayName: string;
  onPublish: (data: {text:string; uri?:string; mediaType?: "image"|"video"}) => Promise<void>;
}) {
  const [text, setText]         = useState("");
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const [mediaType,setMediaType]= useState<"image"|"video"|undefined>();
  const [saving, setSaving]     = useState(false);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
    });
    if (!res.canceled) {
      const asset = res.assets[0];
      setMediaUri(asset.uri);
      setMediaType(asset.type === "video" ? "video" : "image");
    }
  };

  const publish = async () => {
    if (!text.trim() && !mediaUri) return;
    try {
      setSaving(true);
      await onPublish({ text: text.trim(), uri: mediaUri, mediaType });
      setText(""); setMediaUri(undefined); setMediaType(undefined);
      onClose();
    } catch {
      Alert.alert("Error", "No se pudo publicar");
    } finally { setSaving(false); }
  };

  React.useEffect(() => {
    if (!visible) { setText(""); setMediaUri(undefined); setMediaType(undefined); }
  }, [visible]);

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={mStyles.modalSafe}>
        {/* header */}
        <View style={mStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={mStyles.headerTitle}>Crear publicación</Text>
          <TouchableOpacity
            style={[mStyles.publishBtn, (!text.trim() && !mediaUri) && {opacity:0.3}]}
            disabled={(!text.trim() && !mediaUri) || saving}
            onPress={publish}
          >
            <Text style={mStyles.publishText}>{saving ? "..." : "PUBLICAR"}</Text>
          </TouchableOpacity>
        </View>

        {/* usuario */}
        <View style={mStyles.userRow}>
          <Image source={avatar ? {uri:avatar} : emptyAvatar} style={mStyles.userAvatar}/>
          <Text style={mStyles.userName}>{displayName}</Text>
        </View>

        {/* input */}
        <TextInput
          style={mStyles.textArea}
          multiline
          placeholder="¿Qué estás pensando?"
          placeholderTextColor="#ccc"
          value={text}
          onChangeText={setText}
        />

        {/* vista previa */}
        {mediaUri && (
          mediaType==="image" ? (
            <Image source={{uri:mediaUri}} style={mStyles.previewMedia}/>
          ) : (
            <Video
              source={{uri:mediaUri}}
              rate={1} volume={1} isMuted={false}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              style={mStyles.previewMedia}
            />
          )
        )}

        {/* acceso rápido */}
        <View style={mStyles.quickList}>
          <TouchableOpacity style={mStyles.quickRow} onPress={pickMedia}>
            <Ionicons name="image-outline" size={20} color="#43A047" style={{width:30}}/>
            <Text style={mStyles.quickLabel}>Foto / video</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/* ═════════════ FincaScreen ════════════ */
export default function FincaScreen() {
  const router = useRouter();

  const [profile,setProfile]     = useState<ProfileDTO|null>(null);
  const [posts,setPosts]         = useState<PostDTO[]>([]);
  const [editing,setEditing]     = useState(false);
  const [loading,setLoading]     = useState(true);
  const [showComposer,setShowComposer]=useState(false);
  const [tab,setTab]             = useState<TabKey>("posts");

  /* opciones publicación */
  const [optVisible,setOptVisible] = useState(false);
  const [selectedPost,setSelectedPost] = useState<PostDTO|null>(null);

  /* cargar perfil + posts */
  useEffect(()=>{ (async()=>{
      const tk = await AsyncStorage.getItem("userToken");
      if(!tk) return;
      const [pRes,postRes] = await Promise.all([
        fetch(endpoints.finca(),      {headers:{Authorization:`Token ${tk}`}}),
        fetch(endpoints.fincaPosts(), {headers:{Authorization:`Token ${tk}`}}),
      ]);
      setProfile(await pRes.json());
      setPosts(await postRes.json());
      setLoading(false);
  })(); },[]);

  /* publicar */
  const createPost = async (data:{text:string; uri?:string; mediaType?: "image"|"video"})=>{
    const tk = await AsyncStorage.getItem("userToken");
    if(!tk) return;

    let body: any, headers: any;

    if (data.uri) {
      body = new FormData();
      body.append("content", data.text);
      body.append(data.mediaType!, {
        uri: data.uri,
        name: `post.${data.mediaType==="video" ? "mp4":"jpg"}`,
        type: data.mediaType==="video" ? "video/mp4" : "image/jpeg",
      } as any);
      headers = { Authorization:`Token ${tk}` };
    } else {
      body = JSON.stringify({ content: data.text });
      headers = {
        "Content-Type":"application/json",
        Authorization :`Token ${tk}`,
      };
    }

    const res = await fetch(endpoints.fincaPosts(), {
      method:"POST", headers, body
    });
    if(!res.ok) throw new Error(await res.text());

    const newPost:PostDTO = await res.json();
    setPosts(prev=>[newPost,...prev]);
  };

  /* eliminar / mover a papelera */
  const trashPost = async (post:PostDTO)=>{
    try{
      const tk = await AsyncStorage.getItem("userToken"); if(!tk) return;
      await fetch(endpoints.fincaPostDetail(post.id),{   // ← aquí se usa el nuevo nombre
        method:"DELETE",
        headers:{Authorization:`Token ${tk}`},
      });
      setPosts(prev=>prev.filter(p=>p.id!==post.id));
    }catch(err){
      Alert.alert("Error","No se pudo mover a la papelera");
    }
  };

  /* subir imágenes perfil */
  const pickImage = async (field:"avatar"|"cover")=>{
    const res=await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,quality:0.7,
    });
    if(!res.canceled) await uploadImage(field,res.assets[0].uri);
  };
  const uploadImage = async(field:"avatar"|"cover",uri:string)=>{
    const tk = await AsyncStorage.getItem("userToken");
    if(!tk) return;
    setLoading(true);
    const form=new FormData();
    form.append(field,{uri,name:`${field}.jpg`,type:"image/jpeg"} as any);
    await fetch(endpoints.finca(),{method:"PUT",headers:{Authorization:`Token ${tk}`},body:form});
    const refreshed=await fetch(endpoints.finca(),{headers:{Authorization:`Token ${tk}`}}).then(r=>r.json());
    setProfile(refreshed); setLoading(false);
  };

  /* guardar bio */
  const saveBio = async ()=>{
    if(!profile) return;
    const tk = await AsyncStorage.getItem("userToken"); if(!tk) return;
    try{
      setLoading(true);
      await fetch(endpoints.finca(),{
        method:"PUT",
        headers:{ "Content-Type":"application/json", Authorization:`Token ${tk}` },
        body:JSON.stringify({ bio:profile.bio })
      });
      setEditing(false);
    }finally{ setLoading(false); }
  };

  if(loading||!profile){
    return <View style={styles.loading}><ActivityIndicator size="large" color="#2E7D32"/></View>;
  }

  /* -------- render -------- */
  return(
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.dim}/>

      <CreatePostModal
        visible={showComposer}
        onClose={()=>setShowComposer(false)}
        avatar={profile.avatar}
        displayName={profile.display_name||profile.username}
        onPublish={createPost}
      />

      <PostOptionsModal
        visible={optVisible}
        onClose={()=>setOptVisible(false)}
        onEdit={()=>{ /* TODO: flujo de edición */ setOptVisible(false); }}
        onTrash={()=>{
          if(selectedPost){ trashPost(selectedPost); }
          setOptVisible(false);
        }}
      />

      <SafeAreaView style={styles.safe} edges={["top","bottom"]}>
        <HeaderCenter/>

        <ScrollView contentContainerStyle={styles.content}>
          {/* portada */}
          <TouchableOpacity onPress={()=>pickImage("cover")}>
            <Image source={profile.cover?{uri:profile.cover}:coverPlaceholder} style={styles.cover}/>
            <Text style={styles.hint}>Cambiar portada</Text>
          </TouchableOpacity>

          {/* avatar */}
          <View style={styles.avatarWrap}>
            <TouchableOpacity onPress={()=>pickImage("avatar")}>
              <Image source={profile.avatar?{uri:profile.avatar}:emptyAvatar} style={styles.avatar}/>
            </TouchableOpacity>
          </View>

          {/* info */}
          <View style={styles.card}>
            <Text style={styles.name}>{profile.display_name||profile.username}</Text>
            <Text style={styles.infoLine}>@{profile.username}</Text>
            {!!profile.email&&<Text style={styles.infoLine}>📧 {profile.email}</Text>}
            {!!profile.date_of_birth&&<Text style={styles.infoLine}>🎂 {new Date(profile.date_of_birth).toLocaleDateString()}</Text>}
            {!!profile.gender&&<Text style={styles.infoLine}>⚥ {profile.gender==="M"?"Masculino":profile.gender==="F"?"Femenino":"Personalizado"}</Text>}

            {editing?(
              <>
                <TextInput style={[styles.input,{height:80}]} multiline placeholder="Biografía" placeholderTextColor="#888"
                  value={profile.bio} onChangeText={t=>setProfile({...profile,bio:t})}/>
                <TouchableOpacity style={styles.saveBtn} onPress={saveBio}><Text style={styles.saveTxt}>Guardar</Text></TouchableOpacity>
              </>
            ):(
              <>
                <Text style={styles.bio}>{profile.bio||"Sin biografía"}</Text>
                <TouchableOpacity onPress={()=>setEditing(true)}><Text style={styles.editTxt}>Editar biografía</Text></TouchableOpacity>
              </>
            )}
          </View>

          {/* sub-nav */}
          <View style={styles.subNav}>
            {[
              {key:"posts",label:"Publicaciones"},
              {key:"photos",label:"Fotos"},
              {key:"videos",label:"Videos"},
              {key:"store",label:"Mi Tienda"},
            ].map(({key,label})=>(
              <TouchableOpacity key={key} style={[styles.subBtn,tab===key&&styles.subBtnActive]} onPress={()=>setTab(key as TabKey)}>
                <Text style={[styles.subTxt,tab===key&&styles.subTxtActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* barra publicar */}
          <View style={styles.postBar}>
            <TouchableOpacity style={styles.postBarText} onPress={()=>setShowComposer(true)}>
              <Text style={styles.postPlaceholder}>¿Qué estás pensando?</Text>
            </TouchableOpacity>
            <Ionicons name="image-outline" size={22} color="#888"/>
          </View>

          {/* contenido */}
          <View style={styles.tabContent}>
            {tab==="posts" && (
              posts.length
              ? posts.map(p=>{
                  const textContent = p.text ?? p.content ?? "";
                  return(
                    <View key={p.id} style={styles.postCard}>
                      {/* botón opciones */}
                      <TouchableOpacity
                        style={styles.optBtn}
                        onPress={()=>{
                          setSelectedPost(p);
                          setOptVisible(true);
                        }}
                      >
                        <Ionicons name="leaf-outline" size={20} color="#C5E1A5"/>
                      </TouchableOpacity>

                      {!!textContent && <Text style={styles.postContent}>{textContent}</Text>}
                      {!!p.image && <Image source={{uri:p.image}} style={styles.postMedia}/>}
                      {!!p.video && (
                        <Video
                          source={{uri:p.video}}
                          rate={1} volume={1} isMuted={false}
                          resizeMode={ResizeMode.COVER}
                          useNativeControls
                          style={styles.postMedia}/>
                      )}

                      {/* Íconos de acción */}
                      <View style={styles.actionsRow}>
                        <TouchableOpacity><Ionicons name="heart-outline" size={22} color="#C5E1A5"/></TouchableOpacity>
                        <TouchableOpacity><Ionicons name="chatbubble-ellipses-outline" size={22} color="#C5E1A5"/></TouchableOpacity>
                        <TouchableOpacity
                          onPress={()=>Linking.openURL(`https://wa.me/?text=${encodeURIComponent(textContent)}`)}
                        >
                          <Ionicons name="logo-whatsapp" size={22} color="#25D366"/>
                        </TouchableOpacity>
                        <TouchableOpacity><Ionicons name="share-social-outline" size={22} color="#C5E1A5"/></TouchableOpacity>
                      </View>

                      <Text style={styles.postDate}>{new Date(p.created_at).toLocaleString()}</Text>
                    </View>
                  );
                })
              : <Text style={styles.placeholder}>Aún no hay publicaciones</Text>
            )}

            {tab==="photos" && <Text style={styles.placeholder}>Fotos…</Text>}
            {tab==="videos" && <Text style={styles.placeholder}>Videos…</Text>}
            {tab==="store"  && <Text style={styles.placeholder}>Tu tienda…</Text>}
          </View>
        </ScrollView>

        <FooterBar/>
      </SafeAreaView>
    </ImageBackground>
  );
}

/* --- estilos pantalla --- */
const styles = StyleSheet.create({
  bg:{flex:1},
  dim:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(0,0,0,0.45)"},
  safe:{flex:1,justifyContent:"space-between"},
  loading:{flex:1,justifyContent:"center",alignItems:"center"},
  content:{paddingBottom:50},

  cover:{width:"100%",height:180},
  hint:{position:"absolute",bottom:8,right:10,color:"#fff",backgroundColor:"rgba(0,0,0,0.5)",paddingHorizontal:8,borderRadius:6,fontSize:12},
  avatarWrap:{alignItems:"center",marginTop:-50},
  avatar:{width:110,height:110,borderRadius:55,borderWidth:3,borderColor:"#fff"},

  card:{backgroundColor:"rgba(0,0,0,0.40)",borderRadius:16,paddingVertical:22,paddingHorizontal:20,marginHorizontal:24,marginTop:12,alignItems:"center"},
  name:{fontSize:24,fontWeight:"900",color:"#fff"},
  infoLine:{color:"#E0F2F1",fontSize:14,marginTop:2,textAlign:"center"},
  bio:{color:"#fff",fontSize:14,textAlign:"center",marginVertical:8},
  editTxt:{color:"#C5E1A5",textDecorationLine:"underline"},
  input:{backgroundColor:"rgba(255,255,255,0.9)",borderRadius:8,padding:10,marginVertical:6,width:"100%",color:"#000"},
  saveBtn:{backgroundColor:"#2E7D32",paddingVertical:10,borderRadius:32,alignItems:"center",width:"60%",marginTop:6},
  saveTxt:{color:"#fff",fontWeight:"800"},

  subNav:{flexDirection:"row",backgroundColor:"rgba(255,255,255,0.1)",borderRadius:14,marginHorizontal:24,marginTop:16},
  subBtn:{flex:1,paddingVertical:8,alignItems:"center"},
  subBtnActive:{backgroundColor:"rgba(0,0,0,0.3)",borderBottomWidth:2,borderBottomColor:"#C5E1A5",borderRadius:14},
  subTxt:{color:"#E0F2F1",fontSize:13,fontWeight:"700"},
  subTxtActive:{color:"#fff"},

  postBar:{flexDirection:"row",alignItems:"center",backgroundColor:"#fff",marginHorizontal:24,marginTop:18,borderRadius:50,paddingHorizontal:14,paddingVertical:10,elevation:2},
  postBarText:{flex:1},
  postPlaceholder:{color:"#666",fontSize:14},

  tabContent:{marginTop:20,alignItems:"center",paddingHorizontal:24},
  placeholder:{color:"#FFFFFF99",fontSize:14},

  postCard:{width:"100%",backgroundColor:"rgba(0,0,0,0.40)",borderRadius:12,padding:14,marginBottom:12},
  optBtn:{position:"absolute",top:6,right:6,padding:4},
  postContent:{color:"#fff",fontSize:15},
  postMedia:{width:"100%",aspectRatio:1,borderRadius:8,marginTop:6},
  actionsRow:{flexDirection:"row",justifyContent:"space-around",marginTop:10},
  postDate:{color:"#C5E1A5",fontSize:11,marginTop:6,textAlign:"right"},
});

/* --- estilos modal publicar --- */
const mStyles = StyleSheet.create({
  modalSafe:{flex:1,backgroundColor:"#262626"},
  modalHeader:{flexDirection:"row",alignItems:"center",paddingHorizontal:16,paddingVertical:10,backgroundColor:"#1B1B1B"},
  headerTitle:{color:"#fff",fontWeight:"700",fontSize:18,marginLeft:12,flex:1},
  publishBtn:{backgroundColor:"#2E7D32",paddingHorizontal:14,paddingVertical:6,borderRadius:18},
  publishText:{color:"#fff",fontWeight:"700",fontSize:13},

  userRow:{flexDirection:"row",alignItems:"center",padding:16},
  userAvatar:{width:42,height:42,borderRadius:21},
  userName:{color:"#fff",fontWeight:"700",marginLeft:12,fontSize:16},

  textArea:{flex:1,color:"#fff",fontSize:18,paddingHorizontal:16,textAlignVertical:"top"},

  previewMedia:{width:"92%",alignSelf:"center",aspectRatio:1,borderRadius:10,marginTop:10},

  quickList:{borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:"#444"},
  quickRow:{flexDirection:"row",alignItems:"center",padding:14},
  quickLabel:{color:"#e0e0e0",fontSize:14},
});

/* --- estilos modal opciones --- */
const pStyles = StyleSheet.create({
  backdrop:{flex:1,backgroundColor:"rgba(0,0,0,0.6)",justifyContent:"center",alignItems:"center"},
  sheet:{backgroundColor:"#1E1E1E",borderRadius:12,width:"80%",paddingVertical:12},
  optBtn:{flexDirection:"row",alignItems:"center",paddingVertical:12,paddingHorizontal:20},
  optTxt:{color:"#fff",fontSize:15,fontWeight:"700"},
  cancelWrap:{borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:"#555",paddingVertical:12},
  cancelTxt:{color:"#C5E1A5",fontSize:15,fontWeight:"700",textAlign:"center"},
});
