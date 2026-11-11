# Oficina Bortolotto

Sistema web para o atendimento básico da oficina: clientes, veículos e ordens de serviço. A organização segue a base `saep` (`backend/src`, `frontend/src`), adaptada para JavaScript, Express, React e SQLite conforme o escopo solicitado.

## Requisitos

- Node.js 22.13 ou superior (usa o módulo integrado `node:sqlite`).
- npm.

## Configuração e execução

1. Em `backend`, instale as dependências e crie o arquivo de ambiente:

   ```powershell
   cd backend
   npm install
   Copy-Item .env.example .env
   ```

2. Edite `.env` e configure `JWT_SECRET` e `CPF_SECRET` com segredos aleatórios próprios, cada um com pelo menos 32 caracteres. Não reutilize os valores de exemplo.
3. Inicialize o banco e os registros de demonstração:

   ```powershell
   npm run db:init
   ```

4. Inicie a API:

   ```powershell
   npm run dev
   ```

   API em `http://localhost:3001`; verificação em `http://localhost:3001/api/health`.

5. Em outro terminal, inicie o React:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Abra o endereço indicado pelo Vite (normalmente `http://localhost:5173`). O proxy `/api` direciona as chamadas para a API.

## Acesso de demonstração

- E-mail: `marina@oficinabortolotto.com`
- Senha: `Oficina123!`

O SQL contém mais duas contas de demonstração com a mesma senha. Troque/remova as credenciais de demonstração antes de usar dados reais.

## API

Todas as rotas abaixo, exceto login e health, exigem `Authorization: Bearer <token>`.

| Método | Rota | Ação |
|---|---|---|
| POST | `/api/auth/login` | Login; token expira em duas horas |
| GET | `/api/clientes?busca=nome` | Lista clientes e filtra por nome |
| POST | `/api/clientes` | Cadastra cliente |
| PUT | `/api/clientes/:id` | Edita cliente |
| DELETE | `/api/clientes/:id` | Exclui cliente |
| GET | `/api/veiculos` | Lista veículos e nome do cliente |
| POST | `/api/veiculos` | Cadastra veículo vinculado a cliente |
| GET | `/api/ordens-servico` | Lista OS por data com cliente e veículo |
| PATCH | `/api/ordens-servico/:id` | Remarca data da OS |
| GET | `/api/health` | Verifica disponibilidade da API |

Senhas de usuários são verificadas com bcrypt. O CPF recebido pela API é cifrado com AES-256-GCM antes de ser salvo e decifrado no backend para exibição ao usuário autenticado. A chave do CPF fica fora do banco, em `CPF_SECRET`.
