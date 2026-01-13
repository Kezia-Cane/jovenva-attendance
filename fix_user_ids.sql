-- DIAGNOSTIC AND FIX SCRIPT

-- 1. See if there is a mismatch (Same Email, Different ID)
SELECT 
    au.email, 
    au.id AS auth_id, 
    pu.id AS public_id,
    CASE WHEN au.id = pu.id THEN 'MATCH' ELSE 'MISMATCH' END AS status
FROM auth.users au
JOIN public.users pu ON au.email = pu.email;

-- 2. If you see 'MISMATCH' above, run the following to fix it:
--    WARNING: This deletes the public profile so it can be recreated correctly.
--    Attendance records linked to the WRONG ID will also be deleted (cascade).

DELETE FROM public.users
WHERE id IN (
    SELECT pu.id
    FROM auth.users au
    JOIN public.users pu ON au.email = pu.email
    WHERE au.id != pu.id
);

-- 3. Re-sync the correct IDs from Auth
INSERT INTO public.users (id, email, name, avatar_url)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', email), 
    COALESCE(raw_user_meta_data->>'avatar_url', '')
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email; -- Updates email just in case

-- 4. Verify again (Should all be MATCH now)
SELECT count(*) as total_synced_users FROM public.users;
