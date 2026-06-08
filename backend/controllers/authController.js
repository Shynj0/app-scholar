const pool   = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET    || 'app_scholar_secret';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

// ─── POST /api/login ─────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios' });

  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email.trim().toLowerCase()]
    );

    if (!rows.length)
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

    const user = rows[0];
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil, nome: user.nome, reference_id: user.reference_id },
      SECRET,
      { expiresIn: EXPIRES }
    );

    res.json({
      success: true,
      token,
      usuario: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil },
    });
  } catch (err) {
    console.error('[authController.login]', err);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

// ─── POST /api/register ──────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { nome, email, senha, perfil = 'admin' } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });

  try {
    const exists = await pool.query('SELECT id FROM usuarios WHERE email=$1', [email]);
    if (exists.rows.length)
      return res.status(409).json({ success: false, message: 'E-mail já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome,email,senha,perfil) VALUES ($1,$2,$3,$4)
       RETURNING id,nome,email,perfil,created_at`,
      [nome, email.trim().toLowerCase(), hash, perfil]
    );

    res.status(201).json({ success: true, message: 'Usuário criado com sucesso', data: rows[0] });
  } catch (err) {
    console.error('[authController.register]', err);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};
