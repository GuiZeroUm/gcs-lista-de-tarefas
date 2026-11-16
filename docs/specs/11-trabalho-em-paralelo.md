# 11 — Trabalho em paralelo (vários agentes)

Regras para quando mais de um agente trabalha no repositório ao mesmo tempo. Um agente é o **coordenador**; os demais são **agentes de feature**.

## 1. Cada agente fica na sua pasta

- Um agente por feature. Ele só cria ou altera arquivos de `src/features/<feature>/`, das rotas dela em `src/app/`, dos textos dela em `src/i18n/messages/<feature>` e de `public/images/<feature>/`.
- Arquivos compartilhados (`src/lib/`, `src/components/`, `src/theme/`, `src/realtime/`, schema do banco, `package.json`, `next.config.ts`, `server.ts`) **não** são alterados por agentes de feature. Precisa mudar algo neles? Descreva no relatório final; o coordenador aplica.
- Exceção só se combinada no pedido do agente (ex.: o agente de layout é dono de `src/components/layout/`).

## 2. Banco de dados

- O schema é do coordenador. Precisa de campo, índice ou modelo novo? Peça no relatório, com o motivo e a consulta que vai usar.
- Agente de feature não roda migração (`prisma migrate`, `db push`).

## 3. Servidor de desenvolvimento

- Se já existe um rodando, não suba outro. Para testar no navegador, abra uma aba nova e use só ela.
- Contas de teste: veja o seed do projeto.

## 4. Dependências

- Agente de feature não instala pacotes. Consulte a spec 10; se a biblioteca não estiver lá, peça no relatório.

## 5. Git

- Agentes de feature **não** fazem commit. O coordenador revisa e faz um commit por issue.

## 6. Relatório final do agente

1. O que foi feito (arquivos criados/alterados).
2. Critérios de aceite da spec 08 atendidos e os que faltaram.
3. Mudanças pedidas em arquivos compartilhados, schema ou dependências.
4. Resultado de lint e typecheck nos arquivos da feature.
5. Varredura de segurança (spec 07) da feature, em tabela.
