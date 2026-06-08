import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import api from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

const situacaoCfg: Record<string, { color: string; bg: string }> = {
  Aprovado: { color: colors.success, bg: '#e8f5e9' },
  Reprovado: { color: colors.danger, bg: '#ffebee' },
  Cursando: { color: colors.warning, bg: '#fff3e0' },
};

export default function ProfessorAlunosScreen() {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [discFiltro, setDiscFiltro] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const [resAlunos, resDisc] = await Promise.all([
        api.get('/api/professor/alunos'),
        api.get('/api/professor/disciplinas')
      ]);
      setAlunos(resAlunos.data.data || []);
      setDisciplinas(resDisc.data.data || []);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const dadosFiltrados = discFiltro ? alunos.filter(a => a.disciplina_id === discFiltro) : alunos;

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Meus Alunos" subtitle={`${dadosFiltrados.length} aluno(s)`} />
      
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          <TouchableOpacity style={[styles.chip, !discFiltro && styles.chipActive]} onPress={() => setDiscFiltro(null)}>
            <Text style={[styles.chipText, !discFiltro && styles.chipTextActive]}>Todos</Text>
          </TouchableOpacity>
          {disciplinas.map(d => (
            <TouchableOpacity key={d.id} style={[styles.chip, discFiltro === d.id && styles.chipActive]} onPress={() => setDiscFiltro(d.id)}>
              <Text style={[styles.chipText, discFiltro === d.id && styles.chipTextActive]}>{d.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={dadosFiltrados}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
            const cfg = situacaoCfg[item.situacao] || { color: colors.gray[500], bg: colors.gray[200] };
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nomeText}>{item.nome}</Text>
                        <Text style={styles.metaText}>{item.matricula} · {item.curso}</Text>
                        <Text style={styles.discText}>{item.disciplina_nome}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: cfg.bg }]}><Text style={[styles.badgeText, { color: cfg.color }]}>{item.situacao}</Text></View>
                </View>
                <View style={styles.notasRow}>
                    {[{l:'Nota 1', v:item.nota1}, {l:'Nota 2', v:item.nota2}, {l:'Média', v:item.media, h:true}].map(n => (
                        <View key={n.l} style={[styles.notaBox, n.h && {backgroundColor: cfg.bg}]}>
                            <Text style={styles.notaLabel}>{n.l}</Text>
                            <Text style={styles.notaValue}>{n.v != null ? Number(n.v).toFixed(1) : '—'}</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterWrap: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterRow: { padding: spacing.sm, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.gray[100], maxWidth: 160 },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  list: { padding: spacing.md, paddingBottom: 40 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.sm, overflow: 'hidden', ...shadow.sm },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm },
  nomeText: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  metaText: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  discText: { fontSize: fontSize.xs, color: colors.primary, marginTop: 2, fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.round, alignSelf: 'flex-start' },
  badgeText: { fontSize: fontSize.xs, fontWeight: '700' },
  notasRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  notaBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRightWidth: 1, borderRightColor: colors.border },
  notaLabel: { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600', marginBottom: 2 },
  notaValue: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
});