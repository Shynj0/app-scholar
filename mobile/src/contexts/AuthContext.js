import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getUsuarioLogado } from '../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verifica se já tem sessão salva
  useEffect(() => {
    const restaurarSessao = async () => {
      const salvo = await getUsuarioLogado();
      if (salvo) setUsuario(salvo);
      setCarregando(false);
    };
    restaurarSessao();
  }, []);

  const login = async (email, senha) => {
    const { usuario: u } = await loginService(email, senha);
    setUsuario(u);
    return u;
  };

  const logout = async () => {
    await logoutService();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
