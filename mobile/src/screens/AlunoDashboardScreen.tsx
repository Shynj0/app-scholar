import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Platform, Alert, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons }      from '@expo/vector-icons';
import { useAuth }       from '../context/AuthContext';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';
import type { AlunoStackNav } from '../navigation/types';

const CARDS = [
  { title: 'Minhas Disciplinas', subtitle: 'Ver disciplinas em que estou matriculado', icon: 'book-outline' as const,         color: '#1565c0', screen: 'AlunoDisciplinas' as const },
  { title: 'Meu Boletim',        subtitle: 'Ver minhas notas e situação',              icon: 'document-text-outline' as const, color: '#4527a0', screen: 'AlunoBoletim'     as const },
];

export default function AlunoDashboardScreen() {
  const navigation = useNavigation<AlunoStackNav>();
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
          <Text style={styles.greet}>Bem-vindo(a), Aluno(a)</Text>
          <Text style={styles.userName}>{usuario?.nome ?? 'Aluno'} 🎓</Text>
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

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View style={styles.avatarCircle}><Text style={{ fontSize: 32 }}>🎓</Text></View>
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={styles.infoTitle}>{usuario?.nome}</Text>
            <Text style={styles.infoSub}>Área do Estudante</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Meus Acessos</Text>

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:      { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: 48, flexDirection: 'row', alignItems: 'flex-start' },
  greet:       { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)' },
  userName:    { fontSize: fontSize.xl, fontWeight: '700', color: '#fff', marginTop: 2 },
  logoutBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  wave:        { height: 30, backgroundColor: colors.background, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -28 },
  content:     { flex: 1, padding: spacing.lg },
  infoCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg, ...shadow.sm },
  avatarCircle:{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  infoTitle:   { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  infoSub:     { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  sectionTitle:{ fontSize: fontSize.md, fontWeight: '700', color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderLeftWidth: 4, ...shadow.sm },
  iconWrap:    { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardTitle:   { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  cardSub:     { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  footer:      { textAlign: 'center', marginTop: 'auto', paddingTop: spacing.xl, color: colors.text.secondary, fontSize: fontSize.xs },
});