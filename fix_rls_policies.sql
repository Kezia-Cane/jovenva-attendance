-- FIX: Restore proper RLS policies for users table
-- Run this in Supabase SQL Editor

-- Step 1: Drop the restrictive policy that was added by the role migration
-- We drop it if it exists to clean up
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Step 2: Drop the target policy if it already exists to avoid "already exists" error
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can view profiles" ON users; -- Also drop the original name just in case

-- Step 3: Create the permissive SELECT policy
-- This allows all authenticated users to view all profiles (needed for dashboard)
CREATE POLICY "Users can view all profiles"
ON users FOR SELECT
TO authenticated
USING (true);

-- Step 4: Verify policies (Optional)
-- SELECT * FROM pg_policies WHERE tablename = 'users';
