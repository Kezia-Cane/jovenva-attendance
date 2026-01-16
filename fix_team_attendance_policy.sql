-- Enable read access for all users on attendance table
-- This allows the Team Attendance widget to display statuses for all employees
CREATE POLICY "Allow all authenticated users to view attendance"
ON "public"."attendance"
FOR SELECT
TO authenticated
USING (true);
