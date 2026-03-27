import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ChevronRight,
  Paintbrush,
  Shield,
  Snowflake,
  Trophy,
  AlertCircle,
  Wind,
  CloudRain
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface ProtectionRound {
  item: string;
  substance: string;
  threat: string;
  threatType: 'oxygen' | 'moisture' | 'acid';
  correctMethods: string[];
  description: string;
  color: string;
}

const ROUNDS: ProtectionRound[] = [
  {
    item: "Iron Railing",
    substance: "Fe",
    threat: "Rusting",
    threatType: 'moisture',
    correctMethods: ['painting', 'galvanizing'],
    description: "Iron reacts with moisture and oxygen to form flaky red rust.",
    color: "bg-orange-900"
  },
  {
    item: "Potato Chips",
    substance: "Fats/Oils",
    threat: "Rancidity",
    threatType: 'oxygen',
    correctMethods: ['nitrogen', 'antioxidants'],
    description: "Oxidation of oil in food leads to bad smell and taste.",
    color: "bg-amber-400"
  },
  {
    item: "Copper Vessel",
    substance: "Cu",
    threat: "Corrosion",
    threatType: 'acid',
    correctMethods: ['tinning', 'painting'],
    description: "Copper develops a green layer due to reaction with CO₂.",
    color: "bg-orange-600"
  }
];

interface ProtectionMasterProps {
  onComplete: () => void;
}

