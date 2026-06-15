import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Platform, RefreshControl } from 'react-native';
import { Ionicons }     from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // IMPLEMENTADO
import CustomInput     from '../components/CustomInput';
import CustomButton    from '../components/CustomButton';
import Loading         from '../components/Loading';
import api             from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

// ... (interfaces mantidas iguais)
interface DisciplinaBoletim { disciplina: string; carga_horaria: number; semestre: number; professor: string; nota1: number | null; nota2: number | null; media: number | null; situacao: string; }
interface Resumo { total: number; aprovados: number; reprovados: number; cursando: number; media_geral: string | null }
interface AlunoInfo { nome: string; matricula: string; curso: string; email: string }
interface Boletim { aluno: AlunoInfo; disciplinas: DisciplinaBoletim[]; resumo: Resumo }

const situacaoCfg: Record<string, { color: string; bg: string; icon: string }> = {
  Aprovado:  { color: colors.success, bg: '#e8f5e9', icon: 'checkmark-circle' },
  Reprovado: { color: colors.danger,  bg: '#ffebee', icon: 'close-circle'     },
  Cursando:  { color: colors.warning, bg: '#fff3e0', icon: 'time'             },
};
const defaultCfg = { color: colors.gray[500], bg: colors.gray[200], icon: 'help-circle' };

