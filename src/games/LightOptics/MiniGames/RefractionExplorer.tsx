import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight,
  Droplets,
  Layers,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

type Medium = 'air' | 'water' | 'glass';

const MEDIA_DATA = {
  air: { n: 1.0, color: 'bg-white/5', name: 'Air' },
  water: { n: 1.33, color: 'bg-blue-500/20', name: 'Water' },
  glass: { n: 1.5, color: 'bg-slate-400/30', name: 'Glass' }
};

interface RefractionExplorerProps {
  onComplete: () => void;
}

export function RefractionExplorer({ onComplete }: RefractionExplorerProps) {
  const [angle, setAngle] = useState(30);
  const [medium1, setMedium1] = useState<Medium>('air');
  const [medium2, setMedium2] = useState<Medium>('water');
  const [isSuccess, setIsSuccess] = useState(false);

  const n1 = MEDIA_DATA[medium1].n;
  const n2 = MEDIA_DATA[medium2].n;

  // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const refractedAngle = Math.asin((n1 * Math.sin((angle * Math.PI) / 180)) / n2) * (180 / Math.PI);

  useEffect(() => {
    if (angle > 10 && medium1 !== medium2) {
       // Just explore for now
    }
  }, [angle, medium1, medium2]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Medium Selector */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-slate-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Boundary Lab</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Refractive Control</p>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-sm font-black text-slate-900 uppercase italic">Incidence Angle</span>
                       <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-indigo-500 shadow-sm border border-slate-100">{angle}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="80" value={angle} 
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
                    />
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Upper Medium</p>
                       <div className="flex gap-2">
                          {(['air', 'water'] as Medium[]).map(m => (
                            <button key={m} onClick={() => setMedium1(m)} className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${medium1 === m ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{m}</button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Lower Medium</p>
                       <div className="flex gap-2">
                          {(['water', 'glass'] as Medium[]).map(m => (
                            <button key={m} onClick={() => setMedium2(m)} className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${medium2 === m ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{m}</button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-50">
                 <Button onClick={() => onComplete()} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl">
                    Finish Exploration <ChevronRight className="ml-2 inline" />
                 </Button>
              </div>
           </Card>
        </div>

        {/* Refraction Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col">
           {/* Top Medium */}
           <div className={`flex-1 relative ${MEDIA_DATA[medium1].color}`}>
              <div className="absolute top-8 right-12 text-white/20 font-black italic uppercase text-4xl">{MEDIA_DATA[medium1].name}</div>
              
              {/* Incident Ray */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                 <motion.line
                   x1="50%" y1="100%"
                   x2={`${50 - Math.tan((angle * Math.PI) / 180) * 50}%`} y2="0%"
                   stroke="#818cf8" strokeWidth="4" strokeDasharray="8 4"
                   className="shadow-3xl shadow-indigo-500"
                 />
              </svg>
           </div>

           {/* Boundary */}
           <div className="h-2 w-full bg-white/10 backdrop-blur-sm relative z-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-indigo-400/50" />
           </div>

           {/* Bottom Medium */}
           <div className={`flex-1 relative ${MEDIA_DATA[medium2].color}`}>
              <div className="absolute bottom-8 right-12 text-white/20 font-black italic uppercase text-4xl">{MEDIA_DATA[medium2].name}</div>

              {/* Refracted Ray */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                 <motion.line
                   x1="50%" y1="0%"
                   x2={`${50 + Math.tan((refractedAngle * Math.PI) / 180) * 50}%`} y2="100%"
                   stroke="#f472b6" strokeWidth="6"
                   className="shadow-3xl shadow-rose-500"
                 />
                 
                 {/* Normal Line */}
                 <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#475569" strokeWidth="2" strokeDasharray="5 5" />
              </svg>
           </div>

           {/* Normal Line Overlay */}
           <div className="absolute left-1/2 top-0 h-full w-px bg-slate-800/50 border-r border-dashed border-slate-700 pointer-events-none" />

           {/* Info Label */}
           <motion.div 
             animate={{ x: medium1 !== medium2 ? 0 : 20, opacity: 1 }}
             className="absolute bottom-8 left-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] text-white"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                    <Droplets size={24} />
                 </div>
                 <div>
                    <h4 className="text-xl font-black tracking-tighter uppercase italic leading-none">Bending Log</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {n2 > n1 ? 'Denser Medium: Bends Toward Normal' : 'Rarer Medium: Bends Away'}
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
