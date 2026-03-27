import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Focus, 
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface FormulaLabProps {
  onComplete: () => void;
}

export function FormulaLab({ onComplete }: FormulaLabProps) {
  const [u, setU] = useState(-40); // Object distance (negative by convention)
  const [f, setF] = useState(30); // Focal length (positive for convex/concave mirror)
  const [mode, setMode] = useState<'mirror' | 'lens'>('mirror');

  // Mirror formula: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u => v = (f * u) / (u - f)
  // Lens formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u => v = (f * u) / (u + f)
  
  const v = mode === 'mirror' 
    ? (f * u) / (u - f) 
    : (f * u) / (u + f);

  const m = mode === 'mirror' 
    ? -v / u 
    : v / u;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-slate-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
                       <Focus size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Formula Lab</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">u, v, f Relationships</p>
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <button onClick={() => setMode('mirror')} className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'mirror' ? 'bg-teal-600 border-teal-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Mirror</button>
                    <button onClick={() => setMode('lens')} className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'lens' ? 'bg-teal-600 border-teal-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Lens</button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black text-slate-900 uppercase italic">Obj Distance (u)</span>
                          <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-teal-500 shadow-sm border border-slate-100">{u.toFixed(1)} cm</span>
                       </div>
                       <input 
                         type="range" min="-100" max="-10" value={u} 
                         onChange={(e) => setU(parseInt(e.target.value))}
                         className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500"
                       />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black text-slate-900 uppercase italic">Focal Length (f)</span>
                          <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-teal-500 shadow-sm border border-slate-100">{f.toFixed(1)} cm</span>
                       </div>
                       <input 
                         type="range" min="10" max="60" value={f} 
                         onChange={(e) => setF(parseInt(e.target.value))}
                         className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500"
                       />
                    </div>
                 </div>

                 <Card className="p-6 bg-slate-900 rounded-3xl text-white italic">
                    <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-3">Calculated Output</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400">Img Distance (v)</span>
                          <span className="text-lg font-black">{v.toFixed(1)} cm</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400">Magnification (m)</span>
                          <span className={`text-lg font-black ${Math.abs(m) > 1 ? 'text-teal-400' : 'text-rose-400'}`}>{m.toFixed(2)}x</span>
                       </div>
                    </div>
                 </Card>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-50">
                 <Button onClick={onComplete} className="w-full py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-sm">
                    Finish Lab Analysis <ChevronRight className="ml-2 inline" />
                 </Button>
              </div>
           </Card>
        </div>

        {/* Dynamic Visualization Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[550px]">
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
           
           {/* Principal Axis */}
           <div className="absolute w-full h-px bg-slate-800 top-1/2 left-0 pointer-events-none" />

           {/* Mirror/Lens Central Indicator */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[300px] bg-slate-800 border-r border-slate-700 pointer-events-none" />
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase z-10">Pole / Optical Center</div>

           {/* Object */}
           <motion.div 
             animate={{ x: u * 4 }}
             className="absolute left-1/2 top-1/2 -translate-y-full flex flex-col items-center"
           >
              <div className="w-2 h-24 bg-teal-500 rounded-full shadow-3xl shadow-teal-500/50" />
              <div className="w-6 h-6 bg-teal-400 rounded-full -mt-3 border-2 border-white" />
              <span className="text-[10px] font-black text-teal-400 mt-2 uppercase">Object</span>
              <span className="text-[8px] font-bold text-slate-500">{u.toFixed(0)}cm</span>
           </motion.div>

           {/* Image */}
           <AnimatePresence>
             {!isNaN(v) && isFinite(v) && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ 
                   x: v * 4, 
                   opacity: 1,
                   scaleY: m,
                 }}
                 className={`absolute left-1/2 top-1/2 flex flex-col items-center
                    ${m > 0 ? '-translate-y-full' : 'translate-y-0'}
                 `}
               >
                  <div className="w-2 h-24 bg-rose-500 rounded-full opacity-60 shadow-xl" />
                  <div className="w-6 h-6 bg-rose-400 rounded-full -mt-3 border-2 border-white/50" />
                  <span className="text-[10px] font-black text-rose-400 mt-2 uppercase tracking-tighter">Image</span>
                  <span className="text-[8px] font-bold text-slate-500">{v.toFixed(0)}cm</span>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Math Formula Bubble */}
           <div className="absolute bottom-12 px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] text-center space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Equation</p>
              <h4 className="text-3xl font-black text-white italic tracking-tighter">
                 1/({f}) = 1/({v.toFixed(1)}) {mode === 'mirror' ? '+' : '-'} 1/({u})
              </h4>
           </div>

           {/* Magnification Alert */}
           {Math.abs(m) > 1 && (
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-12 left-12 px-6 py-3 bg-teal-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-3xl flex items-center gap-2"
              >
                 <Maximize2 size={14} /> Enlarged Image
              </motion.div>
           )}
           {Math.abs(m) < 1 && (
              <div className="absolute top-12 left-12 px-6 py-3 bg-rose-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-3xl flex items-center gap-2">
                 <Minimize2 size={14} /> Diminished Image
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
