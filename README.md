# Minhas Tarefas — GCS na prática

[![CI/CD](https://github.com/GuiZeroUm/gcs-lista-de-tarefas/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/GuiZeroUm/gcs-lista-de-tarefas/actions/workflows/ci-cd.yml)

Lista de tarefas pessoal com login, feita para o trabalho prático de **Gerência de Configuração de Software**. A aplicação é simples de propósito: o foco está no versionamento, no controle de mudanças, nos testes e no pipeline de CI/CD.

| | |
|---|---|
| **App no ar** | https://guizeroum.github.io/gcs-lista-de-tarefas/ |
| **Repositório** | https://github.com/GuiZeroUm/gcs-lista-de-tarefas |
| **Kanban das issues** | https://github.com/users/GuiZeroUm/projects (projeto "GCS — Minhas Tarefas") |
| **Pipeline** | https://github.com/GuiZeroUm/gcs-lista-de-tarefas/actions |
| **Documento final** | [docs/DOCUMENTO_FINAL.pdf](docs/DOCUMENTO_FINAL.pdf) |

> **Para testar:** abra a URL, clique em **Criar conta**, informe qualquer e-mail e uma senha com 8+ caracteres, letras e números. Não é preciso confirmar o e-mail. Cada conta vê somente as próprias tarefas.

## O que a aplicação faz

- Cadastro, login e logout com **Supabase Auth** (e-mail e senha).
- Área protegida `/tarefas/`: sem login, a pessoa é levada para a tela de entrada.
- **CRUD de tarefas** (criar, listar, editar, concluir e excluir) com título, descrição e prioridade, guardado no **PostgreSQL do Supabase**.
- Isolamento por usuário garantido no banco por **Row Level Security**.
- Tema claro, escuro ou automático.

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | Next.js 16 (App Router, exportação estática) + React 19 + MUI 9 + Tailwind 4 |
| Linguagem | TypeScript (strict) + zod para validar entradas |
| Banco e login | Supabase (PostgreSQL + Auth) via `@supabase/supabase-js` |
| Testes | Vitest + Testing Library + jsdom, cobertura v8 |
| Pacotes | Bun 1.4 |
| Repositório e CI/CD | GitHub + GitHub Actions |
| Hospedagem | GitHub Pages |

Por que GitHub e não GitLab/Vercel: ver [PGC.md §1](PGC.md#1-objetivo-e-escopo) e a decisão D-00 em [ATA_CCB.md](ATA_CCB.md).

## Como rodar localmente

Pré-requisitos: [Bun](https://bun.sh) 1.4+ e um projeto no Supabase (veja [DEPLOY.md](DEPLOY.md), passos 1 a 3).

```bash
git clone https://github.com/GuiZeroUm/gcs-lista-de-tarefas.git
```

```bash
cd gcs-lista-de-tarefas && bun install
```

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com a URL e a chave pública (publishable/anon) do **seu** projeto Supabase. Depois:

```bash
bun run dev
```

O app abre em http://localhost:3210.

## Como testar

| Comando | O que faz |
|---|---|
| `bun run test` | Roda toda a suíte (unitários, integração e autenticação) |
| `bun run test:coverage` | Roda com cobertura (relatório em `coverage/index.html`); falha abaixo de 85% de linhas |
| `bun run lint` | ESLint |
| `bun run typecheck` | Tipos do TypeScript |
| `bun run check` | Lint + tipos + testes (o mesmo que o pipeline exige) |
| `bun run build` | Gera o site estático em `out/` |

Os testes não precisam do Supabase real: usam um **Supabase simulado em memória** (`tests/support/supabaseFalso.ts`) que imita a API e o Row Level Security.

```
tests/
  unit/          regras puras, validações, ambiente, erros, layout
  integration/   CRUD pelo repositório e pela tela (criar, listar, editar, concluir, excluir)
  auth/          bloqueio sem login, liberação após login, formulário, logout
```

## Estrutura

```
src/app/                rotas (/, /entrar, /tarefas)
src/features/auth/      autenticação
src/features/tarefas/   CRUD, regras e repositório
src/lib/                ambiente, Supabase, erros, constantes
supabase/migrations/    esquema do banco versionado
tests/                  suíte de testes
docs/                   arquitetura, specs, documento final
.github/workflows/      pipeline de CI/CD
```

## Documentação de GCS

- [PGC.md](PGC.md): Plano de Gerência de Configuração
- [ATA_CCB.md](ATA_CCB.md): decisões do comitê de mudanças
- [CHANGELOG.md](CHANGELOG.md): histórico de versões
- [DEPLOY.md](DEPLOY.md): produção, pipeline e segredos
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md): diagrama de arquitetura
- [docs/DOCUMENTO_FINAL.pdf](docs/DOCUMENTO_FINAL.pdf): documento de entrega
