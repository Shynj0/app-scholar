const pool = require('../database/connection');

// GET /api/alunos
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alunos ORDER BY nome');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao listar alunos' });
  }
};

// GET /api/alunos/:id
exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alunos WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar aluno' });
  }
};

// GET /api/alunos/matricula/:matricula
exports.getByMatricula = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alunos WHERE matricula=$1', [req.params.matricula]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar aluno' });
  }
};

// POST /api/alunos
exports.create = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  if (!nome || !matricula || !curso || !email)
    return res.status(400).json({ success: false, message: 'Nome, matrícula, curso e e-mail são obrigatórios' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO alunos (nome,matricula,curso,email,telefone,cep,endereco,cidade,estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nome, matricula, curso, email, telefone || null, cep || null,
       endereco || null, cidade || null, estado || null]
    );
    res.status(201).json({ success: true, message: 'Aluno cadastrado com sucesso!', data: rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'Matrícula ou e-mail já cadastrado' });
    console.error('[alunosController.create]', err);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno' });
  }
};

// PUT /api/alunos/:id
exports.update = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE alunos SET nome=$1,matricula=$2,curso=$3,email=$4,telefone=$5,
       cep=$6,endereco=$7,cidade=$8,estado=$9 WHERE id=$10 RETURNING *`,
      [nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    res.json({ success: true, message: 'Aluno atualizado!', data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar aluno' });
  }
};

// DELETE /api/alunos/:id
exports.remove = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM alunos WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    res.json({ success: true, message: 'Aluno removido com sucesso' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao remover aluno' });
  }
};
