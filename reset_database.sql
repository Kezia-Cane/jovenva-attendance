-- WARNING: THIS WILL RESET YOUR PUBLIC TABLES
-- It cleans up the mess and ensures everything is linked correctly.

-- 1. Drop existing tables to start fresh
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Recreate Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Recreate Attendance Table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'ABSENT' CHECK (status IN ('PRESENT', 'ABSENT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, date)
);

-- 4. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Simple and Permissive for owners)
CREATE POLICY "Users can manage their own profile" ON public.users
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own attendance" ON public.attendance
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Backfill YOUR user immediately
INSERT INTO public.users (id, email, name, avatar_url)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email), 
  COALESCE(raw_user_meta_data->>'avatar_url', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
