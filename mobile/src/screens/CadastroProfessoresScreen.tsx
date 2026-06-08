import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import ScreenHeader  from '../components/ScreenHeader';
import CustomInput   from '../components/CustomInput';
import CustomButton  from '../components/CustomButton';
import Loading       from '../components/Loading';
import api           from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Form { nome: string; titulacao: string; area: string; tempo_docencia: string; email: string }
interface Errors { [k: string]: string }

const TITULACOES = ['Graduado', 'Especialista', 'Mestre', 'Doutor', 'Pós-Doutor'];

export default function CadastroProfessoresScreen() {
  const [form, setForm] = useState<Form>({ nome: '', titulacao: '', area: '', tempo_docencia: '', email: '' });
  const [errors,  setErrors]  = useState<Errors>({});
  const [saving,  setSaving]  = useState(false);

  const set = (field: keyof Form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nome.trim())  e.nome  = 'Nome é obrigatório';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    if (form.tempo_docencia && isNaN(Number(form.tempo_docencia)))
      e.tempo_docencia = 'Deve ser um número';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.post('/api/professores', {
        ...form,
        tempo_docencia: form.tempo_docencia ? Number(form.tempo_docencia) : null,
      });
      Alert.alert('✅ Sucesso', 'Professor cadastrado com sucesso!', [
        { text: 'OK', onPress: () => setForm({ nome: '', titulacao: '', area: '', tempo_docencia: '', email: '' }) },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || 'Erro ao cadastrar professor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Cadastro de Professores" subtitle="Informações do docente" />
      <Loading visible={saving} message="Salvando professor..." />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🏫 Dados do Professor</Text>

          <CustomInput
            label="Nome Completo *"
            placeholder="Ex: Prof. João da Silva"
            value={form.nome}
            onChangeText={t => set('nome', t)}
            error={errors.nome}
            icon="person-outline"
          />

          {/* Titulação — chips */}
          <Text style={styles.label}>Titulação</Text>
          <View style={styles.chips}>
            {TITULACOES.map(t => (
              <ChipBtn
                key={t}
                label={t}
                active={form.titulacao === t}
                onPress={() => set('titulacao', t)}
              />
            ))}
          </View>

          <CustomInput
            label="Área de Atuação"
            placeholder="Ex: Algoritmos"
            value={form.area}
            onChangeText={t => set('area', t)}
            icon="briefcase-outline"
          />

          <CustomInput
            label="Tempo de Docência (anos)"
            placeholder="Ex: 5"
            value={form.tempo_docencia}
            onChangeText={t => set('tempo_docencia', t)}
            error={errors.tempo_docencia}
            icon="time-outline"
            keyboardType="numeric"
          />

          <CustomInput
            label="E-mail *"
            placeholder="professor@fatec.sp.gov.br"
            value={form.email}
            onChangeText={t => set('email', t)}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <CustomButton
          title="💾 Salvar Professor"
          onPress={handleSave}
          fullWidth
          loading={saving}
          style={{ marginTop: spacing.md }}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ── Chip de titulação ─────────────────────────────────────────────────────────
function ChipBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content:      { padding: spacing.lg, paddingBottom: 20 },
  section:      { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  label:        { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 8, letterSpacing: 0.3 },
  chips:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip:         { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.gray[100] },
  chipActive:   { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText:     { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '600' },
  chipTextActive:{ color: '#fff' },
});
