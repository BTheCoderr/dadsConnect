begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon,authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
  return new;
end;
$$;

create or replace function private.is_group_member(target_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group
      and gm.user_id = auth.uid()
  );
$$;

create or replace function private.is_group_owner(target_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.dad_groups g
    where g.id = target_group
      and g.created_by = auth.uid()
  )
  or exists (
    select 1
    from public.group_members gm
    where gm.group_id = target_group
      and gm.user_id = auth.uid()
      and gm.role = 'owner'
  );
$$;

create or replace function private.can_view_group(target_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.dad_groups g
    where g.id = target_group
      and (
        g.visibility = 'public'
        or g.created_by = auth.uid()
        or exists (
          select 1
          from public.group_members gm
          where gm.group_id = g.id
            and gm.user_id = auth.uid()
        )
      )
  );
$$;

create or replace function private.can_view_meetup(target_meetup uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.meetups m
    where m.id = target_meetup
      and (m.group_id is null or private.can_view_group(m.group_id))
  );
$$;

create or replace function private.refresh_group_member_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
begin
  target := coalesce(new.group_id,old.group_id);
  update public.dad_groups
  set member_count = (
    select count(*)::integer
    from public.group_members gm
    where gm.group_id = target
  )
  where id = target;
  return coalesce(new,old);
end;
$$;

create or replace function private.refresh_meetup_attendee_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
begin
  target := coalesce(new.meetup_id,old.meetup_id);
  update public.meetups
  set current_attendees = (
    select count(*)::integer
    from public.meetup_attendees ma
    where ma.meetup_id = target
      and ma.status = 'going'
  )
  where id = target;
  return coalesce(new,old);
end;
$$;

revoke all on function private.set_updated_at() from public,anon,authenticated,service_role;
revoke all on function private.handle_new_user() from public,anon,authenticated,service_role;
revoke all on function private.refresh_group_member_count() from public,anon,authenticated,service_role;
revoke all on function private.refresh_meetup_attendee_count() from public,anon,authenticated,service_role;

revoke all on function private.is_group_member(uuid) from public,anon,authenticated,service_role;
revoke all on function private.is_group_owner(uuid) from public,anon,authenticated,service_role;
revoke all on function private.can_view_group(uuid) from public,anon,authenticated,service_role;
revoke all on function private.can_view_meetup(uuid) from public,anon,authenticated,service_role;

grant execute on function private.is_group_member(uuid) to authenticated;
grant execute on function private.is_group_owner(uuid) to authenticated;
grant execute on function private.can_view_group(uuid) to anon,authenticated;
grant execute on function private.can_view_meetup(uuid) to authenticated;

drop trigger if exists profiles_set_updated_at on public.profiles;
drop trigger if exists dad_groups_set_updated_at on public.dad_groups;
drop trigger if exists meetups_set_updated_at on public.meetups;
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists group_members_refresh_count on public.group_members;
drop trigger if exists meetup_attendees_refresh_count on public.meetup_attendees;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger dad_groups_set_updated_at
before update on public.dad_groups
for each row execute function private.set_updated_at();

create trigger meetups_set_updated_at
before update on public.meetups
for each row execute function private.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create trigger group_members_refresh_count
after insert or delete on public.group_members
for each row execute function private.refresh_group_member_count();

create trigger meetup_attendees_refresh_count
after insert or update of status or delete on public.meetup_attendees
for each row execute function private.refresh_meetup_attendee_count();

drop policy if exists profiles_insert_self on public.profiles;
drop policy if exists profiles_update_self on public.profiles;
drop policy if exists groups_read_visible on public.dad_groups;
drop policy if exists groups_create_self on public.dad_groups;
drop policy if exists groups_update_owner on public.dad_groups;
drop policy if exists groups_delete_owner on public.dad_groups;
drop policy if exists members_read_visible_group on public.group_members;
drop policy if exists members_join_public_or_owned on public.group_members;
drop policy if exists members_update_owner on public.group_members;
drop policy if exists members_leave_or_owner_remove on public.group_members;
drop policy if exists messages_read_members on public.group_messages;
drop policy if exists messages_create_member on public.group_messages;
drop policy if exists messages_update_author on public.group_messages;
drop policy if exists messages_delete_author on public.group_messages;
drop policy if exists threads_read_visible_group on public.threads;
drop policy if exists threads_create_member on public.threads;
drop policy if exists threads_update_author on public.threads;
drop policy if exists threads_delete_author on public.threads;
drop policy if exists meetups_read_visible on public.meetups;
drop policy if exists meetups_create_self on public.meetups;
drop policy if exists meetups_update_creator on public.meetups;
drop policy if exists meetups_delete_creator on public.meetups;
drop policy if exists attendees_read_visible on public.meetup_attendees;
drop policy if exists attendees_create_self on public.meetup_attendees;
drop policy if exists attendees_update_self on public.meetup_attendees;
drop policy if exists attendees_delete_self on public.meetup_attendees;
drop policy if exists saves_read_self on public.saves;
drop policy if exists saves_create_self on public.saves;
drop policy if exists saves_update_self on public.saves;
drop policy if exists saves_delete_self on public.saves;

