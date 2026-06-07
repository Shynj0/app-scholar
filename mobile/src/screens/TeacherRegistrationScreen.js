import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { criarProfessor } from '../services/professoresService';

const TITULACOES = ['Graduação', 'Especialização', 'Mestrado', 'Doutorado', 'Pós-Doutorado'];

export default function TeacherRegistrationScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '', titulacao: '', area: '', tempo_docencia: '', email: '',
  });
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSalvar = async () => {
    const { nome, titulacao, area, tempo_docencia, email } = form;
    if (!nome || !titulacao || !area || !tempo_docencia || !email) {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await criarProfessor({ ...form, tempo_docencia: parseInt(tempo_docencia, 10) });
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Novo Professor</Text>

      <TextInput style={styles.input} placeholder="Nome completo *" value={form.nome} onChangeText={(v) => setField('nome', v)} />
      <TextInput style={styles.input} placeholder="Área de atuação *" value={form.area} onChangeText={(v) => setField('area', v)} />
      <TextInput style={styles.input} placeholder="Email *" value={form.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Tempo de docência (anos) *" value={form.tempo_docencia} onChangeText={(v) => setField('tempo_docencia', v)} keyboardType="number-pad" />

      <Text style={styles.label}>Titulação *</Text>
      <View style={styles.chipContainer}>
        {TITULACOES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, form.titulacao === t && styles.chipSelecionado]}
            onPress={() => setField('titulacao', t)}
          >
            <Text style={[styles.chipTexto, form.titulacao === t && styles.chipTextoSelecionado]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.botao, loading && styles.botaoDisabled]} onPress={handleSalvar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Professor</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1E40AF', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 15,
  },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, margin: 4, backgroundColor: '#fff',
  },
  chipSelecionado: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  chipTexto: { color: '#374151', fontSize: 13 },
  chipTextoSelecionado: { color: '#fff', fontWeight: 'bold' },
  botao: { backgroundColor: '#1E40AF', borderRadius: 8, padding: 14, alignItems: 'center', marginVertical: 16 },
  botaoDisabled: { backgroundColor: '#93C5FD' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
