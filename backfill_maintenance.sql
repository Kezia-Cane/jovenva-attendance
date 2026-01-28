-- SQL Script to Backfill 'SYSTEM_MAINTENANCE' status for Jan 26 & 27, 2026
-- Run this in the Supabase SQL Editor

-- 1. Update the Check Constraint on 'status' column (if not already done)
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;

ALTER TABLE attendance 
ADD CONSTRAINT attendance_status_check 
CHECK (status IN ('PRESENT', 'ABSENT', 'EXTRA_WORKOUT', 'SYSTEM_MAINTENANCE'));

-- 2. Backfill for Monday, Jan 26, 2026
INSERT INTO attendance (user_id, date, status, check_in_time, check_out_time)
SELECT 
    id as user_id, 
    '2026-01-26' as date, 
    'SYSTEM_MAINTENANCE' as status,
    NULL as check_in_time,
    NULL as check_out_time
FROM users
ON CONFLICT (user_id, date) 
DO UPDATE SET 
    status = 'SYSTEM_MAINTENANCE',
    check_in_time = NULL,
    check_out_time = NULL;

-- 3. Backfill for Tuesday, Jan 27, 2026
INSERT INTO attendance (user_id, date, status, check_in_time, check_out_time)
SELECT 
    id as user_id, 
    '2026-01-27' as date, 
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
-- SELECT * FROM attendance WHERE status = 'SYSTEM_MAINTENANCE' AND date >= '2026-01-01';
