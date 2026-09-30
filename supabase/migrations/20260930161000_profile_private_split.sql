begin;

create table public.profile_private (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  kids_ages text[] not null default '{}',
  city text,
  state text,
  city_opt_in boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.profile_private (user_id,kids_ages,city,state,city_opt_in,updated_at)
select id,kids_ages,city,state,city_opt_in,updated_at
from public.profiles
on conflict (user_id) do nothing;

alter table public.profile_private enable row level security;

create policy profile_private_read_self
on public.profile_private for select
to authenticated
using (user_id = (select auth.uid()));

create policy profile_private_insert_self
on public.profile_private for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy profile_private_update_self
on public.profile_private for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on public.profile_private from anon,authenticated;
grant select,insert,update on public.profile_private to authenticated;

create trigger profile_private_set_updated_at
before update on public.profile_private
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id,name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'name',''),
      nullif(new.raw_user_meta_data ->> 'full_name',''),
      nullif(split_part(coalesce(new.email,''),'@',1),''),
      'Dad'
    )
  )
  on conflict (id) do nothing;

  insert into public.profile_private (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function private.capture_legacy_profile_private()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.kids_ages is distinct from old.kids_ages
     or new.city is distinct from old.city
     or new.state is distinct from old.state
     or new.city_opt_in is distinct from old.city_opt_in then

    insert into public.profile_private (user_id,kids_ages,city,state,city_opt_in)
    values (
      new.id,
      coalesce(new.kids_ages,'{}'::text[]),
      new.city,
      new.state,
      coalesce(new.city_opt_in,false)
    )
    on conflict (user_id) do update set
      kids_ages = excluded.kids_ages,
      city = excluded.city,
      state = excluded.state,
      city_opt_in = excluded.city_opt_in,
      updated_at = now();

    new.kids_ages = '{}'::text[];
    new.city = null;
    new.state = null;
    new.city_opt_in = false;
  end if;

  return new;
end;
$$;

revoke all on function private.capture_legacy_profile_private() from public,anon,authenticated,service_role;

create trigger profiles_capture_legacy_private
before update of kids_ages,city,state,city_opt_in on public.profiles
for each row execute function private.capture_legacy_profile_private();

update public.profiles
set kids_ages='{}'::text[],
    city=null,
    state=null,
    city_opt_in=false
where cardinality(kids_ages) > 0
   or city is not null
   or state is not null
   or city_opt_in = true;

drop policy if exists profiles_insert_self on public.profiles;
revoke insert on public.profiles from authenticated;

commit;
