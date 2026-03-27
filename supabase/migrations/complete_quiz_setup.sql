-- ==========================================
-- COMPREHENSIVE QUIZ SYSTEM SETUP
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Questions Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    type TEXT DEFAULT 'conceptual' CHECK (type IN ('conceptual', 'numerical', 'assertion_reason', 'case_based', 'match_following')),
    case_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (if they don't exist)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to questions') THEN
    CREATE POLICY "Allow public read access to questions"
    ON questions FOR SELECT
    TO authenticated, anon
    USING (true);
  END IF;
END $$;

-- 5. POPULATE DIVERSE CONTENT
DO $$ 
DECLARE 
    v_elec_id uuid;
    v_chem_id uuid;
    v_life_id uuid;
    v_quad_id uuid;
BEGIN
    -- Get Chapter IDs
    SELECT id INTO v_elec_id FROM chapters WHERE name = 'Electricity' LIMIT 1;
    SELECT id INTO v_chem_id FROM chapters WHERE name = 'Chemical Reactions and Equations' LIMIT 1;
    SELECT id INTO v_life_id FROM chapters WHERE name = 'Life Processes' LIMIT 1;
    SELECT id INTO v_quad_id FROM chapters WHERE name = 'Quadratic Equations' LIMIT 1;

    -- --- ELECTRICITY (Class 10) ---
    IF v_elec_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_elec_id;
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_elec_id, 'Which of the following does not represent electrical power in a circuit?', '["I^2R", "IR^2", "VI", "V^2/R"]', 1, 'Power P = VI = I^2R = V^2/R. IR^2 is not a power formula.', 'easy', 'conceptual'),
        (v_elec_id, 'A wire of resistance 20 ohm is cut into 5 equal parts. The resistance of each part is:', '["4 ohm", "100 ohm", "20 ohm", "1 ohm"]', 0, 'Resistance is proportional to length. 20 / 5 = 4 ohm.', 'medium', 'numerical'),
        (v_elec_id, 'Assertion (A): Current is inversely proportional to resistance for a constant voltage. \nReason (R): V = IR is the mathematical expression of Ohm''s Law.', '["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"]', 0, 'From V=IR, I = V/R. Thus I is inversely proportional to R.', 'medium', 'assertion_reason');
        
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type, case_text) VALUES
        (v_elec_id, 'Which component in the series circuit above would have the highest potential difference across it?', '["The 10-ohm resistor", "The 20-ohm resistor", "The 30-ohm resistor", "Potential difference is same across all"]', 2, 'In series, V = IR. Since I is same, V is proportional to R. 30-ohm resistor has max R, so max V.', 'medium', 'case_based', 'A student connects three resistors of 10 ohm, 20 ohm, and 30 ohm in series with a 12V battery. He ignores the internal resistance of the battery.');
    END IF;

    -- --- CHEMICAL REACTIONS (Class 10) ---
    IF v_chem_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_chem_id;
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_chem_id, 'What happens when magnesium ribbon is burnt in air?', '["It turns into a black powder", "It burns with a dazzling white flame", "It doesn''t burn", "It produces a blue flame"]', 1, 'Magnesium burns with a dazzling white flame to form Magnesium Oxide (MgO).', 'easy', 'conceptual'),
        (v_chem_id, 'Silver chloride turns grey in sunlight due to:', '["Decomposition", "Oxidation", "Reduction", "Combination"]', 0, 'Silver chloride decomposes into Silver and Chlorine gas (Photodecomposition).', 'medium', 'conceptual'),
        (v_chem_id, 'Which of the following is a balanced chemical equation?', '["Mg + O2 -> MgO", "2Mg + O2 -> 2MgO", "Mg + 2O2 -> 2MgO", "2Mg + 2O2 -> 2MgO"]', 1, '2Mg + O2 -> 2MgO has equal number of atoms on both sides.', 'medium', 'numerical');
    END IF;

    -- --- LIFE PROCESSES (Class 10) ---
    IF v_life_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_life_id;
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_life_id, 'The breakdown of pyruvate to give carbon dioxide, water and energy takes place in:', '["Cytoplasm", "Chloroplast", "Mitochondria", "Nucleus"]', 2, 'Aerobic respiration happens in mitochondria.', 'easy', 'conceptual'),
        (v_life_id, 'Which part of the heart receives oxygenated blood from lungs?', '["Left Atrium", "Right Atrium", "Left Ventricle", "Right Ventricle"]', 0, 'Oxygenated blood enters the Left Atrium via pulmonary veins.', 'medium', 'conceptual');
    END IF;

END $$;
