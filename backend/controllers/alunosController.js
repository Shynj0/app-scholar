const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

// POST /api/alunos
exports.create = async (req, res) => {
  const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

  if (!nome || !matricula || !curso || !email)
    return res.status(400).json({ success: false, message: 'Nome, matrícula, curso e e-mail são obrigatórios' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insere na tabela de alunos (Corrigido 'city' para 'cidade')
    const alunoRes = await client.query(
      `INSERT INTO alunos (nome,matricula,curso,email,telefone,cep,endereco,cidade,estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nome, matricula, curso, email.trim().toLowerCase(), telefone || null, cep || null,
       endereco || null, cidade || null, estado || null]
    );
    const novoAluno = alunoRes.rows[0];

    // 2. Cria a senha padrão criptografada para o Aluno
    const senhaPadrao = 'Aluno@123';
    const hash = await bcrypt.hash(senhaPadrao, 10);

    // 3. Cria o usuário correspondente apontando para o ID do aluno
    await client.query(
      `INSERT INTO usuarios (nome, email, senha, perfil, reference_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [nome, email.trim().toLowerCase(), hash, 'aluno', novoAluno.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Aluno e usuário criados com sucesso!', data: novoAluno });

  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'Matrícula ou e-mail já cadastrado' });
    console.error('[alunosController.create]', err);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar aluno' });
  } finally {
    client.release();
  }
};

// GET /api/alunos
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos ORDER BY nome ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[alunosController.getAll]', err);
    res.status(500).json({ success: false, message: 'Erro ao buscar alunos' });
  }
};

// GET /api/alunos/matricula/:matricula
exports.getByMatricula = async (req, res) => {
  const matricula = req.params.matricula?.trim();

  if (!matricula) {
    return res.status(400).json({ success: false, message: 'Matrícula não informada.' });
  }

  try {
    // 💡 CORREÇÃO: Busca usando o casting ::text para evitar erros de tipo do PostgreSQL
    const { rows } = await pool.query(
      'SELECT id, nome, matricula, curso, email FROM alunos WHERE matricula::text = $1::text',
      [matricula]
    );

    // Se não encontrar o aluno na tabela
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Aluno não encontrado' });
    }

    // Retorna com a propriedade 'success: true' e os dados que a tela do App precisa
    return res.json({ 
      success: true, 
      data: rows[0] 
    });

  } catch (err) {
    console.error('[alunosController.getByMatricula Error]:', err);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar matrícula.' });
  }
};

// GET /api/alunos/:id
exports.getById = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};

// PUT /api/alunos/:id
exports.update = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};

// DELETE /api/alunos/:id
exports.remove = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};