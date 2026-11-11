const { Router } = require('express');
const db = require('../db');

const router = Router();

router.get('/', (_req, res) => {
  const rows = db.prepare(`SELECT v.*, c.nome AS cliente_nome
    FROM veiculos v JOIN clientes c ON c.id = v.cliente_id ORDER BY v.modelo, v.id`).all();
  return res.json(rows);
});

router.post('/', (req, res) => {
  const { cliente_id, marca, modelo, ano, placa } = req.body || {};
  if (!cliente_id || ![marca, modelo, ano, placa].every((value) => String(value ?? '').trim())) {
    return res.status(400).json({ error: 'Cliente, marca, modelo, ano e placa são obrigatórios.' });
  }
  const year = Number(ano);
  if (!Number.isInteger(year) || year < 1886 || year > new Date().getFullYear() + 1) {
    return res.status(400).json({ error: 'Informe um ano válido para o veículo.' });
  }
  if (!db.prepare('SELECT id FROM clientes WHERE id = ?').get(Number(cliente_id))) {
    return res.status(400).json({ error: 'Cliente não encontrado.' });
  }
  try {
    const result = db.prepare('INSERT INTO veiculos (cliente_id, marca, modelo, ano, placa) VALUES (?, ?, ?, ?, ?)')
      .run(Number(cliente_id), marca.trim(), modelo.trim(), year, placa.trim().toUpperCase());
    return res.status(201).json(db.prepare('SELECT * FROM veiculos WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Já existe um veículo cadastrado com esta placa.' });
    }
    throw error;
  }
});

module.exports = router;
