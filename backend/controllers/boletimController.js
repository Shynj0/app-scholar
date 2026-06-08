const pool = require('../database/connection');

// GET /api/boletim/:matricula
exports.getBoletim = async (req, res) => {
  const { matricula } = req.params;

  try {
    // Busca o aluno
    const alunoRes = await pool.query(
      'SELECT id, nome, matricula, curso, email FROM alunos WHERE matricula=$1',
      [matricula]
    );

    if (!alunoRes.rows.length)
      return res.status(404).json({ success: false, message: 'Aluno não encontrado' });

    const aluno = alunoRes.rows[0];

    // Busca as notas com disciplinas
    const notasRes = await pool.query(`
      SELECT
        d.nome        AS disciplina,
        d.carga_horaria,
        d.semestre,
        p.nome        AS professor,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      LEFT JOIN professores p ON d.professor_id = p.id
      WHERE n.aluno_id = $1
      ORDER BY d.semestre, d.nome
    `, [aluno.id]);

    const disciplinas = notasRes.rows;

    // Calcula resumo
    const total      = disciplinas.length;
    const aprovados  = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const reprovados = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    const cursando   = disciplinas.filter(d => d.situacao === 'Cursando').length;
    const medias     = disciplinas.filter(d => d.media != null).map(d => Number(d.media));
    const mediaGeral = medias.length
      ? (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(2)
      : null;

    res.json({
      success: true,
      data: {
        aluno: {
          nome:      aluno.nome,
          matricula: aluno.matricula,
          curso:     aluno.curso,
          email:     aluno.email,
        },
        disciplinas,
        resumo: { total, aprovados, reprovados, cursando, media_geral: mediaGeral },
      },
    });
  } catch (err) {
    console.error('[boletimController]', err);
    res.status(500).json({ success: false, message: 'Erro ao gerar boletim' });
  }
};
