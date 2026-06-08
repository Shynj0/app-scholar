const pool = require('../database/connection');

// Função auxiliar para calcular média e situação automaticamente
function calcSituacao(nota1, nota2) {
  if (nota1 == null || nota2 == null) return 'Cursando';
  const media = parseFloat(((Number(nota1) + Number(nota2)) / 2).toFixed(2));
  return { media, situacao: media >= 5 ? 'Aprovado' : 'Reprovado' };
}

// GET /api/notas
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
  } catch (err) {
    console.error('[notasController.getAll]', err);
    res.status(500).json({ success: false, message: 'Erro ao listar notas' });
  }
};

// GET /api/notas/aluno/:alunoId (Onde :alunoId recebe a MATRÍCULA vinda do Front-end)
exports.getByAluno = async (req, res) => {
  const matricula = req.params.alunoId?.trim();

  if (!matricula) {
    return res.status(400).json({ success: false, message: 'Matrícula não informada' });
  }

  try {
    // 1️⃣ Passo: Busca o aluno pela matrícula usando conversão de tipo segura (::text)
    const alunoRes = await pool.query(
      'SELECT id, nome, matricula, curso FROM alunos WHERE matricula::text = $1::text',
      [matricula]
    );

    // Se a matrícula não constar no banco, barra aqui
    if (!alunoRes.rows.length) {
      return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    }

    const aluno = alunoRes.rows[0];

    // 2️⃣ Passo: Busca as notas registradas para o ID interno deste aluno
    const { rows: notas } = await pool.query(`
      SELECT n.*, d.nome as disciplina_nome
      FROM notas n 
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id = $1 
      ORDER BY d.nome
    `, [aluno.id]);

    // Retorna o aluno encontrado E as notas dele (mesmo que o array de notas venha vazio)
    res.json({ 
      success: true, 
      aluno, 
      data: notas 
    });

  } catch (err) {
    console.error('[notasController.getByAluno Error]', err);
    res.status(500).json({ success: false, message: 'Erro interno ao buscar dados do aluno' });
  }
};

// POST /api/notas
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
    console.error('[notasController.create]', err);
    res.status(500).json({ success: false, message: 'Erro ao registrar nota' });
  }
};

// PUT /api/notas/:id
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
    res.json({ success: true, message: 'Nota updated!', data: rows[0] });
  } catch (err) {
    console.error('[notasController.update]', err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar nota' });
  }
};

// DELETE /api/notas/:id
exports.remove = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM notas WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Nota não encontrada' });
    res.json({ success: true, message: 'Nota removida' });
  } catch (err) {
    console.error('[notasController.remove]', err);
    res.status(500).json({ success: false, message: 'Erro ao remover nota' });
  }
};