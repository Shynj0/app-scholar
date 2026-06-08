const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  // Valida se o cabeçalho Authorization existe e segue o padrão 'Bearer <TOKEN>'
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Acesso negado. Token não fornecido.' });
  }

  // Extrai apenas a hash do token retirando a string 'Bearer ' (7 caracteres)
  const token = header.slice(7);

  try {
    // Decodifica o payload e anexa as informações da sessão dentro do objeto de requisição (req.user)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'app_scholar_secret');
    req.user = decoded;
    
    next(); // Permite que a requisição siga para o controller correspondente
  } catch (err) {
    // Mostra no console do backend o real motivo da rejeição (Ex: TokenExpiredError)
    console.error('[authMiddleware Error]:', err.message);
    return res.status(401).json({ success: false, message: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
};