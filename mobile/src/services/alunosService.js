import api from './api';
import axios from 'axios';

// ─── CRUD Alunos ───────────────────────────────────────────────

export const listarAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};

export const buscarAluno = async (id) => {
  const response = await api.get(`/alunos/${id}`);
  return response.data;
};

export const criarAluno = async (dados) => {
  const response = await api.post('/alunos', dados);
  return response.data;
};

export const atualizarAluno = async (id, dados) => {
  const response = await api.put(`/alunos/${id}`, dados);
  return response.data;
};

export const removerAluno = async (id) => {
  const response = await api.delete(`/alunos/${id}`);
  return response.data;
};

// ─── API Externa 1: ViaCEP ─────────────────────────────────────
// Busca endereço pelo CEP diretamente da API pública
export const buscarEnderecoPorCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido.');

  const response = await axios.get(
    `https://viacep.com.br/ws/${cepLimpo}/json/`
  );
  if (response.data.erro) throw new Error('CEP não encontrado.');

  return {
    cep: response.data.cep,
    endereco: response.data.logradouro,
    cidade: response.data.localidade,
    estado: response.data.uf,
    bairro: response.data.bairro,
  };
};

// ─── API Externa 2: IBGE Localidades ──────────────────────────

export const listarEstados = async () => {
  const response = await axios.get(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
  );
  return response.data.map((e) => ({ sigla: e.sigla, nome: e.nome }));
};

export const listarCidadesPorEstado = async (uf) => {
  const response = await axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
  );
  return response.data.map((c) => ({ id: c.id, nome: c.nome }));
};
