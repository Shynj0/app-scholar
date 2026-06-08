const pool = require('../database/connection');

function calcSituacao(nota1, nota2) {
  if (nota1 == null || nota2 == null) return 'Cursando';
  const media = parseFloat(((Number(nota1) + Number(nota2)) / 2).toFixed(2));
  return { media, situacao: media >= 5 ? 'Aprovado' : 'Reprovado' };
}

exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT n.*, a.nome as aluno_nome, a.matricula, d.nome as disciplina_nome
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id
      JOIN disciplinas d ON n.disciplina_id = d.id
      ORDER BY a.nome, d.nome
    `);
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao listar notas' });
  }
};

exports.getByAluno = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT n.*, d.nome as disciplina_nome
      FROM notas n JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id=$1 ORDER BY d.nome
    `, [req.params.alunoId]);
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao buscar notas' });
  }
};

exports.create = async (req, res) => {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;

  if (!aluno_id || !disciplina_id)
    return res.status(400).json({ success: false, message: 'aluno_id e disciplina_id são obrigatórios' });

  const calc = calcSituacao(nota1, nota2);
  const media    = typeof calc === 'object' ? calc.media    : null;
  const situacao = typeof calc === 'object' ? calc.situacao : 'Cursando';

  try {
    const { rows } = await pool.query(
      `INSERT INTO notas (aluno_id,disciplina_id,nota1,nota2,media,situacao)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [aluno_id, disciplina_id, nota1 ?? null, nota2 ?? null, media, situacao]
    );
    res.status(201).json({ success: true, message: 'Nota registrada!', data: rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'Nota já cadastrada para esse aluno/disciplina' });
    res.status(500).json({ success: false, message: 'Erro ao registrar nota' });
  }
};

exports.update = async (req, res) => {
  const { nota1, nota2 } = req.body;
  const calc = calcSituacao(nota1, nota2);
  const media    = typeof calc === 'object' ? calc.media    : null;
  const situacao = typeof calc === 'object' ? calc.situacao : 'Cursando';

  try {
    const { rows } = await pool.query(
      `UPDATE notas SET nota1=$1,nota2=$2,media=$3,situacao=$4 WHERE id=$5 RETURNING *`,
      [nota1 ?? null, nota2 ?? null, media, situacao, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Nota não encontrada' });
    res.json({ success: true, message: 'Nota atualizada!', data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao atualizar nota' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM notas WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Nota não encontrada' });
    res.json({ success: true, message: 'Nota removida' });
  } catch {
    res.status(500).json({ success: false, message: 'Erro ao remover nota' });
  }
};
