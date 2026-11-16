# 02 — Arquitetura e pastas

Organização **por feature** (domínio), seguindo a recomendação oficial do Next.js de manter as rotas em `app/` finas e colocar o código de cada domínio junto ([colocation](https://nextjs.org/docs/app/getting-started/project-structure)). Apagar uma feature = apagar uma pasta.

Pastas da arquitetura ficam em **inglês**; arquivos de código e identificadores no idioma do projeto (spec 01).

## 1. Árvore

```
.
├── CLAUDE.md / AGENTS.md      instruções obrigatórias para agentes (aponta para docs/specs)
├── docs/
│   ├── specs/                 specs do projeto (fonte da verdade)
│   └── ui-reference/          referências visuais (opcional)
├── docker-compose.yml         serviços locais (ex.: PostgreSQL)
├── server.ts                  (opcional) servidor customizado: Next + WebSocket
├── prisma/
│   ├── schema.prisma          modelo do banco (fonte da verdade)
│   ├── migrations/            migrações versionadas
│   └── seed.ts                contas e dados de teste
├── public/
│   ├── images/<feature>/
│   └── sounds/<feature>/
├── storage/                   arquivos enviados no modo local (ignorado pelo git)
└── src/
    ├── proxy.ts               proxy do Next (antigo middleware)
    ├── app/                   SOMENTE rotas do Next (page, layout, loading, error, route)
    │   ├── (public)/          rotas sem login
    │   ├── (authenticated)/   rotas que exigem sessão (o layout verifica a sessão)
    │   └── api/               Route Handlers (upload, webhooks, OAuth)
    ├── features/              um diretório por domínio
    │   └── <feature>/
    │       ├── components/    componentes React da feature
    │       ├── hooks/         hooks de cliente da feature
    │       ├── rules/         regras puras, sem server-only (servidor e cliente)
    │       ├── server/        consultas e regras de negócio (só servidor)
    │       │   └── publico.ts API de servidor que outras features podem usar
    │       ├── actions.ts     Server Actions da feature
    │       ├── schemas.ts     validações zod
    │       └── types.ts       tipos de domínio
    ├── components/            UI reutilizada por 2+ features (layout, providers, ui)
    ├── lib/                   infraestrutura compartilhada (prisma, auth, erros, datas, arquivos, ambiente)
    ├── realtime/              (se houver) protocolo do WebSocket, client/ e server/
    ├── i18n/                  next-intl e messages/ com os textos
    └── theme/                 cores, tipografia e tema (único lugar com valores visuais)
```

Subpastas próprias de uma feature também ficam em inglês (`editor/tools`, `checkout/steps`).

**Exceções no idioma do projeto** (mudar quebraria algo fora do código):

- Pastas de rota que viram URL (`/pedidos`, `/configuracoes`): links já enviados continuam valendo.
- Nomes de parâmetros dinâmicos (`[pedidoId]`): viram identificadores no código (`params.pedidoId`).
- Nomes das migrações: o banco guarda o nome de cada migração aplicada.

## 2. Features (preencher no projeto)

A spec do projeto lista as features numa tabela:

| Pasta | Responsabilidade |
|---|---|
| `features/auth` | Login, cadastro, recuperação de senha, OAuth, sessão |
| `features/<dominio>` | O que esse domínio faz |

## 3. Rotas (preencher no projeto)

| URL | Tela |
|---|---|
| `/` | ... |

URLs saem de funções/constantes de endereços (`features/<x>/enderecos.ts`, `components/layout/enderecos.ts`). Nunca escreva `"/rota"` solto no componente.

## 4. Regras de dependência

- `app/` só compõe: importa de `features/`, `components/`, `lib/`. Nada de regra de negócio em `page.tsx`.
- `features/<x>/server/*` começa com `import "server-only"` e é o **único** lugar que fala com o banco (além de servidores fora do Next, como um hub de WebSocket). Regra usada nos dois lados fica em `features/<x>/rules/` (funções puras).
- Componente de cliente nunca importa de `server/`.
- Uma feature pode usar componentes, hooks e `rules/` de outra. Do `server/` de outra feature, só importa o que ela expõe em **`features/<x>/server/publico.ts`**. O resto de `server/` é interno.
- Se 2+ features precisam da mesma regra pura, ela sobe para `lib/`.
- `theme/` não importa nada do projeto. Todo o resto pode importar `theme/`.

## 5. Onde colocar algo novo

1. É uma URL? → `app/`.
2. É específico de um domínio? → `features/<domínio>/`.
3. É usado por 2+ domínios? → `components/` (UI) ou `lib/` (lógica).
4. É valor visual (cor, espaço, fonte, raio, sombra)? → `theme/`.
5. É texto exibido? → `i18n/` (nunca string solta no componente).
