# 06 — Git e issues

Repositório: veja `git remote -v` (remoto `origin`).

## 1. Todo trabalho nasce de uma issue

1. Antes de codar, crie (ou encontre) a issue: `gh issue create --title "..." --body "..."`.
2. A issue descreve: **objetivo**, **critérios de aceite** (lista marcável) e **fora do escopo**.
3. Trabalho grande vira várias issues pequenas, cada uma entregável sozinha.

Projeto sem GitHub/issues: registre objetivo e critérios de aceite no plano antes de codar.

## 2. Commits

- [Conventional Commits](https://www.conventionalcommits.org/): `tipo(escopo): descrição no imperativo`.
  - Tipos: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `chore`, `build`, `ci`.
  - Escopo = feature (`auth`, `pedidos`...).
  - Descrição curta, no idioma do projeto: `feat(pedidos): lista com filtro por status`.
- O commit que conclui a issue termina com `Closes #<número>` no corpo. Intermediários usam `Refs #<número>`.
- Um commit = uma mudança coerente. Não misture refatoração com funcionalidade nova.
- Nunca commite `.env`, segredos, arquivos enviados ou gerados.

## 3. Antes de cada commit

1. `bun run check` (ou equivalente do projeto) passa: lint, tipos, testes.
2. `bun run build` passa.
3. A varredura de segurança da spec 07 foi feita quando o commit fecha uma feature.

## 4. Branches

- `main` sempre funcional.
- Trabalho em branch `tipo/numero-resumo` (ex.: `feat/12-lista-de-pedidos`) quando for revisado por PR; mudanças diretas na `main` só com autorização do dono do repositório.
- Commit e push só quando o usuário pedir ou autorizar.
