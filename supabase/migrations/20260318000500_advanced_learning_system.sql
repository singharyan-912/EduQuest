-- ==========================================
-- ADVANCED LEARNING SYSTEM SCHEMA
-- 1. Create Questions Table for large banks
-- 2. Add learning_slides to Chapters
-- ==========================================

-- Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL,
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add column for structured interactive slides
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS learning_slides JSONB;

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to questions"
ON questions FOR SELECT
TO authenticated, anon
USING (true);

-- ==========================================
-- SAMPLE HIGH-QUALITY CONTENT: CHEMICAL REACTIONS (Class 10)
-- ==========================================

DO $$ 
DECLARE 
    v_chapter_id uuid;
BEGIN
    SELECT id INTO v_chapter_id FROM chapters WHERE name = 'Chemical Reactions and Equations' LIMIT 1;

    IF v_chapter_id IS NOT NULL THEN
        -- Clear old sample if any
        DELETE FROM questions WHERE chapter_id = v_chapter_id;

        -- 20+ Questions Bank
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation) VALUES
        (v_chapter_id, 'What happens when magnesium ribbon is burnt in air?', '["It turns into a black powder", "It burns with a dazzling white flame", "It doesn''t burn", "It produces a blue flame"]', 1, 'Magnesium burns with a dazzling white flame to form Magnesium Oxide (MgO).'),
        (v_chapter_id, 'Which of the following is a physical change?', '["Burning of wood", "Rusting of iron", "Melting of ice", "Cooking of food"]', 2, 'Melting is a change of state, which is a physical change. All others are chemical changes.'),
        (v_chapter_id, 'What is the chemical formula of quick lime?', '["CaO", "Ca(OH)2", "CaCO3", "CaCl2"]', 0, 'Quick lime is Calcium Oxide (CaO).'),
        (v_chapter_id, 'The reaction of quick lime with water is an example of:', '["Endothermic reaction", "Exothermic reaction", "Photochemical reaction", "Displacement reaction"]', 1, 'It releases a large amount of heat, making it exothermic.'),
        (v_chapter_id, 'What is the color of ferrous sulphate crystals?', '["White", "Blue", "Green", "Brown"]', 2, 'Ferrous sulphate (FeSO4.7H2O) crystals are green.'),
        (v_chapter_id, 'The process of respiration is:', '["Oxidative & Endothermic", "Reductive & Exothermic", "Oxidative & Exothermic", "Reductive & Endothermic"]', 2, 'Respiration is the oxidation of glucose which releases energy (exothermic).'),
        (v_chapter_id, 'When lead nitrate reacts with potassium iodide, the precipitate formed is:', '["White", "Yellow", "Red", "Black"]', 1, 'Lead Iodide (PbI2) is a yellow precipitate.'),
        (v_chapter_id, 'Which gas is evolved when zinc reacts with dilute sulphuric acid?', '["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"]', 1, 'Zinc + H2SO4 -> ZnSO4 + H2 (Hydrogen gas).'),
        (v_chapter_id, 'A balanced chemical equation is based on the law of:', '["Conservation of Momentum", "Conservation of Energy", "Conservation of Mass", "Definite Proportions"]', 2, 'Total mass of reactants = Total mass of products.'),
        (v_chapter_id, 'Fe2O3 + 2Al -> Al2O3 + 2Fe. This is a:', '["Combination reaction", "Double displacement", "Decomposition", "Displacement reaction"]', 3, 'Aluminium displaces Iron from its oxide.'),
        (v_chapter_id, 'Rancidity can be prevented by:', '["Adding antioxidants", "Storing in nitrogen", "Keeping in dark", "All of these"]', 3, 'Antioxidants, nitrogen flushing, and dark storage all slow down oxidation.'),
        (v_chapter_id, 'The burning of a candle involves:', '["Physical change", "Chemical change", "Both physical and chemical", "None of these"]', 2, 'Melting of wax is physical; burning of thread/wax is chemical.'),
        (v_chapter_id, 'Silver chloride turns grey in sunlight due to:', '["Decomposition", "Oxidation", "Reduction", "Combination"]', 0, 'Silver chloride decomposes into Silver and Chlorine gas (Photodecomposition).'),
        (v_chapter_id, 'Reduction is:', '["Gain of oxygen", "Loss of hydrogen", "Gain of electrons", "Loss of electrons"]', 2, 'Reduction involves gain of electrons or loss of oxygen or gain of hydrogen.'),
        (v_chapter_id, 'MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2. The substance oxidized is:', '["MnO2", "HCl", "MnCl2", "Cl2"]', 1, 'HCl is oxidized to Cl2 (loss of hydrogen).'),
        (v_chapter_id, 'Rusting of iron is also called:', '["Corrosion", "Rancidity", "Displacement", "Galvanization"]', 0, 'Rusting is a specific type of corrosion involving iron.'),
        (v_chapter_id, 'Potassium chlorate on heating decomposes into:', '["K and Cl2", "KCl and O2", "KClO and O2", "K2O and Cl2"]', 1, '2KClO3 -> 2KCl + 3O2.'),
        (v_chapter_id, 'What is the valency of Magnesium?', '["1", "2", "3", "4"]', 1, 'Magnesium (atomic number 12) has configuration 2,8,2. Valency is 2.'),
        (v_chapter_id, 'Which of the following is not a decomposition reaction?', '["CaCO3 heating", "Silver bromide in sun", "Digestion of food", "Burning coal"]', 3, 'Burning coal (C + O2 -> CO2) is a combination reaction.'),
        (v_chapter_id, 'When copper powder is heated, it turns black due to:', '["Reduction", "Oxidation", "Displacement", "Sublimation"]', 1, 'Copper reacts with oxygen to form black Copper(II) Oxide (CuO).');

        -- Interactive Slides for Learning
        UPDATE chapters SET learning_slides = '[
            {
                "type": "concept",
                "title": "What is a Chemical Reaction?",
                "content": "A chemical reaction is a process where substances (reactants) transform into new substances (products) with different properties. It involves breaking and forming chemical bonds.",
                "animation": "fade-in",
                "micro_quiz": {
                    "question": "Which of these is a sign of a chemical reaction?",
                    "options": ["Color Change", "Temperature Change", "Gas Evolution", "All of these"],
                    "correct": 3
                }
            },
            {
                "type": "interactive_visual",
                "title": "Balancing Equations",
                "content": "According to the Law of Conservation of Mass, the number of atoms for each element must be equal on both sides of the equation.",
                "visual_type": "equation_balancer_demo",
                "steps": ["Count atoms of reactants", "Count atoms of products", "Use coefficients to balance"]
            },
            {
                "type": "example",
                "title": "Example: Burning of Magnesium",
                "content": "2Mg + O2 → 2MgO. Notice how we use the coefficient ''2'' to ensure the number of atoms is balanced.",
                "solution_steps": [
                    "Reactants: 2 Magnesium atoms, 2 Oxygen atoms",
                    "Products: 2 Magnesium atoms, 2 Oxygen atoms",
                    "Status: Balanced!"
                ]
            },
            {
                "type": "concept",
                "title": "Types: Combination & Decomposition",
                "content": "Combination: A + B -> AB (e.g., C + O2 -> CO2). Decomposition: AB -> A + B (e.g., CaCO3 -> CaO + CO2).",
                "visual": "https://images.unsplash.com/photo-1532187875605-186c6af84c50?w=800"
            }
        ]'::jsonb
        WHERE id = v_chapter_id;
    END IF;
END $$;
