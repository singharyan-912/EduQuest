-- ==========================================
-- NCERT EXHAUSTIVE TOPICS UPDATE (CLASS 12)
-- 2024-25 Syllabus
-- ==========================================

DO $$ 
DECLARE 
    v_subject_id uuid;
BEGIN

-- 1. PHYSICS CLASS 12
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Physics' AND class = '12';

UPDATE chapters SET topics = '["Electric Charge", "Conductors and Insulators", "Coulomb''s Law", "Forces between Multiple Charges", "Electric Field", "Electric Field Lines", "Electric Flux", "Electric Dipole", "Dipole in Uniform External Field", "Continuous Charge Distribution", "Gauss''s Law", "Applications of Gauss''s Law"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Electric Charges and Fields';

UPDATE chapters SET topics = '["Electrostatic Potential", "Potential due to Point Charge", "Potential due to Electric Dipole", "Equipotential Surfaces", "Potential Energy in External Field", "Electrostatics of Conductors", "Dielectrics and Polarisation", "Capacitors and Capacitance", "Parallel Plate Capacitor", "Energy Stored in Capacitor"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Electrostatic Potential and Capacitance';

UPDATE chapters SET topics = '["Electric Current", "Electric Currents in Conductors", "Ohm''s Law", "Drift of Electrons and Resistivity", "Mobility", "Limitations of Ohm''s Law", "Resistivity of Various Materials", "Temperature Dependence of Resistivity", "Electric Energy, Power", "Cells, emf, Internal Resistance", "Cells in Series and in Parallel", "Kirchhoff’s Rules", "Wheatstone Bridge"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Current Electricity';

UPDATE chapters SET topics = '["Magnetic Force", "Motion in a Magnetic Field", "Magnetic Field due to Current Element", "Magnetic Field on Axis of Circular Current Loop", "Ampere’s Circuital Law", "The Solenoid", "Force between Two Parallel Currents", "Torque on Current Loop", "Moving Coil Galvanometer"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Moving Charges and Magnetism';

UPDATE chapters SET topics = '["The Bar Magnet", "Magnetism and Gauss’s Law", "Magnetisation and Magnetic Intensity", "Magnetic Properties of Materials", "Permanent Magnets and Electromagnets"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Magnetism and Matter';

UPDATE chapters SET topics = '["The Experiments of Faraday and Henry", "Magnetic Flux", "Faraday’s Law of Induction", "Lenz’s Law and Conservation of Energy", "Motional Electromotive Force", "Inductance", "Self-Induction", "Mutual Induction", "AC Generator"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Electromagnetic Induction';

UPDATE chapters SET topics = '["AC Voltage Applied to a Resistor", "AC Voltage Applied to an Inductor", "AC Voltage Applied to a Capacitor", "AC Voltage Applied to a Series LCR Circuit", "Power in AC Circuit", "LC Oscillations", "Transformers"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Alternating Current';

UPDATE chapters SET topics = '["Displacement Current", "Electromagnetic Waves", "Electromagnetic Spectrum", "Radio Waves", "Microwaves", "Infrared Waves", "Visible Rays", "Ultraviolet Rays", "X-rays", "Gamma Rays"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Electromagnetic Waves';

UPDATE chapters SET topics = '["Reflection of Light by Spherical Mirrors", "Refraction", "Total Internal Reflection", "Refraction at Spherical Surfaces", "Refraction by a Prism", "Optical Instruments", "The Microscope", "The Telescope"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Ray Optics and Optical Instruments';

UPDATE chapters SET topics = '["Huygens Principle", "Refraction and Reflection using Huygens Principle", "Coherent and Incoherent Addition of Waves", "Interference of Light Waves and Young’s Experiment", "Diffraction", "Polarisation"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Wave Optics';

UPDATE chapters SET topics = '["Electron Emission", "Photoelectric Effect", "Experimental Study of Photoelectric Effect", "Einstein’s Photoelectric Equation", "Particle Nature of Light", "Wave Nature of Matter", "Davisson and Germer Experiment"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Dual Nature of Radiation and Matter';

UPDATE chapters SET topics = '["Alpha-particle Scattering and Rutherford’s Nuclear Model of Atom", "Atomic Spectra", "Bohr Model of the Hydrogen Atom", "The Line Spectra of the Hydrogen Atom", "de Broglie’s Explanation of Bohr’s Second Postulate of Quantisation"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Atoms';

UPDATE chapters SET topics = '["Atomic Masses and Composition of Nucleus", "Size of the Nucleus", "Mass-Energy and Nuclear Binding Energy", "Nuclear Force", "Radioactivity", "Nuclear Energy", "Fission", "Fusion"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Nuclei';

