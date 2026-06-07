import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../config"; // Certifique-se de criar este arquivo com as variáveis necessárias

const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Injeta o token JWT automaticamente em todas as requisições
api.interceptors.request.use(async (req) => {
  const token = await AsyncStorage.getItem('@scholar_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Trata erros de forma centralizada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem =
      error.response?.data?.erro ||
      error.response?.data?.message ||
      'Erro de conexão com o servidor.';
    return Promise.reject(new Error(mensagem));
  }
);

export default api;
