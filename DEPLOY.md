# DEPLOY — produção, pipeline e segredos

Este guia publica o projeto **do zero** em contas gratuitas do Supabase e do GitHub. Basta segui-lo na ordem.

## Visão geral

```
git push ──► GitHub Actions: testes ──► build ──► deploy ──► GitHub Pages (URL pública)
                                  │
                         Secrets do GitHub (URL + chave pública do Supabase)
Navegador ──► GitHub Pages (HTML/JS) ──► Supabase Auth + PostgreSQL (RLS)
```

## 1. Criar o projeto no Supabase

1. Entre em https://supabase.com/dashboard e clique em **New project**.
2. **Name:** `gcs-lista-de-tarefas`. **Region:** South America (São Paulo). Em **Database password**, use **Generate a password** e guarde a senha num gerenciador (o app não usa essa senha).
3. Em **Security**, deixe marcados *Enable Data API* e *Enable automatic RLS*.
4. Clique em **Create new project** e aguarde o status **Healthy**.

## 2. Criar o banco (migrações)

1. No projeto, abra **SQL Editor → New query**.
2. Cole e execute (**Run**), **em ordem**, cada arquivo de `supabase/migrations/`:
   - `20261116150000_criar_tabela_tarefas.sql`: tabela `tarefas`, índice, gatilho de `atualizada_em` e políticas RLS.
   - `20261116170000_adicionar_prazo_das_tarefas.sql`: coluna `prazo` (RFC-01).
3. O Supabase avisa sobre "destructive operations" por causa dos `drop ... if exists`. Os scripts são **idempotentes**: rodar duas vezes dá no mesmo resultado. Confirme em **Run query**.
4. Confira em **Table Editor → tarefas** que a tabela existe e que **RLS enabled** aparece.

> Com o Supabase CLI, o equivalente é `supabase link --project-ref <ref>` e depois `supabase db push`, porque as migrações já estão no formato do CLI.

## 3. Configurar a autenticação

Em **Authentication**:

1. **Sign In / Providers → User Signups:** desligue **Confirm email** e clique em **Save changes**. Motivo: o SMTP gratuito do Supabase só envia e-mails para membros da equipe do projeto. Sem isso, o professor não conseguiria se cadastrar.
2. **Sign In / Providers → Email:** em *Minimum password length*, ponha **8**; em *Password requirements*, escolha **Letters and digits**. Isso espelha a validação do app. Salve.
3. **URL Configuration → Site URL:** `https://<seu-usuario>.github.io/gcs-lista-de-tarefas/`. Salve.

## 4. Obter as chaves

Em **Project Settings → API Keys**:

| Variável | Onde achar | Pode ir para o navegador? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Topo da página do projeto: `https://<ref>.supabase.co` | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Publishable key** (`sb_publishable_...`) ou a *anon key* legada | Sim: é pública por design, e a proteção vem do RLS |
| Secret key / `service_role` | Mesma página | **Nunca.** O app não usa e ela não entra em lugar nenhum do projeto |

## 5. Rodar localmente (opcional)

```bash
cp .env.example .env.local
```

Preencha as duas variáveis no `.env.local`. Esse arquivo é ignorado pelo Git (`.gitignore` tem `.env*` e libera só `!.env.example`). Depois rode `bun install` e `bun run dev`.

## 6. Repositório no GitHub

1. Crie um repositório **público** (o GitHub Pages grátis exige repositório público) e envie o código.
2. **Settings → Secrets and variables → Actions → New repository secret:** crie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores do passo 4.
   Pelo terminal: `gh secret set NEXT_PUBLIC_SUPABASE_URL` (o valor é pedido de forma interativa e não fica no histórico).
3. **Settings → Pages → Build and deployment → Source:** escolha **GitHub Actions**.
4. **Settings → Branches → Add branch protection rule** para `main`:
   - *Require a pull request before merging* (aprovações: 0, pois o trabalho é individual);
   - *Require status checks to pass*: marque `testes` e `build`, e *Require branches to be up to date*;
   - *Do not allow bypassing the above settings*.

## 7. Como o pipeline funciona (`.github/workflows/ci-cd.yml`)

| Job | Quando roda | O que faz | Se falhar |
|---|---|---|---|
| `testes` | Todo push (qualquer branch), todo PR para `main` | `bun install --frozen-lockfile`, lint, checagem de tipos, testes com cobertura (falha abaixo de 85%), resumo da cobertura na página do pipeline e artefato `relatorio-de-cobertura` | PR não pode ser integrado e nada é publicado |
| `build` | Depois de `testes` passar | Confere os Secrets, roda `next build` com `BASE_PATH=/<repo>` e, na `main`, empacota a pasta `out/` | Nada é publicado |
| `deploy` | Só na `main`, depois de `build` | Publica no GitHub Pages (ambiente `github-pages`) | A versão anterior continua no ar |

**Pipeline vermelho não vai para produção:** `deploy` depende de `build`, que depende de `testes`, e a proteção da `main` impede o merge de PR com status vermelho.

**Deploy de prévia:** o GitHub Pages tem só um ambiente. A revisão de uma mudança antes da produção é feita pelo `testes` + `build` do próprio PR e pelo `bun run dev` local.

## 8. Publicar uma nova versão

1. Integre o PR na `main` (o deploy acontece sozinho).
2. Atualize `version` no `package.json` e o `CHANGELOG.md` no próprio PR.
3. Depois do merge, com o pipeline verde:

```bash
git switch main && git pull
```

```bash
git tag -a v1.2.0 -m "v1.2.0 — descrição da linha de base"
```

```bash
git push origin v1.2.0
```

```bash
gh release create v1.2.0 --verify-tag --notes-from-tag
```

## 9. Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Job `build` falha em "Conferir segredos" | Secrets não criados | Passo 6.2 |
| Tela "O app não está configurado" | Site gerado sem as variáveis | Confira os Secrets e rode o pipeline de novo (**Actions → CI/CD → Run workflow**) |
| Login dá "Não foi possível autenticar" | Projeto Supabase pausado (plano grátis pausa após 7 dias sem uso) | Painel do Supabase → **Restore project** |
| Cadastro pede confirmação de e-mail | *Confirm email* ligado | Passo 3.1 |
| Página 404 com CSS quebrado | `BASE_PATH` diferente do nome do repositório | O pipeline usa o nome do repositório automaticamente; no build local use `BASE_PATH=/<repo>` |
