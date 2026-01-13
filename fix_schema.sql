-- Fix missing column
alter table public.users 
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- Force Schema Cache Reload (This fixes the "schema cache" error)
NOTIFY pgrst, 'reload config';
