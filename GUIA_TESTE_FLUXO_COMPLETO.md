# Guia de Teste - GoodDeeds: Fluxo de Eventos e Inscrições

## ✅ Implementação Concluída

Todas as funcionalidades do fluxo de eventos e inscrições foram implementadas. Aqui está como testar:

---

## 📋 Arquivos Criados/Modificados

### Backend (9 arquivos)

```
✓ src/config/migrate.js (MODIFICADO) - Adicionadas colunas: habilidades, areas_interesse, cidade
✓ src/models/Inscricao.js (CRIADO)
✓ src/repositories/InscricaoRepository.js (CRIADO)
✓ src/services/InscricaoService.js (CRIADO)
✓ src/controllers/InscricaoController.js (CRIADO)
✓ src/routes/inscricaoRoutes.js (CRIADO)
✓ src/server.js (MODIFICADO) - Adicionada rota de inscrições
✓ src/utils/compatibilidade.js (CRIADO)
```

### Frontend (19 arquivos)

```
✓ src/services/api.js (MODIFICADO) - Adicionadas funções de API
✓ src/App.jsx (MODIFICADO) - Adicionadas 8 rotas
✓ src/components/EventCard.jsx (CRIADO)
✓ src/utils/compatibilidade.js (CRIADO)

Páginas:
✓ src/pages/ExplorarEventos.jsx + .css
✓ src/pages/DetalhesEvento.jsx + .css
✓ src/pages/MeusEventos.jsx + .css
✓ src/pages/EditarEvento.jsx + .css
✓ src/pages/MinhasInscricoes.jsx + .css
✓ src/pages/GerenciarInscricoes.jsx + .css
✓ src/pages/ControlePresenca.jsx + .css
```

---

## 🚀 Setup Inicial

### 1. Resetar banco de dados (se necessário)

```bash
cd backend
# Deletar banco antigo (se usar PostgreSQL local)
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS gooddeeds;"
# Criar novo banco
psql -U postgres -d postgres -c "CREATE DATABASE gooddeeds;"
# Rodar migrations
npm run migrate
```

### 2. Iniciar servidores

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🧪 Fluxo 1: Voluntário Explora e se Inscreve

### Passo 1: Criar duas contas

1. Cadastro como **VOLUNTARIO** (ex: João Silva / joao@email.com)
2. Cadastro como **ORGANIZADOR** (ex: Ana Silva / ana@email.com)

**Nota:** O tipo de perfil não é selecionável na UI, mas você pode testar alterando o `tipo_perfil` no banco:

```sql
UPDATE usuarios SET tipo_perfil = 'ORGANIZADOR' WHERE id = 2;
```

### Passo 2: Organizador cria evento

1. Login como **ORGANIZADOR** (Ana)
2. Sidebar → "Meus Eventos"
3. Clica "+ Criar Evento"
4. Preenche:
   - Título: "Aulas de Reforço Escolar"
   - Descrição: "Programa de reforço escolar para crianças"
   - Categoria: "Educação"
   - Cidade: "São Paulo"
   - Local: "Centro Comunitário da Zona Norte"
   - Data: 2025-06-15
   - Horário: 14:00
   - Vagas: 5
   - Habilidades: "Ensino", "Paciência", "Comunicação"
5. Clica "Criar evento"
6. ✅ Vê mensagem de sucesso e redireciona para "/meus-eventos"
7. ✅ Evento aparece na lista

### Passo 3: Voluntário explora e vê compatibilidade

1. Login como **VOLUNTARIO** (João)
2. Sidebar → "Explorar Eventos"
3. ✅ Vê evento criado com filtros:
   - Busca por "Reforço"
   - Filtro por "Educação"
   - Filtro por "São Paulo"
4. ✅ Vê compatibilidade% (pode ser 0% inicialmente, pois voluntário não tem habilidades/áreas_interesse preenchidas)
5. Clica "Ver Detalhes"

### Passo 4: Ver detalhes e inscrever

