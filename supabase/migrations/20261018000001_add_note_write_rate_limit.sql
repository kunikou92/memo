begin;

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create table private.note_write_rate_limits (
  user_id uuid primary key references auth.users (id) on delete cascade,
  window_started_at timestamptz not null,
  write_count integer not null,
  constraint note_write_rate_limits_write_count_positive
    check (write_count > 0)
);

revoke all on table private.note_write_rate_limits
from public, anon, authenticated;

create function private.enforce_note_write_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  target_user_id uuid;
  current_window timestamptz := date_trunc('minute', statement_timestamp());
  current_write_count integer;
begin
  -- SQL Editor and service-role operations do not have an authenticated user ID.
  -- RLS continues to reject unauthenticated API writes to public.notes.
  if actor_id is null then
    if tg_op = 'DELETE' then
      return old;
    end if;

    return new;
  end if;

  if tg_op = 'DELETE' then
    target_user_id := old.user_id;
  else
    target_user_id := new.user_id;
  end if;

  if target_user_id is distinct from actor_id then
    raise exception using
      errcode = '42501',
      message = 'note owner does not match authenticated user';
  end if;

  insert into private.note_write_rate_limits as limits (
    user_id,
    window_started_at,
    write_count
  )
  values (actor_id, current_window, 1)
  on conflict (user_id) do update
  set
    window_started_at = excluded.window_started_at,
    write_count = case
      when limits.window_started_at = excluded.window_started_at
        then limits.write_count + 1
      else 1
    end
  returning write_count into current_write_count;

  if current_write_count > 30 then
    raise exception using
      errcode = 'P0001',
      message = 'note_write_rate_limit_exceeded';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke execute on function private.enforce_note_write_rate_limit()
from public, anon, authenticated;

create trigger notes_enforce_write_rate_limit
before insert or update or delete on public.notes
for each row
execute function private.enforce_note_write_rate_limit();

comment on table private.note_write_rate_limits is
  'Tracks up to 30 note writes per authenticated user per one-minute window.';

commit;
