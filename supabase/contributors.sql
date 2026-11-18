create table public.contributors (
  id text primary key,
  nickname text not null check(length(nickname) between 1 and 40),
  created_at timestamptz not null default now()
);
alter table public.contributors enable row level security;
grant select, insert, update on public.contributors to service_role;
alter table public.animals add column contributor_id text references public.contributors(id);
alter table public.events add column contributor_id text references public.contributors(id);
create index events_contributor_idx on public.events(contributor_id);
create index animals_contributor_idx on public.animals(contributor_id);
