import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { endpoints } from "./api";

const { width } = Dimensions.get("window");
const bgImage = require("../assets/images/fondo.png"); // ← fondo agrícola

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  /* ---------- CARGAR USUARIO ---------- */
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("No autenticado", "Debes iniciar sesión primero");
        router.replace("/");
      } else {
        setUsername("UsuarioLogueado"); // TODO: obtén username real
      }
    })();
  }, []);

  /* ---------- LOGOUT ---------- */
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        await fetch(endpoints.logout(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }).catch(() => null);
      }
    } finally {
      await AsyncStorage.removeItem("userToken");
      router.replace("/");
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />

          <View style={styles.headerCenter}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.replace("/home")}
            >
              <Ionicons name="home-outline" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.replace("/marketplace")}
            >
              <Ionicons name="storefront-outline" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.replace("/notificaciones")}
            >
              <Ionicons name="notifications-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------- MAIN ---------- */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>¡Bienvenido/a, {username}!</Text>
        </View>

        {/* ---------- FOOTER ---------- */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/menu")}
          >
            <Ionicons name="add-circle-outline" size={32} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.replace("/buscar")}
          >
            <Ionicons name="search-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },

  /* Superposición tenue para mejorar contraste de texto / íconos */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "space-between",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: "space-between",
  },
  headerLeft: { width: 40 },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerRight: { width: 40, flexDirection: "row", justifyContent: "flex-end" },
  iconButton: { marginHorizontal: 8 },

  /* MAIN */
  mainContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  welcomeText: { fontSize: 20, fontWeight: "600", color: "#333" },

  /* FOOTER */
  footer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: width,
    paddingVertical: 10,
    justifyContent: "space-evenly",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
