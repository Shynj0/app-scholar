import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import api from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Disciplina {
  id: number; nome: string; carga_horaria: number;
  semestre: number; curso: string; total_alunos: number;
}

export default function ProfessorDisciplinasScreen() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/professor/disciplinas');
      setDisciplinas(data.data || []);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as disciplinas');
    } finally { setLoading(false); }
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
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={carregar}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: colors.primary }]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.meta}>{item.curso} · {item.semestre}° semestre · {item.carga_horaria}h</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="people-outline" size={16} color={colors.primary} />
                <Text style={styles.statText}>{item.total_alunos} aluno(s)</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm, borderLeftWidth: 4, ...shadow.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  nome: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  meta: { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600' }
});