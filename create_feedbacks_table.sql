-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESOLVED'))
);

-- Enable Row Level Security
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow authenticated users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" 
ON feedbacks FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own feedback (optional, but good for history if implemented later)
CREATE POLICY "Users can view their own feedback" 
ON feedbacks FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Start Realtime (optional, if admins want to see it live)
alter publication supabase_realtime add table feedbacks;
