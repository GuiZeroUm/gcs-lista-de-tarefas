# 03 — Stack e comandos

Stack **padrão** para projetos web novos. Projeto existente: vale a stack dele (leia `package.json` e a spec do projeto). Trocar uma peça exige motivo registrado.

## 1. Tecnologias

| Camada | Escolha | Observação |
|---|---|---|
| Runtime e pacotes | **Bun** | `bun install`, `bun run`, `bun test`. Não misture npm, pnpm ou yarn |
| Framework | **Next.js** (App Router) + **React** | Server Components por padrão |
| Componentes | **MUI** (`@mui/material`) | Botões, campos, modais, menus, tabelas, abas |
| Utilitários CSS | **Tailwind CSS** | Layout e espaçamento (flex, grid, gap, margens) |
| ORM | **Prisma** | Único acesso ao banco |
| Banco | **PostgreSQL** | Docker no local; gerenciado na nuvem (ex.: Cloud SQL) |
| Validação | **zod** | Toda entrada externa |
| Autenticação | **Better Auth** (sessão no banco, cookie `httpOnly` assinado) | Nunca token em `localStorage`. Núcleo em `src/lib/auth/` |
| Traduções | **next-intl** (sem prefixo na URL, idioma em cookie) | Textos por feature em `src/i18n/messages/` |
| Estado de cliente complexo | **zustand** | Só quando Context/props não bastam (muitos eventos por segundo) |
| Datas | **dayjs** | Formatação com o idioma atual |
| Hospedagem alvo | Contêiner (ex.: Cloud Run) + banco gerenciado + storage de objetos | Código local usa disco; trocar pelo storage em `lib/arquivos` |

Não adicione dependência nova sem necessidade real. Antes, verifique se Next, MUI, Bun ou a plataforma já resolvem (spec 10).

## 2. Next.js recente — leia a documentação local

Versões novas do Next mudam APIs que modelos de IA costumam conhecer errado. **Antes de usar uma API do Next, leia o guia em `node_modules/next/dist/docs/`** (quando existir) ou a doc oficial da versão instalada. Pontos do Next 16:

- `params` e `searchParams` são **Promises** (`const { id } = await params`). Tipos `PageProps<"/rota/[id]">` e `LayoutProps<"/">` vêm de `next typegen`.
- `middleware.ts` agora se chama **`proxy.ts`**.
- `cacheComponents`: ligue só se a maioria das páginas não depender de cookie/sessão; senão exige `<Suspense>` em toda leitura de cookie.
- Com servidor customizado no Bun: pacotes como `pg`, `@prisma/client` e `@prisma/adapter-pg` podem precisar de `transpilePackages` ("Failed to load external module" com alias `pkg-<hash>`).
- Não use `experimental.optimizePackageImports` com `@mui/icons-material` (loop de rebuild no Turbopack). Importe ícones por caminho.
- Arquivos importados por um `server.ts` fora do bundle do Next **não** podem importar `"server-only"`.

## 3. Comandos

Nomes de scripts em **inglês**, no padrão do ecossistema, com prefixo `db:` para o banco.

| Comando | O que faz |
|---|---|
| `bun install` | Instala dependências (e gera o cliente do Prisma no `postinstall`) |
| `bun run dev` | Sobe o banco, aplica migrações, gera o cliente e abre o app |
| `bun run build` / `start` | Build e execução de produção |
| `bun run db:up` | Sobe o PostgreSQL no Docker (`docker compose up -d --wait`) |
| `bun run db:deploy` | Aplica migrações pendentes (`prisma migrate deploy`) |
| `bun run db:migrate` | Cria e aplica migração nova (`prisma migrate dev`) |
| `bun run db:generate` | Gera o cliente do Prisma |
| `bun run db:seed` | Cria dados de teste |
| `bun run lint` | ESLint |
| `bun run typecheck` | `next typegen` + `tsc` |
| `bun run test` | `bun test` |
| `bun run check` | Lint + tipos + testes |

## 4. Variáveis de ambiente

- Ficam em `.env` (ignorado pelo git). O modelo com todas as chaves é `.env.example`.
- O acesso passa por **um único arquivo** (`src/lib/ambiente.ts`) que valida tudo com zod na inicialização. Nunca leia `process.env` direto em outro lugar.
- Segredo de sessão com no mínimo 32 caracteres. Nada sensível em `NEXT_PUBLIC_*`.
- Atrás de proxy/balanceador: configure quantos proxies são confiáveis antes de usar `X-Forwarded-For` para limite de tentativas.

## 5. Porta

Escolha uma porta fixa por projeto e documente na spec (evite 3000 se outro projeto já usa). Se houver WebSocket, sirva na mesma porta do app.