create policy profiles_insert_self
on public.profiles for insert
to authenticated
with check (id = (select auth.uid()));

create policy profiles_update_self
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy groups_read_visible
on public.dad_groups for select
to anon,authenticated
using (
  visibility = 'public'
  or (
    (select auth.uid()) is not null
    and (created_by = (select auth.uid()) or private.is_group_member(id))
  )
);

create policy groups_create_self
on public.dad_groups for insert
to authenticated
with check (created_by = (select auth.uid()));

create policy groups_update_owner
on public.dad_groups for update
to authenticated
using (private.is_group_owner(id))
with check (created_by = (select auth.uid()));

create policy groups_delete_owner
on public.dad_groups for delete
to authenticated
using (private.is_group_owner(id));

create policy members_read_visible_group
on public.group_members for select
to authenticated
using (private.can_view_group(group_id));

create policy members_join_public_or_owned
on public.group_members for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and (
    role = 'member'
    or exists (
      select 1
      from public.dad_groups g
      where g.id = group_id
        and g.created_by = (select auth.uid())
        and role = 'owner'
    )
  )
  and exists (
    select 1
    from public.dad_groups g
    where g.id = group_id
      and (g.visibility = 'public' or g.created_by = (select auth.uid()))
  )
);

create policy members_update_owner
on public.group_members for update
to authenticated
using (private.is_group_owner(group_id))
with check (private.is_group_owner(group_id));

create policy members_leave_or_owner_remove
on public.group_members for delete
to authenticated
using (user_id = (select auth.uid()) or private.is_group_owner(group_id));

create policy messages_read_members
on public.group_messages for select
to authenticated
using (private.is_group_member(group_id));

create policy messages_create_member
on public.group_messages for insert
to authenticated
with check (author_id = (select auth.uid()) and private.is_group_member(group_id));

create policy messages_update_author
on public.group_messages for update
to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()) and private.is_group_member(group_id));

create policy messages_delete_author
on public.group_messages for delete
to authenticated
using (author_id = (select auth.uid()));

create policy threads_read_visible_group
on public.threads for select
to anon,authenticated
using (private.can_view_group(group_id));

create policy threads_create_member
on public.threads for insert
to authenticated
with check (author_id = (select auth.uid()) and private.is_group_member(group_id));

create policy threads_update_author
on public.threads for update
to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()) and private.is_group_member(group_id));

create policy threads_delete_author
on public.threads for delete
to authenticated
using (author_id = (select auth.uid()));

create policy meetups_read_visible
on public.meetups for select
to authenticated
using (group_id is null or private.can_view_group(group_id));

create policy meetups_create_self
on public.meetups for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and (
    group_id is null
    or private.is_group_member(group_id)
    or private.is_group_owner(group_id)
  )
);

create policy meetups_update_creator
on public.meetups for update
to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));

create policy meetups_delete_creator
on public.meetups for delete
to authenticated
using (created_by = (select auth.uid()));

create policy attendees_read_visible
on public.meetup_attendees for select
to authenticated
using (private.can_view_meetup(meetup_id));

create policy attendees_create_self
on public.meetup_attendees for insert
to authenticated
with check (user_id = (select auth.uid()) and private.can_view_meetup(meetup_id));

create policy attendees_update_self
on public.meetup_attendees for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and private.can_view_meetup(meetup_id));

create policy attendees_delete_self
on public.meetup_attendees for delete
to authenticated
using (user_id = (select auth.uid()));

create policy saves_read_self
on public.saves for select
to authenticated
using (user_id = (select auth.uid()));

create policy saves_create_self
on public.saves for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy saves_update_self
on public.saves for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy saves_delete_self
on public.saves for delete
to authenticated
using (user_id = (select auth.uid()));

create index if not exists content_source_idx on public.content(source_id);
create index if not exists group_messages_author_idx on public.group_messages(author_id);
create index if not exists meetups_created_by_idx on public.meetups(created_by);
create index if not exists saves_content_idx on public.saves(content_id);
create index if not exists threads_author_idx on public.threads(author_id);

drop function if exists public.set_updated_at();
drop function if exists public.handle_new_user();
drop function if exists public.is_group_member(uuid);
drop function if exists public.is_group_owner(uuid);
drop function if exists public.can_view_group(uuid);
drop function if exists public.can_view_meetup(uuid);
drop function if exists public.refresh_group_member_count();
drop function if exists public.refresh_meetup_attendee_count();

commit;
