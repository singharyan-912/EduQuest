-- Add student-specific auth fields to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS student_id text UNIQUE,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'student';

-- Ensure class constraint remains valid
ALTER TABLE profiles
ALTER COLUMN class SET NOT NULL;

