import api from './api';

export const listarDisciplinas = async () => {
  const response = await api.get('/disciplinas');
  return response.data;
};

export const buscarDisciplina = async (id) => {
  const response = await api.get(`/disciplinas/${id}`);
  return response.data;
};

export const criarDisciplina = async (dados) => {
  const response = await api.post('/disciplinas', dados);
  return response.data;
};

export const atualizarDisciplina = async (id, dados) => {
  const response = await api.put(`/disciplinas/${id}`, dados);
  return response.data;
};

export const removerDisciplina = async (id) => {
  const response = await api.delete(`/disciplinas/${id}`);
  return response.data;
};
