PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cpf_criptografado TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS veiculos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  placa TEXT NOT NULL UNIQUE,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ordens_servico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  veiculo_id INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  data_agendada TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Senha fictícia dos três usuários de demonstração: Oficina123!
INSERT INTO usuarios (id, nome, email, senha_hash) VALUES
  (1, 'Marina Bortolotto', 'marina@oficinabortolotto.com', '$2b$10$7pkEY2yhgS8YyFEl/y9nEuFPt.dqEd/xSX1y9q9IWyWipl4U8mNFC'),
  (2, 'Rafael Lima', 'rafael@oficinabortolotto.com', '$2b$10$7pkEY2yhgS8YyFEl/y9nEuFPt.dqEd/xSX1y9q9IWyWipl4U8mNFC'),
  (3, 'Camila Souza', 'camila@oficinabortolotto.com', '$2b$10$7pkEY2yhgS8YyFEl/y9nEuFPt.dqEd/xSX1y9q9IWyWipl4U8mNFC')
ON CONFLICT(email) DO UPDATE SET
  nome = excluded.nome,
  senha_hash = excluded.senha_hash;

-- CPFs fictícios ficam vazios no seed. Cadastros feitos pela API são cifrados com AES-256-GCM.
INSERT OR IGNORE INTO clientes (id, nome, telefone, cpf_criptografado) VALUES
  (1, 'Ana Oliveira', '(11) 99911-2233', ''),
  (2, 'Bruno Martins', '(11) 98822-3344', ''),
  (3, 'Carla Ferreira', '(11) 97733-4455', '');

INSERT OR IGNORE INTO veiculos (id, cliente_id, marca, modelo, ano, placa) VALUES
  (1, 1, 'Toyota', 'Corolla', 2021, 'ABC1D23'),
  (2, 2, 'Honda', 'Civic', 2019, 'DEF4G56'),
  (3, 3, 'Chevrolet', 'Onix', 2023, 'GHI7J89');

INSERT OR IGNORE INTO ordens_servico (id, veiculo_id, descricao, data_agendada) VALUES
  (1, 1, 'Revisão periódica', '2026-11-12'),
  (2, 2, 'Troca de pastilhas de freio', '2026-11-13'),
  (3, 3, 'Alinhamento e balanceamento', '2026-11-14');
