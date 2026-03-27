-- Full NCERT Syllabus Migration (Rationalized 2023-24)

-- 1. Cleanup existing chapters and duplicate subjects
DELETE FROM public.chapters;
DELETE FROM public.subjects a USING public.subjects b WHERE a.id > b.id AND a.name = b.name AND a.class = b.class;

-- 2. Ensure Unique Constraint on subjects
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subjects_name_class_unique') THEN
        ALTER TABLE public.subjects ADD CONSTRAINT subjects_name_class_unique UNIQUE (name, class);
    END IF;
END $$;

-- 3. Insert/Update Subjects
INSERT INTO subjects (name, class, icon, description) VALUES
  ('Physics', '10', 'Zap', 'Master the fundamentals of Physics'),
  ('Chemistry', '10', 'Flask', 'Explore the world of Chemistry'),
  ('Biology', '10', 'Leaf', 'Discover the wonders of Biology'),
  ('Mathematics', '10', 'Calculator', 'Solve mathematical challenges'),
  ('Physics', '12', 'Zap', 'Advanced Physics concepts'),
  ('Chemistry', '12', 'Flask', 'Advanced Chemistry topics'),
  ('Biology', '12', 'Leaf', 'Advanced Biology studies'),
  ('Mathematics', '12', 'Calculator', 'Advanced Mathematics')
ON CONFLICT (name, class) DO UPDATE SET icon = EXCLUDED.icon, description = EXCLUDED.description;

