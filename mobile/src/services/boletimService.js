import api from './api';

export const buscarBoletim = async (matricula) => {
  const response = await api.get(`/boletim/${matricula}`);
  return response.data;
};

export const listarNotas = async () => {
  const response = await api.get('/notas');
  return response.data;
};

export const buscarNotasPorAluno = async (alunoId) => {
  const response = await api.get(`/notas/aluno/${alunoId}`);
  return response.data;
};

export const criarNota = async (dados) => {
  const response = await api.post('/notas', dados);
  return response.data;
};

export const atualizarNota = async (id, dados) => {
  const response = await api.put(`/notas/${id}`, dados);
  return response.data;
};
