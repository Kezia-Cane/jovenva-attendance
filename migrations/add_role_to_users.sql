-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'EMPLOYEE' CHECK (role IN ('EMPLOYEE', 'ADMIN'));

-- Update existing users to have a default role if needed (already handled by DEFAULT, but good to be safe)
UPDATE users SET role = 'EMPLOYEE' WHERE role IS NULL;

-- Create Policy: Admins can view all users
CREATE POLICY "Admins can view all users" 
ON users FOR SELECT 
TO authenticated 
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN' 
  OR 
  auth.uid() = id
);

-- Create Policy: Admins can update any user (e.g., to change roles)
CREATE POLICY "Admins can update all users" 
ON users FOR UPDATE 
TO authenticated 
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
);

-- Create Policy: Admins can view all attendance
CREATE POLICY "Admins can view all attendance" 
ON attendance FOR SELECT 
TO authenticated 
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
  OR 
  user_id = auth.uid()
);

-- Create Policy: Admins can insert/update attendance (Overrides)
CREATE POLICY "Admins can manage attendance" 
ON attendance FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM users WHERE id = auth.uid()) = 'ADMIN'
);