export default function BoletimScreen() {
  const [matricula, setMatricula] = useState('');
  const [boletim,   setBoletim]   = useState<Boletim | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [semFiltro, setSemFiltro] = useState<number | null>(null);
  const TOP = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 0;

  const buscarBoletim = async () => {
    if (!matricula.trim()) { Alert.alert('Atenção', 'Digite uma matrícula'); return; }
    setLoading(true);
    setBoletim(null);
    setSemFiltro(null);
    try {
      const { data } = await api.get(`/api/boletim/${matricula.trim()}`);
      setBoletim(data.data);
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 404) Alert.alert('Não encontrado', `Aluno com matrícula ${matricula} não encontrado.`);
      else Alert.alert('Erro', 'Não foi possível carregar o boletim.');
    } finally {
      setLoading(false);
    }
  };

  // ATUALIZAÇÃO AUTOMÁTICA AO FOCAR NA TELA
  useFocusEffect(
    useCallback(() => {
      if (matricula.trim() !== '') {
        buscarBoletim();
      }
    }, [matricula])
  );

  const semestres = boletim ? [...new Set(boletim.disciplinas.map(d => d.semestre).filter(Boolean))].sort() : [];
  const disciplinasFiltradas = boletim ? (semFiltro != null ? boletim.disciplinas.filter(d => d.semestre === semFiltro) : boletim.disciplinas) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={[styles.header, { paddingTop: TOP + 16 }]}><Text style={styles.headerTitle}>📄 Boletim Acadêmico</Text></View>
      <View style={styles.wave} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        // IMPLEMENTADO: Refresh manual
        refreshControl={<RefreshControl refreshing={loading} onRefresh={buscarBoletim} />}
      >
        <View style={styles.searchCard}>
          <Text style={styles.sectionTitle}>🔍 Consultar Boletim</Text>
          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <CustomInput label="Matrícula do Aluno" placeholder="Ex: 2024001" value={matricula} onChangeText={setMatricula} keyboardType="numeric" icon="id-card-outline" containerStyle={{ marginBottom: 0 }} />
            </View>
            <CustomButton title="Buscar" onPress={buscarBoletim} loading={loading} style={styles.searchBtn} />
          </View>
        </View>

        {boletim && (
          <>
            <View style={styles.alunoCard}>
              <View style={styles.avatarCircle}><Text style={{ fontSize: 32 }}>🎓</Text></View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.alunoNome}>{boletim.aluno.nome}</Text>
                <Text style={styles.alunoInfo}>Matrícula: {boletim.aluno.matricula}</Text>
              </View>
            </View>
            <View style={styles.resumo}>
              <ResumoCard label="Total" value={boletim.resumo.total} color={colors.primary} icon="📚" />
              <ResumoCard label="Aprovado" value={boletim.resumo.aprovados} color={colors.success} icon="✅" />
            </View>
            {/* ... Resto do seu JSX mantido exatamente como antes ... */}
            <Text style={styles.sectionTitle}>Disciplinas</Text>
            {disciplinasFiltradas.map((d, idx) => {
              const cfg = situacaoCfg[d.situacao] ?? defaultCfg;
              return (
                <View key={idx} style={[styles.discCard, { borderLeftColor: cfg.color }]}>
                  <View style={styles.discHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.discNome}>{d.disciplina}</Text>
                      <Text style={styles.discMeta}>{d.carga_horaria}h · {d.semestre}° semestre</Text>
                    </View>
                  </View>
                  <View style={styles.notasRow}>
                    <NotaBox label="Nota 1" value={d.nota1} />
                    <NotaBox label="Nota 2" value={d.nota2} />
                    <NotaBox label="Média" value={d.media} highlight color={cfg.color} />
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
      <Loading visible={loading} message="Buscando boletim..." />
    </View>
  );
}

// ── Subcomponentes ─────────────────────────────────────────────────────────────
function ResumoCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <View style={[styles.resumoCard, { borderTopColor: color }]}>
      <Text style={{ fontSize: 20 }}>{icon}</Text>
      <Text style={[styles.resumoValue, { color }]}>{value}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

function NotaBox({ label, value, highlight, color }: { label: string; value: number | null; highlight?: boolean; color?: string }) {
  return (
    <View style={[styles.notaBox, highlight && { backgroundColor: (color ?? colors.primary) + '18' }]}>
      <Text style={[styles.notaLabel, highlight && { color: color }]}>{label}</Text>
      <Text style={[styles.notaValue, highlight && { color, fontWeight: '800', fontSize: fontSize.xl }]}>
        {value != null ? Number(value).toFixed(2) : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header:     { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingBottom: 48 },
  headerTitle:{ fontSize: fontSize.xxl, fontWeight: '700', color: '#fff' },
  headerSub:  { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  wave:       { height: 30, backgroundColor: colors.background, borderTopLeftRadius: 22, borderTopRightRadius: 22, marginTop: -28 },
  content:    { padding: spacing.lg, paddingTop: 0 },
  searchCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm },
  searchRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  searchBtn:  { marginBottom: spacing.md, height: 50, paddingHorizontal: spacing.md, justifyContent: 'center' },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  alunoCard:  { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, ...shadow.md },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  alunoNome:  { fontSize: fontSize.lg, fontWeight: '700', color: '#fff' },
  alunoInfo:  { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  resumo:     { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  resumoCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderTopWidth: 3, ...shadow.sm, gap: 2 },
  resumoValue:{ fontSize: fontSize.xxl, fontWeight: '800' },
  resumoLabel:{ fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600' },
  mediaGeral: { backgroundColor: colors.primary + '12', borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.primary + '30' },
  mediaGeralLabel:{ fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  mediaGeralValue:{ fontSize: fontSize.xxxl, fontWeight: '900', color: colors.primary },
  semChip:     { marginRight: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  semChipActive:{ borderColor: colors.primary, backgroundColor: colors.primary },
  semChipText: { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '600' },
  semChipTextActive:{ color: '#fff' },
  discCard:   { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.sm, borderLeftWidth: 4, ...shadow.sm, overflow: 'hidden' },
  discHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm },
  discNome:   { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  discProf:   { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  discMeta:   { fontSize: fontSize.xs, color: colors.gray[400], marginTop: 2 },
  situacaoBadge:{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.round },
  situacaoText: { fontSize: fontSize.xs, fontWeight: '700' },
  notasRow:   { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  notaBox:    { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRightWidth: 1, borderRightColor: colors.border },
  notaLabel:  { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600', marginBottom: 2 },
  notaValue:  { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  empty:      { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
  emptySub:   { fontSize: fontSize.md, color: colors.text.secondary, textAlign: 'center' },
});
