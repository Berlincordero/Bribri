import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

/* ---------- BARRA SUPERIOR (iconos centrales + fondo blanco) ---------- */
export function HeaderCenter() {
  const router = useRouter();

  return (
    <View style={styles.headerCenter}>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => router.replace("/home")}
      >
        <Ionicons name="home-outline" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => router.replace("/marketplace")}
      >
        <Ionicons name="storefront-outline" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => router.replace("/notificaciones")}
      >
        <Ionicons name="notifications-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

/* ---------- BARRA INFERIOR ---------- */
export function FooterBar() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => router.push("/menu")}
      >
        <Ionicons name="add-circle-outline" size={32} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => router.replace("/buscar")}
      >
        <Ionicons name="search-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
  headerCenter: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    width,
    paddingVertical: 10,
    elevation: 3,
  },
  icon: { marginHorizontal: 8 },
});
