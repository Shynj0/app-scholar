require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rotas ───────────────────────────────────────────────────────────────────
app.use('/api',           require('./routes/auth'));
app.use('/api/alunos',       require('./routes/alunos'));
app.use('/api/professores',  require('./routes/professores'));
app.use('/api/disciplinas',  require('./routes/disciplinas'));
app.use('/api/notas',        require('./routes/notas'));
app.use('/api/boletim',      require('./routes/boletim'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', message: '🎓 App Scholar API funcionando!' })
);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Rota não encontrada' })
);

// ─── Inicialização ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎓 App Scholar Backend`);
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📋 Health check:       http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
