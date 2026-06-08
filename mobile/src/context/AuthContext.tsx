import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Usuario {
  id:     number;
  nome:   string;
  email:  string;
  perfil: 'adm' | 'professor' | 'aluno'; 
}

interface AuthContextData {
  usuario:         Usuario | null;
  token:           string | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  login:  (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario,   setUsuario]   = useState<Usuario | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sessão salva no AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const [savedToken, savedUser] = await AsyncStorage.multiGet([
          '@scholar_token',
          '@scholar_usuario',
        ]);
        if (savedToken[1] && savedUser[1]) {
          setToken(savedToken[1]);
          setUsuario(JSON.parse(savedUser[1]));
        }
      } catch {
        // sessão inválida — ignora
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/api/login', { email, senha });

    if (!data.success) throw new Error(data.message || 'Falha ao autenticar');

    await AsyncStorage.multiSet([
      ['@scholar_token',   data.token],
      ['@scholar_usuario', JSON.stringify(data.usuario)],
    ]);

    setToken(data.token);
    setUsuario(data.usuario);
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@scholar_token', '@scholar_usuario']);
    } catch (e) {
      console.warn('Erro ao limpar storage:', e);
    } finally {
      setToken(null);
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}