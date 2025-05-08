import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const bgImage = require("../assets/images/fondo.png");

export default function CookiesScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        {/* ---------- TÍTULO ---------- */}
        <Text style={styles.title}>Política de cookies</Text>

        {/* ---------- CUERPO ---------- */}
        <ScrollView style={styles.box} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>
            1. ¿Qué son las cookies?{"\n\n"}
            Las cookies son pequeños archivos de texto que los sitios web
            almacenan en tu dispositivo para recordar tus preferencias…{"\n\n"}
            2. ¿Por qué usamos cookies?{"\n\n"}
            Bribri Social utiliza cookies para mejorar tu experiencia, medir el
            rendimiento y proteger la plataforma…{"\n\n"}
            3. Tipos de cookies que utilizamos{"\n\n"}
            • Cookies esenciales{"\n"}
            • Cookies de rendimiento{"\n"}
            • Cookies de funcionalidad…{"\n\n"}
            4. Gestión de cookies{"\n\n"}
            Puedes deshabilitar las cookies en la configuración de tu navegador,
            pero la plataforma podría no funcionar correctamente…{"\n\n"}
            5. Cambios en esta política{"\n\n"}
            Podemos actualizar esta política ocasionalmente. Te notificaremos
            cualquier cambio importante…{"\n\n"}
            ────────────────────────────{"\n\n"}
          </Text>
        </ScrollView>

        {/* ---------- BOTÓN VOLVER ---------- */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/register")}
        >
          <Text style={styles.btnText}>REGRESAR A REGISTRO</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 24,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  box: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 18,
    flex: 1,
  },
  text: { color: "#E0F2F1", fontSize: 14, lineHeight: 20 },
  btn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: "center",
    alignSelf: "center",
    width: "70%",
    marginTop: 16,
    elevation: 4,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 15,
  },
});
