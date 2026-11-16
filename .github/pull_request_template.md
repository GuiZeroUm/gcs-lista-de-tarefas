## O que muda
<!-- Resumo da mudança e da issue ligada -->

Closes #

## Como foi verificado
- [ ] `bun run check` (lint, tipos e testes) passou localmente
- [ ] `bun run build` passou localmente
- [ ] Testes novos cobrem o comportamento novo

## Checklist de GCS (revisão)
- [ ] Branch segue `tipo/<issue>-resumo` e commits seguem Conventional Commits
- [ ] Nenhum segredo ou `.env` com valores no diff
- [ ] Migração nova (se houver) em `supabase/migrations/`, sem editar migração antiga
- [ ] `CHANGELOG.md` e documentação atualizados quando o comportamento mudou
- [ ] Pipeline `testes` verde
