import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { login } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Informe o email e a senha.');
      return;
    }

    setLoading(true);
    try {
      const { usuario } = await login(email.trim(), senha);
      navigation.reset({ index: 0, routes: [{ name: 'Dashboard', params: { usuario } }] });
    } catch (err) {
      Alert.alert('Erro ao entrar', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.titulo}>App Scholar</Text>
        <Text style={styles.subtitulo}>Sistema Acadêmico</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.botao, loading && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.botaoTexto}>Entrar</Text>
          }
        </TouchableOpacity>

        <Text style={styles.dica}>
          Demo: aluno@scholar.com / admin123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF6FF', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 28, elevation: 4 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#1E40AF', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 28 },
  input: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8,
    padding: 12, marginBottom: 14, fontSize: 16, backgroundColor: '#F9FAFB',
  },
  botao: {
    backgroundColor: '#1E40AF', borderRadius: 8,
    padding: 14, alignItems: 'center', marginTop: 4,
  },
  botaoDesabilitado: { backgroundColor: '#93C5FD' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dica: { marginTop: 16, textAlign: 'center', color: '#9CA3AF', fontSize: 12 },
});
