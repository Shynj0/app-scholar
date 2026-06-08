import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  TouchableOpacity, Modal, FlatList,
} from 'react-native';
import { Ionicons }    from '@expo/vector-icons';
import ScreenHeader    from '../components/ScreenHeader';
import CustomInput     from '../components/CustomInput';
import CustomButton    from '../components/CustomButton';
import Loading         from '../components/Loading';
import api             from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Aluno      { id: number; nome: string; matricula: string; curso: string }
interface Disciplina { id: number; nome: string; semestre?: number; professor_nome?: string }

const calcMedia    = (n1: string, n2: string) => {
  const v1 = parseFloat(n1); const v2 = parseFloat(n2);
  if (isNaN(v1) || isNaN(v2)) return null;
  return parseFloat(((v1 + v2) / 2).toFixed(2));
};
const calcSituacao = (media: number | null) =>
  media == null ? '—' : media >= 5 ? 'Aprovado' : 'Reprovado';

export default function NotasScreen() {
  const [matricula,       setMatricula]       = useState('');
  const [aluno,           setAluno]           = useState<Aluno | null>(null);
  const [searching,       setSearching]       = useState(false);
  const [disciplinas,     setDisciplinas]     = useState<Disciplina[]>([]);
  const [discSelecionada, setDiscSelecionada] = useState<Disciplina | null>(null);
  const [showDiscModal,   setShowDiscModal]   = useState(false);
  const [nota1,           setNota1]           = useState('');
  const [nota2,           setNota2]           = useState('');
  const [saving,          setSaving]          = useState(false);
  const [errors,          setErrors]          = useState<Record<string, string>>({});

  const media    = calcMedia(nota1, nota2);
  const situacao = calcSituacao(media);

  useEffect(() => {
    api.get('/api/disciplinas')
      .then(r => setDisciplinas(r.data.data))
      .catch(console.error);
  }, []);

  const buscarAluno = async () => {
    if (!matricula.trim()) { Alert.alert('Atenção', 'Informe a matrícula'); return; }
    setSearching(true);
    setAluno(null);
    try {
      const r = await api.get(`/api/alunos/matricula/${matricula.trim()}`);
      setAluno(r.data.data);
    } catch (err: any) {
      const code = err?.response?.status;
      Alert.alert('Não encontrado', code === 404 ? `Aluno com matrícula ${matricula} não encontrado` : 'Erro ao buscar aluno');
    } finally {
      setSearching(false);
    }
  };

  const validateNotas = () => {
    const e: Record<string, string> = {};
    if (!aluno)           e.aluno = 'Busque um aluno primeiro';
    if (!discSelecionada) e.disc  = 'Selecione uma disciplina';
    if (!nota1.trim())    e.nota1 = 'Nota 1 é obrigatória';
    else {
      const v = parseFloat(nota1);
      if (isNaN(v) || v < 0 || v > 10) e.nota1 = 'Deve ser entre 0 e 10';
    }
    if (!nota2.trim())    e.nota2 = 'Nota 2 é obrigatória';
    else {
      const v = parseFloat(nota2);
      if (isNaN(v) || v < 0 || v > 10) e.nota2 = 'Deve ser entre 0 e 10';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validateNotas()) return;
    setSaving(true);
    try {
      await api.post('/api/notas', {
        aluno_id:      aluno!.id,
        disciplina_id: discSelecionada!.id,
        nota1:         parseFloat(nota1),
        nota2:         parseFloat(nota2),
      });
      Alert.alert('✅ Notas salvas', `Média: ${media} — ${situacao}`, [
        {
          text: 'Lançar mais', onPress: () => {
            setDiscSelecionada(null); setNota1(''); setNota2(''); setErrors({});
          }
        },
        {
          text: 'Novo aluno', onPress: () => {
            setAluno(null); setMatricula(''); setDiscSelecionada(null); setNota1(''); setNota2(''); setErrors({});
          }
        },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao salvar notas';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  const situacaoCor =
    situacao === 'Aprovado'  ? colors.success  :
    situacao === 'Reprovado' ? colors.danger    : colors.gray[500];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Lançamento de Notas" subtitle="Busque o aluno e informe as notas" />
      <Loading visible={saving} message="Salvando notas..." />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Busca de aluno ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Buscar Aluno</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Matrícula"
                placeholder="Ex: 2024001"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numeric"
                icon="id-card-outline"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <CustomButton
              title="Buscar"
              onPress={buscarAluno}
              loading={searching}
              style={styles.searchBtn}
            />
          </View>

          {aluno && (
            <View style={styles.alunoCard}>
              <View style={styles.alunoAvatar}>
                <Text style={{ fontSize: 24 }}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alunoNome}>{aluno.nome}</Text>
                <Text style={styles.alunoInfo}>Matrícula: {aluno.matricula} · {aluno.curso}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            </View>
          )}
        </View>

        {/* ── Lançamento ── */}
        <View style={[styles.section, !aluno && { opacity: 0.5 }]}>
          <Text style={styles.sectionTitle}>📝 Lançar Notas</Text>

          {/* Disciplina */}
          <Text style={styles.label}>Disciplina *</Text>
          {errors.disc && <Text style={styles.errorText}>{errors.disc}</Text>}
          <TouchableOpacity
            style={styles.picker}
            onPress={() => aluno && setShowDiscModal(true)}
            disabled={!aluno}
            activeOpacity={0.7}
          >
            <Ionicons name="book-outline" size={18} color={colors.gray[500]} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerText, !discSelecionada && { color: colors.text.placeholder }]}>
              {discSelecionada ? discSelecionada.nome : 'Selecionar disciplina'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.gray[500]} />
          </TouchableOpacity>

          {/* Notas */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <CustomInput
                label="Nota 1 *"
                placeholder="0.0 – 10.0"
                value={nota1}
                onChangeText={t => { setNota1(t); setErrors(p => ({...p, nota1: ''})); }}
                keyboardType="decimal-pad"
                error={errors.nota1}
                icon="star-outline"
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <CustomInput
                label="Nota 2 *"
                placeholder="0.0 – 10.0"
                value={nota2}
                onChangeText={t => { setNota2(t); setErrors(p => ({...p, nota2: ''})); }}
                keyboardType="decimal-pad"
                error={errors.nota2}
                icon="star-outline"
              />
            </View>
          </View>

          {/* Pré-visualização da média */}
          {nota1 && nota2 && (
            <View style={[styles.preview, { borderColor: situacaoCor }]}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Média:</Text>
                <Text style={[styles.previewMedia, { color: situacaoCor }]}>
                  {media != null ? media.toFixed(2) : '—'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: situacaoCor }]}>
                <Text style={styles.badgeText}>{situacao}</Text>
              </View>
            </View>
          )}

          <CustomButton
            title="💾 Salvar Notas"
            onPress={handleSave}
            fullWidth
            loading={saving}
            disabled={!aluno || !discSelecionada}
            style={{ marginTop: spacing.sm }}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal de Disciplinas ── */}
      <Modal visible={showDiscModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Disciplina</Text>
              <TouchableOpacity onPress={() => setShowDiscModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={disciplinas}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.discItem, discSelecionada?.id === item.id && styles.discItemActive]}
                  onPress={() => { setDiscSelecionada(item); setShowDiscModal(false); setErrors(p => ({...p, disc: ''})); }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.discNome, discSelecionada?.id === item.id && { color: '#fff' }]}>
                      {item.nome}
                    </Text>
                    {item.semestre != null && (
                      <Text style={[styles.discInfo, discSelecionada?.id === item.id && { color: 'rgba(255,255,255,0.8)' }]}>
                        {item.semestre}° semestre{item.professor_nome ? ` · ${item.professor_nome}` : ''}
                      </Text>
                    )}
                  </View>
                  {discSelecionada?.id === item.id && <Ionicons name="checkmark" size={20} color="#fff" />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
              style={{ maxHeight: 400 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content:        { padding: spacing.lg, paddingBottom: 20 },
  section:        { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm },
  sectionTitle:   { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  label:          { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 8, letterSpacing: 0.3 },
  errorText:      { fontSize: fontSize.xs, color: colors.danger, marginBottom: 6, marginLeft: 2 },
  row:            { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  searchBtn:      { marginBottom: spacing.md, paddingHorizontal: spacing.md, height: 48, justifyContent: 'center' },
  alunoCard:      { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '15', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.success + '40' },
  alunoAvatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray[200], alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  alunoNome:      { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary },
  alunoInfo:      { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
  picker:         { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, marginBottom: spacing.md },
  pickerText:     { flex: 1, fontSize: fontSize.base, color: colors.text.primary },
  preview:        { borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, marginVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  previewRow:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  previewLabel:   { fontSize: fontSize.md, fontWeight: '600', color: colors.text.secondary },
  previewMedia:   { fontSize: fontSize.xxl, fontWeight: '800' },
  badge:          { borderRadius: radius.round, paddingHorizontal: 14, paddingVertical: 5 },
  badgeText:      { color: '#fff', fontWeight: '700', fontSize: fontSize.sm },
  overlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox:       { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '75%' },
  modalHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle:     { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  discItem:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderRadius: radius.md },
  discItemActive: { backgroundColor: colors.primary },
  discNome:       { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  discInfo:       { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
});
