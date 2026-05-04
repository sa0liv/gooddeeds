# GoodDeeds

Plataforma web de gestão de eventos de voluntariado desenvolvida para a disciplina de Laboratório de Engenharia de Software.

## Sobre o projeto

O GoodDeeds conecta voluntários a oportunidades de impacto social. Organizadores criam e gerenciam eventos; voluntários os encontram, se inscrevem e obtêm comprovantes de participação.

**Arquitetura:** MVC estendido com camadas de Service e Repository.

**Design:** [Figma — GoodDeeds](https://www.figma.com/design/BWdiggx0MfzWxMxM9oab9g/GoodDeeds)

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express 5 |
| Banco de dados | PostgreSQL |
| Autenticação | JWT (JSON Web Tokens) |
| Prototipação | Figma |
| Gestão | Trello |
| Versionamento | Git + GitHub |

---

## Estrutura do projeto

```
gooddeeds/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Pool de conexão com PostgreSQL
│   │   │   └── migrate.js        # Script de criação das tabelas
│   │   ├── controllers/
│   │   │   └── AuthController.js # Coordena requisições de autenticação
│   │   ├── middleware/
│   │   │   └── validate.js       # Validação de entrada com express-validator
│   │   ├── models/
│   │   │   └── Usuario.js        # Entidade de domínio
│   │   ├── repositories/
│   │   │   └── UsuarioRepository.js  # Acesso ao banco de dados
│   │   ├── routes/
│   │   │   └── authRoutes.js     # Rotas de autenticação
│   │   ├── services/
│   │   │   └── AutenticacaoService.js  # Regras de negócio (bcrypt + JWT)
│   │   └── server.js             # Ponto de entrada do servidor
│   ├── .env.example              # Modelo de variáveis de ambiente
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Cadastro.jsx      # Tela de cadastro
    │   │   ├── Login.jsx         # Tela de login
    │   │   ├── Dashboard.jsx     # Dashboard (placeholder Sprint 2)
    │   │   └── Auth.css          # Estilos das telas de autenticação
    │   ├── services/
    │   │   └── api.js            # Cliente HTTP (Axios)
    │   ├── App.jsx               # Roteamento da aplicação
    │   ├── index.css             # Estilos globais e tokens de design
    │   └── main.jsx              # Ponto de entrada React
    └── package.json
```

---

## Configuração do banco de dados

### 1. Instalar o PostgreSQL

Baixe e instale o PostgreSQL em [postgresql.org/download](https://www.postgresql.org/download/).

### 2. Criar o banco de dados

Abra o terminal do PostgreSQL (psql) ou uma ferramenta como pgAdmin e execute:

```sql
CREATE DATABASE gooddeeds;
```

### 3. Configurar as variáveis de ambiente

Dentro da pasta `backend/`, copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o arquivo `.env` criado:

```
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
DB_NAME=gooddeeds

JWT_SECRET=qualquer_string_longa_e_aleatoria
```

> O arquivo `.env` **nunca deve ser enviado ao GitHub**. Ele já está no `.gitignore`.

### 4. Criar as tabelas

Execute o script de migração para criar as tabelas no banco:

```bash
cd backend
npm run migrate
```

Isso criará a tabela `usuarios` automaticamente.

---

## Como executar localmente

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/)

### 1. Clonar o repositório

```bash
git clone https://github.com/sa0liv/gooddeeds.git
cd gooddeeds
```

### 2. Configurar e iniciar o backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com sua senha do PostgreSQL
npm run migrate   # Cria as tabelas no banco
npm run dev       # Inicia o servidor em modo desenvolvimento
```

O servidor ficará disponível em `http://localhost:3001`.

### 3. Iniciar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/registrar` | Cria novo usuário |
| `POST` | `/api/auth/login` | Autentica usuário |

#### POST /api/auth/registrar

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "senha": "minimo6",
  "tipo_perfil": "VOLUNTARIO"
}
```

**Resposta (201):**
```json
{
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipoPerfil": "VOLUNTARIO"
  },
  "token": "eyJ..."
}
```

#### POST /api/auth/login

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "minimo6"
}
```

**Resposta (200):**
```json
{
  "usuario": { ... },
  "token": "eyJ..."
}
```

---

## O que foi entregue por sprint

### Sprint 1 — 15/04 a 28/04 (Autenticação)

**Backend:**
- Modelagem e criação da tabela `usuarios` (nome, email, telefone, senha, tipo_perfil)
- Endpoint `POST /api/auth/registrar` — cadastro com validação e hash de senha (bcrypt)
- Endpoint `POST /api/auth/login` — autenticação com retorno de token JWT
- Validação de entrada no servidor com express-validator
- Arquitetura MVC com separação em Model, Repository, Service e Controller

**Frontend:**
- Tela de Cadastro fiel ao Figma (campos: nome, e-mail, telefone, senha)
- Tela de Login fiel ao Figma (campos: e-mail, senha)
- Validação em tempo real nos formulários (frontend)
- Integração com o backend via Axios
- Roteamento com React Router DOM (`/login`, `/cadastro`, `/dashboard`)
- Tokens de design aplicados via CSS (cor primária `#2E9E6A`, fonte Inter, bordas e radii do Figma)

### Sprint 2 — 29/04 a 12/05 (Gestão de eventos)

- Em andamento

### Sprint 3 — 13/05 a 26/05 (Participação dos voluntários)

- Pendente

### Sprint 4 — 27/05 a 09/06 (Controle e finalização)

- Pendente

---

## Fluxo de autenticação

```
Usuário → LoginView/CadastroView
       → AuthController
       → AutenticacaoService (valida credenciais, gera JWT)
       → UsuarioRepository (acessa banco PostgreSQL)
       → Retorna token JWT → armazenado no localStorage
```

---

## Configurações de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor backend | `3001` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `sua_senha` |
| `DB_NAME` | Nome do banco | `gooddeeds` |
| `JWT_SECRET` | Chave para assinar tokens | string longa e aleatória |
