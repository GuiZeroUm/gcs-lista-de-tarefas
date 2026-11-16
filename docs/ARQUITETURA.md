# Arquitetura

```mermaid
flowchart LR
    dev["Desenvolvedor<br/>(git push / Pull Request)"]
    subgraph GitHub
        repo["Repositório Git<br/>main protegida"]
        ci["GitHub Actions<br/>testes → build → deploy"]
        secrets[("Secrets<br/>NEXT_PUBLIC_SUPABASE_*")]
        pages["GitHub Pages<br/>site estático (HTML/JS)"]
        board["GitHub Projects<br/>Kanban das issues"]
    end
    subgraph Supabase["Supabase (São Paulo)"]
        auth["Auth<br/>e-mail + senha"]
        api["PostgREST<br/>API REST"]
        db[("PostgreSQL<br/>tabela tarefas + RLS")]
    end
    browser["Navegador do usuário<br/>Next.js (React) + supabase-js"]

    dev -->|push| repo
    repo -->|dispara| ci
    secrets -->|variáveis no build| ci
    ci -->|"publica (só main e pipeline verde)"| pages
    repo -. issues e PRs .- board
    browser -->|"GET páginas"| pages
    browser -->|"login / sessão (JWT)"| auth
    browser -->|"CRUD com JWT"| api
    api -->|"SQL com auth.uid()"| db
    auth --- db
```

## Como as peças conversam

1. **Desenvolvimento:** cada mudança vai para uma branch, que vira Pull Request para a `main`.
2. **Pipeline (GitHub Actions):** a cada push ou PR roda `testes` (lint, tipos, testes com cobertura) e `build`. Na `main`, se tudo passou, roda `deploy`.
3. **Publicação (GitHub Pages):** o `next build` com `output: "export"` gera HTML/JS estático na pasta `out/`. A URL e a chave pública do Supabase entram no build pelos *Secrets* do GitHub.
4. **Execução (navegador):** a página carrega o React. O `supabase-js` autentica no **Supabase Auth**, que devolve um JWT, e chama a **API REST** com esse token.
5. **Segurança dos dados:** o PostgreSQL aplica **Row Level Security**. As políticas usam `auth.uid()` do JWT, então cada pessoa só lê e altera as próprias linhas, mesmo que alguém chame a API diretamente.

## Camadas do código

```
src/app/            rotas (finas): só compõem componentes
src/features/auth/  login, cadastro, sessão, proteção de rota
src/features/tarefas/ CRUD, regras puras (ordenar, resumir), repositório Supabase
src/lib/            ambiente (zod), cliente Supabase, erros, constantes, CSP
src/components/     layout e UI compartilhada
src/i18n/           textos pt-BR
src/theme/          cores, tipografia, medidas, tema MUI
supabase/migrations/ esquema versionado do banco
tests/              unitários, integração e autenticação
```
