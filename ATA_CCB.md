# Ata do Comitê de Controle de Mudanças (CCB)

**Projeto:** Minhas Tarefas — https://github.com/GuiZeroUm/gcs-lista-de-tarefas
**Composição:** Guilherme Santos de Azevedo (gerente de configuração, presidente e membro votante). O professor Juan Carlos Justinia é parte interessada consultiva, sem voto.
**Critérios de decisão:** valor para o usuário, risco para a segurança dos dados, impacto nos itens de configuração, esforço e aderência ao escopo do trabalho (lista **pessoal**, plano gratuito).

---

## Reunião 1 — 16/11/2026, 14h — antes da LB-0

**Pauta:** definição das ferramentas de GCS.

### D-00 — Plataforma de repositório, CI/CD e hospedagem

- **Pedido:** usar GitHub (repositório, Actions, Pages, Projects) no lugar de GitLab, GitLab CI e Vercel.
- **Análise de impacto:** as funções de GCS exigidas existem nas duas plataformas (Merge Request = Pull Request; `.gitlab-ci.yml` = `.github/workflows/ci-cd.yml`; Issue Board = Projects; deploy automático no Vercel = deploy pelo próprio pipeline no Pages). O Pages só serve arquivos estáticos, então o app precisa ser exportado como site estático, com autorização pelo RLS do Supabase (registrado em `docs/specs/00-projeto.md`).
- **Decisão:** **APROVADA COM CONDIÇÕES.**
- **Condições:** (1) o PGC deve mapear cada ferramenta do enunciado para a equivalente; (2) o merge na `main` deve ser bloqueado por pipeline vermelho; (3) o deploy deve ser automático a cada merge na `main`; (4) nenhuma chave no repositório.
- **Situação:** condições atendidas em `PGC.md §1`, na proteção da `main` (status `testes` e `build` obrigatórios) e em `.github/workflows/ci-cd.yml`.

---

## Reunião 2 — 16/11/2026, 16h — após a LB-1 (v1.0.0)

**Pauta:** avaliação das RFCs abertas sobre a linha de base funcional v1.0.0.

| RFC | Issue | Prioridade | Decisão | Versão-alvo |
|---|---|---|---|---|
| RFC-01 — Prazo das tarefas | [#5](https://github.com/GuiZeroUm/gcs-lista-de-tarefas/issues/5) | Alta | **Aprovada** | v1.1.0 |
| RFC-02 — Filtro por situação | [#6](https://github.com/GuiZeroUm/gcs-lista-de-tarefas/issues/6) | Média | **Condicionada** | v1.2.0 |
| RFC-03 — Exportar CSV | [#7](https://github.com/GuiZeroUm/gcs-lista-de-tarefas/issues/7) | Baixa | **Adiada** | Próximo ciclo |
| RFC-04 — Compartilhar tarefas | [#8](https://github.com/GuiZeroUm/gcs-lista-de-tarefas/issues/8) | Média | **Rejeitada** | — |

### RFC-01 — Prazo das tarefas → APROVADA

- **Justificativa:** maior valor para o usuário com risco baixo. A mudança no banco é **aditiva** (coluna `prazo` opcional), então as linhas existentes continuam válidas, o que caracteriza versão MINOR.
- **Orientações:** a comparação de "atrasada" deve usar o dia local, sem hora, e ficar numa regra pura testada. A migração entra como arquivo **novo** e é aplicada no Supabase **antes** do merge.
- **Implementação:** branch `feat/5-prazo-das-tarefas`, PR ligado à #5, gera a **v1.1.0**.

### RFC-02 — Filtro por situação → APROVADA COM CONDIÇÕES

- **Justificativa:** útil e sem impacto no banco.
- **Condições:** (1) o filtro deve rodar **no cliente**, sobre a lista já carregada, **sem nova consulta** ao Supabase a cada troca de aba (protege a cota do plano grátis); (2) a cobertura de testes não pode cair abaixo de 85%; (3) só entra depois da RFC-01, para não conflitar no mesmo componente.
- **Implementação:** branch `feat/6-filtro-por-situacao`, PR ligado à #6, gera a **v1.2.0**.

### RFC-03 — Exportar CSV → ADIADA

- **Justificativa:** prioridade baixa e risco de *CSV injection*, que exige tratamento e testes próprios. Não cabe no prazo desta entrega sem atrasar a auditoria final.
- **Encaminhamento:** fica em **Backlog** no Kanban, com o rótulo `ccb:adiada`, para reavaliação no próximo ciclo.

### RFC-04 — Compartilhar tarefas → REJEITADA

- **Justificativa:** muda o modelo de dono das tarefas, exige reescrever todas as políticas de RLS e abre risco de vazamento de dados entre usuários. Seria uma versão **MAJOR** (v2.0.0) e contraria o escopo aprovado ("lista pessoal: cada usuário vê só as suas").
- **Encaminhamento:** issue fechada como "não planejada", com o rótulo `ccb:rejeitada`.

---

## Acompanhamento

| RFC | Situação final | Evidência |
|---|---|---|
| D-00 | Condições atendidas | PGC §1, proteção da `main`, pipeline |
| RFC-01 | Implementada em v1.1.0 | PR ligado à #5, tag `v1.1.0` |
| RFC-02 | Implementada em v1.2.0, condições verificadas | PR ligado à #6, tag `v1.2.0` |
| RFC-03 | Em Backlog | Issue #7 aberta |
| RFC-04 | Fechada | Issue #8 fechada como "não planejada" |
