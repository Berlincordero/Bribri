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

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        {/* ---------- TÍTULO ---------- */}
        <Text style={styles.title}>Política de privacidad</Text>

        {/* ---------- CUERPO ---------- */}
        <ScrollView style={styles.box} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>
            1. Datos que recopilamos{"\n\n"}
            Bribri Social recopila la información que nos proporcionas al crear
            una cuenta, publicar contenido o comunicarte con otros usuarios esto nos
            ayuda a mejorar y crear nuevas funciones para la plataforma…
            {"\n\n"}
            2. Uso de la información{"\n\n"}
            Utilizamos tus datos para ofrecer y mejorar nuestros servicios,
            personalizar tu experiencia y proteger la plataforma nunca usaremos los datos de los usuarios para otros fines o que no este debidamente estipulado en nuestra politica y que usuario acepta…{"\n\n"}
            3. Compartición de datos{"\n\n"}
            No vendemos tu información personal. Podemos compartirla con
            proveedores de servicio que nos ayudan a operar Bribri Social bajo
            acuerdos de confidencialidad y con mucho cuidado de no violar
            la confianza y leyes de privacidad de los usuarios por lo tanto estos
            se resguardan y manejan con mucho cuidado…{"\n\n"}
            4. Retención y eliminación{"\n\n"}
            Conservamos tus datos el tiempo necesario para cumplir las finalidades
            descritas salvo que solicites su eliminación o que incumpla algunas de
            nuestras politicas o terminos, tambien si viola o infringe algun derecho
            de autoria o propiedad intelectual…{"\n\n"}
            5. Derechos del usuario{"\n\n"}
            Puedes acceder, rectificar o eliminar tus datos, así como oponerte
            a ciertos tratamientos, contactándonos en bribrisocialumbrella@gmail.com{"\n\n"}
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