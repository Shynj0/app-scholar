import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar,
} from 'react-native';
import { useAuth }      from '../context/AuthContext';
import CustomInput      from '../components/CustomInput';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

export default function LoginScreen() {
  const [email,   setEmail]   = useState('admin@appscholar.com');
  const [senha,   setSenha]   = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const { login } = useAuth();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim())                    e.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!senha.trim())                    e.senha = 'Senha é obrigatória';
    else if (senha.length < 6)            e.senha = 'Mínimo 6 caracteres';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), senha);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Credenciais inválidas';
      Alert.alert('Acesso negado', msg);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) =>
    setErrors(prev => ({ ...prev, [field]: '' }));

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.primary }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Topo ── */}
          <View style={styles.top}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🎓</Text>
            </View>
            <Text style={styles.appName}>App Scholar</Text>
            <Text style={styles.tagline}>Sistema Acadêmico · Fatec Jacareí</Text>
            <View style={styles.divider} />
            <Text style={styles.courseName}>Desenvolvimento de Software Multiplataforma</Text>
          </View>

          {/* ── Card de Login ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar no Sistema</Text>
            <Text style={styles.cardSub}>Use suas credenciais institucionais</Text>

            <CustomInput
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={t => { setEmail(t); clearError('email'); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              icon="mail-outline"
            />

            <CustomInput
              label="Senha"
              placeholder="Sua senha"
              value={senha}
              onChangeText={t => { setSenha(t); clearError('senha'); }}
              secureTextEntry
              error={errors.senha}
              icon="lock-closed-outline"
            />

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.75 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>Entrar</Text>}
            </TouchableOpacity>

            {/* Credenciais padrão */}
            <View style={styles.hint}>
              <Text style={styles.hintTitle}>🔑  Acesso padrão (após setup):</Text>
              <Text style={styles.hintText}>admin@appscholar.com  ·  admin123</Text>
            </View>
          </View>

          <Text style={styles.footer}>
            PDM I · João Pedro Anjos · 2026
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  top: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji:   { fontSize: 44 },
  appName:     { fontSize: fontSize.xxxl, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  tagline:     { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  divider:     { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 12 },
  courseName:  { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
  card: {
    marginHorizontal: spacing.md,
    backgroundColor:  colors.surface,
    borderRadius:     radius.xl,
    padding:          spacing.xl,
    ...shadow.lg,
  },
  cardTitle:  { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text.primary },
  cardSub:    { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: spacing.lg, marginTop: 4 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius:    radius.md,
    paddingVertical: 15,
    alignItems:      'center',
    marginTop:       spacing.sm,
    ...shadow.md,
  },
  btnText:   { color: '#fff', fontWeight: '700', fontSize: fontSize.lg, letterSpacing: 0.5 },
  hint: {
    marginTop: spacing.lg,
    padding:   spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius:    radius.md,
    alignItems:      'center',
    gap: 4,
  },
  hintTitle: { fontSize: fontSize.xs, fontWeight: '700', color: colors.text.secondary },
  hintText:  { fontSize: fontSize.sm, color: colors.text.secondary },
  footer:    {
    textAlign:  'center',
    marginTop:  spacing.xl,
    color:      'rgba(255,255,255,0.45)',
    fontSize:   fontSize.xs,
  },
});