1. ✅ Vê todas informações do evento:
   - Descrição completa
   - Organizador (Ana Silva)
   - Habilidades desejadas
   - Compatibilidade%
   - Badge "Aberto" (vagas disponíveis)
2. Clica "Inscrever-se"
3. Modal de confirmação aparece
4. Clica "Confirmar Inscrição"
5. ✅ Mensagem: "Inscrição realizada!"
6. ✅ Botão muda para "Cancelar Inscrição"

### Passo 5: Voluntário vê inscrição em "Minhas Inscrições"

1. Sidebar → "Minhas Inscrições"
2. ✅ Vê card com:
   - Título do evento
   - Data, horário, local
   - Compatibilidade%
   - Status: **"Pendente"** (laranja)
3. Botão "Ver Evento" leva ao detalhe
4. Botão "Cancelar" (disponível apenas se pendente)

---

## 🧪 Fluxo 2: Organizador Gerencia Inscrições

### Passo 6: Organizador vê inscrições

1. Login como **ORGANIZADOR** (Ana)
2. Sidebar → "Meus Eventos"
3. ✅ Vê evento com 3 botões: "Editar", "Inscrições", "Presença"
4. Clica "Inscrições"
5. ✅ Vê página "Gerenciar Inscrições" com:
   - Contadores: X Pendentes, Y Aprovados, Z Recusados
   - Lista de voluntários com:
     - Avatar com inicial
     - Nome, email
     - Habilidades (badges)
     - Cidade
     - Compatibilidade%
     - Status atual
   - Botões: "✓ Aprovar" e "✕ Recusar"

### Passo 7: Aprovar/Recusar inscrições

1. Clica "✓ Aprovar" no voluntário João
2. ✅ Status muda para **"Aprovado"** (verde)
3. Botões desaparecem (inscrição já processada)
4. Contadores atualizam em tempo real

### Passo 8: Controle de Presença

1. Volta para "Meus Eventos"
2. Clica botão "Presença"
3. ✅ Vê página "Controle de Presença" com:
   - Contadores: Total Aprovados, Presentes, Ausentes
   - Lista apenas de aprovados
   - Checkboxes para marcar presença
4. Marca presença de João
5. ✅ Status muda para "✓ Presente" (verde)
6. Contador de "Presentes" aumenta

---

## 🧪 Fluxo 3: Editar e Cancelar Evento

### Passo 9: Editar evento

1. Login como **ORGANIZADOR**
2. "Meus Eventos" → Botão "Editar"
3. ✅ Form pré-preenchido com dados atuais
4. Altera título para "Reforço de Português"
5. Clica "Atualizar Evento"
6. ✅ Mensagem de sucesso
7. Volta para "Meus Eventos"
8. ✅ Título atualizado no card

### Passo 10: Cancelar evento

1. Clica "Editar" novamente
2. Botão "Cancelar Evento" (vermelho, no final do form)
3. Modal de confirmação: "Tem certeza?"
4. Clica "Sim, Cancelar Evento"
5. ✅ Evento deletado do banco
6. ✅ Volta para "Meus Eventos"
7. ✅ Evento não aparece mais na lista

---

## 🧪 Fluxo 4: Filtros e Busca

### Passo 11: Testar filtros em "Explorar Eventos"

1. **Crie 2-3 eventos** com categorias e cidades diferentes
2. Vá em "Explorar Eventos"
3. ✅ Todos eventos aparecem inicialmente
4. Filtro por categoria: "Educação"
   - ✅ Mostra apenas eventos dessa categoria
5. Filtro por cidade: "Rio de Janeiro"
   - ✅ Mostra apenas eventos dessa cidade
6. Busca por texto: "Reforço"
   - ✅ Filtra por título/descrição
7. Combine filtros
   - ✅ Trabalha corretamente

---

## 🧪 Fluxo 5: Compatibilidade

### Passo 12: Testar cálculo de compatibilidade

1. **Backend**: Atualize usuário voluntário com dados:

