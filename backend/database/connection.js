require('dotenv').config(); // Carrega as variáveis do arquivo .env (apenas para ambiente local)
const { Pool } = require('pg');

// Configuração do Pool de Conexão
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Lê a variável do Render
  ssl: {
    rejectUnauthorized: false, // Obrigatório para o Neon, que usa certificados autoassinados
  },
});

// Teste de conexão (ajuda a diagnosticar erros no log do Render)
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
  } else {
    console.log('✅ Conectado ao banco de dados Neon com sucesso!');
    release(); // Libera o cliente de volta para o pool após o teste
  }
});

module.exports = pool;