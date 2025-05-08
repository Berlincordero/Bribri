// app/api.ts
import { Platform } from "react-native";

/**
 * Devuelve la URL base correcta dependiendo del entorno:
 * - Android emulador: 10.0.2.2 → tu PC
 * - iOS simulador / web: 127.0.0.1
 * - Dispositivo físico: tu IP LAN (ajústala si cambia)
 */
const baseURL = Platform.select({
  android: "http://10.0.2.2:8000",
  ios: "http://127.0.0.1:8000",
  default: "http://192.168.100.70:8000",
}) as string;

export const api = (path: string) => `${baseURL}${path}`;

export const endpoints = {
  register: () => api("/api/users/register/"),
  login: () => api("/api/users/login/"),
  logout: () => api("/api/users/logout/"),
};
