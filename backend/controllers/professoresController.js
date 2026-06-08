const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

// POST /api/professores
exports.create = async (req, res) => {
  const { nome, titulacao, area, tempo_docencia, email } = req.body;

  if (!nome || !email)
    return res.status(400).json({ success: false, message: 'Nome e e-mail são obrigatórios' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insere na tabela de professores
    const profRes = await client.query(
      `INSERT INTO professores (nome,titulacao,area,tempo_docencia,email)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nome, titulacao || null, area || null, tempo_docencia || null, email.trim().toLowerCase()]
    );
    const novoProfessor = profRes.rows[0];

    // 2. Cria a senha padrão criptografada para o Professor
    const senhaPadrao = 'Prof@123';
    const hash = await bcrypt.hash(senhaPadrao, 10);

    // 3. Cria o usuário vinculado ao ID do professor
    await client.query(
      `INSERT INTO usuarios (nome, email, senha, perfil, reference_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [nome, email.trim().toLowerCase(), hash, 'professor', novoProfessor.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Professor e usuário criados com sucesso!', data: novoProfessor });

  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505')
      return res.status(409).json({ success: false, message: 'E-mail já cadastrado' });
    console.error('[professoresController.create]', err);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar professor' });
  } finally {
    client.release();
  }
};

// GET /api/professores
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professores ORDER BY nome ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar professores' });
  }
};

// ==========================================
// FUNÇÕES MOCK PARA EVITAR O ERRO UNDEFINED
// ==========================================

// GET /api/professores/:id
exports.getById = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};

// PUT /api/professores/:id
exports.update = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};

// DELETE /api/professores/:id
exports.remove = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};

// Se o seu router tiver uma busca específica (ex: matricula ou email), adicione aqui também:
exports.getByEmail = async (req, res) => {
  res.status(501).json({ message: 'Rota em construção' });
};