-- 4. CLASS 10 SCIENCE CHAPTERS
-- Physics
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Light – Reflection and Refraction', 'Fundamental principles of light', 1, '["Laws of Reflection", "Mirror Formula", "Refraction through glass slab", "Lens Formula", "Power of Lens"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'The Human Eye and the Colourful World', 'Optical properties of human eye', 2, '["Power of Accommodation", "Defects of Vision", "Atmospheric Refraction", "Scattering of Light"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electricity', 'Concepts of current and resistance', 3, '["Ohm''s Law", "Resistance in Series/Parallel", "Heating Effect of Current", "Electric Power"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Magnetic Effects of Electric Current', 'Electromagnetism basics', 4, '["Magnetic Field Lines", "Right Hand Thumb Rule", "Solenoid", "Fleming''s Left/Right Hand Rules"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '10' ON CONFLICT DO NOTHING;

-- Chemistry
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Chemical Reactions and Equations', 'Types of chemical reactions', 1, '["Balanced Equations", "Combination Reactions", "Decomposition", "Displacement", "Oxidation and Reduction"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Acids, Bases and Salts', 'Properties and pH', 2, '["Chemical Properties of Acids/Bases", "pH Scale Importance", "Common Salt", "Plaster of Paris"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Metals and Non-metals', 'Elemental properties', 3, '["Chemical Properties of Metals", "Ionic Compounds", "Occurrence of Metals", "Corrosion"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Carbon and its Compounds', 'Organic chemistry introduction', 4, '["Bonding in Carbon", "Saturated/Unsaturated Compounds", "Functional Groups", "Soaps and Detergents"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '10' ON CONFLICT DO NOTHING;

-- Biology
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Life Processes', 'Essential biological functions', 1, '["Nutrition", "Respiration", "Transportation", "Excretion"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Control and Coordination', 'Nervous and endocrine systems', 2, '["Human Brain", "Reflex Actions", "Plant Hormones", "Hormones in Animals"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'How do Organisms Reproduce?', 'Reproduction methods', 3, '["Asexual Reproduction", "Sexual Reproduction in Plants", "Human Reproduction", "Reproductive Health"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Heredity', 'Genetics basics', 4, '["Inherited Traits", "Mendel''s Contributions", "Sex Determination"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Our Environment', 'Ecology introduction', 5, '["Ecosystem", "Food Chains", "Ozone Layer Depletion", "Waste Management"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '10' ON CONFLICT DO NOTHING;

-- 5. CLASS 10 MATHEMATICS CHAPTERS
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Real Numbers', 'Fundamental number theory', 1, '["Fundamental Theorem of Arithmetic", "Irrational Numbers"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Polynomials', 'Algebraic functions', 2, '["Zeros of a Polynomial", "Relationship between Zeros and Coefficients"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Pair of Linear Equations in Two Variables', 'System of equations', 3, '["Substitution Method", "Elimination Method", "Consistency"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Quadratic Equations', 'Second degree equations', 4, '["Solution by Factorisation", "Quadratic Formula", "Nature of Roots"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Arithmetic Progressions', 'Numerical sequences', 5, '["nth Term", "Sum of First n Terms"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Triangles', 'Geometric properties', 6, '["Similar Figures", "Similarity Criteria", "Basic Proportionality Theorem"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Coordinate Geometry', 'Graphs and distance', 7, '["Distance Formula", "Section Formula"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Introduction to Trigonometry', 'Trig ratios and values', 8, '["Trigonometric Ratios", "Trigonometric Identities"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Some Applications of Trigonometry', 'Heights and distances', 9, '["Angles of Elevation", "Angles of Depression"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Circles', 'Circle geometry', 10, '["Tangent to a Circle", "Number of Tangents from a Point"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Areas Related to Circles', 'Mensuration of circles', 11, '["Area of Sector", "Area of Segment"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Surface Areas and Volumes', '3D mensuration', 12, '["Combination of Solids"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Statistics', 'Data analysis', 13, '["Mean of Grouped Data", "Median of Grouped Data", "Mode of Grouped Data"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Probability', 'Chance analysis', 14, '["Theoretical Probability"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '10' ON CONFLICT DO NOTHING;

-- 6. CLASS 12 PHYSICS CHAPTERS
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electric Charges and Fields', 'Electrostatics Part 1', 1, '["Coulomb''s Law", "Electric Field Lines", "Electric Flux", "Gauss Law"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electrostatic Potential and Capacitance', 'Electrostatics Part 2', 2, '["Equipotential Surfaces", "Dielectrics", "Capacitors in Series/Parallel"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Current Electricity', 'DC circuits', 3, '["Drift Velocity", "Kirchhoff''s Rules", "Wheatstone Bridge"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Moving Charges and Magnetism', 'Magnetism Part 1', 4, '["Lorentz Force", "Biot-Savart Law", "Ampere''s Circuital Law", "Cyclotron"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Magnetism and Matter', 'Magnetism Part 2', 5, '["The Earth''s Magnetism", "Para-, Dia-, Ferro-magnetism"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electromagnetic Induction', 'Induction phenomena', 6, '["Faraday''s Law", "Lenz''s Law", "Eddy Currents", "Self and Mutual Induction"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Alternating Current', 'AC circuits', 7, '["LCR Series Circuit", "Resonance", "Transformer", "AC Generator"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electromagnetic Waves', 'Wave properties', 8, '["Displacement Current", "EM Spectrum"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Ray Optics and Optical Instruments', 'Geometric optics', 9, '["Total Internal Reflection", "Lens Maker''s Formula", "Refraction through Prism", "Telescopes"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Wave Optics', 'Physical optics', 10, '["Huygens Principle", "Interference", "Young''s Double Slit Experiment", "Diffraction"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Dual Nature of Radiation and Matter', 'Quantum theory intro', 11, '["Photoelectric Effect", "Einstein''s Photoelectric Equation", "de Broglie Hypothesis"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Atoms', 'Atomic structures', 12, '["Alpha-particle Scattering", "Bohr Model", "Atomic Spectra"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Nuclei', 'Nuclear physics', 13, '["Nuclear Force", "Mass-Energy Relation", "Nuclear Fission and Fusion"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Semiconductor Electronics: Materials, Devices and Simple Circuits', 'Solid state electronics', 14, '["p-n Junction", "Semiconductor Diode", "Rectifier", "Logic Gates"]'::jsonb
FROM subjects WHERE name = 'Physics' AND class = '12' ON CONFLICT DO NOTHING;

-- 7. CLASS 12 CHEMISTRY CHAPTERS
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Solutions', 'Properties of mixtures', 1, '["Raoult''s Law", "Colligative Properties", "Van''t Hoff Factor"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Electrochemistry', 'Chemical energy and electricity', 2, '["Nernst Equation", "Kohlrausch Law", "Electrolysis", "Batteries"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Chemical Kinetics', 'Reaction rates', 3, '["Order and Molecularity", "Integrated Rate Equations", "Arrhenius Equation"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'The d-and f-Block Elements', 'Transition elements', 4, '["Lanthanoids", "Actinoids", "Chemical Reactivity"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Coordination Compounds', 'Complex chemistry', 5, '["Werner''s Theory", "Ligands", "Isomerism", "Crystal Field Theory"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Haloalkanes and Haloarenes', 'Organic halides', 6, '["SN1 and SN2 Reactions", "Optical Rotation", "Uses and Environmental Effects"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Alcohols, Phenols and Ethers', 'Oxygen-containing organic compounds', 7, '["Mechanisms of Dehydration", "Acidity of Phenols", "Kolbe''s Reaction"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Aldehydes, Ketones and Carboxylic Acids', 'Carbonyl compounds', 8, '["Nucleophilic Addition", "Aldol Condensation", "Cannizzaro Reaction"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Amines', 'Nitrogen-containing compounds', 9, '["Basicity of Amines", "Diazonium Salts", "Hofmann Bromamide Reaction"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biomolecules', 'Chemistry of life', 10, '["Carbohydrates", "Proteins", "Nucleic Acids"]'::jsonb
FROM subjects WHERE name = 'Chemistry' AND class = '12' ON CONFLICT DO NOTHING;

-- 8. CLASS 12 BIOLOGY CHAPTERS
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Sexual Reproduction in Flowering Plants', 'Plant reproduction', 1, '["Structure of Flower", "Pollination", "Double Fertilization", "Seeds"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Human Reproduction', 'Human biological processes', 2, '["Male/Female Systems", "Gametogenesis", "Menstrual Cycle", "Fertilization"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Reproductive Health', 'Society and health', 3, '["Birth Control", "Medical Termination of Pregnancy", "Infertility"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Principles of Inheritance and Variation', 'Genetics Part 1', 4, '["Mendelian Inheritance", "Chromosomal Disorders"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Molecular Basis of Inheritance', 'Genetics Part 2', 5, '["DNA Replication", "Transcription", "Translation", "Human Genome Project"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Evolution', 'Bio-history', 6, '["Natural Selection", "Adaptive Radiation", "Human Evolution"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Human Health and Disease', 'Medical basics', 7, '["Common Diseases", "Immunity", "AIDS and Cancer"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Microbes in Human Welfare', 'Useful bacteria/fungi', 8, '["Microbes in Household Products", "Microbes in Industrial Products", "Sewage Treatment"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biotechnology: Principles and Processes', 'Genetic engineering Part 1', 9, '["Restiction Enzymes", "PCR", "Bioreactors"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biotechnology and its Applications', 'Genetic engineering Part 2', 10, '["Bt Cotton", "Insulin", "Gene Therapy"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Organisms and Populations', 'Ecology Part 1', 11, '["Abiotic Factors", "Populations Interactions"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Ecosystem', 'Ecology Part 2', 12, '["Structure and Function", "Productivity", "Energy Flow", "Decomposition"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Biodiversity and Conservation', 'Ecology Part 3', 13, '["Loss of Biodiversity", "In-situ/Ex-situ Conservation"]'::jsonb
FROM subjects WHERE name = 'Biology' AND class = '12' ON CONFLICT DO NOTHING;

-- 9. CLASS 12 MATHEMATICS CHAPTERS
INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Relations and Functions', 'Advanced mappings', 1, '["Equivalence Relations", "One-one and Onto Functions"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Inverse Trigonometric Functions', 'Restricted domains', 2, '["Principal Value Branches", "Domain and Range"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Matrices', 'Linear algebra Part 1', 3, '["Types of Matrices", "Operation on Matrices", "Transpose"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Determinants', 'Linear algebra Part 2', 4, '["Area of Triangle", "Adjoint and Inverse", "System of Linear Equations"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Continuity and Differentiability', 'Calculus Part 1', 5, '["Exponential/Log Functions", "Logarithmic Differentiation", "Parametric Forms"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Application of Derivatives', 'Calculus Part 2', 6, '["Rate of Change", "Increasing/Decreasing Functions", "Maxima and Minima"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Integrals', 'Calculus Part 3', 7, '["Integration by Substitution", "Partial Fractions", "By Parts", "Definite Integrals"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Application of Integrals', 'Calculus Part 4', 8, '["Area under Simple Curves"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Differential Equations', 'Calculus Part 5', 9, '["Order and Degree", "Homogeneous Equations", "Linear Differential Equations"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Vector Algebra', 'Directional math', 10, '["Dot Product", "Cross Product", "Scalar Triple Product"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Three Dimensional Geometry', 'Space geometry', 11, '["Direction Cosines", "Equation of Line", "Shortest Distance"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Linear Programming', 'Optimization', 12, '["Feasible Region", "Optimal Solution"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;

INSERT INTO chapters (subject_id, name, description, order_num, topics)
SELECT id, 'Probability', 'Conditional chance', 13, '["Conditional Probability", "Bayes'' Theorem", "Random Variables"]'::jsonb
FROM subjects WHERE name = 'Mathematics' AND class = '12' ON CONFLICT DO NOTHING;
