-- RPC to check Student ID uniqueness (usable before authentication)

CREATE OR REPLACE FUNCTION public.is_student_id_available(p_student_id text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE student_id = p_student_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_student_id_available(text) TO anon, authenticated;

