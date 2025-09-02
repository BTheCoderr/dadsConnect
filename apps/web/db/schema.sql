-- DadConnect SQL schema - Focused on Dad Community
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  city text,
  state text,
  bio text,
  interests text[] not null default '{}',
  kids_ages text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Dad Groups for different interests and support
create table if not exists dad_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('support', 'activities', 'sports', 'local', 'interests')),
  topics text[] not null default '{}',
  city text,
  state text,
  visibility text not null default 'public' check (visibility in ('public','private')),
  member_count int not null default 0,
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  group_id uuid not null references dad_groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member','mod','owner')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- Group chat messages for real-time communication
create table if not exists group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references dad_groups(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'link', 'event')),
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_group_messages_group on group_messages(group_id, created_at desc);

-- Dad meetups and activities
create table if not exists meetups (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references dad_groups(id) on delete cascade,
  created_by uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  activity_type text not null check (activity_type in ('watch_party', 'outdoor', 'sports', 'coffee', 'playdate', 'other')),
  location text,
  address text,
  city text,
  state text,
  start_time timestamptz not null,
  end_time timestamptz,
  max_attendees int,
  current_attendees int not null default 0,
  status text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists idx_meetups_start_time on meetups(start_time desc);

create table if not exists meetup_attendees (
  meetup_id uuid not null references meetups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'going' check (status in ('going', 'maybe', 'not_going')),
  joined_at timestamptz not null default now(),
  primary key (meetup_id, user_id)
);

-- RLS (Row Level Security)
alter table profiles enable row level security;
alter table dad_groups enable row level security;
alter table group_members enable row level security;
alter table group_messages enable row level security;
alter table meetups enable row level security;
alter table meetup_attendees enable row level security;

-- Policies
create policy "read_own_profile" on profiles for select using (auth.uid() = id);
create policy "update_own_profile" on profiles for update using (auth.uid() = id);
create policy "insert_own_profile" on profiles for insert with check (auth.uid() = id);
create policy "read_public_profiles" on profiles for select using (true);

create policy "read_public_groups" on dad_groups for select using (visibility = 'public');
create policy "read_private_groups" on dad_groups for select using (
  visibility = 'private' and id in (
    select group_id from group_members where user_id = auth.uid()
  )
);
create policy "create_groups" on dad_groups for insert with check (auth.uid() = created_by);

create policy "read_group_members" on group_members for select using (true);
create policy "join_group" on group_members for insert with check (auth.uid() = user_id);
create policy "leave_group" on group_members for delete using (auth.uid() = user_id);

create policy "read_group_messages" on group_messages for select using (
  group_id in (
    select group_id from group_members where user_id = auth.uid()
  )
);
create policy "send_group_messages" on group_messages for insert with check (
  auth.uid() = author_id and 
  group_id in (
    select group_id from group_members where user_id = auth.uid()
  )
);

create policy "read_meetups" on meetups for select using (true);
create policy "create_meetups" on meetups for insert with check (auth.uid() = created_by);
create policy "update_own_meetups" on meetups for update using (auth.uid() = created_by);

create policy "read_meetup_attendees" on meetup_attendees for select using (true);
create policy "join_meetup" on meetup_attendees for insert with check (auth.uid() = user_id);
create policy "update_meetup_attendance" on meetup_attendees for update using (auth.uid() = user_id);
create policy "leave_meetup" on meetup_attendees for delete using (auth.uid() = user_id);


