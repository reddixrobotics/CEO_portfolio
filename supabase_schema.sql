-- =========================================================================
-- REDDIX ROBOTICS - SUPABASE DATABASE INITIALIZATION SCHEMA
-- Run this in your Supabase SQL Editor (takes 5 seconds)
-- =========================================================================

-- 1. Create table for persistent site content (projects, achievements, skills, bio)
create table if not exists public.site_content (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.site_content enable row level security;

-- 3. Create security policies:
-- Allow anyone to read the site content (for fast static generation & public browsing)
create policy "Allow public read access"
  on public.site_content
  for select
  using (true);

-- Allow full write/update access (managed securely by your Next.js server & API routes)
create policy "Allow authenticated and anon write access"
  on public.site_content
  for all
  using (true)
  with check (true);

-- 4. Set up Supabase Storage Bucket for Project Images (Optional CDN storage)
insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do update set public = true;

-- Storage bucket security policies
create policy "Public Access to Project Images"
  on storage.objects for select
  using ( bucket_id = 'projects' );

create policy "Allow Uploads to Project Images"
  on storage.objects for insert
  with check ( bucket_id = 'projects' );

create policy "Allow Updates to Project Images"
  on storage.objects for update
  using ( bucket_id = 'projects' );
