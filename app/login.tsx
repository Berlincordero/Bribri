import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./api";

const bgImage = require("../assets/images/fondo.png");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(endpoints.login(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("userToken", data.token);
        Alert.alert("Login exitoso", `Bienvenido, ${data.username}`);
        router.replace("/home");
      } else {
        const errorData = await response.json();
        Alert.alert("Error al iniciar sesión", JSON.stringify(errorData));
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        {/* ---------- ENCABEZADO ---------- */}
        <View style={styles.header}>
          <Text style={styles.brand}>Bribri Social</Text>
          <Text style={styles.tagline}>La red social exclusiva del agro</Text>
        </View>

        {/* ---------- CARD ---------- */}
        <View style={styles.card}>
          <Text style={styles.formTitle}>Iniciar Sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario o Email"
            placeholderTextColor="#E8F5E9"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#E8F5E9"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>ENTRAR</Text>
          </TouchableOpacity>

          {/* ENLACE A REGISTRO */}
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => router.replace("/register")}
          >
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- PIE ---------- */}
        <Text style={styles.footer}>
          Un producto de <Text style={styles.footerBold}>Umbrella Agro</Text>, la
          sombrilla de la agropecuaria
        </Text>
      </View>
    </ImageBackground>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },

  /* Superposición oscura y padding top/bottom para centrar card igual que register */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  /* Encabezado */
  header: { alignItems: "center" },
  brand: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  tagline: { fontSize: 16, color: "#C8E6C9", fontWeight: "600" },

  /* Card coincide con register */
  card: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 26,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 18,
  },

  /* Inputs transparentes con contorno verde */
  input: {
    borderWidth: 2,
    borderColor: "#AED581",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "transparent",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Botón verde redondo */
  btn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
    marginTop: 6,
    elevation: 4,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 16,
  },

  /* Enlace a registro */
  linkBtn: { marginTop: 12, alignItems: "center" },
  linkText: {
    color: "#C5E1A5",
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  /* Footer */
  footer: { textAlign: "center", color: "#AED581", fontSize: 13 },
  footerBold: { fontWeight: "900", color: "#C5E1A5" },
});
