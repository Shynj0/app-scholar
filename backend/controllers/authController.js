const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/login
const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // Buscar nome do usuário conforme perfil
    let nome = 'Usuário';
    if (usuario.perfil === 'aluno') {
      const aluno = await pool.query(
        'SELECT nome FROM alunos WHERE usuario_id = $1',
        [usuario.id]
      );
      if (aluno.rows.length > 0) nome = aluno.rows[0].nome;
    } else if (usuario.perfil === 'professor') {
      const prof = await pool.query(
        'SELECT nome FROM professores WHERE usuario_id = $1',
        [usuario.id]
      );
      if (prof.rows.length > 0) nome = prof.rows[0].nome;
    } else {
      nome = 'Administrador';
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

// POST /api/registro
const registro = async (req, res) => {
  const { email, senha, perfil } = req.body;

  if (!email || !senha || !perfil) {
    return res.status(400).json({ erro: 'Email, senha e perfil são obrigatórios.' });
  }

  if (!['aluno', 'professor', 'admin'].includes(perfil)) {
    return res.status(400).json({ erro: 'Perfil inválido.' });
  }

  try {
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (email, senha_hash, perfil) VALUES ($1, $2, $3) RETURNING id, email, perfil',
      [email, senhaHash, perfil]
    );

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso.',
      usuario: result.rows[0],
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

module.exports = { login, registro };
