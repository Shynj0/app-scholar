import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, senha) => {
  const response = await api.post('/login', { email, senha });
  const { token, usuario } = response.data;

  await AsyncStorage.setItem('@scholar_token', token);
  await AsyncStorage.setItem('@scholar_usuario', JSON.stringify(usuario));

  return { token, usuario };
};

export const logout = async () => {
  await AsyncStorage.removeItem('@scholar_token');
  await AsyncStorage.removeItem('@scholar_usuario');
};

export const getUsuarioLogado = async () => {
  const json = await AsyncStorage.getItem('@scholar_usuario');
  return json ? JSON.parse(json) : null;
};

export const getToken = async () => {
  return AsyncStorage.getItem('@scholar_token');
};
