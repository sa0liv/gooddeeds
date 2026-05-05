# GoodDeeds

Plataforma web de gestao de eventos de voluntariado desenvolvida para a disciplina de Laboratorio de Engenharia de Software.

## Sobre o projeto

O GoodDeeds conecta voluntarios a oportunidades de impacto social. Organizadores criam e gerenciam eventos; voluntarios encontram oportunidades, se inscrevem e acompanham sua participacao.

**Arquitetura:** MVC estendido com camadas de Service e Repository.

**Design:** [Figma - GoodDeeds](https://www.figma.com/design/BWdiggx0MfzWxMxM9oab9g/GoodDeeds)

## Tecnologias

| Camada | Tecnologia |
| ------ | ---------- |
| Frontend | React 18 + Vite |
| Backend | Node.js + Express 5 |
| Banco de dados | PostgreSQL |
| Autenticacao | JWT |
| Validacao | express-validator |
| Versionamento | Git + GitHub |

## Estrutura do projeto

```text
gooddeeds/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── migrate.js
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   └── EventoController.js
│   │   ├── middleware/
│   │   │   ├── autenticacao.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── Usuario.js
│   │   │   └── Evento.js
│   │   ├── repositories/
│   │   │   ├── UsuarioRepository.js
│   │   │   └── EventoRepository.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── eventoRoutes.js
│   │   ├── services/
│   │   │   ├── AutenticacaoService.js
│   │   │   └── EventoService.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

## Configuracao do banco de dados

### Opcao 1: Supabase com Transaction Pooler

Use o Transaction Pooler do Supabase para evitar problemas de IPv6 em algumas redes.

1. No Supabase, acesse **Database > Connection pooling**.
2. Selecione **Transaction pooler**.
3. Copie a connection string URI.
4. Configure o `backend/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres.PROJECT_REF:SUA_SENHA@aws-1-REGION.pooler.supabase.com:6543/postgres?connect_timeout=10
JWT_SECRET=troque_por_uma_chave_secreta_longa
```

### Opcao 2: PostgreSQL local

Crie o banco:

```sql
CREATE DATABASE gooddeeds;
```

Configure o `backend/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
DB_NAME=gooddeeds

JWT_SECRET=troque_por_uma_chave_secreta_longa
```

Depois execute a migracao:

```bash
cd backend
npm run migrate
```

A migracao cria/verifica as tabelas `usuarios` e `eventos`.

## Como executar localmente

### Pre-requisitos

- Node.js 18+
- PostgreSQL 14+ ou banco Supabase configurado

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

O backend roda por padrao em `http://localhost:3001`.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend roda por padrao em `http://localhost:5173`.

## Endpoints da API

### Autenticacao

| Metodo | Rota | Descricao |
| ------ | ---- | --------- |
| `POST` | `/api/auth/registrar` | Cria novo usuario |
| `POST` | `/api/auth/login` | Autentica usuario e retorna token JWT |

#### POST /api/auth/registrar

```json
{
  "nome": "Joao Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "senha": "minimo6",
  "tipo_perfil": "VOLUNTARIO"
}
```

#### POST /api/auth/login

```json
{
  "email": "joao@email.com",
  "senha": "minimo6"
}
```

Resposta:

```json
{
  "usuario": {
    "id": 1,
    "nome": "Joao Silva",
    "email": "joao@email.com",
    "tipoPerfil": "VOLUNTARIO"
  },
  "token": "eyJ..."
}
```

### Eventos

Rotas protegidas exigem header:

```http
Authorization: Bearer <token>
```

| Metodo | Rota | Protegida | Descricao |
| ------ | ---- | --------- | --------- |
| `GET` | `/api/eventos` | Nao | Lista eventos ativos |
| `GET` | `/api/eventos/:id` | Nao | Detalha um evento ativo |
| `POST` | `/api/eventos` | Sim | Cria evento para o organizador logado |
| `GET` | `/api/meus-eventos` | Sim | Lista eventos criados pelo organizador logado |
| `PUT` | `/api/eventos/:id` | Sim | Atualiza evento do organizador logado |
| `PATCH` | `/api/eventos/:id/cancelar` | Sim | Cancela evento sem excluir do banco |
| `DELETE` | `/api/eventos/:id` | Sim | Cancela evento sem excluir do banco |

#### POST /api/eventos

```json
{
  "titulo": "Mutirao solidario",
  "descricao": "Arrecadacao e distribuicao de alimentos",
  "local": "Centro Comunitario",
  "data_hora_inicio": "2026-05-10T09:00:00",
  "data_hora_fim": "2026-05-10T13:00:00",
  "numero_maximo_vagas": 20,
  "requisitos": "Levar documento"
}
```

Resposta:

```json
{
  "evento": {
    "id": 1,
    "organizadorId": 2,
    "titulo": "Mutirao solidario",
    "descricao": "Arrecadacao e distribuicao de alimentos",
    "local": "Centro Comunitario",
    "dataHoraInicio": "2026-05-10T09:00:00.000Z",
    "dataHoraFim": "2026-05-10T13:00:00.000Z",
    "numeroMaximoVagas": 20,
    "requisitos": "Levar documento",
    "status": "ATIVO"
  }
}
```

## Regras implementadas

- Apenas usuarios com `tipo_perfil` igual a `ORGANIZADOR` podem criar, editar, listar meus eventos e cancelar eventos.
- Um organizador nao pode editar ou cancelar evento criado por outro organizador.
- Cancelamento e logico: o status muda para `CANCELADO`.
- A listagem publica retorna apenas eventos com status `ATIVO`.
- Campos obrigatorios do evento sao validados no backend.
- `data_hora_fim`, quando informada, deve ser posterior a `data_hora_inicio`.
- `numero_maximo_vagas` deve ser maior que zero.

## Entregas por sprint

### Sprint 1 - 15/04 a 28/04: Autenticacao

**Backend**

- Tabela `usuarios`.
- Cadastro com validacao, hash de senha e tipo de perfil.
- Login com JWT.
- Camadas Controller, Service, Repository e Model.

**Frontend**

- Telas de cadastro e login.
- Integracao com backend via Axios.
- Armazenamento de token no `localStorage`.
- Roteamento para dashboard.

### Sprint 2 - 29/04 a 12/05: Gestao de eventos

**Backend**

- Tabela `eventos`.
- Modelagem da entidade `Evento`.
- Endpoint `POST /api/eventos`.
- Endpoint `GET /api/eventos`.
- Endpoint `GET /api/eventos/:id`.
- Endpoint `GET /api/meus-eventos`.
- Endpoint `PUT /api/eventos/:id`.
- Endpoints de cancelamento `PATCH /api/eventos/:id/cancelar` e `DELETE /api/eventos/:id`.
- Middleware de autenticacao JWT.
- Validacao de permissao do organizador.

**Observacao**

O calculo real de vagas disponiveis depende do modulo de inscricoes, previsto para as proximas sprints. Nesta entrega, a API valida `numero_maximo_vagas` e lista eventos ativos.

### Sprint 3 - 13/05 a 26/05: Participacao dos voluntarios

- Pendente.

### Sprint 4 - 27/05 a 09/06: Controle e finalizacao

- Pendente.

## Configuracoes de ambiente

| Variavel | Descricao | Exemplo |
| -------- | --------- | ------- |
| `PORT` | Porta do backend | `3001` |
| `FRONTEND_URL` | Origem permitida no CORS | `http://localhost:5173` |
| `DATABASE_URL` | Connection string PostgreSQL/Supabase | `postgresql://...` |
| `DB_HOST` | Host local do PostgreSQL | `localhost` |
| `DB_PORT` | Porta local do PostgreSQL | `5432` |
| `DB_USER` | Usuario local do PostgreSQL | `postgres` |
| `DB_PASSWORD` | Senha local do PostgreSQL | `sua_senha` |
| `DB_NAME` | Nome do banco local | `gooddeeds` |
| `JWT_SECRET` | Chave para assinar tokens JWT | `string_longa_e_aleatoria` |

## Observacoes de versionamento

- `node_modules/` nao deve ser versionado.
- Arquivos `.env` nao devem ser enviados ao GitHub.
- Documentos locais de planejamento e artefatos estao ignorados pelo `.gitignore`.