UPDATE chapters SET topics = '["Classification of Metals, Conductors and Semiconductors", "Intrinsic Semiconductor", "Extrinsic Semiconductor", "p-n Junction", "Semiconductor Diode", "Application of Junction Diode as a Rectifier", "Special Purpose p-n Junction Diodes", "Digital Electronics and Logic Gates"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Semiconductor Electronics';


-- 2. CHEMISTRY CLASS 12
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Chemistry' AND class = '12';

UPDATE chapters SET topics = '["Types of Solutions", "Expressing Concentration of Solutions", "Solubility", "Vapour Pressure of Liquid Solutions", "Ideal and Non-ideal Solutions", "Colligative Properties", "Determination of Molar Mass", "Abnormal Molar Masses"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Solutions';

UPDATE chapters SET topics = '["Electrochemical Cells", "Galvanic Cells", "Nernst Equation", "Conductance of Electrolytic Solutions", "Electrolytic Cells and Electrolysis", "Batteries", "Fuel Cells", "Corrosion"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Electrochemistry';

UPDATE chapters SET topics = '["Rate of a Chemical Reaction", "Factors Influencing Rate of a Reaction", "Integrated Rate Equations", "Pseudo First Order Reaction", "Temperature Dependence of the Rate of a Reaction", "Collision Theory of Chemical Reactions"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Chemical Kinetics';

UPDATE chapters SET topics = '["Position in the Periodic Table", "Electronic Configurations of d-Block Elements", "General Properties of Transition Elements", "Some Important Compounds of Transition Elements", "The Lanthanoids", "The Actinoids", "Some Applications of d- and f-Block Elements"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'The d-and f-Block Elements';

UPDATE chapters SET topics = '["Werner''s Theory of Coordination Compounds", "Definitions of Important Terms", "Nomenclature of Coordination Compounds", "Isomerism in Coordination Compounds", "Bonding in Coordination Compounds", "Valence Bond Theory", "Crystal Field Theory", "Bonding in Metal Carbonyls", "Importance and Applications"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Coordination Compounds';

UPDATE chapters SET topics = '["Classification", "Nomenclature", "Nature of C-X Bond", "Methods of Preparation", "Physical Properties", "Chemical Reactions", "Polyhalogen Compounds"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Haloalkanes and Haloarenes';

UPDATE chapters SET topics = '["Classification", "Nomenclature", "Structures of Functional Groups", "Alcohols and Phenols Preparation", "Physical Properties", "Chemical Reactions", "Some Commercially Important Alcohols", "Ethers Preparation & Reactions"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Alcohols, Phenols and Ethers';

UPDATE chapters SET topics = '["Nomenclature and Structure of Carbonyl Group", "Preparation of Aldehydes and Ketones", "Physical Properties", "Chemical Reactions", "Uses of Aldehydes and Ketones", "Nomenclature and Structure of Carboxyl Group", "Methods of Preparation of Carboxylic Acids", "Physical Properties", "Chemical Reactions", "Uses of Carboxylic Acids"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Aldehydes, Ketones and Carboxylic Acids';

UPDATE chapters SET topics = '["Structure of Amines", "Classification", "Nomenclature", "Preparation of Amines", "Physical Properties", "Chemical Reactions", "Method of Preparation of Diazonium Salts", "Physical Properties", "Chemical Reactions", "Importance in Synthesis of Aromatic Compounds"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Amines';

UPDATE chapters SET topics = '["Carbohydrates", "Classification", "Monosaccharides", "Disaccharides", "Polysaccharides", "Importance", "Proteins", "Amino Acids", "Structure of Proteins", "Enzymes", "Vitamins", "Nucleic Acids", "Hormones"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Biomolecules';


-- 3. BIOLOGY CLASS 12
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Biology' AND class = '12';

UPDATE chapters SET topics = '["Flower Structure", "Pre-fertilisation: Structures and Events", "Double Fertilisation", "Post-fertilisation: Structures and Events", "Apomixis and Polyembryony"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Sexual Reproduction in Flowering Plants';

UPDATE chapters SET topics = '["The Male Reproductive System", "The Female Reproductive System", "Gametogenesis", "Menstrual Cycle", "Fertilisation and Implantation", "Pregnancy and Embryonic Development", "Parturition and Lactation"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Human Reproduction';

UPDATE chapters SET topics = '["Reproductive Health: Problems and Strategies", "Population Explosion and Birth Control", "Medical Termination of Pregnancy", "Sexually Transmitted Infections (STIs)", "Infertility"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Reproductive Health';

UPDATE chapters SET topics = '["Mendel’s Laws of Inheritance", "Inheritance of One Gene", "Inheritance of Two Genes", "Sex Determination", "Mutation", "Genetic Disorders"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Principles of Inheritance and Variation';

