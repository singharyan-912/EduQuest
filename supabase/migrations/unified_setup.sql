-- ==========================================
-- EDUQUEST UNIFIED MASTER SETUP
-- Run this ONCE to set up your entire database!
-- ==========================================

-- 1. CREATE CORE TABLES
------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  class text NOT NULL CHECK (class IN ('10', '12')),
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class text NOT NULL CHECK (class IN ('10', '12')),
  icon text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, class)
);

CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  order_num integer NOT NULL,
  topics jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS user_chapter_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  chapter_id uuid REFERENCES chapters ON DELETE CASCADE,
  completed boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(user_id, chapter_id)
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;

-- 3. CREATE POLICIES
------------------------------------------
DO $$ BEGIN
  -- Profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
  END IF;

  -- Subjects & Chapters (Public reading for authenticated users)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view subjects') THEN
    CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view chapters') THEN
    CREATE POLICY "Anyone can view chapters" ON chapters FOR SELECT TO authenticated USING (true);
  END IF;

  -- User Progress
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own progress') THEN
    CREATE POLICY "Users can view own progress" ON user_subject_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own progress') THEN
    CREATE POLICY "Users can update own progress" ON user_subject_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own progress') THEN
    CREATE POLICY "Users can insert own progress" ON user_subject_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own chapter progress') THEN
    CREATE POLICY "Users can view own chapter progress" ON user_chapter_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own chapter progress') THEN
    CREATE POLICY "Users can update own chapter progress" ON user_chapter_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own chapter progress') THEN
    CREATE POLICY "Users can insert own chapter progress" ON user_chapter_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4. CLEANUP & INSERT NCERT CONTENT
------------------------------------------
DELETE FROM public.chapters;
DELETE FROM public.subjects;

-- Insert Subjects
INSERT INTO subjects (name, class, icon, description) VALUES
  ('Physics', '10', 'Zap', 'Master the fundamentals of Physics'),
  ('Chemistry', '10', 'Flask', 'Explore the world of Chemistry'),
  ('Biology', '10', 'Leaf', 'Discover the wonders of Biology'),
  ('Mathematics', '10', 'Calculator', 'Solve mathematical challenges'),
  ('Physics', '12', 'Zap', 'Advanced Physics concepts'),
  ('Chemistry', '12', 'Flask', 'Advanced Chemistry topics'),
  ('Biology', '12', 'Leaf', 'Advanced Biology studies'),
  ('Mathematics', '12', 'Calculator', 'Advanced Mathematics');

