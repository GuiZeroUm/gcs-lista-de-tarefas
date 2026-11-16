# 08 — Funcionalidades

## 1. Visão geral

**Minhas Tarefas** é uma lista de tarefas pessoal. Qualquer pessoa cria uma conta com e-mail e senha, entra e gerencia as **próprias** tarefas (criar, listar, editar, concluir e excluir). Ninguém vê as tarefas de outra pessoa.

### 1.1 Glossário

| Termo | Significado (nome no banco) |
|---|---|
| Usuário | Conta do Supabase Auth (`auth.users`) |
| Tarefa | Item da lista de um usuário (`public.tarefas`) |
| Dono | Usuário que criou a tarefa (`tarefas.usuario_id`) |
| Prioridade | `alta`, `media` ou `baixa` (`tarefas.prioridade`) |
| Concluída | Tarefa marcada como feita (`tarefas.concluida`) |

### 1.2 Perfis e permissões

| Ação | Visitante | Usuário logado (dono) | Outro usuário logado |
|---|---|---|---|
| Ver tela de login/cadastro | ✅ | ✅ (é levado para `/tarefas/`) | ✅ |
| Ver `/tarefas/` | ❌ vai para `/entrar/` | ✅ | ✅ (só as próprias) |
| Criar, editar, concluir, excluir tarefa | ❌ RLS recusa | ✅ | ❌ RLS não encontra a linha → `TAREFA_NAO_ENCONTRADA` |

### 1.3 Constantes do produto

| Constante | Valor | Onde se aplica |
|---|---|---|
| Tamanho do título | 1 a 120 caracteres (sem espaços nas pontas) | Formulário (zod) e `check` no banco |
| Tamanho da descrição | até 1000 caracteres; vazia vira `null` | Formulário (zod) e `check` no banco |
| Prioridade padrão | `media` | Formulário e `default` no banco |
| Senha no cadastro | mínimo 8 caracteres, com letras e números | zod + configuração do Supabase Auth |
| `LIMITE_DE_TAREFAS_LISTADAS` | 500 | Consulta da lista |

## 2. Integrações externas

| Serviço | Uso | Se falhar |
|---|---|---|
| Supabase Auth | Cadastro, login, sessão, logout | Mostra `FALHA_NA_AUTENTICACAO` e mantém a pessoa no formulário |
| Supabase PostgreSQL (PostgREST) | CRUD de `tarefas` | Mostra `FALHA_NO_BANCO`; a lista na tela não muda |

## 3. Telas

### 3.1 Login e cadastro — `/` e `/entrar/`

- Abas **Entrar** e **Criar conta**, com campos e-mail e senha.
- E-mail é normalizado (minúsculas, sem espaços) antes do envio.
- Login certo ou cadastro concluído → vai para `/tarefas/`.
- Se o Supabase exigir confirmação de e-mail (cadastro sem sessão), mostra o aviso "Confirme o cadastro pelo link enviado ao seu e-mail".

**Critérios de aceite**
- [ ] Senha errada mostra "E-mail ou senha incorretos." e não libera o acesso.
- [ ] E-mail inválido é barrado antes de chamar o Supabase.
- [ ] Cadastro com senha fraca mostra a regra de senha.
- [ ] E-mail já cadastrado mostra "Este e-mail já está cadastrado".
- [ ] Quem já está logado e abre `/entrar/` vai para `/tarefas/`.

### 3.2 Minhas tarefas — `/tarefas/`

- Formulário **Nova tarefa**: título, descrição (opcional) e prioridade.
- Resumo "X de Y concluídas" com barra de progresso.
- Lista ordenada: pendentes primeiro; depois prioridade (alta → baixa); depois as mais recentes.
- Cada item: caixa para concluir, título, descrição, etiqueta de prioridade, botões **Editar** (abre diálogo) e **Excluir** (pede confirmação).
- Botão **Sair** no topo.
- Lista vazia: "Nenhuma tarefa por aqui. Que tal criar a primeira?"

**Critérios de aceite**
- [ ] Sem login, a tela não mostra tarefas e leva para `/entrar/`.
- [ ] Criar salva no banco, aparece na lista e limpa o formulário.
- [ ] Título vazio não é enviado ao banco.
- [ ] Editar pelo diálogo atualiza banco e lista.
- [ ] Concluir atualiza o banco e o resumo.
- [ ] Excluir só depois de confirmar; cancelar mantém a tarefa.
- [ ] Um usuário nunca vê nem altera tarefa de outro (RLS).

## 4. Fluxos especiais

Nenhum (sem upload, pagamento ou tempo real).

## 5. Idiomas

Somente pt-BR. Textos em `src/i18n/messages/`.

## 6. Limitações conhecidas

- Sessão guardada pelo `supabase-js` no armazenamento do navegador (ver spec 00).
- Lista sem paginação (limite de 500).
- O plano grátis do Supabase pausa o projeto após 7 dias sem uso. Para reativar, use o painel do Supabase.

## 7. Decisões e mudanças

| Versão | Mudança | Origem |
|---|---|---|
| 1.0.0 | Login + CRUD de tarefas | Requisitos do enunciado |
