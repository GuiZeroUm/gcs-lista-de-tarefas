-- Tabela de tarefas pessoais: cada linha pertence a um usuário do Supabase Auth.
create table if not exists public.tarefas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null check (char_length(btrim(titulo)) between 1 and 120),
  descricao text check (descricao is null or char_length(descricao) <= 1000),
  prioridade text not null default 'media' check (prioridade in ('alta', 'media', 'baixa')),
  concluida boolean not null default false,
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);

create index if not exists tarefas_usuario_id_criada_em_idx
  on public.tarefas (usuario_id, criada_em desc);

create or replace function public.registrar_atualizacao_da_tarefa()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizada_em := now();
  return new;
end;
$$;

drop trigger if exists tarefas_registrar_atualizacao on public.tarefas;
create trigger tarefas_registrar_atualizacao
  before update on public.tarefas
  for each row execute function public.registrar_atualizacao_da_tarefa();

-- Row Level Security: o banco garante que cada usuário só enxerga e altera as próprias tarefas.
alter table public.tarefas enable row level security;

drop policy if exists "dono lê as próprias tarefas" on public.tarefas;
create policy "dono lê as próprias tarefas" on public.tarefas
  for select to authenticated using ((select auth.uid()) = usuario_id);

drop policy if exists "dono cria as próprias tarefas" on public.tarefas;
create policy "dono cria as próprias tarefas" on public.tarefas
  for insert to authenticated with check ((select auth.uid()) = usuario_id);

drop policy if exists "dono altera as próprias tarefas" on public.tarefas;
create policy "dono altera as próprias tarefas" on public.tarefas
  for update to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

drop policy if exists "dono exclui as próprias tarefas" on public.tarefas;
create policy "dono exclui as próprias tarefas" on public.tarefas
  for delete to authenticated using ((select auth.uid()) = usuario_id);

revoke all on public.tarefas from anon;
grant select, insert, update, delete on public.tarefas to authenticated;
