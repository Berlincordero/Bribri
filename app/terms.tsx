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

export default function TermsScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={bgImage} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay}>
        {/* ---------- TÍTULO ---------- */}
        <Text style={styles.title}>Condiciones de Bribri Social</Text>

        {/* ---------- CUERPO ---------- */}
        <ScrollView style={styles.box} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>
            1. Uso del servicio{"\n\n"}
            El uso de Bribri Social está sujeto a las siguientes condiciones.
            Todo usuario debe ser mayor de 18 años queda claro esta condicion si se viola la politica de la misma y un menor de edad se registra y la usa se debe abstener de cualquier responsabilidad de la plataforma ya que esto se tomara como violacion de politicas y condiciones excepto que al mismo se le otorgue el permiso por parte del tutor legal de su uso y contenido. Esta plataforma es
            exclusivamente agropecuaria, el contenido de la misma es regulado y
            no se aceptará otro tipo de contenido y al usuario se le sancionara con advertencias y finalmente con la desactivacion de la cuenta. Nuestra misión es conectar a
            la agropecuaria con todas las personas que aman la agricultura y la
            naturaleza, por ello, el usuario está obligado a usarla para dichos
            fines. Si el usuario no lo hace, será eliminado de la plataforma y
            se eliminará su contenido. Cualquier intento de estafa, de acoso sexual,
            contenido ilegal o pornografico, intento de delitos con menores o
            cualquier delito sera notificado a la policia y autoridades judiciales
            y se dara colaboracion absoluta como informacion requerida por las mismas
            para que procedan contra dicha persona o usuario{"\n\n"}
            2. Responsabilidades del usuario{"\n\n"}
            El usuario es responsable de la información que comparte en
            Bribri Social. No se permite el uso de lenguaje ofensivo, contenido
            ilegal o cualquier actividad que pueda dañar la reputación de la
            plataforma. El contenido que el usuario sube es propiedad de la
            plataforma.{"\n\n"}
            3. Propiedad intelectual{"\n\n"}
            El usuario concede a Bribri Social una licencia no exclusiva,
            mundial y libre de regalías para usar, reproducir y distribuir el
            contenido que sube a la plataforma. El usuario garantiza que tiene
            los derechos necesarios para otorgar esta licencia. El contenido,
            diseño y estructura de Bribri Social son propiedad de la plataforma
            y están protegidos por derechos de autor y otras leyes de propiedad
            intelectual.{"\n\n"}
            4. Privacidad y protección de datos{"\n\n"}
            Bribri Social se compromete a proteger la privacidad de sus
            usuarios. La información personal recopilada se utilizará de acuerdo
            con nuestra política de privacidad.{"\n\n"}
            5. Limitación de responsabilidad{"\n\n"}
            El usuario acepta que Bribri Social no será responsable de ningún
            daño directo, indirecto o incidental que surja del uso de la
            plataforma. La plataforma no garantiza la disponibilidad continua
            del servicio y se reserva el derecho de suspenderlo temporalmente
            por mantenimiento o mejoras.{"\n\n"}
            6. Modificaciones de las condiciones{"\n\n"}
            Cuando Bribri Social realice cambios en estas condiciones, se
            notificará a los usuarios a través de la plataforma. El uso
            continuado del servicio después de la modificación implica la
            aceptación de las nuevas condiciones.{"\n\n"}
            7. Ley aplicable y jurisdicción{"\n\n"}
            Bribri Social se rige por las leyes del país en el que opera.
            Cualquier disputa relacionada con estas condiciones se resolverá en
            los tribunales competentes de dicho país.{"\n\n"}
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

  /* ---------- BOTÓN ---------- */
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
