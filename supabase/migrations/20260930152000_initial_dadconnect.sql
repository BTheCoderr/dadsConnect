begin;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  city text,
  state text,
  city_opt_in boolean not null default false,
  bio text,
  interests text[] not null default '{}',
  kids_ages text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dad_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  description text,
  category text not null,
  topics text[] not null default '{}',
  city text,
  state text,
  visibility text not null default 'public' check (visibility in ('public','private')),
  member_count integer not null default 0 check (member_count >= 0),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.dad_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','moderator','member')),
  joined_at timestamptz not null default now(),
  primary key (group_id,user_id)
);

create table public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.dad_groups(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 4000),
  message_type text not null default 'text' check (message_type in ('text','system')),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.threads (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.dad_groups(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  body text not null check (char_length(btrim(body)) between 1 and 10000),
  ts timestamptz not null default now(),
  reactions jsonb not null default '{}'::jsonb
);

create table public.meetups (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.dad_groups(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 2 and 120),
  description text,
  activity_type text not null,
  location text,
  address text,
  city text,
  state text,
  start_time timestamptz not null,
  end_time timestamptz,
  max_attendees integer check (max_attendees is null or max_attendees > 0),
  current_attendees integer not null default 0 check (current_attendees >= 0),
  status text not null default 'upcoming' check (status in ('upcoming','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time is null or end_time > start_time)
);

create table public.meetup_attendees (
  meetup_id uuid not null references public.meetups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'going' check (status in ('going','maybe','not_going')),
  joined_at timestamptz not null default now(),
  primary key (meetup_id,user_id)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  url text,
  created_at timestamptz not null default now()
);

create table public.content (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  url text not null unique,
  title text not null,
  image text,
  topics text[] not null default '{}',
  read_time integer not null default 5 check (read_time between 1 and 120),
  published_at timestamptz not null default now(),
  excerpt text,
  created_at timestamptz not null default now()
);

create table public.saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content_id uuid not null references public.content(id) on delete cascade,
  note text,
  ts timestamptz not null default now(),
  read_status text not null default 'unread' check (read_status in ('unread','read')),
  unique (user_id,content_id)
);

create index dad_groups_created_by_idx on public.dad_groups(created_by);
create index dad_groups_visibility_idx on public.dad_groups(visibility);
create index dad_groups_location_idx on public.dad_groups(state,city);
create index group_members_user_idx on public.group_members(user_id);
create index group_messages_group_created_idx on public.group_messages(group_id,created_at);
create index threads_group_ts_idx on public.threads(group_id,ts desc);
create index meetups_group_idx on public.meetups(group_id);
create index meetups_start_status_idx on public.meetups(status,start_time);
create index meetup_attendees_user_idx on public.meetup_attendees(user_id);
create index content_published_idx on public.content(published_at desc);
create index saves_user_ts_idx on public.saves(user_id,ts desc);

create or replace function public.set_updated_at()
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

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger dad_groups_set_updated_at
before update on public.dad_groups
for each row execute function public.set_updated_at();

create trigger meetups_set_updated_at
before update on public.meetups
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
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

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_group_member(target_group uuid)
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

create or replace function public.is_group_owner(target_group uuid)
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

create or replace function public.can_view_group(target_group uuid)
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

create or replace function public.can_view_meetup(target_meetup uuid)
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
      and (
        m.group_id is null
        or public.can_view_group(m.group_id)
      )
  );
$$;

create or replace function public.refresh_group_member_count()
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

create trigger group_members_refresh_count
after insert or delete on public.group_members
for each row execute function public.refresh_group_member_count();

create or replace function public.refresh_meetup_attendee_count()
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

create trigger meetup_attendees_refresh_count
after insert or update of status or delete on public.meetup_attendees
for each row execute function public.refresh_meetup_attendee_count();

alter table public.profiles enable row level security;
alter table public.dad_groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;
alter table public.threads enable row level security;
alter table public.meetups enable row level security;
alter table public.meetup_attendees enable row level security;
alter table public.sources enable row level security;
alter table public.content enable row level security;
alter table public.saves enable row level security;

create policy profiles_read_authenticated
on public.profiles for select
to authenticated
using (true);

create policy profiles_insert_self
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy profiles_update_self
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy groups_read_visible
on public.dad_groups for select
to anon,authenticated
using (
  visibility = 'public'
  or (auth.uid() is not null and (created_by = auth.uid() or public.is_group_member(id)))
);

create policy groups_create_self
on public.dad_groups for insert
to authenticated
with check (created_by = auth.uid());

create policy groups_update_owner
on public.dad_groups for update
to authenticated
using (public.is_group_owner(id))
with check (created_by = auth.uid());

create policy groups_delete_owner
on public.dad_groups for delete
to authenticated
using (public.is_group_owner(id));

create policy members_read_visible_group
on public.group_members for select
to authenticated
using (public.can_view_group(group_id));

create policy members_join_public_or_owned
on public.group_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    role = 'member'
    or exists (
      select 1 from public.dad_groups g
      where g.id = group_id
        and g.created_by = auth.uid()
        and role = 'owner'
    )
  )
  and exists (
    select 1 from public.dad_groups g
    where g.id = group_id
      and (g.visibility = 'public' or g.created_by = auth.uid())
  )
);

