-- Production-readiness hardening applied to DadConnect on 2026-10-01.

alter table public.meetups
  add constraint meetups_public_address_must_be_null
  check (address is null);

create or replace function private.enforce_meetup_capacity()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  meetup_status text;
  capacity integer;
  attendee_count integer;
begin
  if new.status <> 'going' then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.status = 'going' then
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(new.meetup_id::text));

  select m.status,m.max_attendees,m.current_attendees
    into meetup_status,capacity,attendee_count
  from public.meetups m
  where m.id = new.meetup_id;

  if meetup_status is null or meetup_status <> 'upcoming' then
    raise exception 'This meetup is not accepting RSVPs';
  end if;

  if capacity is not null and attendee_count >= capacity then
    raise exception 'This meetup is full';
  end if;

  return new;
end;
$$;

create trigger meetup_attendees_enforce_capacity
before insert or update of status on public.meetup_attendees
for each row execute function private.enforce_meetup_capacity();

create policy attendees_visibility_guard
on public.meetup_attendees
as restrictive
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.meetups m
    where m.id = meetup_id
      and (
        m.created_by = auth.uid()
        or (m.group_id is not null and private.is_group_member(m.group_id))
      )
  )
);

create policy meetups_update_integrity_guard
on public.meetups
as restrictive
for update
to authenticated
using (created_by = auth.uid())
with check (
  created_by = auth.uid()
  and address is null
  and (
    group_id is null
    or private.is_group_member(group_id)
    or private.is_group_owner(group_id)
  )
  and current_attendees = (
    select count(*)::integer
    from public.meetup_attendees ma
    where ma.meetup_id = id
      and ma.status = 'going'
  )
);
