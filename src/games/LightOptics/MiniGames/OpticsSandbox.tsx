import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  RotateCcw,
  Zap,
  Plus,
  Trash2,
  MousePointer2
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Component {
  id: string;
  type: 'plane' | 'concave' | 'convex';
  x: number;
  y: number;
  rotation: number;
}

export function OpticsSandbox() {
  const [components, setComponents] = useState<Component[]>([]);
  const [sourcePos, setSourcePos] = useState({ x: 15, y: 50 });
  const [sourceAngle, setSourceAngle] = useState(0);

  const addComponent = (type: 'plane' | 'concave' | 'convex') => {
    const newComp: Component = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 50,
      y: 50,
      rotation: 0
    };
    setComponents([...components, newComp]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-200">
           <Box size={14} /> Unrestricted Simulation
        </div>
        <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          OPTICS <span className="text-indigo-600">SANDBOX</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Toolbox */}
         <div className="space-y-6">
            <Card className="p-8 rounded-[48px] border-4 border-slate-100 bg-white shadow-xl">
               <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">Tools</h3>
                  <div className="grid grid-cols-2 gap-3">
                     <button onClick={() => addComponent('plane')} className="p-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors flex flex-col items-center gap-2">
                        <Plus size={20} /> Plane
                     </button>
                     <button onClick={() => addComponent('concave')} className="p-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-colors flex flex-col items-center gap-2">
                        <Plus size={20} /> Concave
                     </button>
                     <button onClick={() => addComponent('convex')} className="p-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-colors flex flex-col items-center gap-2">
                        <Plus size={20} /> Convex
                     </button>
                  </div>

                  <div className="pt-6 border-t-2 border-slate-50 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Angle</p>
                     <input type="range" min="-90" max="90" value={sourceAngle} onChange={(e) => setSourceAngle(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
               </div>
            </Card>

            <div className="p-8 bg-slate-900 rounded-[48px] text-white italic shadow-3xl">
               <div className="flex items-center gap-3 text-indigo-400 mb-4">
                  <Zap size={24} fill="currentColor" />
                  <span className="text-xs font-black uppercase">Tips</span>
               </div>
               <p className="text-xs font-bold leading-relaxed text-slate-400">
                  Drag mirrors to explore complex light paths. Concave mirrors converge rays, while convex mirrors spread them out.
               </p>
            </div>
         </div>

         {/* Sandbox Arena */}
         <div className="lg:col-span-3 h-[650px] bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden overflow-y-auto p-12">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
            
            {/* Light Source */}
            <div 
              style={{ left: `${sourcePos.x}%`, top: `${sourcePos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
               <div className="w-16 h-8 bg-slate-800 rounded-lg border-2 border-slate-700 p-1 flex items-center justify-center">
                  <div className="w-full h-full bg-indigo-500/20 rounded shadow-3xl shadow-indigo-500" />
               </div>
            </div>

            {/* Placed Components */}
            {components.map(comp => (
               <motion.div
                 key={comp.id}
                 drag
                 dragMomentum={false}
                 className="absolute cursor-move group h-32 w-4"
                 style={{ left: `${comp.x}%`, top: `${comp.y}%`, rotate: comp.rotation }}
               >
                  <div className={`w-full h-full rounded-full border-2 ${
                    comp.type === 'plane' ? 'bg-slate-400 border-white' :
                    comp.type === 'concave' ? 'bg-blue-400 border-blue-200 rounded-l-3xl shadow-blue-500/50' :
                    'bg-rose-400 border-rose-200 rounded-r-3xl shadow-rose-500/50'
                  }`} />
                  <button 
                    onClick={() => removeComponent(comp.id)}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                     <Trash2 size={16} />
                  </button>
               </motion.div>
            ))}

            <div className="absolute bottom-12 left-12 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
               <MousePointer2 size={14} /> Drag mirrors to relocate
            </div>
         </div>
      </div>
    </div>
  );
}
