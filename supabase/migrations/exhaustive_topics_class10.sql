-- ==========================================
-- NCERT EXHAUSTIVE TOPICS UPDATE (CLASS 10)
-- 2024-25 Syllabus
-- ==========================================

DO $$ 
DECLARE 
    v_subject_id uuid;
BEGIN

-- 1. PHYSICS CLASS 10
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Physics' AND class = '10';

UPDATE chapters SET topics = '["Reflection of Light", "Spherical Mirrors", "Concave Mirror: Ray Diagrams", "Convex Mirror: Ray Diagrams", "Mirror Formula", "Magnification", "Refraction of Light", "Laws of Refraction", "Refractive Index", "Refraction by Spherical Lenses", "Lens Formula", "Power of Lens"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Light – Reflection and Refraction';

UPDATE chapters SET topics = '["Structure of Human Eye", "Power of Accommodation", "Defects of Vision: Myopia", "Hypermetropia & Presbyopia", "Refraction through Prism", "Dispersion of White Light", "Atmospheric Refraction", "Scattering of Light: Tyndall Effect"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'The Human Eye and the Colourful World';

UPDATE chapters SET topics = '["Electric Current & Circuit", "Electric Potential", "Ohm''s Law", "Resistance & Resistivity", "Resistors in Series", "Resistors in Parallel", "Heating Effect of Current", "Electric Power", "Commercial Unit of Energy"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Electricity';

UPDATE chapters SET topics = '["Magnetic Field Lines", "Field due to Straight Conductor", "Right Hand Thumb Rule", "Field due to Circular Loop", "Magnetic Field in Solenoid", "Force on Current-carrying Conductor", "Fleming''s Left-Hand Rule", "Electric Motor", "Electromagnetic Induction", "Domestic Electric Circuits"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Magnetic Effects of Electric Current';


-- 2. CHEMISTRY CLASS 10
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Chemistry' AND class = '10';

UPDATE chapters SET topics = '["Chemical Equations", "Writing & Balancing Equations", "Combination Reactions", "Decomposition Reactions", "Displacement Reactions", "Double Displacement", "Oxidation & Reduction", "Corrosion & Rancidity"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Chemical Reactions and Equations';

UPDATE chapters SET topics = '["Chemical Properties of Acids & Bases", "Reaction with Metals", "Neutralization", "pH Scale & Importance", "Common Salt & Chemicals", "Sodium Hydroxide", "Bleaching Powder", "Baking Soda", "Washing Soda", "Plaster of Paris"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Acids, Bases and Salts';

UPDATE chapters SET topics = '["Physical Properties", "Chemical Properties of Metals", "Reactivity Series", "Reaction of Metals & Non-metals", "Ionic Compounds", "Extraction of Metals", "Enrichment of Ores", "Refining", "Corrosion Prevention"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Metals and Non-metals';

UPDATE chapters SET topics = '["Covalent Bonding", "Versatile Nature of Carbon", "Saturated & Unsaturated Compounds", "Chains, Branches & Rings", "Homologous Series", "Nomenclature", "Chemical Properties (Combustion, Oxidation)", "Ethanol & Ethanoic Acid", "Soaps & Detergents"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Carbon and its Compounds';


-- 3. BIOLOGY CLASS 10
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Biology' AND class = '10';

UPDATE chapters SET topics = '["Nutrition in Plants", "Nutrition in Animals", "Human Digestive System", "Respiration", "Transportation in Humans", "Heart & Blood Vessels", "Transportation in Plants", "Excretion in Humans & Plants"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Life Processes';

UPDATE chapters SET topics = '["Nervous System", "Reflex Action", "Human Brain", "Protection of Nervous System", "Coordination in Plants", "Hormones in Animals", "Endocrine System"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Control and Coordination';

UPDATE chapters SET topics = '["Asexual Reproduction Types", "Fission, Fragmentation, Budding", "Vegetative Propagation", "Sexual Reproduction in Plants", "Reproduction in Humans", "Male & Female Systems", "Reproductive Health"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'How do Organisms Reproduce?';

UPDATE chapters SET topics = '["Accumulation of Variation", "Heredity & Inherited Traits", "Mendel''s Contribution", "Sex Determination", "Evolution Introduction"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Heredity';

UPDATE chapters SET topics = '["Ecosystem & Components", "Food Chains & Webs", "Ozone Layer Depletion", "Managing Waste Production"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Our Environment';


-- 4. MATHEMATICS CLASS 10
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Mathematics' AND class = '10';

UPDATE chapters SET topics = '["Fundamental Theorem of Arithmetic", "Lcm & Hcf Properties", "Revisiting Irrational Numbers", "Proofs of √2, √3, √5"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Real Numbers';

UPDATE chapters SET topics = '["Geometrical Meaning of Zeros", "Relationship between Zeros & Coefficients", "Division Algorithm (Self-study)"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Polynomials';

UPDATE chapters SET topics = '["Graphical Method of Solution", "Algebraic Methods", "Substitution Method", "Elimination Method", "Equations Reducible to Linear Form"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Linear Equations in Two Variables';

UPDATE chapters SET topics = '["Standard Form", "Solution by Factorisation", "Solution by Quadratic Formula", "Nature of Roots", "Situational Problems"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Quadratic Equations';

UPDATE chapters SET topics = '["Arithmetic Progressions Intro", "nth Term of an AP", "Sum of First n Terms", "Daily Life Applications"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Arithmetic Progressions';

UPDATE chapters SET topics = '["Similar Figures", "Similarity of Triangles", "Criteria for Similarity (AAA, SSS, SAS)", "Basic Proportionality Theorem (BPT)"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Triangles';

UPDATE chapters SET topics = '["Distance Formula", "Section Formula", "Internal Division", "Area of Triangle (Excluded for 2024)"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Coordinate Geometry';

UPDATE chapters SET topics = '["Trigonometric Ratios", "Ratios of Specific Angles (0-90)", "Trigonometric Identities", "Proof of sin²A + cos²A = 1"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Introduction to Trigonometry';

UPDATE chapters SET topics = '["Heights and Distances", "Angle of Elevation", "Angle of Depression", "Multi-Triangle Problems"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Some Applications of Trigonometry';

UPDATE chapters SET topics = '["Tangent to a Circle", "Number of Tangents from a Point"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Circles';

UPDATE chapters SET topics = '["Perimeter & Area of Circle", "Area of Sector", "Area of Segment", "Combined Plane Figures"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Areas Related to Circles';

UPDATE chapters SET topics = '["Surface Area of Combined Solids", "Volume of Combined Solids", "Conversion of Solid (Excluded)", "Frustum of Cone (Excluded)"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Surface Areas and Volumes';

UPDATE chapters SET topics = '["Mean of Grouped Data", "Median of Grouped Data", "Mode of Grouped Data", "Cumulative Frequency Graph (Excluded)"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Statistics';

UPDATE chapters SET topics = '["Theoretical Probability", "Elementary Events", "Complementary Events", "Experimental vs Theoretical"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Probability';

END $$;
