import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  Trophy,
  ChevronRight,
  LayoutGrid,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface RayDiagramBuilderProps {
  onComplete: () => void;
}

export function RayDiagramBuilder({ onComplete }: RayDiagramBuilderProps) {
  const [objectPos, setObjectPos] = useState(30); // Position from mirror (0-100)
  const [activeRays, setActiveRays] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focalLength] = useState(40);

  const toggleRay = (id: string) => {
    if (activeRays.includes(id)) {
      setActiveRays(prev => prev.filter(r => r !== id));
    } else {
      setActiveRays(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (activeRays.length >= 2) {
      setTimeout(() => setIsSuccess(true), 1500);
    }
  }, [activeRays]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ray Selector */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-slate-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                       <LayoutGrid size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Ray Builder</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Principal Construction</p>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-sm font-black text-slate-900 uppercase italic">Object At</span>
                       <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-blue-500 shadow-sm border border-slate-100">{objectPos > focalLength * 2 ? 'Beyond C' : objectPos > focalLength ? 'Between C & F' : 'Inside F'}</span>
                    </div>
                    <input 
                      type="range" min="10" max="90" value={objectPos} 
                      onChange={(e) => setObjectPos(parseInt(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>

                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Select Principal Rays</p>
                    {[
                      { id: 'parallel', label: 'Parallel to Axis' },
                      { id: 'focus', label: 'Through Focus' },
                      { id: 'center', label: 'Through Center (C)' }
                    ].map(ray => (
                       <button
                         key={ray.id}
                         onClick={() => toggleRay(ray.id)}
                         className={`w-full p-4 rounded-2xl border-4 text-left font-black text-xs uppercase italic tracking-tighter transition-all flex items-center justify-between
                           ${activeRays.includes(ray.id) ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white border-slate-50 text-slate-400 hover:border-blue-200'}
                         `}
                       >
                          {ray.label}
                          {activeRays.includes(ray.id) && <Zap size={14} fill="white" />}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-50">
                 <button onClick={() => setActiveRays([])} className="w-full py-4 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em]">
                    <RotateCcw size={14} className="inline mr-2" /> Reset Construction
                 </button>
              </div>
           </Card>
        </div>

        {/* Diagram Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[550px]">
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
           
           {/* Principal Axis */}
           <div className="absolute w-full h-px bg-slate-800 top-1/2 left-0 pointer-events-none" />

           {/* Focal Points Labels */}
           <div className="absolute left-[50%] top-1/2 mt-4 -translate-x-1/2 flex gap-[80px] pointer-events-none">
              <div className="text-slate-600 font-black text-xs">F</div>
              <div className="text-slate-600 font-black text-xs">C</div>
           </div>

           {/* Mirror Line */}
           <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-4 h-[300px] bg-slate-800 rounded-full border-r-4 border-blue-400/50" />

           {/* Object */}
           <motion.div 
             animate={{ right: `${10 + objectPos}%` }}
             className="absolute top-1/2 -translate-y-full flex flex-col items-center pointer-events-none"
           >
              <div className="w-1 h-20 bg-emerald-500 rounded-full shadow-3xl shadow-emerald-500/50" />
              <div className="w-4 h-4 bg-emerald-400 rounded-full -mt-2 border-2 border-white" />
              <span className="text-[10px] font-black text-emerald-500 mt-2 uppercase">Object</span>
           </motion.div>

           {/* Ray Construction SVG */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 1000">
              <AnimatePresence>
                 {activeRays.includes('parallel') && (
                   <motion.path
                     initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                     d={`M ${900 - objectPos * 10} 400 L 900 400 L 500 500 L 100 600`}
                     fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5"
                   />
                 )}
                 {activeRays.includes('focus') && (
                   <motion.path
                     initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                     d={`M ${900 - objectPos * 10} 400 L 580 500 L 900 600 L 900 600`} // Simplified reflect
                     fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="10 5"
                   />
                 )}
              </AnimatePresence>
           </svg>

           {/* Image (Ghost) */}
           {activeRays.length >= 2 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
               style={{ 
                 right: `${10 + (objectPos < focalLength ? -20 : objectPos * 1.5)}%`, 
                 transform: `translateY(${objectPos < focalLength ? '-100%' : '100%'}) scaleY(${objectPos < focalLength ? 1.5 : -0.8})` 
               }}
               className="absolute top-1/2 flex flex-col items-center"
             >
                <div className="w-1 h-20 bg-blue-400 rounded-full" />
                <span className="text-[10px] font-black text-blue-400 mt-2 uppercase">Image</span>
             </motion.div>
           )}

           {/* Success Notification */}
           {isSuccess && (
             <motion.div 
               initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
               className="absolute bottom-12 px-12 py-6 bg-blue-600 rounded-[32px] text-white flex items-center gap-6 shadow-4xl cursor-pointer"
               onClick={onComplete}
             >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                   <Trophy size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black italic uppercase tracking-tighter">Construction Valid!</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Principal rays correctly intersected.</p>
                </div>
                <ChevronRight className="ml-4" />
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
