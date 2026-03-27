import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Glasses, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface LensLabProps {
  onComplete: () => void;
}

export function LensLab({ onComplete }: LensLabProps) {
  const [objectX, setObjectX] = useState(-50);
  const [focalLength, setFocalLength] = useState(30);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');

  // Lens formula: 1/v = 1/f + 1/u
  const u = objectX;
  const f = lensType === 'convex' ? focalLength : -focalLength;
  const v = (f * u) / (u + f);
  const mag = v / u;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lens Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-slate-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                       <Glasses size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Lens Lab</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Image Formation</p>
                    </div>
                 </div>

                 <div className="flex gap-2">
                    <button onClick={() => setLensType('convex')} className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${lensType === 'convex' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Convex</button>
                    <button onClick={() => setLensType('concave')} className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${lensType === 'concave' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>Concave</button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black text-slate-900 uppercase italic">Object Position</span>
                          <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-rose-500 shadow-sm border border-slate-100">{Math.abs(objectX)}cm</span>
                       </div>
                       <input 
                         type="range" min="-120" max="-10" value={objectX} 
                         onChange={(e) => setObjectX(parseInt(e.target.value))}
                         className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-rose-500"
                       />
                    </div>
                 </div>

                 <Card className="p-5 bg-slate-900 rounded-3xl text-white italic">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Image Stats</p>
                    <p className="text-xs font-bold leading-relaxed">
                       Nature: <span className="text-rose-300">{Math.abs(u) > Math.abs(f) && lensType === 'convex' ? 'Real & Inverted' : 'Virtual & Erect'}</span><br/>
                       Size: <span className="text-rose-300">{Math.abs(mag) > 1 ? 'Magnified' : 'Diminished'}</span>
                    </p>
                 </Card>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-50">
                 <Button onClick={onComplete} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em]">
                    Master Lens Power <ChevronRight className="ml-2 inline" />
                 </Button>
              </div>
           </Card>
        </div>

        {/* Visualizer Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[550px]">
           <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-rose-900/20 to-transparent" />
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
           
           {/* Principal Axis */}
           <div className="absolute w-full h-px bg-slate-800 top-1/2 left-0 pointer-events-none" />

           {/* Lens Visualization */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className={`w-8 h-[300px] rounded-full border-4 shadow-3xl ${lensType === 'convex' ? 'bg-rose-400/20 border-rose-300/40' : 'bg-indigo-400/20 border-indigo-300/40 skew-x-[-2deg]'}`} />
           </div>

           {/* Focal Points */}
           <div className="absolute left-[35%] top-1/2 mt-4 text-slate-700 font-bold text-[10px]">F1</div>
           <div className="absolute left-[65%] top-1/2 mt-4 text-slate-700 font-bold text-[10px]">F2</div>

           {/* Object */}
           <motion.div 
             animate={{ x: objectX * 3.5 }}
             className="absolute left-1/2 top-1/2 -translate-y-full flex flex-col items-center"
           >
              <div className="w-1.5 h-20 bg-emerald-500 rounded-full shadow-3xl shadow-emerald-500/50" />
              <div className="w-4 h-4 bg-emerald-400 rounded-full -mt-2 border-2 border-white" />
           </motion.div>

           {/* Image */}
           <AnimatePresence>
             {!isNaN(v) && isFinite(v) && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ 
                   x: v * 3.5, 
                   opacity: 1,
                   scaleY: mag,
                 }}
                 className={`absolute left-1/2 top-1/2 flex flex-col items-center
                    ${mag > 0 ? '-translate-y-full' : 'translate-y-0'}
                 `}
               >
                  <div className="w-1.5 h-20 bg-rose-500 rounded-full opacity-80 shadow-3xl shadow-rose-500/50" />
                  <div className="w-4 h-4 bg-rose-400 rounded-full -mt-2 border-2 border-white" />
                  <span className="text-[10px] font-black text-rose-400 mt-2 uppercase">Image</span>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Rays SVG */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 1000">
              {/* Parallel Ray */}
              <motion.path 
                animate={{ d: `M ${500 + objectX * 35} 400 L 500 400 L ${500 + v * 35} ${500 + 100 * mag}` }}
                fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 5" opacity="0.4"
              />
           </svg>

           {/* Lens Eye Icon */}
           <div className="absolute bottom-12 right-12 text-slate-800">
              <Eye size={64} opacity="0.1" />
           </div>
        </div>
      </div>
    </div>
  );
}
