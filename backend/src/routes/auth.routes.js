const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) return res.status(400).json({ error: 'Informe e-mail e senha.' });

    const user = db.prepare('SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?')
      .get(String(email).trim().toLowerCase());
    if (!user || !(await bcrypt.compare(String(senha), user.senha_hash))) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user.id, nome: user.nome }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token, nome: user.nome });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
