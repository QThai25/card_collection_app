import axios from "axios";
import { getItem } from "../utils/storage";

const RAW_BASE = process.env.EXPO_PUBLIC_API_BASE;

if (!RAW_BASE) {
  console.error("❌ EXPO_PUBLIC_API_BASE is missing");
}

const BASE_URL = RAW_BASE
  ? `${RAW_BASE.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api"; // fallback dev

console.log("🌐 API BASE:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("getItem(token) failed:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to help debug 4xx/5xx responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.config) {
      const info = {
        url: error.config.url,
        method: error.config.method,
        status: error.response?.status,
        data: error.response?.data,
      };
      console.warn("⚠️ API response error:", info);
    } else {
      console.warn("⚠️ API response error (no config):", error?.message || error);
    }
    return Promise.reject(error);
  }
);

export default api;
