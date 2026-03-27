/*
  # Remove student_id and switch to email-based login

  1. Changes
    - Drop `student_id` column from `profiles` table.
    - Update `handle_new_user` function to remove `student_id` reference.
*/

-- Update the handle_new_user function first to avoid dependency issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, class, xp, level, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'class', '10'),
    0,
    1,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );

  RETURN NEW;
END;
$$;

-- Drop the student_id column
ALTER TABLE profiles DROP COLUMN IF EXISTS student_id;
