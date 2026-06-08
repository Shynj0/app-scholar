import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons }  from '@expo/vector-icons';
import ScreenHeader  from '../components/ScreenHeader';
import { useAuth }   from '../context/AuthContext';
import api           from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface DisciplinaBoletim {
  disciplina: string; carga_horaria: number; semestre: number;
  professor: string; nota1: number | null; nota2: number | null;
  media: number | null; situacao: string;
}
interface Resumo { total: number; aprovados: number; reprovados: number; cursando: number; media_geral: string | null }
interface AlunoInfo { nome: string; matricula: string; curso: string; email: string }
interface Boletim { aluno: AlunoInfo; disciplinas: DisciplinaBoletim[]; resumo: Resumo }

const situacaoCfg: Record<string, { color: string; bg: string; icon: string }> = {
  Aprovado:  { color: colors.success, bg: '#e8f5e9', icon: 'checkmark-circle' },
  Reprovado: { color: colors.danger,  bg: '#ffebee', icon: 'close-circle'     },
  Cursando:  { color: colors.warning, bg: '#fff3e0', icon: 'time'             },
};

export default function AlunoBoletimScreen() {
  const { usuario } = useAuth();
  const [boletim,   setBoletim]   = useState<Boletim | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const carregar = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const { data } = await api.get('/api/aluno/boletim');
      setBoletim(data.data);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Não foi possível carregar o boletim');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Meu Boletim" />
      <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Meu Boletim" subtitle="Histórico de notas" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => carregar(true)} colors={[colors.primary]} />}
      >
        {!boletim ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 56 }}>📋</Text>
            <Text style={styles.emptyTitle}>Boletim indisponível</Text>
            <Text style={styles.emptySub}>Nenhuma nota lançada ainda</Text>
          </View>
        ) : (
          <>
            {/* Card do aluno */}
            <View style={styles.alunoCard}>
              <View style={styles.avatarCircle}><Text style={{ fontSize: 32 }}>🎓</Text></View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.alunoNome}>{boletim.aluno.nome}</Text>
                <Text style={styles.alunoInfo}>Matrícula: {boletim.aluno.matricula}</Text>
                <Text style={styles.alunoInfo}>Curso: {boletim.aluno.curso}</Text>
              </View>
            </View>

            {/* Resumo */}
            <View style={styles.resumo}>
              {[
                { label: 'Total',     value: boletim.resumo.total,      color: colors.primary,   icon: '📚' },
                { label: 'Aprovado',  value: boletim.resumo.aprovados,  color: colors.success,   icon: '✅' },
                { label: 'Reprovado', value: boletim.resumo.reprovados, color: colors.danger,    icon: '❌' },
                { label: 'Cursando',  value: boletim.resumo.cursando,   color: colors.warning,   icon: '⏳' },
              ].map(r => (
                <View key={r.label} style={[styles.resumoCard, { borderTopColor: r.color }]}>
                  <Text style={{ fontSize: 18 }}>{r.icon}</Text>
                  <Text style={[styles.resumoValue, { color: r.color }]}>{r.value}</Text>
                  <Text style={styles.resumoLabel}>{r.label}</Text>
                </View>
              ))}
            </View>

            {boletim.resumo.media_geral && (
              <View style={styles.mediaGeral}>
                <Text style={styles.mediaGeralLabel}>Média Geral</Text>
                <Text style={styles.mediaGeralValue}>
                  {Number(boletim.resumo.media_geral).toFixed(2)}
                </Text>
              </View>
            )}

            {/* Disciplinas */}
            <Text style={styles.sectionTitle}>Disciplinas</Text>

            {boletim.disciplinas.length === 0 ? (
              <Text style={{ color: colors.text.secondary, textAlign: 'center', padding: 24 }}>
                Nenhuma disciplina encontrada
              </Text>
            ) : (
              boletim.disciplinas.map((d, idx) => {
                const cfg = situacaoCfg[d.situacao] ?? { color: colors.gray[500], bg: colors.gray[200], icon: 'help-circle' };
                return (
                  <View key={idx} style={[styles.discCard, { borderLeftColor: cfg.color }]}>
                    <View style={styles.discHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.discNome}>{d.disciplina}</Text>
                        {d.professor && <Text style={styles.discProf}>👨‍🏫 {d.professor}</Text>}
                        <Text style={styles.discMeta}>{d.carga_horaria}h · {d.semestre}° semestre</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                        <Ionicons name={cfg.icon as any} size={13} color={cfg.color} style={{ marginRight: 3 }} />
                        <Text style={[styles.badgeText, { color: cfg.color }]}>{d.situacao}</Text>
                      </View>
                    </View>

                    <View style={styles.notasRow}>
                      {[
                        { label: 'Nota 1', value: d.nota1 },
                        { label: 'Nota 2', value: d.nota2 },
                        { label: 'Média',  value: d.media, h: true },
                      ].map(n => (
                        <View key={n.label} style={[styles.notaBox, n.h && { backgroundColor: cfg.bg }]}>
                          <Text style={[styles.notaLabel, n.h && { color: cfg.color }]}>{n.label}</Text>
                          <Text style={[styles.notaValue, n.h && { color: cfg.color, fontWeight: '800', fontSize: fontSize.xl }]}>
                            {n.value != null ? Number(n.value).toFixed(2) : '—'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content:        { padding: spacing.lg },
  alunoCard:      { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, ...shadow.md },
  avatarCircle:   { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  alunoNome:      { fontSize: fontSize.lg, fontWeight: '700', color: '#fff' },
  alunoInfo:      { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  resumo:         { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  resumoCard:     { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderTopWidth: 3, ...shadow.sm, gap: 2 },
  resumoValue:    { fontSize: fontSize.xxl, fontWeight: '800' },
  resumoLabel:    { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600' },
  mediaGeral:     { backgroundColor: colors.primary + '12', borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.primary + '30' },
  mediaGeralLabel:{ fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  mediaGeralValue:{ fontSize: fontSize.xxxl, fontWeight: '900', color: colors.primary },
  sectionTitle:   { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  discCard:       { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.sm, borderLeftWidth: 4, ...shadow.sm, overflow: 'hidden' },
  discHeader:     { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm },
  discNome:       { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  discProf:       { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  discMeta:       { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
  badge:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.round },
  badgeText:      { fontSize: fontSize.xs, fontWeight: '700' },
  notasRow:       { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  notaBox:        { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRightWidth: 1, borderRightColor: colors.border },
  notaLabel:      { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600', marginBottom: 2 },
  notaValue:      { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  empty:          { alignItems: 'center', paddingVertical: 80, gap: 12 },
  emptyTitle:     { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  emptySub:       { fontSize: fontSize.md, color: colors.text.secondary },
});