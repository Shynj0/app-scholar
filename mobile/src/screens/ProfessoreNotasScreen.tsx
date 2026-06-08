import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, Modal, ScrollView, TextInput,
} from 'react-native';
import { Ionicons }    from '@expo/vector-icons';
import ScreenHeader    from '../components/ScreenHeader';
import CustomButton    from '../components/CustomButton';
import api             from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Disciplina { id: number; nome: string; semestre: number }
interface AlunoNota {
  id: number; nome: string; matricula: string;
  disciplina_id: number; nota_id: number;
  nota1: number | null; nota2: number | null;
  media: number | null; situacao: string;
}

const calcMedia = (n1: string, n2: string) => {
  const v1 = parseFloat(n1), v2 = parseFloat(n2);
  if (isNaN(v1) || isNaN(v2)) return null;
  return parseFloat(((v1 + v2) / 2).toFixed(2));
};

export default function ProfessorNotasScreen() {
  const [disciplinas,  setDisciplinas]  = useState<Disciplina[]>([]);
  const [discAtual,    setDiscAtual]    = useState<Disciplina | null>(null);
  const [alunos,       setAlunos]       = useState<AlunoNota[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [loadingAlunos,setLoadingAlunos]= useState(false);
  const [showDiscModal,setShowDiscModal]= useState(false);
  const [editItem,     setEditItem]     = useState<AlunoNota | null>(null);
  const [nota1,        setNota1]        = useState('');
  const [nota2,        setNota2]        = useState('');
  const [saving,       setSaving]       = useState(false);

  const carregarDisciplinas = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/professor/disciplinas');
      setDisciplinas(data.data);
      if (data.data.length > 0 && !discAtual) {
        setDiscAtual(data.data[0]);
      }
    } catch { Alert.alert('Erro', 'Não foi possível carregar as disciplinas'); }
    finally { setLoading(false); }
  }, []);

  const carregarAlunos = useCallback(async (discId: number) => {
    setLoadingAlunos(true);
    try {
      const { data } = await api.get(`/api/professor/alunos?disciplina_id=${discId}`);
      setAlunos(data.data);
    } catch { Alert.alert('Erro', 'Não foi possível carregar os alunos'); }
    finally { setLoadingAlunos(false); }
  }, []);

  useEffect(() => { carregarDisciplinas(); }, [carregarDisciplinas]);
  useEffect(() => { if (discAtual) carregarAlunos(discAtual.id); }, [discAtual]);

  const abrirEdicao = (item: AlunoNota) => {
    setEditItem(item);
    setNota1(item.nota1 != null ? String(item.nota1) : '');
    setNota2(item.nota2 != null ? String(item.nota2) : '');
  };

  const salvar = async () => {
    if (!editItem) return;
    const v1 = parseFloat(nota1), v2 = parseFloat(nota2);
    if (nota1 && (isNaN(v1) || v1 < 0 || v1 > 10)) return Alert.alert('Erro', 'Nota 1 deve ser entre 0 e 10');
    if (nota2 && (isNaN(v2) || v2 < 0 || v2 > 10)) return Alert.alert('Erro', 'Nota 2 deve ser entre 0 e 10');

    setSaving(true);
    try {
      await api.put(`/api/professor/notas/${editItem.nota_id}`, {
        nota1: nota1 ? v1 : null,
        nota2: nota2 ? v2 : null,
      });
      Alert.alert('✅ Salvo!', 'Nota atualizada com sucesso');
      setEditItem(null);
      if (discAtual) carregarAlunos(discAtual.id);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Erro ao salvar nota');
    } finally { setSaving(false); }
  };

  const media = calcMedia(nota1, nota2);
  const situacao = media != null ? (media >= 5 ? 'Aprovado' : 'Reprovado') : '—';
  const sitCor = situacao === 'Aprovado' ? colors.success : situacao === 'Reprovado' ? colors.danger : colors.gray[500];

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Notas" />
      <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Lançamento de Notas" subtitle="Selecione a disciplina" />

      {/* Seletor de disciplina */}
      <View style={styles.discSelector}>
        <TouchableOpacity style={styles.discBtn} onPress={() => setShowDiscModal(true)} activeOpacity={0.8}>
          <Ionicons name="book-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.discBtnText} numberOfLines={1}>
            {discAtual ? discAtual.nome : 'Selecionar disciplina'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loadingAlunos ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={() => discAtual && carregarAlunos(discAtual.id)}
          refreshing={loadingAlunos}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>📝</Text>
              <Text style={styles.emptyTitle}>Nenhuma nota encontrada</Text>
              <Text style={styles.emptySub}>Lance notas pelo módulo de Notas do admin</Text>
            </View>
          }
          renderItem={({ item }) => {
            const cfg = item.situacao === 'Aprovado'
              ? { color: colors.success, bg: '#e8f5e9' }
              : item.situacao === 'Reprovado'
              ? { color: colors.danger, bg: '#ffebee' }
              : { color: colors.warning, bg: '#fff3e0' };

            return (
              <TouchableOpacity style={styles.card} onPress={() => abrirEdicao(item)} activeOpacity={0.85}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nomeText}>{item.nome}</Text>
                    <Text style={styles.metaText}>Matrícula: {item.matricula}</Text>
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
                <View style={styles.editHint}>
                  <Ionicons name="create-outline" size={14} color={colors.primary} />
                  <Text style={styles.editHintText}>Toque para editar</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Modal de disciplinas */}
      <Modal visible={showDiscModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Disciplina</Text>
              <TouchableOpacity onPress={() => setShowDiscModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {disciplinas.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.discItem, discAtual?.id === d.id && styles.discItemActive]}
                  onPress={() => { setDiscAtual(d); setShowDiscModal(false); }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.discNome, discAtual?.id === d.id && { color: '#fff' }]}>{d.nome}</Text>
                    <Text style={[styles.discMeta, discAtual?.id === d.id && { color: 'rgba(255,255,255,0.8)' }]}>
                      {d.semestre}° semestre
                    </Text>
                  </View>
                  {discAtual?.id === d.id && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de edição de nota */}
      <Modal visible={!!editItem} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Notas</Text>
              <TouchableOpacity onPress={() => setEditItem(null)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {editItem && (
              <>
                <View style={styles.alunoInfo}>
                  <Text style={styles.alunoNome}>{editItem.nome}</Text>
                  <Text style={styles.alunoMat}>Matrícula: {editItem.matricula}</Text>
                </View>

                <View style={styles.notasEditRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Nota 1</Text>
                    <TextInput
                      style={styles.notaInput}
                      value={nota1}
                      onChangeText={setNota1}
                      keyboardType="decimal-pad"
                      placeholder="0.0 – 10.0"
                      placeholderTextColor={colors.text.placeholder}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Nota 2</Text>
                    <TextInput
                      style={styles.notaInput}
                      value={nota2}
                      onChangeText={setNota2}
                      keyboardType="decimal-pad"
                      placeholder="0.0 – 10.0"
                      placeholderTextColor={colors.text.placeholder}
                    />
                  </View>
                </View>

                {nota1 && nota2 && (
                  <View style={[styles.preview, { borderColor: sitCor }]}>
                    <Text style={styles.previewLabel}>Média: <Text style={[styles.previewMedia, { color: sitCor }]}>{media?.toFixed(2)}</Text></Text>
                    <View style={[styles.badge, { backgroundColor: sitCor + '20' }]}>
                      <Text style={[styles.badgeText, { color: sitCor }]}>{situacao}</Text>
                    </View>
                  </View>
                )}

                <CustomButton title="💾 Salvar" onPress={salvar} loading={saving} fullWidth style={{ marginTop: spacing.md }} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  discSelector:  { backgroundColor: colors.surface, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  discBtn:       { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '12', borderRadius: radius.md, padding: spacing.md, borderWidth: 1.5, borderColor: colors.primary + '40' },
  discBtnText:   { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.primary },
  list:          { padding: spacing.md, paddingBottom: 40 },
  card:          { backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.sm, overflow: 'hidden', ...shadow.sm },
  cardTop:       { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm },
  nomeText:      { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  metaText:      { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  badge:         { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.round },
  badgeText:     { fontSize: fontSize.xs, fontWeight: '700' },
  notasRow:      { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  notaBox:       { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRightWidth: 1, borderRightColor: colors.border },
  notaLabel:     { fontSize: fontSize.xs, color: colors.text.secondary, fontWeight: '600', marginBottom: 2 },
  notaValue:     { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  editHint:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 8, gap: 4, backgroundColor: colors.primary + '08' },
  editHintText:  { fontSize: fontSize.xs, color: colors.primary, fontWeight: '600' },
  empty:         { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle:    { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  emptySub:      { fontSize: fontSize.md, color: colors.text.secondary, textAlign: 'center' },
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox:      { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '80%' },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle:    { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  discItem:      { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, marginBottom: 4 },
  discItemActive:{ backgroundColor: colors.primary },
  discNome:      { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  discMeta:      { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  alunoInfo:     { backgroundColor: colors.gray[100], borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  alunoNome:     { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  alunoMat:      { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  notasEditRow:  { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  inputLabel:    { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 6 },
  notaInput:     { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary, textAlign: 'center' },
  preview:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md },
  previewLabel:  { fontSize: fontSize.md, fontWeight: '600', color: colors.text.secondary },
  previewMedia:  { fontSize: fontSize.xl, fontWeight: '800' },
});