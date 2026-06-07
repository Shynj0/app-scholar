import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { buscarBoletim } from '../services/boletimService';
import { getUsuarioLogado } from '../services/authService';

const COR_SITUACAO = {
  Aprovado: '#10B981',
  Reprovado: '#EF4444',
  'Recuperação': '#F59E0B',
  Cursando: '#6B7280',
};

export default function GradesViewScreen() {
  const [matricula, setMatricula] = useState('');
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(false);

  // Se for aluno, carrega o boletim dele automaticamente
  useEffect(() => {
    const carregarAutomatico = async () => {
      const usuario = await getUsuarioLogado();
      if (usuario?.perfil === 'aluno') {
        // O aluno tem sua matrícula armazenada; adaptável conforme sua lógica
        // Aqui tentamos buscar pela matrícula salva em AsyncStorage se disponível
      }
    };
    carregarAutomatico();
  }, []);

  const handleBuscar = async () => {
    if (!matricula.trim()) {
      Alert.alert('Atenção', 'Informe a matrícula do aluno.');
      return;
    }
    setLoading(true);
    setBoletim(null);
    try {
      const dados = await buscarBoletim(matricula.trim());
      setBoletim(dados);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Consulta de Boletim</Text>

      <View style={styles.buscaRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Matrícula do aluno"
          value={matricula}
          onChangeText={setMatricula}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.botaoBuscar} onPress={handleBuscar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.botaoBuscarTexto}>Buscar</Text>}
        </TouchableOpacity>
      </View>

      {boletim && (
        <>
          {/* Cabeçalho do aluno */}
          <View style={styles.card}>
            <Text style={styles.alunoNome}>{boletim.aluno}</Text>
            <Text style={styles.alunoInfo}>Matrícula: {boletim.matricula}</Text>
            <Text style={styles.alunoInfo}>Curso: {boletim.curso}</Text>
            {boletim.mediaGeral !== null && (
              <View style={styles.mediaGeralBox}>
                <Text style={styles.mediaGeralLabel}>Média Geral</Text>
                <Text style={[
                  styles.mediaGeralValor,
                  { color: boletim.mediaGeral >= 6 ? '#10B981' : '#EF4444' }
                ]}>
                  {boletim.mediaGeral.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* Resumo */}
          <View style={styles.resumoRow}>
            <View style={[styles.resumoItem, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.resumoNum, { color: '#10B981' }]}>{boletim.resumo.aprovadas}</Text>
              <Text style={styles.resumoLabel}>Aprovadas</Text>
            </View>
            <View style={[styles.resumoItem, { backgroundColor: '#FEE2E2' }]}>
              <Text style={[styles.resumoNum, { color: '#EF4444' }]}>{boletim.resumo.reprovadas}</Text>
              <Text style={styles.resumoLabel}>Reprovadas</Text>
            </View>
            <View style={[styles.resumoItem, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.resumoNum, { color: '#F59E0B' }]}>{boletim.resumo.recuperacao}</Text>
              <Text style={styles.resumoLabel}>Recuperação</Text>
            </View>
            <View style={[styles.resumoItem, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.resumoNum, { color: '#6B7280' }]}>{boletim.resumo.cursando}</Text>
              <Text style={styles.resumoLabel}>Cursando</Text>
            </View>
          </View>

          {/* Disciplinas */}
          <Text style={styles.secaoTitulo}>Disciplinas</Text>
          {boletim.disciplinas.length === 0 && (
            <Text style={styles.vazio}>Nenhuma nota lançada.</Text>
          )}
          {boletim.disciplinas.map((d, i) => (
            <View key={i} style={styles.disciplinaCard}>
              <View style={styles.disciplinaHeader}>
                <Text style={styles.disciplinaNome}>{d.disciplina}</Text>
                <View style={[styles.badge, { backgroundColor: COR_SITUACAO[d.situacao] || '#6B7280' }]}>
                  <Text style={styles.badgeTexto}>{d.situacao}</Text>
                </View>
              </View>
              {d.professor && <Text style={styles.professor}>Prof. {d.professor}</Text>}
              <Text style={styles.disciplinaInfo}>Semestre: {d.semestre}º | Carga: {d.carga_horaria}h</Text>
              <View style={styles.notasRow}>
                <View style={styles.notaItem}>
                  <Text style={styles.notaLabel}>Nota 1</Text>
                  <Text style={styles.notaValor}>{d.nota1 ?? '—'}</Text>
                </View>
                <View style={styles.notaItem}>
                  <Text style={styles.notaLabel}>Nota 2</Text>
                  <Text style={styles.notaValor}>{d.nota2 ?? '—'}</Text>
                </View>
                <View style={[styles.notaItem, styles.mediaItem]}>
                  <Text style={styles.notaLabel}>Média</Text>
                  <Text style={[
                    styles.notaValor,
                    styles.mediaValor,
                    { color: d.media >= 6 ? '#10B981' : d.media >= 4 ? '#F59E0B' : '#EF4444' }
                  ]}>
                    {d.media ?? '—'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1E40AF', marginBottom: 16 },
  buscaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 8, padding: 12, fontSize: 15,
  },
  botaoBuscar: { backgroundColor: '#1E40AF', borderRadius: 8, padding: 12, justifyContent: 'center' },
  botaoBuscarTexto: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  alunoNome: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  alunoInfo: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  mediaGeralBox: { marginTop: 12, alignItems: 'center' },
  mediaGeralLabel: { fontSize: 12, color: '#6B7280' },
  mediaGeralValor: { fontSize: 36, fontWeight: 'bold' },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  resumoItem: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center', marginHorizontal: 3 },
  resumoNum: { fontSize: 22, fontWeight: 'bold' },
  resumoLabel: { fontSize: 10, color: '#374151', marginTop: 2 },
  secaoTitulo: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 8 },
  vazio: { color: '#9CA3AF', textAlign: 'center', marginTop: 16 },
  disciplinaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  disciplinaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  disciplinaNome: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1 },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  professor: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  disciplinaInfo: { fontSize: 12, color: '#9CA3AF', marginTop: 2, marginBottom: 8 },
  notasRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
  notaItem: { flex: 1, alignItems: 'center' },
  mediaItem: { borderLeftWidth: 1, borderLeftColor: '#F3F4F6' },
  notaLabel: { fontSize: 11, color: '#9CA3AF' },
  notaValor: { fontSize: 18, fontWeight: '600', color: '#111827' },
  mediaValor: { fontSize: 20, fontWeight: 'bold' },
});
