# 00 — Decisões deste projeto

Esta spec **prevalece** sobre as specs genéricas de 01 a 12 quando há conflito. Ela registra o motivo de cada desvio, como pede a spec 03.

## 1. Restrições que vêm do enunciado

O trabalho exige **Supabase Auth + PostgreSQL do Supabase** e uma URL pública gratuita. A pedido do aluno, a hospedagem é o **GitHub Pages**, que só serve arquivos estáticos. Daí saem os desvios abaixo.

| Spec genérica | Neste projeto | Motivo |
|---|---|---|
| Server Components leem dados; Server Actions escrevem | Componentes de cliente chamam o Supabase pelo `supabase-js` | O GitHub Pages não executa servidor. O `next build` gera HTML estático (`output: "export"`) |
| Prisma como único acesso ao banco | `supabase-js` (API REST do PostgREST), acessado só por `features/<x>/repositorioDe*.ts` e `features/auth/services/` | Não existe servidor para rodar o Prisma. Um único módulo por feature fala com o banco, mantendo o princípio |
| Better Auth, sessão em cookie `httpOnly` | Supabase Auth, sessão gerida pelo `supabase-js` no armazenamento do navegador | Exigência do enunciado; sem servidor não há cookie `httpOnly`. Mitigação: CSP restritiva por `<meta>` (`src/lib/politicaDeSeguranca.ts`), nenhum HTML vindo do usuário e RLS no banco |
| Autorização em `server/permissoes.ts` | **Row Level Security** no PostgreSQL (`supabase/migrations`) | O banco é o único ponto confiável quando o cliente é público. Cada política compara `auth.uid()` com `usuario_id` |
| `bun test` | **Vitest** (rodado pelo Bun) + Testing Library + jsdom | Testes de componentes React com DOM e relatório de cobertura v8; é a ferramenta sugerida no enunciado |
| next-intl | Textos em `src/i18n/messages/*.ts` lidos por `textos` | Um só idioma (pt-BR) e site estático; o next-intl sem servidor exige prefixo de idioma na URL. A regra "nenhum texto solto no componente" continua valendo |
| Listas paginadas por cursor (20) | Lista única limitada a `LIMITE_DE_TAREFAS_LISTADAS` (500) e ordenada por índice `(usuario_id, criada_em desc)` | Lista pessoal pequena. Paginação fica registrada como melhoria futura |
| Cabeçalhos de segurança no `next.config.ts` | CSP e Referrer-Policy via `<meta>` no `layout.tsx`. `X-Frame-Options` e `frame-ancestors` não são possíveis | O GitHub Pages não permite cabeçalhos HTTP próprios |
| Porta fixa | `3210` (`bun run dev`) | |

## 2. Features

| Pasta | Responsabilidade |
|---|---|
| `features/auth` | Entrar, criar conta, sair, observar a sessão, proteger rotas |
| `features/tarefas` | CRUD das tarefas do usuário logado, regras de ordenação e resumo |

## 3. Rotas

| URL | Tela | Acesso |
|---|---|---|
| `/` | Login/cadastro (leva para `/tarefas/` se já logado) | Público |
| `/entrar/` | Login/cadastro | Público |
| `/tarefas/` | Lista e CRUD de tarefas | Só logado (`ProtecaoDeRota`) |

Endereços em `src/components/layout/enderecos.ts`. Em produção, o `basePath` é `/gcs-lista-de-tarefas` (variável `BASE_PATH` no build).

## 4. Identidade visual

- Paleta em `src/theme/cores.ts` (claro e escuro), com contraste AA para texto sobre fundo e superfície.
- Fonte do sistema (sem download, sem bloqueio de renderização).
- Raios: cartões 12px, botões 10px; alvo de toque mínimo de 44px.
- Tema **Claro / Escuro / Automático** no seletor do topo (MUI `colorSchemes`, atributo `data-*` no `<html>`).
- Ícones `@mui/icons-material` importados por caminho.

## 5. Contratos compartilhados (spec 12)

| Import | Contrato |
|---|---|
| `@/lib/ambiente` | `obterAmbiente()` valida as variáveis `NEXT_PUBLIC_SUPABASE_*` com zod. Único leitor de `process.env` no app |
| `@/lib/supabase` | `obterClienteSupabase()`: cliente único (singleton) |
| `@/lib/erros` | `ErroDeNegocio`, `falhar(codigo)`, `traduzirErro(erro)`; códigos em `textos.comum.erros` |
| `@/lib/constantes` | `LIMITE_DE_TAREFAS_LISTADAS` |
| `@/components/layout/enderecos` | `ENDERECOS` |
| `@/components/layout/EstruturaDaPagina` | Topo com nome do app, seletor de tema e ações |
| `@/components/ui/IndicadorDeCarregamento` | Spinner acessível |
| `@/components/ui/DialogoDeConfirmacao` | Props: `estaAberto`, `titulo`, `detalhe`, `rotuloDaConfirmacao`, `aoConfirmar`, `aoCancelar` |
| `@/features/auth/components/ProtecaoDeRota` | Envolve páginas que exigem login |
| `@/i18n/textos` | `textos.comum`, `textos.auth`, `textos.tarefas` |
| `@/theme/*` | `CORES`, `TIPOGRAFIA`, `MEDIDAS`, `temaMui` |
