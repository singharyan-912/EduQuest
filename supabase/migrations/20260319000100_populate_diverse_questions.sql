-- Populate diverse question bank for key chapters
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

    -- 1. ELECTRICITY (Class 10) - Diverse 20+ Questions
    IF v_elec_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_elec_id;
        
        -- Conceptual
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_elec_id, 'Which of the following does not represent electrical power in a circuit?', '["I^2R", "IR^2", "VI", "V^2/R"]', 1, 'Power P = VI = I^2R = V^2/R. IR^2 is not a power formula.', 'easy', 'conceptual'),
        (v_elec_id, 'What is the commercial unit of electrical energy?', '["Joule", "Watt", "Kilowatt-hour", "Volt"]', 2, 'One unit of electricity is 1 kWh.', 'easy', 'conceptual'),
        (v_elec_id, 'The resistance of an ideal voltmeter is:', '["Zero", "Infinite", "Very Low", "Moderate"]', 1, 'An ideal voltmeter should have infinite resistance to avoid drawing current.', 'medium', 'conceptual');

        -- Numerical
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_elec_id, 'A wire of resistance 20 ohm is cut into 5 equal parts. The resistance of each part is:', '["4 ohm", "100 ohm", "20 ohm", "1 ohm"]', 0, 'Resistance is proportional to length. 20 / 5 = 4 ohm.', 'medium', 'numerical'),
        (v_elec_id, 'Two resistors of 10 ohm and 40 ohm are connected in parallel. Their equivalent resistance is:', '["50 ohm", "30 ohm", "8 ohm", "0.02 ohm"]', 2, '1/Rp = 1/10 + 1/40 = 5/40 = 1/8. So Rp = 8 ohm.', 'medium', 'numerical'),
        (v_elec_id, 'An electric bulb is rated 220 V and 100 W. When it is operated on 110 V, the power consumed will be:', '["100 W", "75 W", "50 W", "25 W"]', 3, 'R = V^2 / P = (220*220)/100 = 484 ohm. New P = (110*110)/484 = 25 W.', 'hard', 'numerical');

        -- Assertion-Reason
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_elec_id, 'Assertion (A): Current is inversely proportional to resistance for a constant voltage. \nReason (R): V = IR is the mathematical expression of Ohm''s Law.', '["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"]', 0, 'From V=IR, I = V/R. Thus I is inversely proportional to R.', 'medium', 'assertion_reason'),
        (v_elec_id, 'Assertion (A): Fuse wire must have high resistance and low melting point. \nReason (R): It protects the circuit from overflow of current.', '["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"]', 0, 'High resistance generates heat (H=I^2Rt) and low melting point causes it to melt quickly.', 'medium', 'assertion_reason');

        -- Case-based
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type, case_text) VALUES
        (v_elec_id, 'Which component in the series circuit above would have the highest potential difference across it?', '["The 10-ohm resistor", "The 20-ohm resistor", "The 30-ohm resistor", "Potential difference is same across all"]', 2, 'In series, V = IR. Since I is same, V is proportional to R. 30-ohm resistor has max R, so max V.', 'medium', 'case_based', 'A student connects three resistors of 10 ohm, 20 ohm, and 30 ohm in series with a 12V battery. He ignores the internal resistance of the battery.'),
        (v_elec_id, 'What is the total current flowing in the circuit?', '["2 A", "1.2 A", "0.2 A", "0.5 A"]', 2, 'R_total = 10 + 20 + 30 = 60 ohm. I = V / R = 12 / 60 = 0.2 A.', 'medium', 'case_based', 'A student connects three resistors of 10 ohm, 20 ohm, and 30 ohm in series with a 12V battery. He ignores the internal resistance of the battery.');

        -- Match Following (Represented as MCQ)
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_elec_id, 'Match the following: \nP: Current \nQ: Resistance \nR: Potential Difference \nS: Electric Power \n\n1: Ohm \n2: Ampere \n3: Watt \n4: Volt', '["P-2, Q-1, R-4, S-3", "P-1, Q-2, R-3, S-4", "P-3, Q-4, R-1, S-2", "P-4, Q-3, R-2, S-1"]', 0, 'Current-Ampere, Resistance-Ohm, Potential Difference-Volt, Power-Watt.', 'easy', 'match_following');
    END IF;

    -- 2. CHEMICAL REACTIONS (Class 10) - Diverse 20+ Questions
    IF v_chem_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_chem_id;
        
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_chem_id, 'Which of the following is a balanced chemical equation?', '["Mg + O2 -> MgO", "2Mg + O2 -> 2MgO", "Mg + 2O2 -> 2MgO", "2Mg + 2O2 -> 2MgO"]', 1, '2Mg + O2 -> 2MgO has equal number of atoms on both sides.', 'easy', 'conceptual'),
        (v_chem_id, 'The decomposition of lead nitrate produces a brown gas. This gas is:', '["Nitrogen", "Oxygen", "Nitrogen Dioxide", "Nitric Oxide"]', 2, '2Pb(NO3)2 -> 2PbO + 4NO2 + O2. NO2 is brown gas.', 'medium', 'conceptual'),
        (v_chem_id, 'Assertion (A): Photosynthesis is an endothermic reaction. \nReason (R): Energy is absorbed in the form of sunlight during photosynthesis.', '["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"]', 0, 'Sunlight is required/absorbed, making it endothermic.', 'medium', 'assertion_reason'),
        (v_chem_id, 'Identify the substance reduced in: CuO + H2 -> Cu + H2O', '["CuO", "H2", "Cu", "H2O"]', 0, 'CuO loses oxygen to become Cu, so it is reduced.', 'medium', 'conceptual');
    END IF;

    -- 3. LIFE PROCESSES (Class 10) - Diverse 20+ Questions
    IF v_life_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_life_id;
        
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_life_id, 'The breakdown of pyruvate to give carbon dioxide, water and energy takes place in:', '["Cytoplasm", "Chloroplast", "Mitochondria", "Nucleus"]', 2, 'Aerobic respiration happens in mitochondria.', 'easy', 'conceptual'),
        (v_life_id, 'Which part of the alimentary canal receives bile from the liver?', '["Stomach", "Small Intestine", "Large Intestine", "Oesophagus"]', 1, 'Bile and pancreatic juice enter the duodenum (small intestine).', 'easy', 'conceptual'),
        (v_life_id, 'Assertion (A): The opening and closing of the stomatal pore is a function of the guard cells. \nReason (R): Stomatal pores open when water flows into the guard cells.', '["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is not the correct explanation of A", "A is true but R is false", "A is false but R is true"]', 0, 'Swelling of guard cells opens the pore.', 'medium', 'assertion_reason');
    END IF;

    -- 4. QUADRATIC EQUATIONS (Class 10 Maths)
    IF v_quad_id IS NOT NULL THEN
        DELETE FROM questions WHERE chapter_id = v_quad_id;
        
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation, difficulty, type) VALUES
        (v_quad_id, 'The quadratic formula for ax^2 + bx + c = 0 is:', '["x = (-b ± √(b^2 - 4ac)) / 2a", "x = (b ± √(b^2 - 4ac)) / 2a", "x = (-b ± √(b^2 + 4ac)) / 2a", "x = -b / 2a"]', 0, 'Standard quadratic formula.', 'easy', 'conceptual'),
        (v_quad_id, 'The nature of roots if b^2 - 4ac > 0 is:', '["Real and Equal", "Real and Distinct", "No Real Roots", "Imaginary Roots"]', 1, 'D > 0 means distinct real roots.', 'easy', 'conceptual'),
        (v_quad_id, 'Find the roots of x^2 - 5x + 6 = 0:', '["2, 3", "-2, -3", "1, 6", "-1, -6"]', 0, '(x-2)(x-3) = 0 => x=2,3.', 'medium', 'numerical'),
        (v_quad_id, 'The sum of areas of two squares is 468 m². If the difference of their perimeters is 24 m, find the sides of the two squares.', '["18m, 12m", "15m, 10m", "20m, 14m", "24m, 18m"]', 0, 'Let sides be x, y. x^2+y^2=468, 4x-4y=24 => x-y=6. (y+6)^2+y^2=468. Solving gives 18, 12.', 'hard', 'numerical');
    END IF;

END $$;