-- Insert Class 10 Physics
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Light – Reflection and Refraction', 'Fundamental principles of light', 1, '["Laws of Reflection", "Mirror Formula", "Refraction", "Lens Formula"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'The Human Eye and the Colourful World', 'Optical properties', 2, '["Defects of Vision", "Atmospheric Refraction", "Scattering of Light"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electricity', 'Concepts of current and resistance', 3, '["Ohm''s Law", "Resistance", "Heating Effect", "Electric Power"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Magnetic Effects of Electric Current', 'Electromagnetism basics', 4, '["Magnetic Field", "Solenoid", "Fleming''s Rules"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '10';

-- Insert Class 10 Chemistry
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Chemical Reactions and Equations', 'Types of chemical reactions', 1, '["Balanced Equations", "Decomposition", "Oxidation"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Acids, Bases and Salts', 'Properties and pH', 2, '["pH Scale", "Common Salt", "Plaster of Paris"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Metals and Non-metals', 'Elemental properties', 3, '["Reactivity Series", "Ionic Compounds", "Corrosion"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Carbon and its Compounds', 'Organic chemistry', 4, '["Functional Groups", "Soaps and Detergents"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '10';

-- Insert Class 10 Biology
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Life Processes', 'Essential biological functions', 1, '["Nutrition", "Respiration", "Excretion"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Control and Coordination', 'Nervous and endocrine systems', 2, '["Human Brain", "Plant Hormones"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'How do Organisms Reproduce?', 'Reproduction methods', 3, '["Asexual Reproduction", "Human Reproduction"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Heredity', 'Genetics basics', 4, '["Inherited Traits", "Sex Determination"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Our Environment', 'Ecology introduction', 5, '["Ecosystem", "Ozone Layer"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '10';

-- Insert Class 10 Maths
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Real Numbers', 'Number theory', 1, '["Fundamental Theorem", "Irrational Numbers"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Polynomials', 'Algebra basics', 2, '["Zeros of Polynomial", "Coefficients"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Linear Equations in Two Variables', 'System of equations', 3, '["Substitution", "Elimination"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Quadratic Equations', 'Second degree equations', 4, '["Quadratic Formula", "Roots"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Arithmetic Progressions', 'Numerical sequences', 5, '["nth Term", "Sum of n Terms"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Triangles', 'Geometry', 6, '["Similarity Criteria", "Thales Theorem"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Coordinate Geometry', 'Graphs', 7, '["Distance Formula", "Section Formula"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Introduction to Trigonometry', 'Trig ratios', 8, '["Trig Ratios", "Identities"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Some Applications of Trigonometry', 'Heights and distances', 9, '["Angle of Elevation"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Circles', 'Circle geometry', 10, '["Tangent to Circle"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Areas Related to Circles', 'Mensuration', 11, '["Area of Sector"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Surface Areas and Volumes', '3D math', 12, '["Combination of Solids"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Statistics', 'Data analysis', 13, '["Mean", "Median", "Mode"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Probability', 'Chance', 14, '["Theoretical Probability"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '10';

-- Insert Class 12 Physics (Full)
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electric Charges and Fields', 'Electrostatics 1', 1, '["Coulomb Law", "Gauss Law"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electrostatic Potential and Capacitance', 'Electrostatics 2', 2, '["Capacitance", "Potential"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Current Electricity', 'Circuits', 3, '["Ohm Law", "Kirchhoff Rules"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Moving Charges and Magnetism', 'Magnetism 1', 4, '["Lorentz Force", "Ampere Law"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Magnetism and Matter', 'Magnetism 2', 5, '["Earth Magnetism"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electromagnetic Induction', 'Induction', 6, '["Faraday Law", "Lenz Law"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Alternating Current', 'AC', 7, '["LCR Circuit", "Transformer"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electromagnetic Waves', 'Waves', 8, '["EM Spectrum"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Ray Optics and Optical Instruments', 'Optics 1', 9, '["Lens Maker Formula", "Telescope"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Wave Optics', 'Optics 2', 10, '["Interference", "Diffraction"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Dual Nature of Radiation and Matter', 'Quantum', 11, '["Photoelectric Effect"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Atoms', 'Structure', 12, '["Bohr Model"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Nuclei', 'Nuclear', 13, '["Fission", "Fusion"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Semiconductor Electronics', 'Electronics', 14, '["p-n Junction", "Logic Gates"]'::jsonb FROM subjects WHERE name = 'Physics' AND class = '12';

-- Insert Class 12 Chemistry (Full)
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Solutions', 'Physical', 1, '["Raoult Law", "Colligative Prop"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electrochemistry', 'Physical', 2, '["Nernst Eq", "Fuel Cells"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Chemical Kinetics', 'Physical', 3, '["Rate Constant", "Activation Energy"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'The d-and f-Block Elements', 'Inorganic', 4, '["Lanthanoids"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Coordination Compounds', 'Inorganic', 5, '["CFT", "Isomerism"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Haloalkanes and Haloarenes', 'Organic', 6, '["SN1/SN2 Mechanism"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Alcohols, Phenols and Ethers', 'Organic', 7, '["Kolbe Reaction"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Aldehydes, Ketones and Carboxylic Acids', 'Organic', 8, '["Aldol Condensation"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Amines', 'Organic', 9, '["Basicity of Amines"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biomolecules', 'Life', 10, '["Proteins", "DNA"]'::jsonb FROM subjects WHERE name = 'Chemistry' AND class = '12';

-- Insert Class 12 Biology (Full)
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Sexual Reproduction in Flowering Plants', 'Biology', 1, '["Pollination"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Human Reproduction', 'Biology', 2, '["Fertilization"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Reproductive Health', 'Biology', 3, '["Birth Control"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Principles of Inheritance and Variation', 'Genetics', 4, '["Mendelian Laws"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Molecular Basis of Inheritance', 'Genetics', 5, '["DNA Replication"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Evolution', 'Biology', 6, '["Natural Selection"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Human Health and Disease', 'Biology', 7, '["Immunity"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Microbes in Human Welfare', 'Biology', 8, '["Sewage Treatment"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biotechnology: Principles and Processes', 'Biotech', 9, '["PCR"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biotechnology and its Applications', 'Biotech', 10, '["Insulin"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Organisms and Populations', 'Ecology', 11, '["Population Growth"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Ecosystem', 'Ecology', 12, '["Energy Flow"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biodiversity and Conservation', 'Ecology', 13, '["In-situ Conservation"]'::jsonb FROM subjects WHERE name = 'Biology' AND class = '12';

-- Insert Class 12 Maths (Full)
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Relations and Functions', 'Math', 1, '["Equivalence Relations"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Inverse Trigonometric Functions', 'Math', 2, '["Principal Values"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Matrices', 'Algebra', 3, '["Operations"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Determinants', 'Algebra', 4, '["Inverse"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Continuity and Differentiability', 'Calculus', 5, '["Derivatives"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Application of Derivatives', 'Calculus', 6, '["Rate of Change"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Integrals', 'Calculus', 7, '["Definite Integrals"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Application of Integrals', 'Calculus', 8, '["Area Under Curve"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Differential Equations', 'Calculus', 9, '["Linear Eq"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Vector Algebra', 'Math', 10, '["Dot Product"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Three Dimensional Geometry', 'Math', 11, '["Shortest Distance"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Linear Programming', 'Math', 12, '["Optimal Sol"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Probability', 'Math', 13, '["Bayes Theorem"]'::jsonb FROM subjects WHERE name = 'Mathematics' AND class = '12';

-- 5. CREATE PROGRESS TRIGGER
------------------------------------------
CREATE OR REPLACE FUNCTION handle_chapter_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_subject_id uuid;
    v_total_chapters integer;
    v_completed_chapters integer;
BEGIN
    SELECT subject_id INTO v_subject_id FROM chapters WHERE id = NEW.chapter_id;
    SELECT COUNT(*) INTO v_total_chapters FROM chapters WHERE subject_id = v_subject_id;
    SELECT COUNT(*) INTO v_completed_chapters 
    FROM user_chapter_progress ucp
    JOIN chapters c ON c.id = ucp.chapter_id
    WHERE ucp.user_id = NEW.user_id 
    AND c.subject_id = v_subject_id
    AND ucp.completed = true;
    
    INSERT INTO user_subject_progress (user_id, subject_id, chapters_completed, total_chapters, progress_percentage, updated_at)
    VALUES (
        NEW.user_id, 
        v_subject_id, 
        v_completed_chapters, 
        v_total_chapters, 
        CASE WHEN v_total_chapters > 0 THEN (v_completed_chapters * 100 / v_total_chapters) ELSE 0 END,
        NOW()
    )
    ON CONFLICT (user_id, subject_id) DO UPDATE SET
        chapters_completed = EXCLUDED.chapters_completed,
        total_chapters = EXCLUDED.total_chapters,
        progress_percentage = EXCLUDED.progress_percentage,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_chapter_completion ON user_chapter_progress;
CREATE TRIGGER on_chapter_completion
AFTER INSERT OR UPDATE OF completed ON user_chapter_progress
FOR EACH ROW
EXECUTE FUNCTION handle_chapter_completion();
