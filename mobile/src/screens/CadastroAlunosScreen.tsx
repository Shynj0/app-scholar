import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity,
  Modal, FlatList, ActivityIndicator,
} from 'react-native';
import { Ionicons }         from '@expo/vector-icons';
import ScreenHeader         from '../components/ScreenHeader';
import CustomInput          from '../components/CustomInput';
import CustomButton         from '../components/CustomButton';
import Loading              from '../components/Loading';
import api                  from '../services/api';
import { buscarCEP, formatarCEP } from '../services/viacepService';
import { listarEstados, Estado }   from '../services/ibgeService';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Errors { [k: string]: string }

export default function CadastroAlunosScreen() {
  const [form, setForm] = useState({
    nome: '', matricula: '', curso: '', email: '',
    telefone: '', cep: '', endereco: '', cidade: '', estado: '',
  });
  const [errors,        setErrors]        = useState<Errors>({});
  const [saving,        setSaving]        = useState(false);
  const [loadingCEP,    setLoadingCEP]    = useState(false);
  const [estados,       setEstados]       = useState<Estado[]>([]);
  const [showEstModal,  setShowEstModal]  = useState(false);
  const [filterEst,     setFilterEst]     = useState('');

  useEffect(() => {
    listarEstados().then(setEstados).catch(console.error);
  }, []);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── CEP auto-fill ─────────────────────────────────────────────────────────
  const onCEPChange = async (raw: string) => {
    const fmt = formatarCEP(raw);
    set('cep', fmt);
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 8) {
      setLoadingCEP(true);
      const end = await buscarCEP(digits);
      setLoadingCEP(false);
      if (end) {
        setForm(prev => ({
          ...prev, cep: fmt,
          endereco: end.logradouro,
          cidade:   end.localidade,
          estado:   end.uf,
        }));
      } else {
        Alert.alert('CEP não encontrado', 'Verifique o CEP e preencha o endereço manualmente.');
      }
    }
  };

  // ── Validação ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nome.trim())      e.nome      = 'Nome é obrigatório';
    if (!form.matricula.trim()) e.matricula = 'Matrícula é obrigatória';
    if (!form.curso.trim())     e.curso     = 'Curso é obrigatório';
    if (!form.email.trim())     e.email     = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/api/alunos', form);
      Alert.alert('✅ Sucesso', 'Aluno cadastrado com sucesso!', [
        { text: 'OK', onPress: () => setForm({ nome: '', matricula: '', curso: '', email: '', telefone: '', cep: '', endereco: '', cidade: '', estado: '' }) },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao cadastrar aluno';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  const estadosFiltrados = estados.filter(e =>
    e.nome.toLowerCase().includes(filterEst.toLowerCase()) ||
    e.sigla.toLowerCase().includes(filterEst.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Cadastro de Alunos" subtitle="Preencha todos os campos obrigatórios" />
      <Loading visible={saving} message="Salvando aluno..." />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Dados Pessoais ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Dados Pessoais</Text>

          <CustomInput label="Nome Completo *" placeholder="Ex: Maria da Silva" value={form.nome}
            onChangeText={t => set('nome', t)} error={errors.nome} icon="person-outline" />

          <CustomInput label="Matrícula *" placeholder="Ex: 2024001" value={form.matricula}
            onChangeText={t => set('matricula', t)} error={errors.matricula}
            icon="id-card-outline" keyboardType="numeric" />

          <CustomInput label="Curso *" placeholder="Ex: DSM" value={form.curso}
            onChangeText={t => set('curso', t)} error={errors.curso} icon="school-outline" />

          <CustomInput label="E-mail *" placeholder="aluno@email.com" value={form.email}
            onChangeText={t => set('email', t)} error={errors.email}
            icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />

          <CustomInput label="Telefone" placeholder="(12) 99999-9999" value={form.telefone}
            onChangeText={t => set('telefone', t)} icon="call-outline" keyboardType="phone-pad" />
        </View>

        {/* ── Endereço ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Endereço</Text>

          <CustomInput
            label="CEP"
            placeholder="00000-000"
            value={form.cep}
            onChangeText={onCEPChange}
            icon="location-outline"
            keyboardType="numeric"
            maxLength={9}
            rightIcon={loadingCEP ? <ActivityIndicator size="small" color={colors.primary} /> : undefined}
          />

          <CustomInput label="Endereço" placeholder="Rua, número, complemento" value={form.endereco}
            onChangeText={t => set('endereco', t)} icon="home-outline" />

          <CustomInput label="Cidade" placeholder="Sua cidade" value={form.cidade}
            onChangeText={t => set('cidade', t)} icon="business-outline" />

          {/* Estado — seletor com Modal */}
          <Text style={styles.label}>Estado</Text>
          <TouchableOpacity style={styles.picker} onPress={() => setShowEstModal(true)} activeOpacity={0.7}>
            <Ionicons name="map-outline" size={18} color={colors.gray[500]} style={{ marginRight: 8 }} />
            <Text style={[styles.pickerText, !form.estado && { color: colors.text.placeholder }]}>
              {form.estado ? `${form.estado} — ${estados.find(e => e.sigla === form.estado)?.nome ?? ''}` : 'Selecione o estado'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>

        <CustomButton title="💾 Salvar Aluno" onPress={handleSave} fullWidth loading={saving} style={{ marginTop: spacing.md }} />
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal de Seleção de Estado ── */}
      <Modal visible={showEstModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Estado</Text>
              <TouchableOpacity onPress={() => setShowEstModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <CustomInput
              placeholder="Buscar estado..."
              value={filterEst}
              onChangeText={setFilterEst}
              icon="search-outline"
              containerStyle={{ marginHorizontal: 0, marginBottom: spacing.sm }}
            />

            <FlatList
              data={estadosFiltrados}
              keyExtractor={item => item.sigla}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.estItem, form.estado === item.sigla && styles.estItemActive]}
                  onPress={() => { set('estado', item.sigla); setShowEstModal(false); setFilterEst(''); }}
                >
                  <Text style={[styles.estSigla, form.estado === item.sigla && { color: '#fff' }]}>{item.sigla}</Text>
                  <Text style={[styles.estNome,  form.estado === item.sigla && { color: '#fff' }]}>{item.nome}</Text>
                  {form.estado === item.sigla && <Ionicons name="checkmark" size={18} color="#fff" />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
              style={{ maxHeight: 380 }}
            />
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
  label:        { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 6, letterSpacing: 0.3 },
  picker: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, height: 48,
    marginBottom: spacing.md,
  },
  pickerText:   { flex: 1, fontSize: fontSize.base, color: colors.text.primary },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox:     { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '80%' },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle:   { fontSize: fontSize.xl, fontWeight: '700', color: colors.text.primary },
  estItem:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: spacing.sm, borderRadius: radius.md },
  estItemActive:{ backgroundColor: colors.primary },
  estSigla:     { width: 36, fontWeight: '700', color: colors.primary, fontSize: fontSize.md },
  estNome:      { flex: 1, color: colors.text.primary, fontSize: fontSize.md },
});
