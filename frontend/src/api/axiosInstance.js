import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getItem } from '../utils/storage';

/**
 * Tự động xác định baseURL phù hợp cho môi trường hiện tại.
 * - Android Emulator → 10.0.2.2
 * - iOS Simulator → localhost
 * - Thiết bị thật / Expo Go → IP LAN của máy dev
 * - Nếu bạn muốn cố định dùng ngrok thì đặt FIXED_API_BASE.
 */
function resolveApiBase() {
  try {
    // ⚙️ Nếu bạn muốn dùng ngrok, thay URL này bằng link ngrok thật
    // hoặc để trống '' để dùng local dev server.
    const FIXED_API_BASE = ''; // ví dụ: 'https://your-ngrok-url.ngrok-free.app/api'

    // Nếu FIXED_API_BASE có giá trị → dùng cố định
    if (FIXED_API_BASE && FIXED_API_BASE.length > 8) {
      console.log('✅ Using fixed API base:', FIXED_API_BASE);
      return FIXED_API_BASE.replace(/\/+$/, '');
    }

    // Expo Dev Mode: tự động lấy IP từ debuggerHost
    const debuggerHost =
      Constants.manifest?.debuggerHost ||
      Constants.expoConfig?.hostUri ||
      Constants.manifest2?.debuggerHost;

    if (debuggerHost) {
      const host = debuggerHost.split(':')[0];
      const url = `http://${host}:5000/api`;
      console.log('✅ Using Expo debugger host API base:', url);
      return url;
    }

    // Android emulator (AVD)
    if (Platform.OS === 'android') {
      const url = 'http://10.0.2.2:5000/api';
      console.log('✅ Using Android emulator API base:', url);
      return url;
    }

    // iOS simulator
    if (Platform.OS === 'ios') {
      const url = 'http://localhost:5000/api';
      console.log('✅ Using iOS simulator API base:', url);
      return url;
    }

    // Fallback
    const defaultUrl = 'http://localhost:5000/api';
    console.log('✅ Using default localhost API base:', defaultUrl);
    return defaultUrl;
  } catch (error) {
    console.error('❌ resolveApiBase error:', error);
    return 'http://localhost:5000/api';
  }
}

// 🔍 In ra base URL để debug
const BASE_URL = resolveApiBase();
console.log('🌐 Final API Base URL:', BASE_URL);

// ⚡ Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 🧩 Thêm interceptor tự động gắn token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('⚠️ axios interceptor getItem token error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
