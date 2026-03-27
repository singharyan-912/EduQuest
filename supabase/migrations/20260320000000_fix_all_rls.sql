-- NUCLEAR RLS FIX (Run this if the previous one didn't work)
-- This removes all row-level restrictions for authenticated users
-- to ensure the game can definitely save and load.

-- 1. Drop all existing policies for these tables
DO $$ 
DECLARE pol record;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('questions', 'user_chapter_progress', 'profiles')) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 2. Open up access to all authenticated users (no more auth.uid matching for now)
CREATE POLICY "Full access to authenticated" ON user_chapter_progress FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public read for questions" ON questions FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Public read for profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 3. Ensure the column exists
ALTER TABLE user_chapter_progress ADD COLUMN IF NOT EXISTS game_progress JSONB DEFAULT '{}'::jsonb;
