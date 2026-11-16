<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regras do projeto

Leia antes de mudar qualquer coisa:

1. [`docs/specs/00-projeto.md`](docs/specs/00-projeto.md): decisões e desvios deste projeto (prevalece sobre as specs genéricas).
2. [`docs/specs/08-funcionalidades.md`](docs/specs/08-funcionalidades.md): comportamento do produto (fonte da verdade).
3. As demais specs em `docs/specs/` (regras de código, arquitetura, git, segurança).
4. [`PGC.md`](PGC.md): branches, versões, controle de mudanças e linhas de base.

Comandos: `bun run dev`, `bun run check` (lint + tipos + testes), `bun run test:coverage`, `bun run build`.
