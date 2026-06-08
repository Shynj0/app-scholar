import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Platform, Alert, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';
import type { StackNavigationProp } from '@react-navigation/stack';
// ✅ Corrigido: Importando AdmStackParamList que é o correto
import type { AdmStackParamList } from '../navigation/types';

// ✅ Simplificado: Como as rotas são de uma Stack, usamos apenas StackNavigationProp
type Nav = StackNavigationProp<AdmStackParamList>;

interface Card {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  // ✅ Corrigido para refletir o nome correto do parâmetro de rotas do ADM
  screen: keyof AdmStackParamList | 'Boletim';
}

const CARDS: Card[] = [
  { title: 'Alunos', subtitle: 'Cadastrar aluno', icon: 'people', color: '#1565c0', screen: 'CadastroAlunos' },
  { title: 'Professores', subtitle: 'Cadastrar professor', icon: 'school', color: '#283593', screen: 'CadastroProfessores' },
  { title: 'Disciplinas', subtitle: 'Cadastrar disciplina', icon: 'book', color: '#0277bd', screen: 'CadastroDisciplinas' },
  { title: 'Notas', subtitle: 'Lançar notas', icon: 'create', color: '#00695c', screen: 'Notas' },
  { title: 'Boletim', subtitle: 'Consultar boletim', icon: 'document-text', color: '#4527a0', screen: 'Boletim' },
];

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { usuario, logout } = useAuth();

  const TOP = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja encerrar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleNav = (screen: Card['screen']) => {
    if (screen === 'Boletim') {
      (navigation as any).navigate('Boletim');
    } else {
      navigation.navigate(screen as keyof AdmStackParamList);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: TOP + 8 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greet}>Bem-vindo,</Text>
          <Text style={styles.userName}>{usuario?.nome ?? 'Usuário'} 👋</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.6 : 1 }]}
          onPress={handleLogout}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* ── Wave decorativo ── */}
      <View style={styles.wave} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cartão de resumo */}
        <View style={styles.infoCard}>
          <Ionicons name="school-outline" size={32} color={colors.primary} />
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.infoTitle}>App Scholar</Text>
            <Text style={styles.infoSub}>Sistema Acadêmico · Fatec Jacareí</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Módulos do Sistema</Text>

        {/* Grid de cards */}
        <View style={styles.grid}>
          {CARDS.map(card => (
            <TouchableOpacity
              // ✅ Corrigido: Usando card.title (string pura) para evitar conflito de tipo no key
              key={card.title}
              style={[styles.card, { borderTopColor: card.color }]}
              onPress={() => handleNav(card.screen)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: card.color + '18' }]}>
                <Ionicons name={card.icon} size={28} color={card.color} />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSub}>{card.subtitle}</Text>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={14} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>
          João Pedro Anjos · PDM I · 2026
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: { flex: 1 },
  greet: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)' },
  userName: { fontSize: fontSize.xl, fontWeight: '700', color: '#fff', marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  wave: {
    height: 32,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -28,
  },
  content: { padding: spacing.lg, paddingTop: 0 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  infoTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  infoSub: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderTopWidth: 3,
    ...shadow.sm,
    marginBottom: spacing.xs,
    minHeight: 130,
  },
  iconWrap: { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  cardTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  cardSub: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 2, flex: 1 },
  cardArrow: { alignSelf: 'flex-end', marginTop: spacing.xs },
  footer: { textAlign: 'center', marginTop: spacing.xl, color: colors.text.secondary, fontSize: fontSize.xs },
});