-- Allow Admins to view all feedback
-- Assuming you have a way to check if a user is an admin in the policy, 
-- usually via a custom claim or a lookup to the public.users table (if it has role).

-- Method 1: If you have a public users table with a role column
CREATE POLICY "Admins can view all feedback" 
ON feedbacks FOR SELECT 
TO authenticated 
USING (
  exists (
    select 1 from users 
    where users.id = auth.uid() 
    and users.role = 'ADMIN'
  )
);