UPDATE chapters SET topics = '["The DNA", "The Search for Genetic Material", "RNA World", "Replication", "Transcription", "Genetic Code", "Translation", "Regulation of Gene Expression", "Human Genome Project", "DNA Fingerprinting"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Molecular Basis of Inheritance';

UPDATE chapters SET topics = '["Origin of Life", "Evolution of Life Forms - A Theory", "What are the Evidences for Evolution?", "What is Adaptive Radiation?", "Biological Evolution", "Mechanism of Evolution", "Hardy-Weinberg Principle", "A Brief Account of Evolution", "Origin and Evolution of Man"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Evolution';

UPDATE chapters SET topics = '["Common Diseases in Humans", "Immunity", "AIDS", "Cancer", "Drugs and Alcohol Abuse"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Human Health and Disease';

UPDATE chapters SET topics = '["Microbes in Household Products", "Microbes in Industrial Products", "Microbes in Sewage Treatment", "Microbes in Production of Biogas", "Microbes as Biocontrol Agents", "Microbes as Biofertilisers"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Microbes in Human Welfare';

UPDATE chapters SET topics = '["Principles of Biotechnology", "Tools of Recombinant DNA Technology", "Processes of Recombinant DNA Technology"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Biotechnology: Principles and Processes';

UPDATE chapters SET topics = '["Biotechnological Applications in Agriculture", "Biotechnological Applications in Medicine", "Transgenic Animals", "Ethical Issues"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Biotechnology and its Applications';

UPDATE chapters SET topics = '["Population Attributes", "Population Growth", "Life History Variation", "Population Interactions"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Organisms and Populations';

UPDATE chapters SET topics = '["Ecosystem: Structure and Function", "Productivity", "Decomposition", "Energy Flow", "Ecological Pyramids", "Ecological Succession", "Nutrient Cycling", "Ecosystem Services"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Ecosystem';

UPDATE chapters SET topics = '["Biodiversity", "Biodiversity Conservation"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Biodiversity and Conservation';


-- 4. MATHEMATICS CLASS 12
SELECT id INTO v_subject_id FROM subjects WHERE name = 'Mathematics' AND class = '12';

UPDATE chapters SET topics = '["Types of Relations", "Types of Functions", "Composition of Functions and Invertible Function"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Relations and Functions';

UPDATE chapters SET topics = '["Basic Concepts", "Properties of Inverse Trigonometric Functions"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Inverse Trigonometric Functions';

UPDATE chapters SET topics = '["Matrix", "Types of Matrices", "Operations on Matrices", "Transpose of a Matrix", "Symmetric and Skew Symmetric Matrices", "Invertible Matrices"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Matrices';

UPDATE chapters SET topics = '["Determinant", "Area of a Triangle", "Minors and Cofactors", "Adjoint and Inverse of a Matrix", "Applications of Determinants and Matrices"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Determinants';

UPDATE chapters SET topics = '["Continuity", "Differentiability", "Exponential and Logarithmic Functions", "Logarithmic Differentiation", "Derivatives of Functions in Parametric Forms", "Second Order Derivative"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Continuity and Differentiability';

UPDATE chapters SET topics = '["Rate of Change of Quantities", "Increasing and Decreasing Functions", "Maxima and Minima"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Application of Derivatives';

UPDATE chapters SET topics = '["Integration as an Inverse Process of Differentiation", "Methods of Integration", "Integrals of some Particular Functions", "Integration by Partial Fractions", "Integration by Parts", "Definite Integral", "Fundamental Theorem of Calculus", "Evaluation of Definite Integrals by Substitution", "Some Properties of Definite Integrals"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Integrals';

UPDATE chapters SET topics = '["Area under Simple Curves", "Area between Two Curves (Excluded)"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Application of Integrals';

UPDATE chapters SET topics = '["Basic Concepts", "General and Particular Solutions of a Differential Equation", "Methods of Solving First Order, First Degree Differential Equations"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Differential Equations';

UPDATE chapters SET topics = '["Some Basic Concepts", "Types of Vectors", "Addition of Vectors", "Multiplication of a Vector by a Scalar", "Product of Two Vectors", "Scalar (dot) Product", "Vector (cross) Product"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Vector Algebra';

UPDATE chapters SET topics = '["Direction Cosines and Direction Ratios of a Line", "Equation of a Line in Space", "Angle between Two Lines", "Shortest Distance between Two Lines"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Three Dimensional Geometry';

UPDATE chapters SET topics = '["Linear Programming Problem and its Mathematical Formulation", "Graphical Method of Solving Linear Programming Problems"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Linear Programming';

UPDATE chapters SET topics = '["Conditional Probability", "Multiplication Theorem on Probability", "Independent Events", "Bayes'' Theorem", "Random Variables and its Probability Distributions"]'::jsonb 
WHERE subject_id = v_subject_id AND name = 'Probability';

END $$;
