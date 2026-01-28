-- SQL Script to Backfill 'SYSTEM_MAINTENANCE' status for Jan 26 & 27
-- Run this in the Supabase SQL Editor

-- 1. Update the Check Constraint on 'status' column
-- First, drop the old constraint (name might vary, so we try standard names or rely on the ADD to fail if strict)
-- Note: Supabase/Postgres names constraints automatically if not specified. 
-- Usually 'attendance_status_check'.
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;

-- Add the new constraint including 'SYSTEM_MAINTENANCE' and 'EXTRA_WORKOUT'
ALTER TABLE attendance 
ADD CONSTRAINT attendance_status_check 
CHECK (status IN ('PRESENT', 'ABSENT', 'EXTRA_WORKOUT', 'SYSTEM_MAINTENANCE'));

-- 2. Backfill for Sunday, Jan 26, 2025
-- We insert a record for every user who doesn't have one, or update if they do.
INSERT INTO attendance (user_id, date, status, check_in_time, check_out_time)
SELECT 
    id as user_id, 
    '2025-01-26' as date, 
    'SYSTEM_MAINTENANCE' as status,
    NULL as check_in_time,
    NULL as check_out_time
FROM users
ON CONFLICT (user_id, date) 
DO UPDATE SET 
    status = 'SYSTEM_MAINTENANCE',
    check_in_time = NULL,
    check_out_time = NULL;

-- 3. Backfill for Monday, Jan 27, 2025
INSERT INTO attendance (user_id, date, status, check_in_time, check_out_time)
SELECT 
    id as user_id, 
    '2025-01-27' as date, 
    'SYSTEM_MAINTENANCE' as status,
    NULL as check_in_time,
    NULL as check_out_time
FROM users
ON CONFLICT (user_id, date) 
DO UPDATE SET 
    status = 'SYSTEM_MAINTENANCE',
    check_in_time = NULL,
    check_out_time = NULL;

-- 4. Verify results
-- SELECT * FROM attendance WHERE status = 'SYSTEM_MAINTENANCE';
