import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { criarAluno, buscarEnderecoPorCep, listarEstados, listarCidadesPorEstado } from '../services/alunosService';

export default function StudentRegistrationScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '', matricula: '', curso: '', email: '', telefone: '',
    cep: '', endereco: '', cidade: '', estado: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [modalEstado, setModalEstado] = useState(false);
  const [modalCidade, setModalCidade] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    listarEstados()
      .then(setEstados)
      .catch(() => Alert.alert('Aviso', 'Não foi possível carregar os estados.'));
  }, []);

  const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleBuscarCep = async () => {
    if (form.cep.replace(/\D/g, '').length !== 8) {
      Alert.alert('Atenção', 'Digite um CEP válido com 8 dígitos.');
      return;
    }
    setLoadingCep(true);
    try {
      const dados = await buscarEnderecoPorCep(form.cep);
      setForm((f) => ({
        ...f,
        endereco: dados.endereco || f.endereco,
        cidade: dados.cidade,
        estado: dados.estado,
      }));
      // Carrega cidades do estado retornado
      if (dados.estado) await carregarCidades(dados.estado);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoadingCep(false);
    }
  };

  const carregarCidades = async (uf) => {
    setLoadingCidades(true);
    try {
      const lista = await listarCidadesPorEstado(uf);
      setCidades(lista);
    } catch {
      Alert.alert('Aviso', 'Não foi possível carregar as cidades.');
    } finally {
      setLoadingCidades(false);
    }
  };

  const selecionarEstado = async (sigla) => {
    setField('estado', sigla);
    setField('cidade', '');
    setModalEstado(false);
    await carregarCidades(sigla);
    setModalCidade(true);
  };

  const handleSalvar = async () => {
    const { nome, matricula, curso, email } = form;
    if (!nome || !matricula || !curso || !email) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios: Nome, Matrícula, Curso e Email.');
      return;
    }
    setLoading(true);
    try {
      await criarAluno(form);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
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
      <Text style={styles.titulo}>Novo Aluno</Text>

      {/* Dados pessoais */}
      <Text style={styles.secao}>Dados Pessoais</Text>
      <TextInput style={styles.input} placeholder="Nome completo *" value={form.nome} onChangeText={(v) => setField('nome', v)} />
      <TextInput style={styles.input} placeholder="Matrícula *" value={form.matricula} onChangeText={(v) => setField('matricula', v)} />
      <TextInput style={styles.input} placeholder="Curso *" value={form.curso} onChangeText={(v) => setField('curso', v)} />
      <TextInput style={styles.input} placeholder="Email *" value={form.email} onChangeText={(v) => setField('email', v)} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Telefone" value={form.telefone} onChangeText={(v) => setField('telefone', v)} keyboardType="phone-pad" />

      {/* Endereço com ViaCEP */}
      <Text style={styles.secao}>Endereço <Text style={styles.badge}>ViaCEP</Text></Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="CEP"
          value={form.cep}
          onChangeText={(v) => setField('cep', v)}
          keyboardType="number-pad"
          maxLength={9}
        />
        <TouchableOpacity style={styles.botaoCep} onPress={handleBuscarCep} disabled={loadingCep}>
          {loadingCep ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.botaoCepTexto}>Buscar</Text>}
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="Endereço" value={form.endereco} onChangeText={(v) => setField('endereco', v)} />

      {/* Estado - IBGE */}
      <Text style={styles.labelIBGE}>Estado / Cidade <Text style={styles.badge}>IBGE</Text></Text>
      <TouchableOpacity style={styles.seletor} onPress={() => setModalEstado(true)}>
        <Text style={form.estado ? styles.seletorTexto : styles.seletorPlaceholder}>
          {form.estado || 'Selecionar estado'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.seletor} onPress={() => form.estado && setModalCidade(true)}>
        <Text style={form.cidade ? styles.seletorTexto : styles.seletorPlaceholder}>
          {form.cidade || 'Selecionar cidade (escolha o estado primeiro)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botao, loading && styles.botaoDisabled]} onPress={handleSalvar} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar Aluno</Text>}
      </TouchableOpacity>

      {/* Modal Estados */}
      <Modal visible={modalEstado} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Selecione o Estado</Text>
            <FlatList
              data={estados}
              keyExtractor={(item) => item.sigla}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selecionarEstado(item.sigla)}>
                  <Text>{item.sigla} — {item.nome}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalEstado(false)}>
              <Text style={styles.modalFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Cidades */}
      <Modal visible={modalCidade} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Selecione a Cidade</Text>
            {loadingCidades
              ? <ActivityIndicator size="large" color="#1E40AF" />
              : (
                <FlatList
                  data={cidades}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalItem} onPress={() => { setField('cidade', item.nome); setModalCidade(false); }}>
                      <Text>{item.nome}</Text>
                    </TouchableOpacity>
                  )}
                />
              )
            }
            <TouchableOpacity onPress={() => setModalCidade(false)}>
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
  secao: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 12, marginBottom: 6 },
  labelIBGE: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 12, marginBottom: 6 },
  badge: { color: '#1E40AF', fontSize: 11, fontWeight: 'bold', backgroundColor: '#DBEAFE', paddingHorizontal: 4, borderRadius: 4 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 15,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  botaoCep: { backgroundColor: '#1E40AF', borderRadius: 8, padding: 12, marginBottom: 10, justifyContent: 'center' },
  botaoCepTexto: { color: '#fff', fontWeight: 'bold' },
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
  modalFechar: { textAlign: 'center', color: '#EF4444', fontWeight: 'bold', marginTop: 12 },
});
