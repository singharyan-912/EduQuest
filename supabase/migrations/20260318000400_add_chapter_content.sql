-- Add content column to chapters and populate Class 10/12 samples

-- 1. Add column
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS content jsonb DEFAULT NULL;

-- 2. Sample Content: Class 10 Chemistry - Chemical Reactions and Equations
UPDATE public.chapters 
SET content = '{
  "learning": [
    {
      "type": "concept",
      "title": "Introduction to Chemical Reactions",
      "content": "Chemical reactions occur when chemical bonds between atoms are formed or broken. The substances that go into a chemical reaction are called the reactants, and the substances that come out of the reaction are known as the products.",
      "visual": "https://images.unsplash.com/photo-1532187875605-1ef6c237f146?w=800&auto=format&fit=crop&q=60"
    },
    {
      "type": "example",
      "title": "Solving for Balanced Equations",
      "content": "To balance an equation, you must ensure the number of atoms for each element is the same on both sides.",
      "steps": [
        "Write the unbalanced equation: Fe + H2O -> Fe3O4 + H2",
        "Balance oxygen atoms: Fe + 4H2O -> Fe3O4 + H2",
        "Balance hydrogen atoms: Fe + 4H2O -> Fe3O4 + 4H2",
        "Balance iron atoms: 3Fe + 4H2O -> Fe3O4 + 4H2"
      ]
    },
    {
      "type": "interaction",
      "interactionType": "quiz_mini",
      "question": "In the reaction 2Mg + O2 -> 2MgO, what are the reactants?",
      "options": ["MgO", "Mg and O2", "Only Mg", "Only O2"],
      "correct": 1
    }
  ],
  "challenge": {
    "quiz": [
      {
        "question": "Burning of coal is which type of reaction?",
        "options": ["Decomposition", "Combination", "Displacement", "Double Displacement"],
        "correct": 1
      },
      {
        "question": "What happens when dilute hydrochloric acid is added to iron fillings?",
        "options": ["Hydrogen gas and iron chloride are produced", "Chlorine gas and iron hydroxide are produced", "No reaction takes place", "Iron salt and water are produced"],
        "correct": 0
      },
      {
        "question": "Which of the following is a physical change?",
        "options": ["Formation of curd from milk", "Ripening of fruits", "Melting of ice", "Burning of wood"],
        "correct": 2
      },
      {
        "question": "The process of respiration is:",
        "options": ["An oxidation reaction which is endothermic", "A reduction reaction which is exothermic", "A combination reaction which is endothermic", "An oxidation reaction which is exothermic"],
        "correct": 3
      },
      {
        "question": "Which gas is evolved when zinc reacts with dilute sulfuric acid?",
        "options": ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
        "correct": 1
      }
    ],
    "game": {
      "type": "equation_balancer",
      "config": {
        "title": "Master the Balance",
        "equation": "H2 + O2 -> H2O",
        "target": "2H2 + O2 -> 2H2O"
      }
    }
  }
}'::jsonb
WHERE name = 'Chemical Reactions and Equations' AND subject_id IN (SELECT id FROM subjects WHERE name = 'Chemistry' AND class = '10');

-- 3. Sample Content: Class 10 Physics - Light – Reflection and Refraction
UPDATE public.chapters 
SET content = '{
  "learning": [
    {
      "type": "concept",
      "title": "Laws of Reflection",
      "content": "Reflection is the bouncing back of light when it hits a polished surface. The two laws are: 1. Angle of incidence = Angle of reflection. 2. The incident ray, reflected ray, and normal all lie in the same plane.",
      "visual": "https://images.unsplash.com/photo-1506318137071-a8e063b49983?w=800&auto=format&fit=crop&q=60"
    },
    {
      "type": "example",
      "title": "Using the Mirror Formula",
      "content": "Find the position of an object placed 20cm in front of a concave mirror of focal length 10cm.",
      "steps": [
        "Given: u = -20cm, f = -10cm",
        "Mirror Formula: 1/v + 1/u = 1/f",
        "1/v = 1/f - 1/u = 1/(-10) - 1/(-20)",
        "1/v = -1/10 + 1/20 = -1/20",
        "v = -20cm. The image is real and inverted."
      ]
    }
  ],
  "challenge": {
    "quiz": [
      {
        "question": "The unit of power of a lens is:",
        "options": ["Meter", "Dioptre", "Watt", "Joule"],
        "correct": 1
      },
      {
        "question": "A concave mirror gives real, inverted and same size image if the object is placed:",
        "options": ["At F", "At C", "Beyond C", "Between P and F"],
        "correct": 1
      }
    ],
    "game": {
      "type": "ray_tracer",
      "config": {
        "title": "Light Path",
        "objective": "Adjust the mirror angle to hit the target"
      }
    }
  }
}'::jsonb
WHERE name = 'Light – Reflection and Refraction' AND subject_id IN (SELECT id FROM subjects WHERE name = 'Physics' AND class = '10');
