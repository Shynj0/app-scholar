import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Platform, Alert, Pressable,
} from 'react-native';
import { useNavigation }  from '@react-navigation/native';
import { Ionicons }       from '@expo/vector-icons';
import { useAuth }        from '../context/AuthContext';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';
import type { ProfStackNav } from '../navigation/types';

const CARDS = [
  { title: 'Minhas Disciplinas', subtitle: 'Ver disciplinas cadastradas', icon: 'book' as const,         color: '#1565c0', screen: 'ProfDisciplinas' as const },
  { title: 'Meus Alunos',        subtitle: 'Ver alunos por disciplina',   icon: 'people' as const,       color: '#00695c', screen: 'ProfAlunos'      as const },
  { title: 'Notas',              subtitle: 'Inserir e alterar notas',      icon: 'create' as const,       color: '#4527a0', screen: 'ProfNotas'       as const },
];

export default function ProfessorDashboardScreen() {
  const navigation = useNavigation<ProfStackNav>();
  const { usuario, logout } = useAuth();
  const TOP = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;

  const handleLogout = () =>
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ], { cancelable: true });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={[styles.header, { paddingTop: TOP + 8 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greet}>Bem-vindo(a), Professor(a)</Text>
          <Text style={styles.userName}>{usuario?.nome ?? 'Professor'} 👋</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.6 : 1 }]}
          onPress={handleLogout}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.wave} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="school-outline" size={32} color={colors.primary} />
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.infoTitle}>Área do Professor</Text>
            <Text style={styles.infoSub}>Gerencie suas turmas e notas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Funcionalidades</Text>

        {CARDS.map(card => (
          <TouchableOpacity
            key={card.screen}
            style={[styles.card, { borderLeftColor: card.color }]}
            onPress={() => navigation.navigate(card.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: card.color + '18' }]}>
              <Ionicons name={card.icon} size={28} color={card.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSub}>{card.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>App Scholar · Fatec Jacareí</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:      { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: 48, flexDirection: 'row', alignItems: 'flex-start' },
  greet:       { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)' },
  userName:    { fontSize: fontSize.xl, fontWeight: '700', color: '#fff', marginTop: 2 },
  logoutBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  wave:        { height: 30, backgroundColor: colors.background, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -28 },
  content:     { padding: spacing.lg, paddingBottom: 40 },
  infoCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.sm },
  infoTitle:   { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  infoSub:     { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  sectionTitle:{ fontSize: fontSize.md, fontWeight: '700', color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderLeftWidth: 4, ...shadow.sm },
  iconWrap:    { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardTitle:   { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  cardSub:     { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  footer:      { textAlign: 'center', marginTop: spacing.xl, color: colors.text.secondary, fontSize: fontSize.xs },
});