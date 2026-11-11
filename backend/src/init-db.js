const fs = require('node:fs');
const path = require('node:path');
const db = require('./db');
const sql = fs.readFileSync(path.resolve(__dirname, '../../banco.sql'), 'utf8');
db.exec(sql);
console.log('Banco SQLite inicializado.');
db.close();
