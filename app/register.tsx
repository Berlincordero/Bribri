import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./api";

const bgImage = require("../assets/images/fondo.png");

type Gender = "F" | "M" | "O";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dob, setDob] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);

  const [gender, setGender] = useState<Gender>("M");

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const payload: any = { username, email, password, gender };
      if (dob) payload.date_of_birth = dob.toISOString().split("T")[0];

      const res = await fetch(endpoints.register(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        await AsyncStorage.setItem("userToken", data.token);
        Alert.alert("Registro exitoso", `Bienvenido, ${data.username}`);
        router.replace("/home");
      } else {
        const err = await res.json();
        Alert.alert("Error al registrar", JSON.stringify(err));
      }
    } catch {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  /* ---------- UI ---------- */
  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <Text style={styles.brand}>Bribri Social</Text>
          <Text style={styles.tagline}>La red social exclusiva del agro</Text>
        </View>

        {/* FORMULARIO DESPLAZABLE */}
        <ScrollView
          style={styles.card}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formTitle}>Registro</Text>

          {/* CAMPOS */}
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#E8F5E9"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#E8F5E9"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#E8F5E9"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* FECHA */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#E8F5E9" }}>
              {dob
                ? dob.toLocaleDateString()
                : "Fecha de nacimiento (tocar para elegir)"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={dob || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_e: any, d?: Date) => {
                setShowPicker(false);
                if (d) setDob(d);
              }}
              maximumDate={new Date()}
            />
          )}

          {/* GÉNERO — radios */}
          <Text style={styles.genderLabel}>Género</Text>
          <View style={styles.genderRow}>
            {[
              { lbl: "Mujer", val: "F" },
              { lbl: "Hombre", val: "M" },
              { lbl: "Personalizado", val: "O" },
            ].map(({ lbl, val }) => (
              <TouchableOpacity
                key={val}
                style={styles.radioOpt}
                onPress={() => setGender(val as Gender)}
              >
                <Ionicons
                  name={
                    gender === val ? "radio-button-on" : "radio-button-off"
                  }
                  size={20}
                  color="#C5E1A5"
                />
                <Text style={styles.radioTxt}>{lbl}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AVISO */}
          <Text style={styles.legalText}>
            Al hacer clic en{" "}
            <Text style={{ fontWeight: "bold" }}>"Crear cuenta"</Text>, aceptas
            nuestras{" "}
            <Text style={styles.link} onPress={() => router.push("/terms")}>
              Condiciones
            </Text>
            , la{" "}
            <Text style={styles.link} onPress={() => router.push("/privacy")}>
              Política de privacidad
            </Text>{" "}
            y la{" "}
            <Text style={styles.link} onPress={() => router.push("/cookies")}>
              Política de cookies
            </Text>
            .
          </Text>

          {/* BOTÓN */}
          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>CREAR CUENTA</Text>
          </TouchableOpacity>

          {/* VOLVER A LOGIN */}
          <TouchableOpacity
            style={styles.backLogin}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.backLoginText}>¿Ya tienes? Ingresa</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* PIE */}
        <Text style={styles.footer}>
                 Un producto de <Text style={styles.footerBold}>Umbrella Agro COSTA RICA</Text>, la
                 sombrilla de la agropecuaria orgullosamente costarricenses.
        </Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  header: { alignItems: "center" },
  brand: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  tagline: { fontSize: 14, color: "#C8E6C9", fontWeight: "600" },

  /* CARD */
  card: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: 480,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: "#AED581",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#FFFFFF",
  },

  /* GÉNERO */
  genderLabel: {
    color: "#E8F5E9",
    marginTop: 6,
    marginBottom: 2,
    fontSize: 14,
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  radioOpt: { flexDirection: "row", alignItems: "center" },
  radioTxt: { color: "#E8F5E9", marginLeft: 4, fontSize: 14 },

  legalText: {
    fontSize: 11,
    color: "#E0F2F1",
    marginTop: 6,
    lineHeight: 15,
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: "#C5E1A5",
  },
  btn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    borderRadius: 28,
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
    marginTop: 6,
  },
  btnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  backLogin: { marginTop: 8, alignItems: "center" },
  backLoginText: {
    color: "#C5E1A5",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  footer: { textAlign: "center", color: "#AED581", fontSize: 12 },
  footerBold: { fontWeight: "900", color: "#C5E1A5" },
});
