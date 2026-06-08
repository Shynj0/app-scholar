const pool = require('../database/connection');

// GET /api/professor/disciplinas
exports.getMinhasDisciplinas = async (req, res) => {
  const professorId = req.user.reference_id;
  if (!professorId)
    return res.status(400).json({ success: false, message: 'Professor não vinculado à conta' });
  try {
    const { rows } = await pool.query(`
      SELECT d.*,
        (SELECT COUNT(DISTINCT n.aluno_id) FROM notas n WHERE n.disciplina_id = d.id) AS total_alunos
      FROM disciplinas d
      WHERE d.professor_id = $1
      ORDER BY d.semestre, d.nome
    `, [professorId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar disciplinas' });
  }
};

// GET /api/professor/alunos?disciplina_id=X
exports.getMeusAlunos = async (req, res) => {
  const professorId = req.user.reference_id;
  const { disciplina_id } = req.query;
  if (!professorId)
    return res.status(400).json({ success: false, message: 'Professor não vinculado' });
  try {
    const params = [professorId];
    let where = 'd.professor_id = $1';
    if (disciplina_id) { params.push(disciplina_id); where += ` AND d.id = $2`; }

    const { rows } = await pool.query(`
      SELECT a.id, a.nome, a.matricula, a.curso, a.email,
        d.id as disciplina_id, d.nome as disciplina_nome,
        n.id as nota_id, n.nota1, n.nota2, n.media, n.situacao
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE ${where}
      ORDER BY d.nome, a.nome
    `, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar alunos' });
  }
};

// PUT /api/professor/notas/:id
exports.updateNota = async (req, res) => {
  const professorId = req.user.reference_id;
  const { nota1, nota2 } = req.body;
  try {
    const check = await pool.query(`
      SELECT n.id FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.id = $1 AND d.professor_id = $2
    `, [req.params.id, professorId]);
    if (!check.rows.length)
      return res.status(403).json({ success: false, message: 'Sem permissão para esta nota' });

    const media    = (nota1 != null && nota2 != null) ? parseFloat(((+nota1 + +nota2) / 2).toFixed(2)) : null;
    const situacao = media != null ? (media >= 5 ? 'Aprovado' : 'Reprovado') : 'Cursando';

    const { rows } = await pool.query(
      `UPDATE notas SET nota1=$1,nota2=$2,media=$3,situacao=$4 WHERE id=$5 RETURNING *`,
      [nota1 ?? null, nota2 ?? null, media, situacao, req.params.id]
    );
    res.json({ success: true, message: 'Nota atualizada!', data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar nota' });
  }
};

// POST /api/professor/notas
exports.createNota = async (req, res) => {
  const professorId = req.user.reference_id;
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;
  try {
    const check = await pool.query(
      `SELECT id FROM disciplinas WHERE id=$1 AND professor_id=$2`,
      [disciplina_id, professorId]
    );
    if (!check.rows.length)
      return res.status(403).json({ success: false, message: 'Sem permissão para esta disciplina' });

    const media    = (nota1 != null && nota2 != null) ? parseFloat(((+nota1 + +nota2) / 2).toFixed(2)) : null;
    const situacao = media != null ? (media >= 5 ? 'Aprovado' : 'Reprovado') : 'Cursando';

    const { rows } = await pool.query(
      `INSERT INTO notas (aluno_id,disciplina_id,nota1,nota2,media,situacao)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [aluno_id, disciplina_id, nota1 ?? null, nota2 ?? null, media, situacao]
    );
    res.status(201).json({ success: true, message: 'Nota inserida!', data: rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'Nota já cadastrada para este aluno nesta disciplina' });
    res.status(500).json({ success: false, message: 'Erro ao inserir nota' });
  }
};