const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error('Defina JWT_SECRET com ao menos 32 caracteres no arquivo .env');
}

function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Autenticação necessária. Entre novamente.' });

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão expirada ou token inválido. Entre novamente.' });
  }
}

module.exports = { authenticate };
