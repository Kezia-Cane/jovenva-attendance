-- Schedule Tasks Table
CREATE TABLE IF NOT EXISTS schedule_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED')),
  priority VARCHAR(20) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule_tasks(date);
CREATE INDEX IF NOT EXISTS idx_schedule_assigned_user ON schedule_tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_user_date ON schedule_tasks(assigned_to_user_id, date);
CREATE INDEX IF NOT EXISTS idx_schedule_status ON schedule_tasks(status);

-- Enable Row Level Security
ALTER TABLE schedule_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view tasks assigned to them or created by them
CREATE POLICY "Users can view their own tasks" ON schedule_tasks
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = assigned_to_user_id);

-- Policy: Users can insert tasks (for themselves or others - currently allowing all authenticated users)
CREATE POLICY "Users can create tasks" ON schedule_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update tasks created by them or assigned to them
CREATE POLICY "Users can update their own tasks" ON schedule_tasks
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = assigned_to_user_id);

-- Policy: Only creators can delete tasks
CREATE POLICY "Creators can delete their tasks" ON schedule_tasks
  FOR DELETE
  USING (auth.uid() = user_id);
