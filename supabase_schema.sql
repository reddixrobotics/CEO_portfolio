-- =========================================================================
-- REDDIX ROBOTICS - SUPABASE DATABASE INITIALIZATION SCHEMA
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/epcwggltiksvwghlxjzf/sql/new
-- =========================================================================

-- 1. Create table for persistent site content (projects, achievements, skills, bio)
create table if not exists public.site_content (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Disable RLS on site_content so writes from Next.js server/API are never blocked
alter table public.site_content disable row level security;

-- 3. Set up Supabase Storage Bucket for Project Images (Public CDN)
insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do update set public = true;

-- Drop previous storage policies if they exist, then recreate cleanly
drop policy if exists "Public Access to Project Images" on storage.objects;
drop policy if exists "Allow Uploads to Project Images" on storage.objects;
drop policy if exists "Allow Updates to Project Images" on storage.objects;

create policy "Public Access to Project Images"
  on storage.objects for select
  using ( bucket_id = 'projects' );

create policy "Allow Uploads to Project Images"
  on storage.objects for insert
  with check ( bucket_id = 'projects' );

create policy "Allow Updates to Project Images"
  on storage.objects for update
  using ( bucket_id = 'projects' );
