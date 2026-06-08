const pool = require('../database/connection');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT d.*, p.nome as professor_nome
      FROM disciplinas d
      LEFT JOIN professores p ON d.professor_id = p.id
      ORDER BY d.semestre, d.nome
    `);
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao listar disciplinas' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT d.*, p.nome as professor_nome
      FROM disciplinas d LEFT JOIN professores p ON d.professor_id = p.id
      WHERE d.id=$1
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Disciplina não encontrada' });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar disciplina' });
  }
};

exports.create = async (req, res) => {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

  if (!nome || !carga_horaria || !curso || !semestre)
    return res.status(400).json({ success: false, message: 'Nome, carga horária, curso e semestre são obrigatórios' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO disciplinas (nome,carga_horaria,professor_id,curso,semestre)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, carga_horaria, professor_id || null, curso, semestre]
    );
    res.status(201).json({ success: true, message: 'Disciplina cadastrada com sucesso!', data: rows[0] });
  } catch (err) {
    console.error('[disciplinasController.create]', err);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar disciplina' });
  }
};

exports.update = async (req, res) => {
  const { nome, carga_horaria, professor_id, curso, semestre } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE disciplinas SET nome=$1,carga_horaria=$2,professor_id=$3,curso=$4,semestre=$5
       WHERE id=$6 RETURNING *`,
      [nome, carga_horaria, professor_id, curso, semestre, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Disciplina não encontrada' });
    res.json({ success: true, message: 'Disciplina atualizada!', data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao atualizar disciplina' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM disciplinas WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Disciplina não encontrada' });
    res.json({ success: true, message: 'Disciplina removida com sucesso' });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao remover disciplina' });
  }
};
