import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      {/* Login y registro */}
      <Stack.Screen name="index"          options={{ headerShown: false }} />
      <Stack.Screen name="register"       options={{ headerShown: false }} />

      {/* Home: header nativo con título */}
      <Stack.Screen
        name="home"
        options={{ headerTitle: "Bribri Social" }}
      />

      {/* Páginas que DEBEN mostrar navbars (header nativo activo) */}
      <Stack.Screen
        name="marketplace"
        options={{ headerTitle: "Bribri Social" }}
      />
      <Stack.Screen
        name="notificaciones"
        options={{ headerTitle: "Bribri Social" }}
      />
      <Stack.Screen
        name="buscar"
        options={{ headerTitle: "Bribri Social" }}
      />

      {/* Textos legales (sin header) */}
      <Stack.Screen name="terms"          options={{ headerShown: false }} />
      <Stack.Screen name="privacy"        options={{ headerShown: false }} />
      <Stack.Screen name="cookies"        options={{ headerShown: false }} />

      {/* Otras secciones sin header */}
      <Stack.Screen name="menu"           options={{ headerShown: false }} />
      <Stack.Screen name="novedades"      options={{ headerShown: false }} />
      <Stack.Screen name="finca"          options={{ headerShown: false }} />
      <Stack.Screen name="config"         options={{ headerShown: false }} />
    </Stack>
  );
}
