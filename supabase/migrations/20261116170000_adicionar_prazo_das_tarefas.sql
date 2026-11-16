-- RFC-01 (issue #5): prazo opcional das tarefas. Mudança aditiva: linhas antigas ficam com prazo nulo.
alter table public.tarefas add column if not exists prazo date;
