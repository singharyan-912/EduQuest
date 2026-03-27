import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  RotateCcw, 
  ChevronRight,
  Battery,
  Flame,
  Wind,
  Droplets,
  Activity,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface EnergyGeneratorProps {
  onComplete: () => void;
}

export function EnergyGenerator({ onComplete }: EnergyGeneratorProps) {
  const [atp, setAtp] = useState(0);
  const [oxygen, setOxygen] = useState(100);
  const [glucose, setGlucose] = useState(100);
  const [lacticAcid, setLacticAcid] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAerobic, setIsAerobic] = useState(true);

  // Oxygen depletion simulation
  useEffect(() => {
    if (isSuccess) return;
    const interval = setInterval(() => {
      setOxygen(prev => Math.max(0, prev - (isAerobic ? 2 : 5)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isAerobic, isSuccess]);

  const generateATP = () => {
    if (glucose <= 0 || isSuccess) return;

    if (oxygen > 10) {
      // Aerobic Respiration (High ATP)
      setAtp(prev => Math.min(prev + 10, 1000));
      setGlucose(prev => prev - 5);
      setOxygen(prev => prev - 5);
      setIsAerobic(true);
    } else {
      // Anaerobic Respiration (Low ATP + Lactic Acid)
      setAtp(prev => Math.min(prev + 2, 1000));
      setGlucose(prev => prev - 5);
      setLacticAcid(prev => prev + 10);
      setIsAerobic(false);
    }

    if (atp >= 990) {
      setIsSuccess(true);
    }
  };

  const refillOxygen = () => {
    setOxygen(100);
    setLacticAcid(prev => Math.max(0, prev - 20));
  };

  const reset = () => {
    setAtp(0);
    setOxygen(100);
    setGlucose(100);
    setLacticAcid(0);
    setIsSuccess(false);
    setIsAerobic(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Metabolic Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-blue-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Cell Engine</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Mitochondrial Hub</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Glucose Gauge */}
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Glucose (Fuel)</span>
                      <span className="text-emerald-500">{glucose}%</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div 
                        className="h-full bg-emerald-400"
                        animate={{ width: `${glucose}%` }}
                      />
                   </div>
                </div>

                {/* Oxygen Gauge */}
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Oxygen (Oxidizer)</span>
                      <span className={oxygen < 20 ? 'text-rose-500 animate-pulse' : 'text-blue-500'}>{oxygen}%</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div 
                        className={`h-full ${oxygen < 20 ? 'bg-rose-400' : 'bg-blue-400'}`}
                        animate={{ width: `${oxygen}%` }}
                      />
                   </div>
                </div>

                {/* Lactic Acid Threat */}
                {lacticAcid > 0 && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-center gap-3 text-rose-600"
                  >
                    <Flame size={18} />
                    <div className="flex-1">
                       <p className="text-[10px] font-black uppercase tracking-tight">Lactic Acid Accumulation: {lacticAcid}%</p>
                       <p className="text-[8px] font-bold italic opacity-70">Warning: Muscle Cramp Risk Spike!</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="pt-6 space-y-3">
               <Button onClick={refillOxygen} variant="outline" className="w-full py-4 text-blue-600 border-blue-200 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <Wind size={16} /> Inhale O₂
               </Button>
               <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest">
                  <RotateCcw size={16} className="mr-2 inline" /> Reboot Metabolism
               </Button>
            </div>
          </Card>
        </div>

        {/* ATP Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.3),transparent_70%)]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full flex flex-col items-center gap-12">
                  {/* ATP Storage Tank */}
                  <div className="relative w-full max-w-md h-40 bg-white/5 rounded-[40px] border-4 border-white/10 p-4 flex flex-col justify-end overflow-hidden shadow-inner">
                     <motion.div 
                       className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-80"
                       animate={{ height: `${(atp / 1000) * 100}%` }}
                     />
                     <div className="relative z-10 w-full mb-4 flex flex-col items-center text-white">
                        <Zap size={40} className="mb-2 text-yellow-400 animate-pulse" />
                        <span className="text-5xl font-black italic tracking-tighter">{atp}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">ATP Units</span>
                     </div>
                  </div>

                  {/* Reaction Zone */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={generateATP}
                    disabled={glucose <= 0}
                    className="group relative w-64 h-64 rounded-full border-8 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-3xl hover:bg-white/10 transition-all"
                  >
                     <motion.div 
                        animate={isAerobic ? { rotate: [0, 360] } : {}}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border border-dashed border-white/20"
                     />
                     <div className="text-center">
                        <Battery size={60} className={glucose > 20 ? 'text-blue-400' : 'text-rose-500 animate-pulse'} />
                        <p className="mt-4 font-black italic uppercase tracking-widest text-[10px] text-white">Breakdown Glucose</p>
                     </div>
                     
                     {/* Feedback Particles */}
                     <AnimatePresence>
                        {isAerobic ? (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-8 text-emerald-400 font-black text-xs uppercase italic tracking-widest">
                              Aerobic (+38 ATP)
                           </motion.div>
                        ) : (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-8 text-rose-400 font-black text-xs uppercase italic tracking-widest flex items-center gap-2">
                              Anaerobic (+2 ATP) <AlertCircle size={14} />
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </motion.button>

                  <div className="flex gap-4">
                     <div className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        By-product: {isAerobic ? 'CO₂ + H₂O' : 'Lactic Acid'}
                     </div>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-3xl">
                     <Trophy size={64} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      ENERGY <span className="text-blue-400">MAXIMIZED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Respiration complete. Your cellular furnace has provided enough ATP to power complex biological work.
                    </p>
                  </div>
                  
                  <div className="p-8 bg-blue-500/10 rounded-[40px] border-4 border-blue-500/30 w-full max-w-sm">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="text-left border-r-2 border-white/10 pr-4">
                           <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Yield</p>
                           <p className="text-3xl font-black text-white">1000 ATP</p>
                        </div>
                        <div className="text-left pl-4">
                           <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Efficiency</p>
                           <p className="text-3xl font-black text-emerald-400">92%</p>
                        </div>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Deploy Nutrients <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
