const pool = require('../database/connection');

// GET /api/aluno/disciplinas
exports.getMinhasDisciplinas = async (req, res) => {
  const alunoId = req.user.reference_id;
  if (!alunoId)
    return res.status(400).json({ success: false, message: 'Aluno não vinculado à conta' });
  try {
    const { rows } = await pool.query(`
      SELECT d.nome as disciplina, d.carga_horaria, d.semestre, d.curso,
        p.nome as professor_nome, p.titulacao, p.area,
        n.nota1, n.nota2, n.media, n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      LEFT JOIN professores p ON d.professor_id = p.id
      WHERE n.aluno_id = $1
      ORDER BY d.semestre, d.nome
    `, [alunoId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar disciplinas' });
  }
};

// GET /api/aluno/boletim
exports.getMeuBoletim = async (req, res) => {
  const alunoId = req.user.reference_id;
  if (!alunoId)
    return res.status(400).json({ success: false, message: 'Aluno não vinculado' });
  try {
    const alunoRes = await pool.query(
      'SELECT id,nome,matricula,curso,email FROM alunos WHERE id=$1', [alunoId]
    );
    if (!alunoRes.rows.length)
      return res.status(404).json({ success: false, message: 'Aluno não encontrado' });

    const aluno = alunoRes.rows[0];
    const { rows: disciplinas } = await pool.query(`
      SELECT d.nome as disciplina, d.carga_horaria, d.semestre,
        p.nome as professor, n.nota1, n.nota2, n.media, n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      LEFT JOIN professores p ON d.professor_id = p.id
      WHERE n.aluno_id = $1 ORDER BY d.semestre, d.nome
    `, [alunoId]);

    const total      = disciplinas.length;
    const aprovados  = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const reprovados = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    const cursando   = disciplinas.filter(d => d.situacao === 'Cursando').length;
    const medias     = disciplinas.filter(d => d.media != null).map(d => Number(d.media));
    const media_geral = medias.length
      ? (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(2) : null;

    res.json({
      success: true,
      data: { aluno, disciplinas, resumo: { total, aprovados, reprovados, cursando, media_geral } }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao gerar boletim' });
  }
};