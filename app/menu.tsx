import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./api";

const bgImage = require("../assets/images/fondo.png");

export default function MenuScreen() {
  const router = useRouter();

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

  /* ---------- COMPONENTE BOTÓN ---------- */
  const MenuButton = ({
    icon,
    label,
    action,
  }: {
    icon: string;
    label: string;
    action: () => void;
  }) => (
    <TouchableOpacity style={styles.iconBtn} onPress={action}>
      <Ionicons name={icon as any} size={34} color="#FFFFFF" />
      <Text style={styles.iconLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.title}>Menú rápido</Text>

        {/* ---------- CARD ---------- */}
        <View style={styles.card}>
          {/* FILA 1 */}
          <View style={styles.row}>
            <MenuButton
              icon="home-outline"
              label="Home"
              action={() => router.replace("/home")}
            />
            <MenuButton
              icon="storefront-outline"
              label="Marketplace"
              action={() => router.replace("/marketplace")}
            />
            <MenuButton
              icon="newspaper-outline"
              label="Novedades"
              action={() => router.replace("/novedades")}
            />
          </View>

          {/* FILA 2 */}
          <View style={styles.row}>
            <MenuButton
              icon="person-outline"
              label="Mi Finca"
              action={() => router.replace("/finca")}
            />
            <MenuButton
              icon="notifications-outline"
              label="Notificaciones"
              action={() => router.replace("/notificaciones")}
            />
            <MenuButton
              icon="search-outline"
              label="Buscar"
              action={() => router.replace("/buscar")}
            />
          </View>

          {/* FILA 3 */}
          <View style={styles.row}>
            <MenuButton
              icon="settings-outline"
              label="Config."
              action={() => router.replace("/config")}
            />
            <MenuButton
              icon="log-out-outline"
              label="Salir"
              action={handleLogout}
            />
          </View>
        </View>
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 22,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  iconBtn: { alignItems: "center" },
  iconLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 6,
    fontSize: 12,
  },
});
