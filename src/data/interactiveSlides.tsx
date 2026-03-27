import React from 'react';
import { Maximize2, ZoomIn } from 'lucide-react';

export interface InteractiveSlideType {
  title: string;
  content: string;
  visual?: string;
  visual_type?: string;
  component?: React.ReactNode;
}

const MindMapViewer = ({ imageUrl, title }: { imageUrl: string, title: string }) => {
  return (
    <div className="relative group w-full h-full min-h-[500px] rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-2xl flex flex-col cursor-zoom-in">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Scrollable container for the large mind map */}
      <div className="flex-1 w-full h-full overflow-auto custom-scrollbar p-8">
          <img 
            src={imageUrl} 
            alt={title} 
            className="min-w-full min-h-full object-contain transition-transform duration-300 transform-gpu hover:scale-110" 
            style={{ padding: '2rem' }}
          />
      </div>

      <div className="absolute bottom-6 right-6 bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl text-white flex items-center space-x-3 text-sm font-bold border border-white/10 shadow-xl group-hover:bg-slate-800 transition-colors">
        <ZoomIn size={18} className="text-blue-400" />
        <span>Hover to zoom & scroll</span>
      </div>
    </div>
  );
};

const interactiveSlidesRegistry: Record<string, InteractiveSlideType[]> = {
  'control-and-coordination': [
    {
      title: 'Control and Coordination',
      content: 'Detailed interactive view for Control and Coordination.',
      visual: '/slides/Class 10/Mind Map-1/Biology/Control and Coordination.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Biology/Control and Coordination.png" title="Control and Coordination" />
    },
  ],
  'heredity-and-evolution': [
    {
      title: 'Heredity and Evolution',
      content: 'Detailed interactive view for Heredity and Evolution.',
      visual: '/slides/Class 10/Mind Map-1/Biology/Heredity and Evolution.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Biology/Heredity and Evolution.png" title="Heredity and Evolution" />
    },
  ],
  'how-do-organisms-reproduce': [
    {
      title: 'How do Organisms Reproduce',
      content: 'Detailed interactive view for How do Organisms Reproduce.',
      visual: '/slides/Class 10/Mind Map-1/Biology/How do Organisms Reproduce.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Biology/How do Organisms Reproduce.png" title="How do Organisms Reproduce" />
    },
  ],
  'life-processes': [
    {
      title: 'Life Processes',
      content: 'Detailed interactive view for Life Processes.',
      visual: '/slides/Class 10/Mind Map-1/Biology/Life Processes.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Biology/Life Processes.png" title="Life Processes" />
    },
  ],
  'management-of-natural-resources': [
    {
      title: 'Management of Natural Resources',
      content: 'Detailed interactive view for Management of Natural Resources.',
      visual: '/slides/Class 10/Mind Map-1/Biology/Management of Natural Resources.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Biology/Management of Natural Resources.png" title="Management of Natural Resources" />
    },
  ],
  'our-environment': [
    {
      title: 'Our Environment',
      content: 'Detailed interactive view for Our Environment.',
      visual: '/slides/Class 10/Mind Map-1/Biology/Our Environment.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Biology/Our Environment.png" title="Our Environment" />
    },
  ],
  'acids-bases-and-salts': [
    {
      title: 'Acids, Bases and Salts',
      content: 'Detailed interactive view for Acids, Bases and Salts.',
      visual: '/slides/Class 10/Mind Map-1/Chemistry/Acids, Bases and Salts.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Chemistry/Acids, Bases and Salts.png" title="Acids, Bases and Salts" />
    },
  ],
  'carbon-and-its-compounds': [
    {
      title: 'Carbon and Its Compounds',
      content: 'Detailed interactive view for Carbon and Its Compounds.',
      visual: '/slides/Class 10/Mind Map-1/Chemistry/Carbon and Its Compounds.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Chemistry/Carbon and Its Compounds.png" title="Carbon and Its Compounds" />
    },
  ],
  'chemical-reactions-and-equations': [
    {
      title: 'Chemical Reactions and Equations',
      content: 'Detailed interactive view for Chemical Reactions and Equations.',
      visual: '/slides/Class 10/Mind Map-1/Chemistry/Chemical Reactions and Equations.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Chemistry/Chemical Reactions and Equations.png" title="Chemical Reactions and Equations" />
    },
  ],
  'metals-and-non-metals': [
    {
      title: 'Metals and Non-Metals',
      content: 'Detailed interactive view for Metals and Non-Metals.',
      visual: '/slides/Class 10/Mind Map-1/Chemistry/Metals and Non-Metals.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Chemistry/Metals and Non-Metals.png" title="Metals and Non-Metals" />
    },
  ],
  'periodic-classification-of-elements': [
    {
      title: 'Periodic Classification of Elements',
      content: 'Detailed interactive view for Periodic Classification of Elements.',
      visual: '/slides/Class 10/Mind Map-1/Chemistry/Periodic Classification of Elements.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Chemistry/Periodic Classification of Elements.png" title="Periodic Classification of Elements" />
    },
  ],
  'areas-related-to-circles': [
    {
      title: 'Areas Related to Circles',
      content: 'Detailed interactive view for Areas Related to Circles.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Areas Related to Circles.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Areas Related to Circles.png" title="Areas Related to Circles" />
    },
  ],
  'arithmetic-progressions': [
    {
      title: 'Arithmetic Progressions',
      content: 'Detailed interactive view for Arithmetic Progressions.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Arithmetic Progressions.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Arithmetic Progressions.png" title="Arithmetic Progressions" />
    },
  ],
  'circles': [
    {
      title: 'Circles',
      content: 'Detailed interactive view for Circles.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Circles.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Circles.png" title="Circles" />
    },
  ],
  'coordinate-geometry': [
    {
      title: 'Coordinate Geometry',
      content: 'Detailed interactive view for Coordinate Geometry.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Coordinate Geometry.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Coordinate Geometry.png" title="Coordinate Geometry" />
    },
  ],
  'pair-of-linear-equations-in-two-variables': [
    {
      title: 'Pair of Linear Equations in Two Variables',
      content: 'Detailed interactive view for Pair of Linear Equations in Two Variables.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Pair of Linear Equations in Two Variables.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Pair of Linear Equations in Two Variables.png" title="Pair of Linear Equations in Two Variables" />
    },
  ],
  'polynomials': [
    {
      title: 'Polynomials',
      content: 'Detailed interactive view for Polynomials.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Polynomials.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Polynomials.png" title="Polynomials" />
    },
  ],
  'probability': [
    {
      title: 'Probability',
      content: 'Detailed interactive view for Probability.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Probability.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Probability.png" title="Probability" />
    },
  ],
  'quadratic-equations': [
    {
      title: 'Quadratic Equations',
      content: 'Detailed interactive view for Quadratic Equations.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Quadratic Equations.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Quadratic Equations.png" title="Quadratic Equations" />
    },
  ],
  'real-numbers': [
    {
      title: 'Real Numbers',
      content: 'Detailed interactive view for Real Numbers.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Real Numbers.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Real Numbers.png" title="Real Numbers" />
    },
  ],
  'statistics': [
    {
      title: 'Statistics',
      content: 'Detailed interactive view for Statistics.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Statistics.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Statistics.png" title="Statistics" />
    },
  ],
  'surface-areas-and-volumes': [
    {
      title: 'Surface Areas and Volumes',
      content: 'Detailed interactive view for Surface Areas and Volumes.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Surface Areas and Volumes.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Surface Areas and Volumes.png" title="Surface Areas and Volumes" />
    },
  ],
  'triangles': [
    {
      title: 'Triangles',
      content: 'Detailed interactive view for Triangles.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Triangles.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Triangles.png" title="Triangles" />
    },
  ],
  'trigonometry': [
    {
      title: 'Trigonometry',
      content: 'Detailed interactive view for Trigonometry.',
      visual: '/slides/Class 10/Mind Map-1/Maths/Trigonometry.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Maths/Trigonometry.png" title="Trigonometry" />
    },
  ],
  'electricity': [
    {
      title: 'Electricity',
      content: 'Detailed interactive view for Electricity.',
      visual: '/slides/Class 10/Mind Map-1/Physics/Electricity.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Physics/Electricity.png" title="Electricity" />
    },
  ],
  'human-eye-and-colourful-world': [
    {
      title: 'Human Eye and Colourful World',
      content: 'Detailed interactive view for Human Eye and Colourful World.',
      visual: '/slides/Class 10/Mind Map-1/Physics/Human Eye and Colourful World.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Physics/Human Eye and Colourful World.png" title="Human Eye and Colourful World" />
    },
  ],
  'light-reflection-refraction': [
    {
      title: 'Light – Reflection and Refraction',
      content: 'Detailed interactive view for Light – Reflection and Refraction.',
      visual: '/slides/Class 10/Mind Map-1/Physics/Light – Reflection and Refraction.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Physics/Light – Reflection and Refraction.png" title="Light – Reflection and Refraction" />
    },
  ],
  'magnetic-effects-of-electric-current': [
    {
      title: 'Magnetic Effects of Electric Current',
      content: 'Detailed interactive view for Magnetic Effects of Electric Current.',
      visual: '/slides/Class 10/Mind Map-1/Physics/Magnetic Effects of Electric Current.png',
      component: <MindMapViewer imageUrl="/slides/Class 10/Mind Map-1/Physics/Magnetic Effects of Electric Current.png" title="Magnetic Effects of Electric Current" />
    },
  ],
  'reproduction-in-organisms': [
    {
      title: 'Reproduction in Organisms',
      content: 'Detailed interactive view for Reproduction in Organisms.',
      visual: '/slides/Class 12/Mind map/Biology/Reproduction in Organisms.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Biology/Reproduction in Organisms.png" title="Reproduction in Organisms" />
    },
  ],
  'sexual-reproduction-in-flowering-plants': [
    {
      title: 'Sexual Reproduction in Flowering Plants',
      content: 'Detailed interactive view for Sexual Reproduction in Flowering Plants.',
      visual: '/slides/Class 12/Mind map/Biology/Sexual Reproduction in Flowering Plants.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Biology/Sexual Reproduction in Flowering Plants.png" title="Sexual Reproduction in Flowering Plants" />
    },
  ],
  'solid-state': [
    {
      title: 'Solid State',
      content: 'Detailed interactive view for Solid State.',
      visual: '/slides/Class 12/Mind map/Chemistry/Solid State.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Chemistry/Solid State.png" title="Solid State" />
    },
  ],
  'solutions': [
    {
      title: 'Solutions',
      content: 'Detailed interactive view for Solutions.',
      visual: '/slides/Class 12/Mind map/Chemistry/Solutions.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Chemistry/Solutions.png" title="Solutions" />
    },
  ],
  'inverse-trigonometric-functions': [
    {
      title: 'Inverse Trigonometric Functions',
      content: 'Detailed interactive view for Inverse Trigonometric Functions.',
      visual: '/slides/Class 12/Mind map/Maths/Inverse Trigonometric Functions.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Maths/Inverse Trigonometric Functions.png" title="Inverse Trigonometric Functions" />
    },
  ],
  'relations-and-functions': [
    {
      title: 'Relations and Functions',
      content: 'Detailed interactive view for Relations and Functions.',
      visual: '/slides/Class 12/Mind map/Maths/Relations and Functions.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Maths/Relations and Functions.png" title="Relations and Functions" />
    },
  ],
  'electric-charges-and-fields': [
    {
      title: 'Electric Charges and Fields',
      content: 'Detailed interactive view for Electric Charges and Fields.',
      visual: '/slides/Class 12/Mind map/Physics/Electric Charges and Fields.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Physics/Electric Charges and Fields.png" title="Electric Charges and Fields" />
    },
  ],
  'electrostatic-potential-and-capacitance': [
    {
      title: 'Electrostatic Potential and Capacitance',
      content: 'Detailed interactive view for Electrostatic Potential and Capacitance.',
      visual: '/slides/Class 12/Mind map/Physics/Electrostatic Potential and Capacitance.png',
      component: <MindMapViewer imageUrl="/slides/Class 12/Mind map/Physics/Electrostatic Potential and Capacitance.png" title="Electrostatic Potential and Capacitance" />
    },
  ],
};

export const getInteractiveSlides = (chapterName: string): InteractiveSlideType[] => {
  // Direct match try
  if (interactiveSlidesRegistry[chapterName]) return interactiveSlidesRegistry[chapterName];
  
  // Slugify match try
  let slug = chapterName
    .toLowerCase()
    .replace(/[\s–,-]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/^-+|-+$/g, '');
    
  if (slug === 'light-reflection-and-refraction') {
    slug = 'light-reflection-refraction';
  }

  return interactiveSlidesRegistry[slug] || [];
};
