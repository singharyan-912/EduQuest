-- Create a trigger to automatically create a profile row when a new auth user is created.
-- This avoids client-side profile inserts failing due to RLS / missing session (e.g. when email confirmation is enabled).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
 -- Remove 'student_id' from the columns and the values
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

