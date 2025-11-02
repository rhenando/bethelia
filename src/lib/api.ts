// frontend/src/lib/api.ts
import axios from "axios";
import { ENV } from "./env";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: `${ENV.VITE_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