```sql
UPDATE usuarios
SET
  habilidades = ARRAY['Ensino', 'Comunicação', 'Paciência'],
  areas_interesse = ARRAY['Educação', 'Social'],
  cidade = 'São Paulo'
WHERE id = 1;
```

2. Acesse "Explorar Eventos"
3. ✅ Compatibilidade% agora é calculada:
   - Habilidades (40%): 2 de 3 combinem = ~26%
   - Localização (30%): São Paulo = 30%
   - Interesse (30%): Educação está em interesses = 30%
   - **Total: ~86%**

4. Clique "Ver Detalhes"
5. ✅ Compatibilidade% aparece grande no card lateral

---

## ⚠️ Testes de Validação

### Validação de Inscrições

```
1. Voluntário tenta se inscrever 2x no mesmo evento
   ✅ Erro: "Você já está inscrito neste evento"

2. Evento sem vagas, voluntário tenta inscrever
   ✅ Erro: "Sem vagas disponíveis"
   ✅ Botão desabilitado

3. Organizador tenta aprovar inscrição de outro organizador
   ✅ Erro: "Permissão negada"

4. Campo obrigatório em criar/editar evento vazio
   ✅ Erro: "Campo obrigatório"
```

---

## 📊 Estados Visuais a Verificar

| Elemento         | Estado   | Esperado                   |
| ---------------- | -------- | -------------------------- |
| Badge de Status  | Ativo    | Verde #2e9e6a              |
| Badge de Status  | Completo | Cinza #999                 |
| Status Inscrição | Pendente | Laranja #ff9800            |
| Status Inscrição | Aprovado | Verde #2e9e6a              |
| Status Inscrição | Recusado | Vermelho #f44336           |
| Botão Principal  | Hover    | Escurece para #257d54      |
| Compatibilidade  | Barra    | Preenche proporcionalmente |

---

## 📱 Testes de Responsividade

Teste em breakpoints:

- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1024px)
- ✅ Mobile (320px-767px)

Verificar:

- Grids viram single-column
- Cards são legíveis
- Botões são clicáveis
- Overflow de texto é tratado

---

## 🔍 Verificações Finais

- [ ] Sem erros no console
- [ ] Sem erros no terminal do backend
- [ ] Todas rotas funcionam
- [ ] Token persiste ao refresh
- [ ] Logout funciona
- [ ] Layout responsivo
- [ ] Cores seguem padrão Figma
- [ ] Compatibilidade calcula corretamente
- [ ] Inscrições salvam no banco
- [ ] Status atualiza em tempo real

---

## 🎯 Comandos Úteis

### Resetar dados de teste

```bash
# Deletar e recriar banco
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS gooddeeds; CREATE DATABASE gooddeeds;"

# Rodar migrations
npm run migrate
```

### Verificar dados no banco

```bash
psql -U postgres -d gooddeeds

# Ver usuários
SELECT id, nome, email, tipo_perfil, habilidades, cidade FROM usuarios;

# Ver eventos
SELECT id, titulo, criador_id, vagas FROM eventos;

# Ver inscrições
SELECT i.id, i.usuario_id, i.evento_id, i.status FROM inscricoes i;
```

---

## 📝 Checklist de Teste Completo

### Backend

- [ ] migrate.js cria tabelas corretamente
- [ ] Endpoints de inscrição retornam 201 (criado)
- [ ] Validações funcionam (duplicata, vagas)
- [ ] Autorização bloqueia acesso indevido
- [ ] Compatibilidade calcula corretamente

### Frontend

- [ ] Todas 8 rotas novas funcionam
- [ ] Filtros atualizam lista
- [ ] Modal de confirmação aparece
- [ ] Carregamento mostra feedback
- [ ] Erros exibem mensagens claras
- [ ] Estados vazios mostram mensagens

### UX/UI

- [ ] Cores seguem paleta do Figma
- [ ] Cards são consistentes
- [ ] Badges de status visíveis
- [ ] Ícones carregam
- [ ] Texto legível

---

✅ **Tudo implementado e pronto para testar!**
