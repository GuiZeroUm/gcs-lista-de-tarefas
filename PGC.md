# Plano de Gerência de Configuração (PGC)

**Projeto:** Minhas Tarefas — lista de tarefas pessoal com login
**Repositório:** https://github.com/GuiZeroUm/gcs-lista-de-tarefas
**Versão deste plano:** 1.0 (aprovado na linha de base LB-0)
**Formato:** trabalho individual — Guilherme Santos

## 1. Objetivo e escopo

Este plano define como os artefatos do projeto são identificados, versionados, alterados, publicados e auditados. Ele vale para todo o ciclo de vida da aplicação: do primeiro commit até a versão entregue.

**Ferramentas.** O enunciado pede GitLab, GitLab CI e Vercel. Por decisão registrada (ver [ATA_CCB.md](ATA_CCB.md), decisão D-00), usamos os equivalentes do GitHub. Todos são gratuitos e cumprem as mesmas funções de GCS:

| Função | Enunciado | Usado neste projeto |
|---|---|---|
| Repositório Git, MRs, tags | GitLab | GitHub (Pull Requests = Merge Requests) |
| Pipeline de CI/CD | GitLab CI (`.gitlab-ci.yml`) | GitHub Actions (`.github/workflows/ci-cd.yml`) |
| Hospedagem com deploy automático | Vercel | GitHub Pages (deploy pelo próprio pipeline) |
| Kanban das issues | GitLab Issue Board | GitHub Projects (quadro) |
| Banco e login | Supabase | Supabase (PostgreSQL + Auth), sem mudança |

## 2. Papéis e responsabilidades

Como o trabalho é individual, a mesma pessoa acumula os papéis, mas cada papel tem um **momento e um registro próprios**. Isso garante que nenhuma etapa seja pulada.

| Papel | Quem | Responsabilidade | Onde fica o registro |
|---|---|---|---|
| Gerente de configuração (GC) | Guilherme Santos | Mantém este PGC, cria tags e linhas de base, protege a `main`, conduz as auditorias | PGC.md, tags, releases |
| Desenvolvedor | Guilherme Santos | Implementa issues aprovadas em branches próprias | Commits e Pull Requests |
| Revisor | Guilherme Santos + pipeline | Revisa o PR pelo checklist do template. O pipeline é o revisor automático **obrigatório** (bloqueia o merge) | Checklist do PR e status do CI |
| CCB (comitê de controle de mudanças) | Guilherme Santos (presidente e único membro votante); professor como parte interessada consultiva | Avalia RFCs: aprova, condiciona, adia ou rejeita | ATA_CCB.md e rótulos `ccb:*` nas issues |

## 3. Itens de configuração (ICs)

| ID | Item | Local | Observação |
|---|---|---|---|
| IC-01 | Código-fonte da aplicação | `src/` | Next.js + TypeScript |
| IC-02 | Suíte de testes | `tests/` | Vitest: unitários, integração e autenticação |
| IC-03 | Esquema do banco (migrações) | `supabase/migrations/` | Um arquivo SQL por mudança, em ordem cronológica no nome. **Migrações aplicadas nunca são editadas**: uma mudança gera uma nova migração |
| IC-04 | Configuração de build e dependências | `package.json`, `bun.lock`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.mts` | O `bun.lock` fixa as versões exatas (build reprodutível) |
| IC-05 | Pipeline de CI/CD | `.github/workflows/ci-cd.yml` | Testes, build e deploy |
| IC-06 | Modelo de ambiente | `.env.example` | Só os nomes das variáveis, **nunca** valores |
| IC-07 | Documentação de GCS | `PGC.md`, `ATA_CCB.md`, `CHANGELOG.md` | |
| IC-08 | Documentação técnica | `README.md`, `DEPLOY.md`, `docs/ARQUITETURA.md`, `docs/specs/` | |
| IC-09 | Modelos de processo | `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md` | Padronizam RFCs e revisões |
| IC-10 | Documento final | `docs/DOCUMENTO_FINAL.pdf` | Gerado a partir de `docs/DOCUMENTO_FINAL.md` por `bun run docs:pdf` (`scripts/gerarDocumentoFinal.ts`); prints em `docs/evidencias/` |

**Não são ICs** (ficam fora do Git pelo `.gitignore`): `node_modules/`, `.next/`, `out/`, `coverage/` e qualquer `.env*` com valores reais. Relatórios gerados são publicados como **artefatos do pipeline**.

## 4. Versionamento

Usamos **versionamento semântico** `MAJOR.MINOR.PATCH`:

| Parte | Sobe quando | Exemplo neste projeto |
|---|---|---|
| MAJOR | Quebra compatibilidade (ex.: migração que apaga ou renomeia dados, mudança de login) | Mudar o modelo de dono das tarefas |
| MINOR | Funcionalidade nova compatível (nova coluna opcional, novo filtro) | v1.1.0: prazo das tarefas (RFC-01) |
| PATCH | Correção sem funcionalidade nova | Correção de validação |

- A versão vive em `package.json` e na tag Git anotada `vX.Y.Z`, criada **somente na `main`**, depois do merge e com o pipeline verde.
- Cada tag gera uma **Release** no GitHub com as notas do `CHANGELOG.md`.
- Versões `0.x` representam o período de construção, antes da primeira linha de base funcional.
- Mudanças só de documentação não mudam a versão da aplicação.

## 5. Branches e integração

- **`main`**: sempre funcional e publicada. É **protegida**: não aceita push direto, exige Pull Request e exige o status `testes` verde. Pipeline vermelho bloqueia o merge e, portanto, o deploy.
- **Branches de trabalho:** `tipo/<nº da issue>-resumo` (ex.: `feat/3-prazo-das-tarefas`), criadas a partir da `main` atualizada. Tipos: `feat`, `fix`, `docs`, `ci`, `chore`, `test`.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) em português: `feat(tarefas): adiciona prazo`. Commits intermediários levam `Refs #n`; o PR que conclui a issue leva `Closes #n`.
- **Integração:** merge commit (`Merge pull request #n`), para que o histórico mostre a integração de cada branch.
- Branches integradas são apagadas após o merge.

