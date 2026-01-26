import axios from 'axios';
import { getItem } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE + '/api';

console.log('🌐 API BASE:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
