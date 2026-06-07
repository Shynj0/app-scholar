import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { criarDisciplina } from '../services/disciplinasService';
import { listarProfessores } from '../services/professoresService';

export default function SubjectRegistrationScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '', carga_horaria: '', professor_id: null, curso: '', semestre: '',
  });
  const [professorNome, setProfessorNome] = useState('');
  const [professores, setProfessores] = useState([]);
  const [modalProf, setModalProf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfs, setLoadingProfs] = useState(true);

  useEffect(() => {
    listarProfessores()
      .then(setProfessores)
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar os professores.'))
      .finally(() => setLoadingProfs(false));
  }, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const selecionarProfessor = (prof) => {
    setField('professor_id', prof.id);
    setProfessorNome(prof.nome);
    setModalProf(false);
  };

  const handleSalvar = async () => {
    const { nome, carga_horaria, curso, semestre } = form;
    if (!nome || !carga_horaria || !curso || !semestre) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: Nome, Carga Horária, Curso e Semestre.');
      return;
    }
    setLoading(true);
    try {
      await criarDisciplina({
        ...form,
        carga_horaria: parseInt(form.carga_horaria, 10),
        semestre: parseInt(form.semestre, 10),
      });
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!', [
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
      <Text style={styles.titulo}>Nova Disciplina</Text>

      <TextInput style={styles.input} placeholder="Nome da disciplina *" value={form.nome} onChangeText={(v) => setField('nome', v)} />
      <TextInput style={styles.input} placeholder="Carga horária (horas) *" value={form.carga_horaria} onChangeText={(v) => setField('carga_horaria', v)} keyboardType="number-pad" />
      <TextInput style={styles.input} placeholder="Curso *" value={form.curso} onChangeText={(v) => setField('curso', v)} />
      <TextInput style={styles.input} placeholder="Semestre *" value={form.semestre} onChangeText={(v) => setField('semestre', v)} keyboardType="number-pad" />

      <Text style={styles.label}>Professor Responsável</Text>
      {loadingProfs
        ? <ActivityIndicator color="#1E40AF" />
        : (
          <TouchableOpacity style={styles.seletor} onPress={() => setModalProf(true)}>
            <Text style={professorNome ? styles.seletorTexto : styles.seletorPlaceholder}>
              {professorNome || 'Selecionar professor (opcional)'}
            </Text>
          </TouchableOpacity>
        )
      }

      <TouchableOpacity style={[styles.botao, loading && styles.botaoDisabled]} onPress={handleSalvar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Disciplina</Text>}
      </TouchableOpacity>

      {/* Modal Professores */}
      <Modal visible={modalProf} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Selecione o Professor</Text>
            <FlatList
              data={professores}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selecionarProfessor(item)}>
                  <Text style={styles.modalItemNome}>{item.nome}</Text>
                  <Text style={styles.modalItemSub}>{item.titulacao} — {item.area}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ color: '#9CA3AF', textAlign: 'center' }}>Nenhum professor cadastrado.</Text>}
            />
            <TouchableOpacity onPress={() => setModalProf(false)}>
              <Text style={styles.modalFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  seletor: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 8, padding: 12, marginBottom: 10,
  },
  seletorTexto: { fontSize: 15, color: '#111827' },
  seletorPlaceholder: { fontSize: 15, color: '#9CA3AF' },
  botao: { backgroundColor: '#1E40AF', borderRadius: 8, padding: 14, alignItems: 'center', marginVertical: 16 },
  botaoDisabled: { backgroundColor: '#93C5FD' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '70%' },
  modalTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#1E40AF' },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalItemNome: { fontSize: 15, fontWeight: '600', color: '#111827' },
  modalItemSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  modalFechar: { textAlign: 'center', color: '#EF4444', fontWeight: 'bold', marginTop: 12 },
});
