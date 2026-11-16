# 01 — Regras de código

## 1. Simples primeiro

- A meta é sempre a solução **mais simples** que resolve o problema. Se dá para simplificar, simplifique.
- Não crie abstração "para o futuro" sem um segundo uso real ou previsto na spec de funcionalidades (08).
- Prefira código direto e legível a código "esperto".
- **Antes de criar algo do zero, pesquise na internet se já existe biblioteca madura que resolva** (critérios em [10-bibliotecas.md](10-bibliotecas.md)). Só construa do zero quando nenhuma opção atende aos critérios, e registre o motivo na spec 10 do projeto.

## 2. Nomes que se explicam

- Se ao bater o olho o nome não diz o que a coisa é ou faz, o nome está errado.
- Funções começam com **verbo**: `listarPedidosDoUsuario`, `criarReserva`, `formatarHorarioDoEvento`.
- Booleanos começam com `e`/`tem`/`pode`/`deve`: `eDono`, `temAnexo`, `podeEditar`, `deveMostrarAviso`.
- Componentes React são substantivos em PascalCase: `CartaoDoPedido`, `ModalDeConfirmacao`.
- Hooks começam com `use`: `usePedidoAtual`, `useCarrinho`.
- Proibido: abreviações (`usr`, `cfg`, `btn`, `idx`), nomes genéricos (`data`, `info`, `item`, `handle`, `temp`, `x`) e letras soltas fora de laços curtíssimos.
- Constantes globais em `MAIUSCULAS_COM_UNDERLINE`: `MINUTOS_DE_TOLERANCIA`.

## 3. Idioma do código

Padrão (o projeto pode trocar na própria spec):

- Variáveis, funções, componentes, tipos, enums, arquivos de código, chaves de tradução e mensagens: **português**.
- Exceções: APIs de biblioteca/framework (`useState`, `page.tsx`, `route.ts`, `layout.tsx`, `GET`, `POST`), nomes de pastas da arquitetura (inglês, ver spec 02) e termos técnicos sem tradução usual (`token`, `WebSocket`, `cookie`, `upload`).
- Nomes de arquivos de código seguem o principal export: `CartaoDoPedido.tsx`, `listarPedidos.ts`.
- Projeto existente em outro idioma: siga o idioma dele. Não misture.

## 4. Funções pequenas, sem god functions

- Uma função faz **uma** coisa. Se o nome precisa de "e" (`validarESalvarEEnviar`), divida.
- Referência: até ~25 linhas por função e até ~150 linhas por arquivo. Passou disso, procure o que extrair.
- No máximo 3 parâmetros posicionais; acima disso use um objeto nomeado.
- Evite aninhamento profundo: use retorno antecipado (`if (!pedido) return null`).
- Viu lógica repetida (ou que claramente vai se repetir)? Extraia para uma função reutilizável no lugar certo (spec 02).
- Componentes React: um componente por arquivo; passou de ~120 linhas, divida em subcomponentes.

## 5. Comentários

- O código deve se explicar sozinho. **Evite comentários.**
- Só comente o **porquê** de algo não óbvio (regra de negócio, contorno de bug de navegador). Nunca o **o quê**.
- Proibido: código comentado, comentários de seção (`// ---- helpers ----`), JSDoc repetindo o nome da função.

## 6. TypeScript

- `strict` sempre ligado. Proibido `any` (use `unknown` + validação). Proibido `// @ts-ignore`.
- Toda entrada externa (formulário, corpo de requisição, mensagem de WebSocket, resposta de API de terceiros) é validada com **zod** no limite do sistema.
- Tipos de domínio ficam em `types.ts` da feature. Tipos do banco vêm do ORM; não duplique.

## 7. React e Next.js

- **Server Components por padrão.** Use `"use client"` só quando precisar de estado, efeito, evento ou API do navegador, e o mais "embaixo" possível na árvore.
- Leituras de dados: no servidor, chamando as funções de `features/<x>/server/`.
- Escritas: **Server Actions** (`features/<x>/actions.ts`) que validam a entrada com zod e checam permissão.
- Route Handlers (`app/api/**/route.ts`) só para o que Server Action não resolve: upload/download de arquivo, streaming, webhooks, callback OAuth.
- Sem `useEffect` para buscar dados que o servidor pode entregar.

## 8. Erros

- Erros de regra de negócio usam uma classe própria (ex.: `ErroDeNegocio` em `src/lib/erros.ts`) com um código conhecido; a interface traduz o código.
- Nunca engula erro em silêncio. Se o erro é esperado e ignorável (ex.: serviço externo fora do ar), registre no log com contexto.

## 9. Testes

- Regras de negócio puras (`features/<x>/rules/*`, utilitários de `src/lib/`) têm teste (`bun test` no padrão da stack).
- Nome do teste descreve o comportamento em português: `test("cliente só cancela até 24 horas antes", ...)`.
