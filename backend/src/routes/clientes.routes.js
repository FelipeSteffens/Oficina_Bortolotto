const { Router } = require('express');
const db = require('../db');
const { encrypt, decrypt } = require('../crypto');

const router = Router();
const safeCustomer = ({ cpf_criptografado, ...row }) => ({ ...row, cpf: decrypt(cpf_criptografado) });
const hasText = (value) => String(value ?? '').trim().length > 0;

router.get('/', (req, res) => {
  const busca = `%${String(req.query.busca || '').trim()}%`;
  const rows = db.prepare('SELECT * FROM clientes WHERE nome LIKE ? ORDER BY nome').all(busca);
  return res.json(rows.map(safeCustomer));
});

router.post('/', (req, res) => {
  const { nome, telefone, cpf } = req.body || {};
  if (![nome, telefone, cpf].every(hasText)) {
    return res.status(400).json({ error: 'Nome, telefone e CPF são obrigatórios.' });
  }
  const result = db.prepare('INSERT INTO clientes (nome, telefone, cpf_criptografado) VALUES (?, ?, ?)')
    .run(nome.trim(), telefone.trim(), encrypt(cpf.trim()));
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(safeCustomer(cliente));
});

router.put('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Cliente não encontrado.' });

  const { nome, telefone, cpf } = req.body || {};
  if (![nome, telefone].every(hasText) || (cpf !== undefined && !hasText(cpf))) {
    return res.status(400).json({ error: 'Nome e telefone são obrigatórios; CPF, quando informado, não pode ficar vazio.' });
  }
  const cpfCifrado = cpf === undefined ? current.cpf_criptografado : encrypt(cpf.trim());
  db.prepare('UPDATE clientes SET nome = ?, telefone = ?, cpf_criptografado = ? WHERE id = ?')
    .run(nome.trim(), telefone.trim(), cpfCifrado, req.params.id);
  return res.json(safeCustomer(db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Cliente não encontrado.' });
  return res.status(204).end();
});

module.exports = router;
