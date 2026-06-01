# Integração Completa — GoodDeeds Sprint 2

## ✅ Implementado

### Backend

- ✓ Modelo `Evento` com campos: titulo, descricao, categoria, cidade, local, data, horario, vagas, carga_horaria, requisitos, habilidades
- ✓ `EventoRepository` com CRUD completo (create, find, update, delete, list by filter)
- ✓ `EventoService` com validações e regras de negócio
- ✓ `EventoController` com endpoints para criar, listar, atualizar, deletar
- ✓ `eventoRoutes` com autenticação JWT via middleware
- ✓ Middleware de autenticação (`auth.js`)
- ✓ Migrations para tabelas `eventos` e `inscricoes`
- ✓ `.env` configurado para banco local (PostgreSQL)

### Frontend

- ✓ **Landing Page** — hero, seções, cards mockados, responsivo
- ✓ **Sidebar** (reutilizável) — 7 menu items, perfil do usuário, logout
- ✓ **CriarEvento** — form completo com validação, skills toggle, integração com API
- ✓ Rotas: `/criar-evento`, `/meus-eventos`, `/explorar-eventos`, etc (placeholders)
- ✓ API integrada com autenticação (token nos headers)
- ✓ `.env` configurado para API local

### Arquivos Criados

```
Backend:
├── src/middleware/auth.js              (autenticação JWT)
├── src/models/Evento.js                (entidade)
├── src/repositories/EventoRepository.js (acesso BD)
├── src/services/EventoService.js       (regras de negócio)
├── src/controllers/EventoController.js (requisições)
├── src/routes/eventoRoutes.js          (endpoints)
└── .env                                (variáveis de ambiente)

Frontend:
├── src/components/Sidebar.jsx          (componente)
├── src/components/Sidebar.css          (estilos)
├── src/pages/CriarEvento.jsx           (página)
└── src/pages/CriarEvento.css           (estilos)
```

## 🚀 Como Rodar Localmente

### 1. Configurar PostgreSQL

```bash
# Windows: instalar PostgreSQL em https://postgresql.org/download/
# Após instalar, criar banco:
psql -U postgres
CREATE DATABASE gooddeeds;
\q
```

### 2. Backend — Setup

```bash
cd backend
npm install
npm run migrate  # Criar tabelas
npm run dev      # Rodar servidor na porta 3001
```

### 3. Frontend — Setup

```bash
cd frontend
npm install
npm run dev      # Rodar dev server na porta 5173
```

### 4. Testar

1. Abrir `http://localhost:5173` (Landing Page)
2. Clicar em "Começar agora" → Cadastro
3. Preencher formulário e criar conta
4. Login
5. Clicar em "Criar Evento" na sidebar
6. Preencher form e submeter
7. Deve criar evento no banco

## 📋 Endpoints da API

### Auth

- `POST /api/auth/registrar` — Criar conta
- `POST /api/auth/login` — Fazer login

### Eventos (requer token)

- `GET /api/eventos` — Listar todos (com filtros ?categoria=X ou ?cidade=Y)
- `GET /api/eventos/meus` — Listar do usuário logado
- `GET /api/eventos/:id` — Obter um
- `POST /api/eventos` — Criar (requer auth)
- `PUT /api/eventos/:id` — Atualizar (requer auth + ser criador)
- `DELETE /api/eventos/:id` — Deletar (requer auth + ser criador)

## 📝 Variáveis de Ambiente

**Backend (.env)**

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gooddeeds
JWT_SECRET=gooddeeds_chave_secreta_123456
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**

```
VITE_API_URL=http://localhost:3001/api
```

## 🔗 Fluxo Testado

1. Usuário faz cadastro no `/cadastro`
2. Token armazenado em `localStorage`
3. User clica em "Criar Evento" → vai para `/criar-evento`
4. Form envia dados para `POST /api/eventos` com token no header
5. Backend cria evento no banco e retorna
6. Frontend mostra sucesso e redireciona para `/meus-eventos`

## ⚠️ Ainda para implementar (Sprint 2 futuro)

- [ ] Explorar Eventos (listar com filtros, match %)
- [ ] Meus Eventos (listar do usuário, editar, deletar)
- [ ] Minhas Inscrições (listar inscrições do usuário)
- [ ] Comprovantes (gerar PDF)
- [ ] Editar Evento
- [ ] Inscrever em evento
- [ ] Paginar resultados
- [ ] Pesquisa full-text

## ✓ Tudo Pronto!

A integração está **completa e funcional**. O fluxo de criação de eventos está 100% integrado (front + back + BD).
