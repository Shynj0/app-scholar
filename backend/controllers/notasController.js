const pool = require('../database/connection');

const calcularSituacao = (nota1, nota2) => {
  const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;
  let situacao;
  if (media >= 6.0) {
    situacao = 'Aprovado';
  } else if (media >= 4.0) {
    situacao = 'Recuperação';
  } else {
    situacao = 'Reprovado';
  }
  return { media: parseFloat(media.toFixed(2)), situacao };
};

const listar = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.*, a.nome AS aluno_nome, d.nome AS disciplina_nome
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id
      JOIN disciplinas d ON n.disciplina_id = d.id
      ORDER BY a.nome, d.nome
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar notas:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

const buscarPorAluno = async (req, res) => {
  const { aluno_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT n.*, d.nome AS disciplina_nome
      FROM notas n
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE n.aluno_id = $1
      ORDER BY d.nome
    `, [aluno_id]);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar notas por aluno:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

const criar = async (req, res) => {
  const { aluno_id, disciplina_id, nota1, nota2 } = req.body;

  if (!aluno_id || !disciplina_id) {
    return res.status(400).json({
      erro: 'aluno_id e disciplina_id são obrigatórios.',
    });
  }

  const { media, situacao } = nota1 != null && nota2 != null
    ? calcularSituacao(nota1, nota2)
    : { media: null, situacao: 'Cursando' };

  try {
    const result = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [aluno_id, disciplina_id, nota1 || null, nota2 || null, media, situacao]
    );
    return res.status(201).json({
      mensagem: 'Nota cadastrada com sucesso.',
      nota: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Nota já cadastrada para este aluno nesta disciplina.' });
    }
    console.error('Erro ao criar nota:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

const atualizar = async (req, res) => {
  const { id } = req.params;
  const { nota1, nota2 } = req.body;

  try {
    // 1. Busca a nota atual para não perder dados ao atualizar apenas um campo
    const notaAtualResult = await pool.query('SELECT nota1, nota2 FROM notas WHERE id = $1', [id]);
    
    if (notaAtualResult.rows.length === 0) {
      return res.status(404).json({ erro: 'Nota não encontrada.' });
    }

    const notaAtual = notaAtualResult.rows[0];
    
    // 2. Define os novos valores (se vier undefined no body, mantém o do banco)
    const novaNota1 = nota1 !== undefined ? nota1 : notaAtual.nota1;
    const novaNota2 = nota2 !== undefined ? nota2 : notaAtual.nota2;

    // 3. Recalcula a situação
    const { media, situacao } = novaNota1 != null && novaNota2 != null
      ? calcularSituacao(novaNota1, novaNota2)
      : { media: null, situacao: 'Cursando' };

    // 4. Salva no banco
    const result = await pool.query(
      `UPDATE notas SET
        nota1 = $1,
        nota2 = $2,
        media = $3,
        situacao = $4
       WHERE id = $5 RETURNING *`,
      [novaNota1, novaNota2, media, situacao, id]
    );

    return res.json({ mensagem: 'Nota atualizada.', nota: result.rows[0] });
  } catch (err) {
    console.error('Erro ao atualizar nota:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

module.exports = { listar, buscarPorAluno, criar, atualizar };