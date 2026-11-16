# Changelog

Todas as mudanças relevantes deste projeto. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), com [versionamento semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [1.0.0] — 2026-11-16 — Linha de base LB-1 (funcional)

### Adicionado
- Login, cadastro e logout com Supabase Auth (e-mail e senha) (#1, PR #3).
- Área protegida `/tarefas/`: só acessa quem está logado (#1, PR #3).
- CRUD de tarefas (criar, listar, editar, concluir e excluir) salvo no PostgreSQL do Supabase (#2, PR #4).
- Migração `20261116150000_criar_tabela_tarefas.sql` com Row Level Security por dono (#2, PR #4).
- Resumo "X de Y concluídas" e ordenação por situação, prioridade e data (#2, PR #4).
- Suíte de testes: unitários, integração do CRUD e fluxo de autenticação, com cobertura mínima de 85% (#1, #2, PRs #3 e #4).

## [0.1.0] — 2026-11-16 — Linha de base LB-0 (planejamento)

### Adicionado
- Estrutura do projeto Next.js com exportação estática para o GitHub Pages.
- Plano de Gerência de Configuração (`PGC.md`) e specs do projeto.
- Pipeline de CI/CD no GitHub Actions (testes, build e deploy), modelos de issue (RFC) e de Pull Request.
- `.env.example` e `.gitignore` sem segredos.
