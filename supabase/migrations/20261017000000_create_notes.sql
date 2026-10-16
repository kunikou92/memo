begin;

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint notes_title_not_blank check (char_length(btrim(title)) > 0)
);

create index notes_user_id_updated_at_idx
on public.notes (user_id, updated_at desc);

create function public.set_notes_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$;

revoke execute on function public.set_notes_updated_at() from public, anon, authenticated;

create trigger notes_set_updated_at
before update on public.notes
for each row
execute function public.set_notes_updated_at();

alter table public.notes enable row level security;

revoke all on table public.notes from anon, authenticated;
grant select, insert, update, delete on table public.notes to authenticated;

create policy "Users can view their own notes"
on public.notes
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own notes"
on public.notes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own notes"
on public.notes
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own notes"
on public.notes
for delete
to authenticated
using ((select auth.uid()) = user_id);

commit;
