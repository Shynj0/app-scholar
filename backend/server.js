require('dotenv').config(); // Essencial para ler o arquivo .env
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/auth');
const alunosRoutes = require('./routes/alunos');
const professoresRoutes = require('./routes/professores');
const disciplinasRoutes = require('./routes/disciplinas');
const notasRoutes = require('./routes/notas');
const boletimRoutes = require('./routes/boletim');

app.use('/api', authRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/boletim', boletimRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'App Scholar API está rodando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});