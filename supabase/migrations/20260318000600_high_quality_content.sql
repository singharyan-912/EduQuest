-- ==========================================
-- HIGH QUALITY CONTENT POPULATION (PART 2)
-- Electricity, Life Processes, Light
-- ==========================================

DO $$ 
DECLARE 
    v_elec_id uuid;
    v_life_id uuid;
    v_light_id uuid;
BEGIN
    -- 1. Get Chapter IDs
    SELECT id INTO v_elec_id FROM chapters WHERE name = 'Electricity' LIMIT 1;
    SELECT id INTO v_life_id FROM chapters WHERE name = 'Life Processes' LIMIT 1;
    SELECT id INTO v_light_id FROM chapters WHERE name = 'Light – Reflection and Refraction' LIMIT 1;

    -- 2. ELECTRICITY (Class 10)
    IF v_elec_id IS NOT NULL THEN
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation) VALUES
        (v_elec_id, 'The SI unit of electric current is:', '["Ohm", "Volt", "Ampere", "Watt"]', 2, 'Electric current is measured in Amperes (A).'),
        (v_elec_id, 'What is the relation between Voltage (V), Current (I) and Resistance (R)?', '["V = I + R", "V = I / R", "V = I * R", "I = V * R"]', 2, 'Ohm''s Law states V = IR.'),
        (v_elec_id, 'A device used to measure electric current is:', '["Voltmeter", "Ammeter", "Galvanometer", "Generator"]', 1, 'An ammeter measures current and is connected in series.'),
        (v_elec_id, 'Work done in moving a unit charge between two points is:', '["Current", "Power", "Resistance", "Potential Difference"]', 3, 'Potential difference is the work done per unit charge.'),
        (v_elec_id, 'The resistance of a conductor is inversely proportional to its:', '["Length", "Area of cross-section", "Temperature", "Nature of material"]', 1, 'R = rho * (L/A). Resistance is inversely proportional to Area.'),
        (v_elec_id, 'The SI unit of resistivity is:', '["Ohm", "Ohm-meter", "Volt", "Ampere"]', 1, 'Resistivity (rho) is measured in Ohm-meters.'),
        (v_elec_id, 'In a series circuit, which quantity remains the same at every point?', '["Voltage", "Current", "Power", "Resistance"]', 1, 'Current is constant in a series circuit.'),
        (v_elec_id, 'In a parallel circuit, which quantity remains the same across all components?', '["Current", "Voltage", "Power", "Resistance"]', 1, 'Voltage is constant across parallel branches.'),
        (v_elec_id, 'The commercial unit of electrical energy is:', '["Joule", "Watt", "Kilowatt-hour", "Volt"]', 2, '1 kWh = 1 unit of electricity.'),
        (v_elec_id, '1 kWh is equal to how many Joules?', '["3.6 x 10^5 J", "3.6 x 10^6 J", "36 x 10^6 J", "0.36 x 10^6 J"]', 1, '1 kWh = 1000W * 3600s = 3.6 million Joules.'),
        (v_elec_id, 'The heating effect of electric current is used in:', '["Electric Heater", "Electric Bulb", "Electric Fuse", "All of these"]', 3, 'Heaters, bulbs (filament), and fuses all use Joule heating.'),
        (v_elec_id, 'The filament of an electric bulb is made of:', '["Copper", "Aluminium", "Tungsten", "Nichrome"]', 2, 'Tungsten is used due to its very high melting point.'),
        (v_elec_id, 'Electric power is defined as:', '["P = VI", "P = I^2R", "P = V^2/R", "All of these"]', 3, 'All are correct formulas derived from P=VI and V=IR.'),
        (v_elec_id, 'A wire of resistance R is cut into five equal parts. The resistance of each part is:', '["R/5", "5R", "R", "R/25"]', 0, 'Resistance is proportional to length, so 1/5th length has 1/5th resistance.'),
        (v_elec_id, 'Why are copper and aluminium wires usually employed for electricity transmission?', '["High resistivity", "Low resistivity", "High melting point", "Magnetic properties"]', 1, 'Low resistivity means less power loss during transmission.'),
        (v_elec_id, 'The fuse wire should have a:', '["Low melting point", "High melting point", "Very high resistance", "Unlimited capacity"]', 0, 'A low melting point ensures it breaks when excess current flows.'),
        (v_elec_id, 'If the current through a resistor is doubled, the power dissipation becomes:', '["Double", "Half", "Four times", "Remains same"]', 2, 'P = I^2R. If I is doubled (2^2), P becomes 4 times.'),
        (v_elec_id, 'Which component represents an open switch in a circuit diagram?', '["( )", "(.)", "---", "| |"]', 0, 'Round brackets without a dot represent an open plug key.'),
        (v_elec_id, 'The path of an electric current is called:', '["Network", "Circuit", "Route", "Loop"]', 1, 'A continuous closed path is an electric circuit.'),
        (v_elec_id, 'What happens to resistance when a wire is stretched twice its length?', '["Doubles", "Halves", "Becomes 4 times", "Remains same"]', 2, 'L becomes 2L, Area becomes A/2 (volume constant). R = rho * (2L / (A/2)) = 4R.');

        UPDATE chapters SET learning_slides = '[
            {
                "type": "concept",
                "title": "Electric Potential",
                "content": "Imagine gravity pushing water through a pipe. Electric potential is like that pressure, pushing charges through a wire.",
                "visual": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800"
            },
            {
                "type": "interactive_visual",
                "title": "Ohm''s Law Visualizer",
                "content": "V = IR. If you increase Voltage, Current increases. If you increase Resistance, Current decreases.",
                "visual_type": "circuit_demo"
            },
            {
                "type": "micro_quiz",
                "title": "Quick Check",
                "content": "Let''s test your knowledge of units.",
                "micro_quiz": {
                    "question": "Which unit measures Resistance?",
                    "options": ["Ampere", "Volt", "Ohm", "Watt"],
                    "correct": 2
                }
            }
        ]'::jsonb WHERE id = v_elec_id;
    END IF;

    -- 3. LIFE PROCESSES (Class 10)
    IF v_life_id IS NOT NULL THEN
        INSERT INTO questions (chapter_id, question, options, correct_index, explanation) VALUES
        (v_life_id, 'The mode of nutrition in Amoeba is:', '["Saprophytic", "Holozoic", "Parasitic", "Autotrophic"]', 1, 'Amoeba takes in solid food particles (Holozoic).'),
        (v_life_id, 'Which plant tissue transports water and minerals?', '["Phloem", "Xylem", "Parenchyma", "Collenchyma"]', 1, 'Xylem is responsible for water transport from roots to leaves.'),
        (v_life_id, 'The breakdown of pyruvate to give CO2, water and energy takes place in:', '["Cytoplasm", "Mitochondria", "Chloroplast", "Nucleus"]', 1, 'Aerobic respiration occurs in mitochondria.'),
        (v_life_id, 'Autotrophic nutrition requires:', '["CO2 and H2O", "Chlorophyll", "Sunlight", "All of these"]', 3, 'Photosynthesis needs carbon dioxide, water, chlorophyll, and light.'),
        (v_life_id, 'The enzyme present in saliva is:', '["Pepsin", "Trypsin", "Amylase", "Lipase"]', 2, 'Salivary amylase breaks down starch into sugar.'),
        (v_life_id, 'The site of complete digestion in humans is:', '["Stomach", "Small Intestine", "Large Intestine", "Liver"]', 1, 'Final digestion of carbs, fats, and proteins happens in the small intestine.'),
        (v_life_id, 'Bile juice is stored in the:', '["Liver", "Gall Bladder", "Pancreas", "Stomach"]', 1, 'Liver secretes bile, but it is stored in the gall bladder.'),
        (v_life_id, 'Which part of the heart receives oxygenated blood from lungs?', '["Left Atrium", "Right Atrium", "Left Ventricle", "Right Ventricle"]', 0, 'Oxygenated blood enters the Left Atrium via pulmonary veins.'),
        (v_life_id, 'The structural and functional unit of kidney is:', '["Neuron", "Nephron", "Alveoli", "Bronchi"]', 1, 'Nephrons filter blood in the kidneys.'),
        (v_life_id, 'Villi are present in:', '["Stomach", "Small Intestine", "Large Intestine", "Oesophagus"]', 1, 'Villi increase surface area for absorption in the small intestine.'),
        (v_life_id, 'Which of the following is produced during anaerobic respiration in yeast?', '["Lactic acid", "Ethanol + CO2", "Pyruvate", "CO2 + Water"]', 1, 'Yeast fermentation produces ethanol and carbon dioxide.'),
        (v_life_id, 'The normal blood pressure in humans is:', '["120/80 mmHg", "80/120 mmHg", "100/60 mmHg", "140/90 mmHg"]', 0, 'Systolic 120 and Diastolic 80.'),
        (v_life_id, 'Movement of food through the alimentary canal is called:', '["Translocation", "Peristalsis", "Respiration", "Digestion"]', 1, 'Wavelike muscle contractions are peristalsis.'),
        (v_life_id, 'Platelets help in:', '["O2 transport", "Immunity", "Blood clotting", "Digestion"]', 2, 'Platelets prevent blood loss by forming clots.'),
        (v_life_id, 'The process of losing water as vapor from leaves is:', '["Evaporation", "Transpiration", "Translocation", "Excretion"]', 1, 'Transpiration creates suction pull for water transport.'),
        (v_life_id, 'Hemoglobin has a high affinity for:', '["CO2", "O2", "N2", "H2"]', 1, 'Hemoglobin carries oxygen in the blood.'),
        (v_life_id, 'Guard cells regulate the opening and closing of:', '["Roots", "Stomata", "Xylem", "Phloem"]', 1, 'Stomatal pores on leaves are controlled by guard cells.'),
        (v_life_id, 'The sound ''lub'' and ''dub'' are produced by:', '["Lungs", "Heart Valves", "Arteries", "Veins"]', 1, 'Heart sounds are caused by valves closing.'),
        (v_life_id, 'Renal artery carries:', '["Pure blood", "Dirty blood to kidney", "Filter red blood", "Oxygenated blood"]', 1, 'It carries blood to the kidney for filtration.'),
        (v_life_id, 'Trypsin digests:', '["Fats", "Carbs", "Proteins", "Vitamins"]', 2, 'Trypsin is a proteolytic enzyme secreted by the pancreas.');

        UPDATE chapters SET learning_slides = '[
            {
                "type": "concept",
                "title": "The Power of Nutrition",
                "content": "Life requires energy. Whether it''s a plant making food from light or you eating an apple, it''s all about fueling biological engines.",
                "visual": "https://images.unsplash.com/photo-1512149177596-f817ced76809?w=800"
            },
            {
                "type": "interaction",
                "title": "Digestive Track",
                "content": "Hover over the organs to see their function.",
                "visual_type": "organ_visualizer"
            }
        ]'::jsonb WHERE id = v_life_id;
    END IF;

END $$;
