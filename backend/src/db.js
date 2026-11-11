require('dotenv').config();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const filename = process.env.DATABASE_PATH || './oficina.sqlite';
const db = new DatabaseSync(path.resolve(filename));
db.exec('PRAGMA foreign_keys = ON');
module.exports = db;
