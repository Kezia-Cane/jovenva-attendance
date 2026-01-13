-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.attendance enable row level security;

-- USERS TABLE POLICIES
-- 1. Allow users to insert their OWN profile (Crucial for the fix)
create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- 2. Allow users to update their OWN profile
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- 3. Allow users to view profiles
create policy "Users can view profiles"
  on public.users for select
  using (true);

-- ATTENDANCE TABLE POLICIES
-- 4. Allow users to view their own attendance
create policy "Users can view own attendance"
  on public.attendance for select
  using (auth.uid() = user_id);

-- 5. Allow users to insert their own attendance
create policy "Users can insert own attendance"
  on public.attendance for insert
  with check (auth.uid() = user_id);

-- 6. Allow users to update their own attendance (for check-out)
create policy "Users can update own attendance"
  on public.attendance for update
  using (auth.uid() = user_id);
