const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const token = header.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'app_scholar_secret');
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
};
