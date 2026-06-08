import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenHeader         from '../components/ScreenHeader';
import CustomInput          from '../components/CustomInput';
import CustomButton         from '../components/CustomButton';
import Loading              from '../components/Loading';
import api                  from '../services/api';
import { colors, spacing, fontSize, radius, shadow } from '../styles/theme';

interface Errors { [k: string]: string }

export default function CadastroProfessoresScreen() {
  const [form, setForm] = useState({
    nome: '', email: '', titulacao: '', area: '', tempo_docencia: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.nome.trim())  e.nome  = 'Nome é obrigatório';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // ✅ Chamando a rota correta do professor
      await api.post('/api/professores', form);
      Alert.alert('✅ Sucesso', 'Professor cadastrado com sucesso! Conta de acesso criada.', [
        { text: 'OK', onPress: () => setForm({ nome: '', email: '', titulacao: '', area: '', tempo_docencia: '' }) },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao cadastrar professor';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Cadastro de Professores" subtitle="Preencha os dados do docente" />
      <Loading visible={saving} message="Salvando professor..." />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Dados do Professor</Text>

          <CustomInput label="Nome Completo *" placeholder="Ex: Prof. Cláudio" value={form.nome}
            onChangeText={t => set('nome', t)} error={errors.nome} icon="person-outline" />

          <CustomInput label="E-mail *" placeholder="professor@fatec.sp.gov.br" value={form.email}
            onChangeText={t => set('email', t)} error={errors.email}
            icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />

          <CustomInput label="Titulação" placeholder="Ex: Mestre, Doutor, Especialista" value={form.titulacao}
            onChangeText={t => set('titulacao', t)} icon="school-outline" />

          <CustomInput label="Área de Atuação" placeholder="Ex: Desenvolvimento Web, Redes" value={form.area}
            onChangeText={t => set('area', t)} icon="code-slash-outline" />

          <CustomInput label="Tempo de Docência (Anos)" placeholder="Ex: 5" value={form.tempo_docencia}
            onChangeText={t => set('tempo_docencia', t)} icon="time-outline" keyboardType="numeric" />
        </View>

        <CustomButton title="💾 Salvar Professor" onPress={handleSave} fullWidth loading={saving} style={{ marginTop: spacing.md }} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content:      { padding: spacing.lg, paddingBottom: 20 },
  section:      { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
});