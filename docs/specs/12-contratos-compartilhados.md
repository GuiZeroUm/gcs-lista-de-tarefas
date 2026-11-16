# 12 — Contratos compartilhados (modelo)

A spec 12 do projeto lista **o que já existe e deve ser usado** (não recrie). Antes de escrever um utilitário, procure aqui e em `src/lib/` / `src/components/`. Faltou algo? Peça ao coordenador (spec 11) ou crie no lugar compartilhado e acrescente a esta lista no mesmo commit.

## Contratos que todo projeto da stack padrão deve ter

| Import | Contrato |
|---|---|
| `@/lib/ambiente` | `ambiente` validado com zod na inicialização, `eProducao`. Único leitor de `process.env` |
| `@/lib/prisma` | `prisma`, único cliente do banco |
| `@/lib/erros` | `ErroDeNegocio`, `falhar("CODIGO")`, `CODIGOS_DE_ERRO`. A interface mostra a tradução do código |
| `@/lib/acoes` | `executarAcao(async () => ...)` → `ResultadoDaAcao<T>` = `{ ok: true, dados }` ou `{ ok: false, erro }`. **Toda** Server Action retorna isso |
| `@/lib/auth/sessao` | `obterUsuarioLogado()`, `exigirUsuarioNaPagina()` (redireciona ao login), `exigirUsuarioNaAcao()` (lança `ErroDeNegocio`), tipo `UsuarioLogado` |
| `@/lib/auth/servidor` / `cliente` | Instância do Better Auth no servidor e cliente mínimo no navegador |
| `@/lib/constantes` | Constantes do produto (spec 08) |
| `@/lib/datas` | `dayjs` configurado (utc, timezone, locales) + helpers de data |
| `@/lib/arquivos` | Gerar chave, salvar, abrir e apagar arquivo (disco local agora, storage de objetos depois) |
| `@/components/layout/enderecos` | Endereços das páginas principais. Nunca escreva URL solta |
| `@/components/ui/*` | Componentes de UI compartilhados (listar cada um com suas props) |
| `@/theme/*` | Cores, tipografia e medidas (spec 05) |
| `src/i18n/messages/<feature>` | Textos por namespace; `comum` com botões genéricos e todos os `comum.erros.*` |

## Como documentar no projeto

Para cada contrato: import, funções/props expostas, regra de uso ("confira a permissão **antes** de chamar"). Agrupe por área (Sessão, Rotas e layout, Dados e ações, Textos, Visual, Tempo real, API de servidor de cada feature via `features/<x>/server/publico.ts`).
