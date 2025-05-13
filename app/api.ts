// app/api.ts
import { Platform } from "react-native";

/* ─────────────────── URL base según plataforma ──────────────────── */
const baseURL = Platform.select({
  android : "http://10.0.2.2:8000",   // emulador Android
  ios     : "http://127.0.0.1:8000",  // simulador iOS
  default : "http://192.168.100.70:8000", // dispositivo físico / web
}) as string;

/* Helper para concatenar la ruta con la base */
export const api = (path: string) => `${baseURL}${path}`;

/* ─────────────────── Endpoints centralizados ────────────────────── */
export const endpoints = {
  /* ― Auth ― */
  register : () => api("/api/users/register/"),
  login    : () => api("/api/users/login/"),
  logout   : () => api("/api/users/logout/"),

  /* ― Perfil finca ― */
  finca         : () => api("/api/finca/"),            // obtener / actualizar perfil
  fincaPosts    : () => api("/api/finca/posts/"),      // listar / crear posts
  fincaPostDetail: (id: number | string) =>            // obtener / editar / eliminar
                   api(`/api/finca/posts/${id}/`),
};
