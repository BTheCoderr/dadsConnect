-- DadConnect community safety baseline: account-owned block list and private reports.
-- Apply to the dedicated DadConnect Supabase project before enabling the controls in production.
begin;

create table public.user_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint no_self_block check (blocker_id <> blocked_id)
);
create index user_blocks_blocked_idx on public.user_blocks(blocked_id);
alter table public.user_blocks enable row level security;
revoke all on public.user_blocks from anon,authenticated;
grant select,insert,delete on public.user_blocks to authenticated;
create policy user_blocks_read_own on public.user_blocks for select to authenticated
  using (blocker_id = (select auth.uid()));
create policy user_blocks_insert_own on public.user_blocks for insert to authenticated
  with check (blocker_id = (select auth.uid()) and blocked_id <> blocker_id);
create policy user_blocks_delete_own on public.user_blocks for delete to authenticated
  using (blocker_id = (select auth.uid()));

create table public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  group_id uuid references public.dad_groups(id) on delete set null,
  message_id uuid references public.group_messages(id) on delete set null,
  reason text not null check (reason in ('harassment','spam','unsafe','other')),
  details text check (details is null or char_length(details) <= 1000),
  created_at timestamptz not null default now()
);
create index safety_reports_created_idx on public.safety_reports(created_at desc);
create index safety_reports_reporter_idx on public.safety_reports(reporter_id);
alter table public.safety_reports enable row level security;
revoke all on public.safety_reports from anon,authenticated;
grant select,insert on public.safety_reports to authenticated;
create policy safety_reports_read_own on public.safety_reports for select to authenticated
  using (reporter_id = (select auth.uid()));
create policy safety_reports_insert_own on public.safety_reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and (reported_user_id is null or reported_user_id <> reporter_id)
    and (reported_user_id is not null or group_id is not null or message_id is not null)
    and (message_id is null or exists (
      select 1 from public.group_messages gm
      where gm.id = message_id and private.is_group_member(gm.group_id)
    ))
  );

commit;
