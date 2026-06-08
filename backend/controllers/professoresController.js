const pool = require('../database/connection');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM professores ORDER BY nome');
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao listar professores' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM professores WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Professor não encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar professor' });
  }
};

exports.create = async (req, res) => {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  if (!nome || !email)
    return res.status(400).json({ success: false, message: 'Nome e e-mail são obrigatórios' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO professores (nome,titulacao,area,tempo_docencia,email)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, titulacao || null, area || null, tempo_docencia || null, email]
    );
    res.status(201).json({ success: true, message: 'Professor cadastrado com sucesso!', data: rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'E-mail já cadastrado' });
    res.status(500).json({ success: false, message: 'Erro ao cadastrar professor' });
  }
};

exports.update = async (req, res) => {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE professores SET nome=$1,titulacao=$2,area=$3,tempo_docencia=$4,email=$5
       WHERE id=$6 RETURNING *`,
      [nome, titulacao, area, tempo_docencia, email, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Professor não encontrado' });
    res.json({ success: true, message: 'Professor atualizado!', data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao atualizar professor' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM professores WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Professor não encontrado' });
    res.json({ success: true, message: 'Professor removido com sucesso' });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao remover professor' });
  }
};
