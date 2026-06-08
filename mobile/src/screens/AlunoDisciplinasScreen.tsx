import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons }   from '@expo/vector-icons';
import ScreenHeader   from '../components/ScreenHeader';
import api            from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Disciplina {
  disciplina: string; carga_horaria: number; semestre: number; curso: string;
  professor_nome: string; titulacao: string; area: string;
  nota1: number | null; nota2: number | null; media: number | null; situacao: string;
}

const situacaoCfg: Record<string, { color: string; bg: string }> = {
  Aprovado:  { color: colors.success, bg: '#e8f5e9' },
  Reprovado: { color: colors.danger,  bg: '#ffebee' },
  Cursando:  { color: colors.warning, bg: '#fff3e0' },
};

export default function AlunoDisciplinasScreen() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading,     setLoading]     = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/aluno/disciplinas');
      setDisciplinas(data.data);
    } catch { Alert.alert('Erro', 'Não foi possível carregar as disciplinas'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Minhas Disciplinas" />
      <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Minhas Disciplinas" subtitle={`${disciplinas.length} disciplina(s)`} />

      <FlatList
        data={disciplinas}
        keyExtractor={(item, i) => `${item.disciplina}-${i}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={carregar}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📚</Text>
            <Text style={styles.emptyTitle}>Nenhuma disciplina</Text>
            <Text style={styles.emptySub}>Você ainda não está matriculado em nenhuma disciplina</Text>
          </View>
        }
        renderItem={({ item }) => {
          const cfg = situacaoCfg[item.situacao] ?? { color: colors.gray[500], bg: colors.gray[200] };
          return (
            <View style={[styles.card, { borderTopColor: cfg.color }]}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nome}>{item.disciplina}</Text>
                  <Text style={styles.meta}>{item.curso} · {item.semestre}° semestre · {item.carga_horaria}h</Text>
                  {item.professor_nome && (
                    <Text style={styles.prof}>
                      👨‍🏫 {item.professor_nome}{item.titulacao ? ` (${item.titulacao})` : ''}
                    </Text>
                  )}
                </View>
                <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.badgeText, { color: cfg.color }]}>{item.situacao}</Text>
                </View>
              </View>

              <View style={styles.notasRow}>
                {[
                  { label: 'Nota 1', value: item.nota1 },
                  { label: 'Nota 2', value: item.nota2 },
                  { label: 'Média',  value: item.media, h: true },
                ].map(n => (
                  <View key={n.label} style={[styles.notaBox, n.h && { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.notaLabel, n.h && { color: cfg.color }]}>{n.label}</Text>
                    <Text style={[styles.notaValue, n.h && { color: cfg.color, fontWeight: '800' }]}>
                      {n.value != null ? Number(n.value).toFixed(2) : '—'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:       { padding: spacing.md, paddingBottom: 40 },
  card:       { backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.sm, overflow: 'hidden', borderTopWidth: 3, ...shadow.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm },
  nome:       { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  meta:       { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  prof:       { fontSize: fontSize.sm, color: colors.primary, marginTop: 4, fontWeight: '600' },
  badge:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.round, alignSelf: 'flex-start' },
  badgeText:  { fontSize: fontSize.xs, fontWeight: '700' },
  notasRow:   { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  notaBox:    { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRightWidth: 1, borderRightColor: colors.border },
  notaLabel:  { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600', marginBottom: 2 },
  notaValue:  { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  empty:      { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  emptySub:   { fontSize: fontSize.md, color: colors.text.secondary, textAlign: 'center' },
});