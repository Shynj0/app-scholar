const pool = require('../database/connection');
const axios = require('axios');

// GET /api/alunos
const listar = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM alunos ORDER BY nome ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar alunos:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// GET /api/alunos/:id
const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM alunos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar aluno:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// GET /api/alunos/matricula/:matricula
const buscarPorMatricula = async (req, res) => {
  const { matricula } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM alunos WHERE matricula = $1',
      [matricula]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar aluno por matrícula:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// POST /api/alunos
const criar = async (req, res) => {
  const {
    nome, matricula, curso, email, telefone,
    cep, endereco, cidade, estado, usuario_id,
  } = req.body;

  if (!nome || !matricula || !curso || !email) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, matrícula, curso e email.',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO alunos
        (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, usuario_id || null]
    );
    return res.status(201).json({
      mensagem: 'Aluno cadastrado com sucesso.',
      aluno: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Matrícula ou email já cadastrado.' });
    }
    console.error('Erro ao criar aluno:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// PUT /api/alunos/:id
const atualizar = async (req, res) => {
  const { id } = req.params;
  const {
    nome, matricula, curso, email, telefone,
    cep, endereco, cidade, estado,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE alunos SET
        nome = COALESCE($1, nome),
        matricula = COALESCE($2, matricula),
        curso = COALESCE($3, curso),
        email = COALESCE($4, email),
        telefone = COALESCE($5, telefone),
        cep = COALESCE($6, cep),
        endereco = COALESCE($7, endereco),
        cidade = COALESCE($8, cidade),
        estado = COALESCE($9, estado)
       WHERE id = $10 RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    return res.json({ mensagem: 'Aluno atualizado.', aluno: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar aluno:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// DELETE /api/alunos/:id
const remover = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }
    return res.json({ mensagem: 'Aluno removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover aluno:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// GET /api/alunos/cep/:cep  — Proxy ViaCEP
const buscarCep = async (req, res) => {
  const { cep } = req.params;
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    return res.status(400).json({ erro: 'CEP inválido. Informe 8 dígitos.' });
  }

  try {
    const response = await axios.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );
    if (response.data.erro) {
      return res.status(404).json({ erro: 'CEP não encontrado.' });
    }
    return res.json(response.data);
  } catch (err) {
    console.error('Erro ao consultar ViaCEP:', err.message);
    return res.status(500).json({ erro: 'Erro ao consultar ViaCEP.' });
  }
};

module.exports = { listar, buscarPorId, buscarPorMatricula, criar, atualizar, remover, buscarCep };
