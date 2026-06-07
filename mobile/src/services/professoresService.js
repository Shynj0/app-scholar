import api from './api';

export const listarProfessores = async () => {
  const response = await api.get('/professores');
  return response.data;
};

export const buscarProfessor = async (id) => {
  const response = await api.get(`/professores/${id}`);
  return response.data;
};

export const criarProfessor = async (dados) => {
  const response = await api.post('/professores', dados);
  return response.data;
};

export const atualizarProfessor = async (id, dados) => {
  const response = await api.put(`/professores/${id}`, dados);
  return response.data;
};

export const removerProfessor = async (id) => {
  const response = await api.delete(`/professores/${id}`);
  return response.data;
};
