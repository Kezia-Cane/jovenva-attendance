-- Migration: Add end_date column for overnight task support
-- Run this migration to allow tasks that span overnight (e.g., 9pm to 1am next day)

-- Step 1: Drop the constraint that blocks overnight tasks
ALTER TABLE schedule_tasks DROP CONSTRAINT IF EXISTS valid_time_range;

-- Step 2: Add end_date column for tasks that span to the next day
ALTER TABLE schedule_tasks ADD COLUMN IF NOT EXISTS end_date DATE;

-- Step 3: Set default end_date to the same as date for existing records
UPDATE schedule_tasks SET end_date = date WHERE end_date IS NULL;

-- Step 4: Make end_date NOT NULL after populating existing data
ALTER TABLE schedule_tasks ALTER COLUMN end_date SET NOT NULL;

-- Step 5: Set default for new records
ALTER TABLE schedule_tasks ALTER COLUMN end_date SET DEFAULT CURRENT_DATE;

-- Step 6: Add index for date range queries
CREATE INDEX IF NOT EXISTS idx_schedule_date_range ON schedule_tasks(date, end_date);
