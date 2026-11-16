# 04 — Banco de dados e performance

Base: [arquitetura de backend do Google](https://developers.google.com/solutions/content-driven/backend/architecture?hl=pt-br) e [fundamentos de arquitetura do Google Cloud](https://docs.cloud.google.com/architecture/fundamentals?hl=pt-br). O sistema precisa escalar sem travar quando houver muitos usuários.

## 1. Consultas: toda leitura usa índice

- Toda consulta filtra por **chave primária, chave única ou coluna indexada** declarada no schema (`@id`, `@unique`, `@@index`, `@@unique`).
- Criou um filtro novo? Crie o índice no mesmo commit.
- **Proibido** `LIKE '%termo%'`, `contains`, `startsWith` sem índice adequado, `mode: "insensitive"` e qualquer busca que faça varredura completa da tabela. São O(n): com milhões de linhas, travam o banco.
  - Precisa de busca por texto? Use uma coluna normalizada e indexada (ex.: e-mail sempre minúsculo) ou índice de texto do PostgreSQL (`tsvector` + GIN), registrado na spec.
- **Proibido N+1**: nunca faça consulta dentro de laço. Use `include`/`select` com relações, `where: { id: { in: ids } }` ou uma única consulta agregada.
- Sempre `select` só as colunas usadas pela tela.
- Contagens e somas ficam no banco (`_count`, `aggregate`, `groupBy`), não em JavaScript.

## 2. Listas: sempre paginadas

- Nenhuma lista retorna "tudo". Use paginação por **cursor** (`take` + `cursor` + `orderBy` por coluna indexada). Tamanho padrão: 20.
- Ordenação sempre por coluna indexada (normalmente a mesma do filtro, em índice composto).

## 3. Escritas

- Operações que mudam mais de uma tabela ficam em transação (`prisma.$transaction`).
- Geração de código único usa a restrição `@unique` e tenta de novo em caso de colisão; não consulte antes para "ver se existe".
- Chamadas externas lentas ficam **fora** da transação.

## 4. Modelo

- IDs UUID (`@default(uuid())`). Datas em `DateTime` (UTC no banco).
- Nomes de modelos e campos no idioma do projeto, mapeados para tabelas em `snake_case` com `@@map`/`@map`.
- Enums para estados fixos.
- Exclusões em cascata declaradas no schema (`onDelete: Cascade`), nunca feitas à mão em vários passos.

## 5. Conexão

- Um único cliente do banco em `src/lib/prisma.ts` (reaproveitado no modo dev).
- Em produção serverless/contêiner, limite de conexões na URL (`connection_limit`) para não estourar o banco.

## 6. Performance da interface — meta 100 no Lighthouse

Meta: **100** em Performance, Acessibilidade, Boas práticas e SEO em todas as páginas que não dependem de câmera/microfone.

- Server Components por padrão; JavaScript de cliente só onde há interação.
- Partes pesadas (editores, players, canvas, WebRTC) carregam com `next/dynamic` só na tela que usa.
- Imagens com `next/image` (tamanho declarado, `priority` só na imagem principal visível). Ilustrações em SVG.
- Fontes com `next/font` (sem requisição externa, `display: swap`).
- Ícones importados por caminho (`@mui/icons-material/Add`), nunca o pacote inteiro.
- Nada bloqueante no `<head>`: sem scripts de terceiros, sem CSS externo.
- `loading.tsx` com esqueleto nas rotas que buscam dados (CLS = 0).
- Cache longo para estáticos e uploads imutáveis (`Cache-Control: public, max-age=31536000, immutable`).
- Acessibilidade: botão de ícone com `aria-label` traduzido; contraste mínimo AA; foco visível; `lang` do `<html>` acompanha o idioma.
- Antes de concluir uma tela: rode o Lighthouse (desktop e mobile) no build de produção.
