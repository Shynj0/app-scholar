const pool = require('../database/connection');

// GET /api/disciplinas
const listar = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, p.nome AS professor_nome
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      ORDER BY d.semestre ASC, d.nome ASC
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar disciplinas:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// GET /api/disciplinas/:id
const buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT d.*, p.nome AS professor_nome
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      WHERE d.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar disciplina:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// POST /api/disciplinas
const criar = async (req, res) => {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  if (!nome || !carga_horaria || !curso || !semestre) {
    return res.status(400).json({
      erro: 'Campos obrigatórios: nome, carga horária, curso e semestre.',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre]
    );
    return res.status(201).json({
      mensagem: 'Disciplina cadastrada com sucesso.',
      disciplina: result.rows[0],
    });
  } catch (err) {
    console.error('Erro ao criar disciplina:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// PUT /api/disciplinas/:id
const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  try {
    const result = await pool.query(
      `UPDATE disciplinas SET
        nome = COALESCE($1, nome),
        carga_horaria = COALESCE($2, carga_horaria),
        professor_id = COALESCE($3, professor_id),
        curso = COALESCE($4, curso),
        semestre = COALESCE($5, semestre)
       WHERE id = $6 RETURNING *`,
      [nome, carga_horaria, professor_id, curso, semestre, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }
    return res.json({ mensagem: 'Disciplina atualizada.', disciplina: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar disciplina:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// DELETE /api/disciplinas/:id
const remover = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM disciplinas WHERE id = $1 RETURNING id', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }
    return res.json({ mensagem: 'Disciplina removida com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover disciplina:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
