const pool = require('../database/connection');

// GET /api/boletim/:matricula
exports.getBoletim = async (req, res) => {
  // .trim() evita problemas com espaços invisíveis enviados na requisição
  const matricula = req.params.matricula?.trim();

  if (!matricula) {
    return res.status(400).json({ success: false, message: 'Matrícula não informada.' });
  }

  try {
    // 💡 CORREÇÃO AQUI: Convertendo ambos os lados para TEXT (::text)
    // Isso evita o erro clássico de "operator does not exist: integer = character varying" do PostgreSQL
    const alunoRes = await pool.query(
      'SELECT id, nome, matricula, curso, email FROM alunos WHERE matricula::text = $1::text',
      [matricula]
    );

    if (!alunoRes.rows.length) {
      return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    }

    const aluno = alunoRes.rows[0];

    // Busca as notas com disciplinas vinculadas ao ID interno do aluno encontrado
    const notasRes = await pool.query(`
      SELECT
        d.nome        AS disciplina,
        d.carga_horaria, -- Mantendo o mapeamento correto da tabela
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

    // Calcula o resumo estatístico para o Front-end
    const total      = disciplinas.length;
    const aprovados  = disciplinas.filter(d => d.situacao === 'Aprovado').length;
    const reprovados = disciplinas.filter(d => d.situacao === 'Reprovado').length;
    const cursando   = disciplinas.filter(d => d.situacao === 'Cursando').length;
    
    const medias     = disciplinas.filter(d => d.media != null).map(d => Number(d.media));
    const mediaGeral = medias.length
      ? (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(2)
      : null;

    // Retorna exatamente a estrutura que a BoletimScreen.tsx espera receber (data.data)
    return res.json({
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
    // Mantém o log detalhado no terminal do servidor para o seu controle
    console.error('[boletimController Error]:', err);
    return res.status(500).json({ success: false, message: 'Erro interno ao gerar o boletim' });
  }
};