## 6. Controle de mudanças

1. **Solicitação:** toda mudança nasce como issue. Mudanças em uma linha de base já entregue usam o modelo **RFC** (descrição, justificativa, prioridade, análise de impacto e critérios de aceite).
2. **Kanban (GitHub Projects):** `Backlog → A fazer → Fazendo → Em revisão → Concluído`. A RFC entra em *Backlog*.
3. **Análise e decisão do CCB:** o CCB avalia impacto, risco e esforço e decide **aprovar**, **condicionar**, **adiar** ou **rejeitar**. A decisão vai para o `ATA_CCB.md` e vira o rótulo `ccb:*` na issue. Aprovadas vão para *A fazer*; adiadas ficam em *Backlog*; rejeitadas são fechadas como "não planejado".
4. **Implementação:** branch própria, card em *Fazendo*.
5. **Revisão:** PR ligado à issue (`Closes #n`), card em *Em revisão*. O merge só acontece com o checklist completo e o CI verde.
6. **Fechamento:** o merge fecha a issue e o card vai para *Concluído*. Se a mudança for relevante, gera versão, tag e deploy.

**Rótulos:** `tipo:rfc`, `tipo:feature`, `tipo:docs`, `tipo:ci`; `prioridade:alta`, `prioridade:media`, `prioridade:baixa`; `ccb:aprovada`, `ccb:condicionada`, `ccb:adiada`, `ccb:rejeitada`; `seguranca`.

## 7. Linhas de base

Uma linha de base é um conjunto de ICs revisado e aprovado, que só muda pelo controle de mudanças.

| Linha de base | Marco | Identificação | Conteúdo |
|---|---|---|---|
| LB-0 — Planejamento | PGC aprovado e pipeline configurado | tag `v0.1.0` | PGC, pipeline, estrutura do projeto |
| LB-1 — Funcional | Login + CRUD + testes no ar | tag `v1.0.0` | Requisitos mínimos do enunciado |
| LB-2 | RFC-01 implementada | tag `v1.1.0` | Prazo das tarefas |
| LB-3 — Entrega | RFC-02 implementada e auditorias FCA/PCA aprovadas | tag `v1.2.0` | Versão avaliada |

## 8. Segredos e ambientes

- **Local:** `.env.local`, ignorado pelo Git. O modelo é o `.env.example`.
- **Pipeline:** *Secrets* do GitHub Actions (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Produção:** o build do pipeline embute somente a URL e a chave **pública** do Supabase (publishable/anon), feitas para o navegador. A proteção dos dados é o *Row Level Security* do PostgreSQL. A chave secreta (`service_role`) **nunca** é usada pelo app.
- Um segredo exposto por engano é revogado no Supabase imediatamente, e o fato é registrado como RFC de segurança.

## 9. Auditorias

- **FCA (auditoria funcional):** confere se cada requisito e cada RFC aprovada tem implementação **e teste passando**. Usa o relatório de cobertura e a lista de critérios de aceite.
- **PCA (auditoria física):** confere se a versão publicada corresponde à tag (mesmo commit), se todos os ICs da seção 3 existem e se não há segredo no repositório.
- As auditorias são feitas antes de cada linha de base. A auditoria da entrega final está no `docs/DOCUMENTO_FINAL.md`.