create policy members_update_owner
on public.group_members for update
to authenticated
using (public.is_group_owner(group_id))
with check (public.is_group_owner(group_id));

create policy members_leave_or_owner_remove
on public.group_members for delete
to authenticated
using (user_id = auth.uid() or public.is_group_owner(group_id));

create policy messages_read_members
on public.group_messages for select
to authenticated
using (public.is_group_member(group_id));

create policy messages_create_member
on public.group_messages for insert
to authenticated
with check (author_id = auth.uid() and public.is_group_member(group_id));

create policy messages_update_author
on public.group_messages for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid() and public.is_group_member(group_id));

create policy messages_delete_author
on public.group_messages for delete
to authenticated
using (author_id = auth.uid());

create policy threads_read_visible_group
on public.threads for select
to anon,authenticated
using (public.can_view_group(group_id));

create policy threads_create_member
on public.threads for insert
to authenticated
with check (author_id = auth.uid() and public.is_group_member(group_id));

create policy threads_update_author
on public.threads for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid() and public.is_group_member(group_id));

create policy threads_delete_author
on public.threads for delete
to authenticated
using (author_id = auth.uid());

create policy meetups_read_visible
on public.meetups for select
to authenticated
using (group_id is null or public.can_view_group(group_id));

create policy meetups_create_self
on public.meetups for insert
to authenticated
with check (
  created_by = auth.uid()
  and (
    group_id is null
    or public.is_group_member(group_id)
    or public.is_group_owner(group_id)
  )
);

create policy meetups_update_creator
on public.meetups for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy meetups_delete_creator
on public.meetups for delete
to authenticated
using (created_by = auth.uid());

create policy attendees_read_visible
on public.meetup_attendees for select
to authenticated
using (public.can_view_meetup(meetup_id));

create policy attendees_create_self
on public.meetup_attendees for insert
to authenticated
with check (user_id = auth.uid() and public.can_view_meetup(meetup_id));

create policy attendees_update_self
on public.meetup_attendees for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and public.can_view_meetup(meetup_id));

create policy attendees_delete_self
on public.meetup_attendees for delete
to authenticated
using (user_id = auth.uid());

create policy sources_read_all
on public.sources for select
to anon,authenticated
using (true);

create policy content_read_all
on public.content for select
to anon,authenticated
using (true);

create policy saves_read_self
on public.saves for select
to authenticated
using (user_id = auth.uid());

create policy saves_create_self
on public.saves for insert
to authenticated
with check (user_id = auth.uid());

create policy saves_update_self
on public.saves for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy saves_delete_self
on public.saves for delete
to authenticated
using (user_id = auth.uid());

revoke all on public.profiles,public.dad_groups,public.group_members,public.group_messages,public.threads,public.meetups,public.meetup_attendees,public.sources,public.content,public.saves from anon,authenticated;

grant select on public.dad_groups,public.threads,public.sources,public.content to anon;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.dad_groups,public.group_members,public.group_messages,public.threads,public.meetups,public.meetup_attendees,public.saves to authenticated;
grant select on public.sources,public.content to authenticated;

revoke all on function public.is_group_member(uuid) from public;
revoke all on function public.is_group_owner(uuid) from public;
revoke all on function public.can_view_group(uuid) from public;
revoke all on function public.can_view_meetup(uuid) from public;
grant execute on function public.is_group_member(uuid) to authenticated;
grant execute on function public.is_group_owner(uuid) to authenticated;
grant execute on function public.can_view_group(uuid) to anon,authenticated;
grant execute on function public.can_view_meetup(uuid) to authenticated;

alter publication supabase_realtime add table public.group_messages;

commit;
