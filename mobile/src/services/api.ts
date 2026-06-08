import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ──────────────────────────────────────────────────────────────────────────────
//  ATENÇÃO: altere esta URL conforme seu ambiente:
//  • Emulador Android:  http://10.0.2.2:3000
//  • Emulador iOS:      http://localhost:3000
//  • Dispositivo real:  http://SEU_IP_LOCAL:3000  (ex: http://192.168.1.10:3000)
// ──────────────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://192.168.1.66:3000';

export { BASE_URL };

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Interceptor de Request: injeta o token JWT ───────────────────────────────
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@scholar_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor de Response: trata erros globais ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@scholar_token', '@scholar_usuario']);
    }
    return Promise.reject(error);
  }
);

export default api;
