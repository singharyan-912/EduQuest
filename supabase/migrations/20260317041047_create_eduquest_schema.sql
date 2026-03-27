/*
  # EduQuest Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `class` (text, either '10' or '12')
      - `xp` (integer, default 0)
      - `level` (integer, default 1)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `class` (text)
      - `icon` (text)
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `chapters`
      - `id` (uuid, primary key)
      - `subject_id` (uuid, references subjects)
      - `name` (text)
      - `description` (text)
      - `order` (integer)
      - `topics` (jsonb, array of topic names)
      - `created_at` (timestamptz)
    
    - `user_subject_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `subject_id` (uuid, references subjects)
      - `chapters_completed` (integer, default 0)
      - `total_chapters` (integer, default 0)
      - `progress_percentage` (integer, default 0)
      - `updated_at` (timestamptz)
    
    - `user_chapter_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `chapter_id` (uuid, references chapters)
      - `completed` (boolean, default false)
      - `xp_earned` (integer, default 0)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  class text NOT NULL CHECK (class IN ('10', '12')),
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view all profiles for leaderboard"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class text NOT NULL CHECK (class IN ('10', '12')),
  icon text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  order_num integer NOT NULL,
  topics jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chapters"
  ON chapters FOR SELECT
  TO authenticated
  USING (true);

-- Create user_subject_progress table
CREATE TABLE IF NOT EXISTS user_subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects ON DELETE CASCADE,
  chapters_completed integer DEFAULT 0,
  total_chapters integer DEFAULT 0,
  progress_percentage integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_id)
);

ALTER TABLE user_subject_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_subject_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_subject_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_subject_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_chapter_progress table
CREATE TABLE IF NOT EXISTS user_chapter_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  chapter_id uuid REFERENCES chapters ON DELETE CASCADE,
  completed boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(user_id, chapter_id)
);

ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chapter progress"
  ON user_chapter_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chapter progress"
  ON user_chapter_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chapter progress"
  ON user_chapter_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert placeholder subjects for Class 10
INSERT INTO subjects (name, class, icon, description) VALUES
  ('Physics', '10', 'Zap', 'Master the fundamentals of Physics'),
  ('Chemistry', '10', 'Flask', 'Explore the world of Chemistry'),
  ('Biology', '10', 'Leaf', 'Discover the wonders of Biology'),
  ('Mathematics', '10', 'Calculator', 'Solve mathematical challenges')
ON CONFLICT DO NOTHING;

-- Insert placeholder subjects for Class 12
INSERT INTO subjects (name, class, icon, description) VALUES
  ('Physics', '12', 'Zap', 'Advanced Physics concepts'),
  ('Chemistry', '12', 'Flask', 'Advanced Chemistry topics'),
  ('Biology', '12', 'Leaf', 'Advanced Biology studies'),
  ('Mathematics', '12', 'Calculator', 'Advanced Mathematics')
ON CONFLICT DO NOTHING;

-- Insert placeholder chapters for Class 10 Physics
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Light - Reflection and Refraction', 'Study of light behavior', 1, '["Laws of Reflection", "Mirror Formula", "Refraction", "Lens Formula"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electricity', 'Understanding electric current and circuits', 2, '["Electric Current", "Ohm''s Law", "Resistance", "Electric Power"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Magnetic Effects of Electric Current', 'Magnetism and electromagnetism', 3, '["Magnetic Field", "Electromagnetic Induction", "Electric Motor", "Electric Generator"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10'
ON CONFLICT DO NOTHING;

-- Insert placeholder chapters for Class 10 Chemistry
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Chemical Reactions and Equations', 'Types of chemical reactions', 1, '["Chemical Equations", "Types of Reactions", "Oxidation and Reduction", "Corrosion"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Acids, Bases and Salts', 'Properties of acids and bases', 2, '["Acids", "Bases", "pH Scale", "Salts"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Metals and Non-metals', 'Properties and reactivity', 3, '["Physical Properties", "Chemical Properties", "Reactivity Series", "Extraction of Metals"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10'
ON CONFLICT DO NOTHING;

-- Insert placeholder chapters for Class 10 Biology
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Life Processes', 'Essential life functions', 1, '["Nutrition", "Respiration", "Transportation", "Excretion"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Control and Coordination', 'Nervous and hormonal systems', 2, '["Nervous System", "Hormones", "Reflex Actions", "Plant Movements"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Heredity and Evolution', 'Genetics and evolution', 3, '["Heredity", "Mendel''s Laws", "Evolution", "Speciation"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10'
ON CONFLICT DO NOTHING;

-- Insert placeholder chapters for Class 10 Mathematics
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Real Numbers', 'Number system fundamentals', 1, '["Euclid''s Division", "Fundamental Theorem", "Irrational Numbers", "Rational Numbers"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Polynomials', 'Algebraic expressions', 2, '["Polynomials", "Zeros of Polynomial", "Division Algorithm", "Factorization"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10'
ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Quadratic Equations', 'Solving quadratic equations', 3, '["Standard Form", "Solution by Factorization", "Quadratic Formula", "Nature of Roots"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10'
ON CONFLICT DO NOTHING;