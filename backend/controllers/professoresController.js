const pool = require('../database/connection');

// GET /api/professores
const listar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professores ORDER BY nome ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar professores:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// GET /api/professores/:id
const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM professores WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar professor:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// POST /api/professores
const criar = async (req, res) => {
  const { nome, titulacao, area, tempo_docencia, email, usuario_id } = req.body;

  if (!nome || !titulacao || !area || !tempo_docencia || !email) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, titulação, área, tempo de docência e email.',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email, usuario_id || null]
    );
    return res.status(201).json({
      mensagem: 'Professor cadastrado com sucesso.',
      professor: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Email já cadastrado.' });
    }
    console.error('Erro ao criar professor:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// PUT /api/professores/:id
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE professores SET
        nome = COALESCE($1, nome),
        titulacao = COALESCE($2, titulacao),
        area = COALESCE($3, area),
        tempo_docencia = COALESCE($4, tempo_docencia),
        email = COALESCE($5, email)
       WHERE id = $6 RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }
    return res.json({ mensagem: 'Professor atualizado.', professor: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar professor:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// DELETE /api/professores/:id
const remover = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM professores WHERE id = $1 RETURNING id', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Professor não encontrado.' });
    }
    return res.json({ mensagem: 'Professor removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover professor:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
