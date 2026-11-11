const { Router } = require('express');
const db = require('../db');

const router = Router();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
function validDate(value) {
  if (!datePattern.test(String(value || ''))) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

router.get('/', (_req, res) => {
  const rows = db.prepare(`SELECT os.id, os.descricao, os.data_agendada,
      v.id AS veiculo_id, v.marca, v.modelo, v.ano, v.placa,
      c.id AS cliente_id, c.nome AS cliente_nome
    FROM ordens_servico os
    JOIN veiculos v ON v.id = os.veiculo_id
    JOIN clientes c ON c.id = v.cliente_id
    ORDER BY os.data_agendada, os.id`).all();
  return res.json(rows);
});

router.patch('/:id', (req, res) => {
  const { data_agendada } = req.body || {};
  if (!validDate(data_agendada)) return res.status(400).json({ error: 'Informe uma data válida no formato AAAA-MM-DD.' });
  const result = db.prepare('UPDATE ordens_servico SET data_agendada = ? WHERE id = ?')
    .run(data_agendada, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Ordem de serviço não encontrada.' });
  return res.json(db.prepare('SELECT * FROM ordens_servico WHERE id = ?').get(req.params.id));
});

module.exports = router;
