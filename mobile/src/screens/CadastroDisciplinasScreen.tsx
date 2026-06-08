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

interface Professor { id: number; nome: string; titulacao?: string; area?: string }
interface Errors    { [k: string]: string }

const SEMESTRES = [1, 2, 3, 4, 5, 6, 7, 8];
const CURSOS    = ['DSM', 'GTI', 'ADS', 'BD', 'SI', 'Outro'];

export default function CadastroDisciplinasScreen() {
  const [form, setForm] = useState({
    nome: '', carga_horaria: '', professor_id: '', curso: '', semestre: '',
  });
  const [errors,         setErrors]         = useState<Errors>({});
  const [saving,         setSaving]         = useState(false);
  const [professores,    setProfessores]    = useState<Professor[]>([]);
  const [loadingProfs,   setLoadingProfs]   = useState(true);
  const [showProfModal,  setShowProfModal]  = useState(false);
  const [filterProf,     setFilterProf]     = useState('');
  const [profSelecionado,setProfSelecionado]= useState<Professor | null>(null);

  useEffect(() => {
    api.get('/api/professores')
      .then(r => setProfessores(r.data.data))
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar os professores'))
      .finally(() => setLoadingProfs(false));
  }, []);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nome.trim())         e.nome         = 'Nome é obrigatório';
    if (!form.carga_horaria)       e.carga_horaria = 'Carga horária é obrigatória';
    else if (isNaN(Number(form.carga_horaria)) || Number(form.carga_horaria) <= 0)
      e.carga_horaria = 'Deve ser um número positivo';
    if (!form.curso.trim())        e.curso        = 'Curso é obrigatório';
    if (!form.semestre)            e.semestre     = 'Semestre é obrigatório';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/api/disciplinas', {
        nome:          form.nome,
        carga_horaria: Number(form.carga_horaria),
        professor_id:  form.professor_id ? Number(form.professor_id) : null,
        curso:         form.curso,
        semestre:      Number(form.semestre),
      });
      Alert.alert('✅ Sucesso', 'Disciplina cadastrada com sucesso!', [
        {
          text: 'OK', onPress: () => {
            setForm({ nome: '', carga_horaria: '', professor_id: '', curso: '', semestre: '' });
            setProfSelecionado(null);
          }
        },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Erro ao cadastrar disciplina');
    } finally {
      setSaving(false);
    }
  };

  const profsFiltrados = professores.filter(p =>
    p.nome.toLowerCase().includes(filterProf.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Cadastro de Disciplinas" subtitle="Informações da disciplina" />
      <Loading visible={saving} message="Salvando disciplina..." />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Dados da Disciplina</Text>

          <CustomInput
            label="Nome da Disciplina *"
            placeholder="Ex: Programação Mobile I"
            value={form.nome}
            onChangeText={t => set('nome', t)}
            error={errors.nome}
            icon="book-outline"
          />

          <CustomInput
            label="Carga Horária (h) *"
            placeholder="Ex: 80"
            value={form.carga_horaria}
            onChangeText={t => set('carga_horaria', t)}
            error={errors.carga_horaria}
            icon="timer-outline"
            keyboardType="numeric"
          />

          {/* Curso — chips */}
          <Text style={styles.label}>Curso *</Text>
          {errors.curso && <Text style={styles.errorText}>{errors.curso}</Text>}
          <View style={styles.chips}>
            {CURSOS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, form.curso === c && styles.chipActive]}
                onPress={() => set('curso', c)}
              >
                <Text style={[styles.chipText, form.curso === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Semestre — chips */}
          <Text style={styles.label}>Semestre *</Text>
          {errors.semestre && <Text style={styles.errorText}>{errors.semestre}</Text>}
          <View style={styles.chips}>
            {SEMESTRES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, styles.chipSm, form.semestre === String(s) && styles.chipActive]}
                onPress={() => set('semestre', String(s))}
              >
                <Text style={[styles.chipText, form.semestre === String(s) && styles.chipTextActive]}>{s}°</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Professor — seletor */}
          <Text style={styles.label}>Professor Responsável</Text>
          <TouchableOpacity
            style={[styles.picker, loadingProfs && { opacity: 0.6 }]}
            onPress={() => !loadingProfs && setShowProfModal(true)}
            disabled={loadingProfs}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={18} color={colors.gray[500]} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerText, !profSelecionado && { color: colors.text.placeholder }]}>
              {loadingProfs
                ? 'Carregando professores...'
                : profSelecionado
                  ? `${profSelecionado.nome}${profSelecionado.titulacao ? ` (${profSelecionado.titulacao})` : ''}`
                  : 'Selecionar professor (opcional)'
              }
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.gray[500]} />
          </TouchableOpacity>

          {profSelecionado && (
            <TouchableOpacity onPress={() => { setProfSelecionado(null); set('professor_id', ''); }}>
              <Text style={{ color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.md }}>
                ✕ Remover professor
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <CustomButton
          title="💾 Salvar Disciplina"
          onPress={handleSave}
          fullWidth
          loading={saving}
          style={{ marginTop: spacing.md }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal de Professores ── */}
      <Modal visible={showProfModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Professor</Text>
              <TouchableOpacity onPress={() => { setShowProfModal(false); setFilterProf(''); }}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <CustomInput
              placeholder="Buscar professor..."
              value={filterProf}
              onChangeText={setFilterProf}
              icon="search-outline"
              containerStyle={{ marginHorizontal: 0, marginBottom: spacing.sm }}
            />

            {profsFiltrados.length === 0 ? (
              <Text style={{ color: colors.text.secondary, textAlign: 'center', padding: 24 }}>
                Nenhum professor encontrado
              </Text>
            ) : (
              <FlatList
                data={profsFiltrados}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.profItem, profSelecionado?.id === item.id && styles.profItemActive]}
                    onPress={() => {
                      setProfSelecionado(item);
                      set('professor_id', String(item.id));
                      setShowProfModal(false);
                      setFilterProf('');
                    }}
                  >
                    <View style={styles.profAvatar}>
                      <Text style={{ fontSize: 18 }}>👨‍🏫</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.profNome, profSelecionado?.id === item.id && { color: '#fff' }]}>
                        {item.nome}
                      </Text>
                      {item.area && (
                        <Text style={[styles.profArea, profSelecionado?.id === item.id && { color: 'rgba(255,255,255,0.8)' }]}>
                          {item.area}
                        </Text>
                      )}
                    </View>
                    {profSelecionado?.id === item.id && <Ionicons name="checkmark" size={20} color="#fff" />}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
                style={{ maxHeight: 360 }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content:      { padding: spacing.lg, paddingBottom: 20 },
  section:      { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  label:        { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 8, letterSpacing: 0.3 },
  errorText:    { fontSize: fontSize.xs, color: colors.danger, marginBottom: 6, marginLeft: 2 },
  chips:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.gray[100] },
  chipSm:       { paddingHorizontal: 10, paddingVertical: 7 },
  chipActive:   { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText:     { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '600' },
  chipTextActive:{ color: '#fff' },
  picker: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, marginBottom: spacing.sm,
  },
  pickerText:    { flex: 1, fontSize: fontSize.base, color: colors.text.primary },
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox:      { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '75%' },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle:    { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  profItem:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: radius.md },
  profItemActive:{ backgroundColor: colors.primary },
  profAvatar:    { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray[200], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  profNome:      { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  profArea:      { fontSize: fontSize.sm, color: colors.text.secondary, marginTop: 2 },
});
