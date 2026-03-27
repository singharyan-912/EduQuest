import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  RotateCcw, 
  ChevronRight,
  Activity,
  Zap,
  Filter,
  Droplets,
  Trophy,
  AlertCircle,
  FlaskConical,
  XCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Particle {
  id: number;
  type: 'waste' | 'nutrient';
  name: string;
  x: number;
  y: number;
}

interface WasteManagerProps {
  onComplete: () => void;
}

export function WasteManager({ onComplete }: WasteManagerProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toxicity, setToxicity] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Spawn particles
  useEffect(() => {
    if (isSuccess || isGameOver) return;
    
    const interval = setInterval(() => {
      const newParticle: Particle = {
        id: Date.now(),
        type: Math.random() > 0.4 ? 'waste' : 'nutrient',
        name: Math.random() > 0.4 ? 'Urea' : 'Glucose',
        x: Math.random() * 80 + 10, // 10% to 90%
        y: -10
      };
      setParticles(prev => [...prev, newParticle]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuccess, isGameOver]);

  // Move particles
  useEffect(() => {
    if (isSuccess || isGameOver) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const next = prev.map(p => ({ ...p, y: p.y + 2 }));
        
        // Check for particles that reached the bottom (unfiltered)
        next.forEach(p => {
          if (p.y >= 100 && p.type === 'waste') {
            setToxicity(t => Math.min(t + 10, 100));
          }
        });

        return next.filter(p => p.y < 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isSuccess, isGameOver]);

  useEffect(() => {
    if (toxicity >= 100) setIsGameOver(true);
    if (filteredCount >= 20) setIsSuccess(true);
  }, [toxicity, filteredCount]);

  const handleParticleClick = (p: Particle) => {
    if (isSuccess || isGameOver) return;

    if (p.type === 'waste') {
      setFilteredCount(c => c + 1);
      setToxicity(t => Math.max(0, t - 2));
    } else {
      setToxicity(t => Math.min(t + 15, 100)); // Hitting nutrients is bad!
    }
    
    setParticles(prev => prev.filter(item => item.id !== p.id));
  };

  const reset = () => {
    setParticles([]);
    setToxicity(0);
    setFilteredCount(0);
    setIsSuccess(false);
    setIsGameOver(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filtration Dashboard */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-amber-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                  <Filter size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Nephro-Guard</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Excretion Terminal</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="p-6 bg-slate-950 rounded-[32px] border-b-4 border-amber-600">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Blood Toxicity</p>
                    <div className="flex items-end gap-2">
                       <span className={`text-4xl font-black italic tracking-tighter ${toxicity > 70 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                          {toxicity}%
                       </span>
                    </div>
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                         className={`h-full ${toxicity > 70 ? 'bg-rose-500' : 'bg-amber-500'}`}
                         animate={{ width: `${toxicity}%` }}
                       />
                    </div>
                 </div>

                 <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Wastes Purified</span>
                    <span className="text-xl font-black text-slate-900 italic tracking-tighter">{filteredCount} / 20</span>
                 </div>

                 <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-1" size={18} />
                    <p className="text-[11px] font-bold text-amber-800 leading-relaxed italic pr-4">
                      Filter <span className="text-rose-600 underline underline-offset-4">Urea (Purple)</span> but save <span className="text-emerald-600 underline underline-offset-4">Glucose (Green)</span>!
                    </p>
                 </div>
              </div>
            </div>

            <div className="pt-6">
              <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                <RotateCcw size={16} className="mr-2 inline" /> Reset Dialysis
              </Button>
            </div>
          </Card>
        </div>

        {/* Nephron Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent border-t-2 border-white/20" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:30px_30px]" />

           <AnimatePresence mode="wait">
             {!isSuccess && !isGameOver ? (
               <div className="relative w-full h-full">
                  {particles.map(p => (
                    <motion.button
                      key={p.id}
                      onClick={() => handleParticleClick(p)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, top: `${p.y}%`, left: `${p.x}%` }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute w-14 h-14 rounded-2xl border-4 flex items-center justify-center shadow-3xl group transition-transform
                        ${p.type === 'waste' ? 'bg-rose-500/20 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white' : 
                          'bg-emerald-500/20 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'}
                      `}
                    >
                       {p.type === 'waste' ? <XCircle size={28} /> : <Droplets size={28} />}
                       <span className="absolute -bottom-6 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.name}
                       </span>
                    </motion.button>
                  ))}
               </div>
             ) : isGameOver ? (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center gap-8"
                >
                   <div className="w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center shadow-3xl">
                      <Trash2 size={64} className="text-white" />
                   </div>
                   <h2 className="text-6xl font-black text-rose-500 uppercase italic tracking-tighter leading-none">
                     SYSTEM <span className="text-white">FAILING!</span>
                   </h2>
                   <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                     Toxicity levels reached threshold. Uraemia detected. Reboot dialysis immediately!
                   </p>
                   <Button onClick={reset} className="px-16 py-6 bg-white text-slate-950 font-black rounded-3xl text-xl shadow-2xl hover:scale-105 transition-transform">
                      Re-Initialize Filter
                   </Button>
                </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center shadow-3xl">
                     <Trophy size={64} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      PURITY <span className="text-amber-400">ACHIEVED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Nephron filtration complete. Metabolic wastes have been successfully removed while vital nutrients were preserved.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Urea Filtered</p>
                        <p className="text-2xl font-black">20 Units</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Body State</p>
                        <p className="text-2xl font-black text-amber-500 tracking-tighter italic uppercase">STABLE</p>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Complete Life Cycle <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