export function ProtectionMaster({ onComplete }: ProtectionMasterProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [activeMethods, setActiveMethods] = useState<string[]>([]);
  const [isProtected, setIsProtected] = useState(false);
  const [degradation, setDegradation] = useState(0);

  const round = ROUNDS[currentRound];

  useEffect(() => {
    if (isProtected) return;

    const interval = setInterval(() => {
      setDegradation(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentRound, isProtected]);

  const applyMethod = (method: string) => {
    if (isProtected) return;

    const newMethods = [...activeMethods, method];
    setActiveMethods(newMethods);

    if (round.correctMethods.includes(method)) {
      setIsProtected(true);
    }
  };

  const reset = () => {
    setActiveMethods([]);
    setIsProtected(false);
    setDegradation(0);
  };

  const nextLevel = () => {
    if (currentRound < ROUNDS.length - 1) {
      setCurrentRound(prev => prev + 1);
      reset();
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Protection Toolkit */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-rose-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-6 flex-1">
               <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                  <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Guard Kit</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Apply Measures</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => applyMethod('painting')}
                    className="p-5 rounded-3xl border-2 border-slate-50 bg-slate-50 hover:border-rose-200 transition-all flex items-center gap-4 group"
                  >
                     <div className="p-3 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                        <Paintbrush size={20} className="text-rose-500" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Painting</span>
                  </button>

                  <button 
                    onClick={() => applyMethod('galvanizing')}
                    className="p-5 rounded-3xl border-2 border-slate-50 bg-slate-50 hover:border-rose-200 transition-all flex items-center gap-4 group"
                  >
                     <div className="p-3 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                        <Shield size={20} className="text-blue-500" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Galvanize</span>
                  </button>

                  <button 
                    onClick={() => applyMethod('nitrogen')}
                    className="p-5 rounded-3xl border-2 border-slate-50 bg-slate-50 hover:border-rose-200 transition-all flex items-center gap-4 group"
                  >
                     <div className="p-3 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                        <Wind size={20} className="text-cyan-500" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">N₂ Flush</span>
                  </button>

                  <button 
                    onClick={() => applyMethod('antioxidants')}
                    className="p-5 rounded-3xl border-2 border-slate-50 bg-slate-50 hover:border-rose-200 transition-all flex items-center gap-4 group"
                  >
                     <div className="p-3 bg-white rounded-2xl group-hover:scale-110 transition-transform">
                        <Snowflake size={20} className="text-emerald-500" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Antioxidant</span>
                  </button>
               </div>
            </div>

            <div className="pt-6">
               <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-start gap-3">
                  <p className="text-[10px] font-bold text-rose-800 leading-relaxed italic">
                    Protect the item before it completely degrades!
                  </p>
               </div>
            </div>
          </Card>
        </div>

        {/* Protection Chamber */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-rose-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:32px_32px]" />

           <AnimatePresence mode="wait">
             {!isProtected && degradation < 100 ? (
               <div className="relative w-full h-full flex flex-col items-center justify-between">
                  <header className="text-center space-y-2">
                     <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Environmental Degradation</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{round.item} <span className="text-rose-400">Under Attack</span></h2>
                     <p className="text-white/40 font-bold italic text-sm">Targeting: {round.substance}</p>
                  </header>

                  <div className="relative flex items-center justify-center">
                     {/* The Item */}
                     <div className={`w-64 h-64 rounded-[48px] overflow-hidden border-8 border-white/20 transition-all duration-1000 relative
                        ${degradation > 50 ? 'grayscale scale-95' : ''}
                     `}>
                        <div className={`absolute inset-0 ${round.color} mix-blend-overlay`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Shield size={120} className="text-white/10" strokeWidth={1} />
                        </div>
                        
                        {/* Degradation Overlay */}
                        <div 
                          className="absolute inset-0 bg-orange-950 mix-blend-multiply transition-all duration-300"
                          style={{ opacity: degradation / 100 }}
                        />
                     </div>

                     {/* Threat Particles */}
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[1,2,3,4,5,6,7,8].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ 
                              x: [(Math.random()-0.5)*500, (Math.random()-0.5)*200, (Math.random()-0.5)*500],
                              y: [(Math.random()-0.5)*500, (Math.random()-0.5)*200, (Math.random()-0.5)*500],
                              opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            className="absolute"
                          >
                             {round.threatType === 'moisture' ? <CloudRain size={32} className="text-blue-400/30" /> : <Wind size={32} className="text-white/20" />}
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  {/* Damage Meter */}
                  <div className="w-full max-w-xl space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                        <span>{round.threat} Level</span>
                        <span className="text-rose-400">{degradation}% Damaged</span>
                     </div>
                     <div className="h-4 bg-white/5 rounded-full overflow-hidden border-2 border-white/10 p-1">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-rose-600 rounded-full"
                          animate={{ width: `${degradation}%` }}
                        />
                     </div>
                  </div>
               </div>
             ) : degradation >= 100 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-8">
                   <AlertCircle size={80} className="text-rose-500 animate-pulse" />
                   <div className="text-center">
                      <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4">SYSTEM BREACH</h2>
                      <p className="text-slate-400 font-bold italic">The item has been completely corroded or turned rancid.</p>
                   </div>
                   <Button onClick={reset} className="px-10 py-4 bg-white text-slate-950 font-black rounded-2xl">RE-INITIALIZE RECOVERY</Button>
                </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Trophy size={64} className="animate-bounce" />
                  </div>
                  
                  <div>
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      ASSET <span className="text-rose-400">SECURED</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      Protection layer active! You've successfully prevented {round.threat} using <strong>{activeMethods[activeMethods.length-1].toUpperCase()}</strong>.
                    </p>
                  </div>

                  <div className="p-10 bg-white/5 rounded-[48px] border-4 border-rose-500/30 flex items-center gap-6 shadow-3xl">
                      <div className="w-40 h-40 rounded-[32px] border-4 border-white overflow-hidden relative">
                         <div className={`absolute inset-0 ${round.color} opacity-60`} />
                         <div className="absolute inset-0 bg-blue-400/20 backdrop-blur-[2px]" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck size={64} className="text-white animate-[pulse_2s_infinite]" />
                         </div>
                      </div>
                      <div className="text-left space-y-3">
                         <div className="px-4 py-1 bg-rose-600/20 text-rose-400 text-[10px] font-black uppercase tracking-widest inline-block rounded-full">Active Defense: {activeMethods[activeMethods.length-1]}</div>
                         <h4 className="text-white text-2xl font-black italic">{round.item} - STABLE</h4>
                         <p className="text-slate-500 font-bold text-xs max-w-xs">{round.description}</p>
                      </div>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentRound < ROUNDS.length - 1 ? 'Next Protection Task' : 'Final Laboratory Report'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
