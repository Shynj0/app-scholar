import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!email.includes('@')) {
      newErrors.email = 'Email inválido';
    }
    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }
    return newErrors;
  };

  const handleLogin = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Validação', 'Por favor, corrija os erros');
      return;
    }

    if (login(email, senha)) {
      setEmail('');
      setSenha('');
      setErrors({});
      /*navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });*/
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.appTitle}>App Scholar</Text>
          <Text style={styles.appSubtitle}>Gerenciamento Acadêmico</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Acesso ao Sistema</Text>

          <Input
            label="Email ou Usuário"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: '' });
              }
            }}
            placeholder="seu.email@example.com"
            error={errors.email}
            keyboardType="email-address"
          />

          <Input
            label="Senha"
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              if (errors.senha) {
                setErrors({ ...errors, senha: '' });
              }
            }}
            placeholder="Digite sua senha"
            error={errors.senha}
            secureTextEntry
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            variant="primary"
            size="large"
            style={styles.loginButton}
          />
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoLabel}>Dados de Demonstração:</Text>
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>Email: usuario@example.com</Text>
            <Text style={styles.demoText}>Senha: qualquer valor</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  appSubtitle: {
    fontSize: FontSizes.base,
    color: Colors.textLight,
  },
  formSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  demoSection: {
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  demoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  demoBox: {
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: BorderRadius.small,
  },
  demoText: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    marginVertical: Spacing.xs,
  },
});

export default LoginScreen;