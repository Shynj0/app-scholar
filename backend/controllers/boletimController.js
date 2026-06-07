const pool = require('../database/connection');

// GET /api/boletim/:matricula
const buscarBoletim = async (req, res) => {
  const { matricula } = req.params;

  try {
    // Busca o aluno
    const alunoResult = await pool.query(
      'SELECT * FROM alunos WHERE matricula = $1',
      [matricula]
    );

    if (alunoResult.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    const aluno = alunoResult.rows[0];

    // Busca as notas com disciplinas
    const notasResult = await pool.query(`
      SELECT
        d.nome AS disciplina,
        n.nota1,
        n.nota2,
        n.media,
        n.situacao,
        d.carga_horaria,
        d.semestre,
        p.nome AS professor
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      LEFT JOIN professores p ON d.professor_id = p.id
      WHERE n.aluno_id = $1
      ORDER BY d.semestre ASC, d.nome ASC
    `, [aluno.id]);

    const disciplinas = notasResult.rows;

    // Calcula estatísticas gerais
    const aprovadas = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const reprovadas = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    const recuperacao = disciplinas.filter(d => d.situacao === 'Recuperação').length;
    const cursando = disciplinas.filter(d => d.situacao === 'Cursando').length;

    const mediasValidas = disciplinas
      .filter(d => d.media !== null)
      .map(d => parseFloat(d.media));

    const mediaGeral = mediasValidas.length > 0
      ? parseFloat(
          (mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length).toFixed(2)
        )
      : null;

    return res.json({
      aluno: aluno.nome,
      matricula: aluno.matricula,
      curso: aluno.curso,
      mediaGeral,
      resumo: { aprovadas, reprovadas, recuperacao, cursando },
      disciplinas,
    });
  } catch (err) {
    console.error('Erro ao buscar boletim:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

module.exports = { buscarBoletim };
