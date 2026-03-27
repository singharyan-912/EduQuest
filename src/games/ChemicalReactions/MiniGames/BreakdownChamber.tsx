import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Sun, 
  RotateCcw, 
  ChevronRight,
  Trophy,
  Activity
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface DecompositionReaction {
  id: string;
  reactant: {
    name: string;
    formula: string;
    description: string;
    color: string;
  };
  energyType: 'thermal' | 'light' | 'electrolytic';
  products: {
    formula: string;
    color: string;
  }[];
}

const REACTIONS: DecompositionReaction[] = [
  {
    id: 't-deco',
    reactant: { name: 'Calcium Carbonate', formula: 'CaCO₃', description: "Limestone decomposes upon strong heating.", color: "bg-orange-100" },
    energyType: 'thermal',
    products: [{ formula: 'CaO', color: 'bg-orange-200' }, { formula: 'CO₂', color: 'bg-slate-400' }]
  },
  {
    id: 'l-deco',
    reactant: { name: 'Silver Chloride', formula: 'AgCl', description: "White silver chloride turns grey in sunlight.", color: "bg-slate-100" },
    energyType: 'light',
    products: [{ formula: 'Ag', color: 'bg-slate-300' }, { formula: 'Cl₂', color: 'bg-emerald-400' }]
  },
  {
    id: 'e-deco',
    reactant: { name: 'Water', formula: 'H₂O', description: "Water splits into hydrogen and oxygen via electricity.", color: "bg-cyan-500" },
    energyType: 'electrolytic',
    products: [{ formula: 'H₂', color: 'bg-blue-400' }, { formula: 'O₂', color: 'bg-rose-400' }]
  }
];

interface BreakdownChamberProps {
  onComplete: () => void;
}

export function BreakdownChamber({ onComplete }: BreakdownChamberProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [activeEnergy, setActiveEnergy] = useState<'thermal' | 'light' | 'electrolytic' | null>(null);
  const [isLysis, setIsLysis] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lysisProgress, setLysisProgress] = useState(0);

  const reaction = REACTIONS[currentLevel];

  useEffect(() => {
    if (activeEnergy === reaction.energyType) {
      const interval = setInterval(() => {
        setLysisProgress(prev => {
          if (prev >= 100) {
            setIsLysis(false);
            setIsSuccess(true);
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      setIsLysis(true);
      return () => clearInterval(interval);
    } else if (activeEnergy) {
      // Wrong energy - reset
      setTimeout(() => setActiveEnergy(null), 1000);
    }
  }, [activeEnergy, reaction]);

  const reset = () => {
    setActiveEnergy(null);
    setIsLysis(false);
    setIsSuccess(false);
    setLysisProgress(0);
  };

  const nextLevel = () => {
    if (currentLevel < REACTIONS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      reset();
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Energy Selectors */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-orange-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                  <Flame size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Energy Inputs</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select source</p>
                </div>
              </div>

              <div className="space-y-4">
                 <button 
                   onClick={() => setActiveEnergy('thermal')}
                   className={`w-full p-6 rounded-[32px] border-4 flex items-center justify-between group transition-all
                     ${activeEnergy === 'thermal' ? 'bg-orange-600 border-orange-400 text-white shadow-xl scale-105' : 'bg-white border-slate-50 hover:border-orange-200 shadow-sm'}
                   `}
                 >
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                       <Flame className={activeEnergy === 'thermal' ? 'text-white' : 'text-orange-500'} /> 
                       <span>Heat</span>
                    </div>
                    {activeEnergy === 'thermal' && reaction.energyType !== 'thermal' && <Activity size={16} className="text-white animate-pulse" />}
                 </button>

                 <button 
                    onClick={() => setActiveEnergy('light')}
                    className={`w-full p-6 rounded-[32px] border-4 flex items-center justify-between group transition-all
                      ${activeEnergy === 'light' ? 'bg-amber-500 border-amber-300 text-white shadow-xl scale-105' : 'bg-white border-slate-50 hover:border-amber-200 shadow-sm'}
                    `}
                 >
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                       <Sun className={activeEnergy === 'light' ? 'text-white' : 'text-amber-500'} /> 
                       <span>Light</span>
                    </div>
                 </button>

                 <button 
                    onClick={() => setActiveEnergy('electrolytic')}
                    className={`w-full p-6 rounded-[32px] border-4 flex items-center justify-between group transition-all
                      ${activeEnergy === 'electrolytic' ? 'bg-blue-600 border-blue-400 text-white shadow-xl scale-105' : 'bg-white border-slate-50 hover:border-blue-200 shadow-sm'}
                    `}
                 >
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                       <Zap className={activeEnergy === 'electrolytic' ? 'text-white' : 'text-blue-500'} /> 
                       <span>Electric</span>
                    </div>
                 </button>
              </div>

              {activeEnergy && activeEnergy !== reaction.energyType && (
                <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-start gap-3">
                   <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Wait! This energy can't break these bonds.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
               <button onClick={reset} className="w-full py-4 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] border-2 border-slate-50">
                  <RotateCcw size={14} className="inline mr-2" /> Reset Reaction
               </button>
            </div>
          </Card>
        </div>

        {/* Breakdown Zone */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-orange-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:32px_32px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full h-full flex flex-col items-center justify-between">
                  {/* Reactant Core */}
                  <div className="relative flex flex-col items-center gap-6 mt-12">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Substrate Chamber</p>
                     
                     <div className="relative w-64 h-64 flex items-center justify-center">
                        <motion.div 
                           animate={isLysis ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                           className={`w-48 h-48 rounded-[60px] flex items-center justify-center text-slate-900 font-black text-4xl shadow-3xl border-8 border-white/50 ${reaction.reactant.color} relative z-10`}
                        >
                           {reaction.reactant.formula}
                        </motion.div>
                        
                        {/* Progressive Cracks */}
                        {isLysis && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: lysisProgress / 100 }}
                            className="absolute inset-0 border-8 border-dashed border-white/20 rounded-[80px]"
                          />
                        )}

                        {/* Energy Effects */}
                        <AnimatePresence>
                           {activeEnergy === 'thermal' && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -bottom-12">
                                <Flame size={64} className="text-orange-500 animate-bounce" />
                             </motion.div>
                           )}
                           {activeEnergy === 'light' && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -top-12">
                                <Sun size={80} className="text-amber-400 animate-pulse" />
                             </motion.div>
                           )}
                           {activeEnergy === 'electrolytic' && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                                <Zap size={80} className="text-blue-400 absolute top-0 left-0 animate-pulse" />
                                <Zap size={80} className="text-blue-400 absolute bottom-0 right-0 animate-pulse delay-100" />
                             </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                     <div className="text-center max-w-sm">
                        <h4 className="text-white font-black text-xl italic mb-2 tracking-tight uppercase leading-none">{reaction.reactant.name}</h4>
                        <p className="text-white/40 font-bold text-sm italic italic tracking-tighter">"{reaction.reactant.description}"</p>
                     </div>
                  </div>

                  {/* Meter */}
                  <div className="w-full max-w-xl space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-widest">
                        <span>Structural Bonds</span>
                        <span className="text-orange-400">{100 - lysisProgress}% Integrity</span>
                     </div>
                     <div className="h-4 bg-white/5 rounded-full overflow-hidden border-2 border-white/10 p-1">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full"
                          animate={{ width: `${lysisProgress}%` }}
                        />
                     </div>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="relative">
                    <div className="w-32 h-32 bg-orange-600 rounded-full flex items-center justify-center shadow-3xl text-white">
                       <Trophy size={64} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      BONDS <span className="text-orange-500">SEVERED</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      One complex molecule has decomposed into simpler products: <strong className="text-white">{reaction.products.map(p => p.formula).join(' + ')}</strong>.
                    </p>
                  </div>
                  
                  <div className="p-8 bg-white/5 rounded-[48px] border-4 border-orange-500/30 flex flex-col items-center gap-4">
                     <div className="flex items-center gap-8 text-4xl font-black text-white">
                        <div className={`px-12 py-4 rounded-[32px] text-slate-900 shadow-xl ${reaction.reactant.color}`}>
                           {reaction.reactant.formula}
                        </div>
                        <ChevronRight className="text-orange-500 mx-2" />
                        <div className="flex items-center gap-4">
                           {reaction.products.map((p, i) => (
                             <div key={i} className="flex items-center gap-4">
                                <div className={`px-8 py-3 rounded-2xl text-slate-900 ${p.color}`}>{p.formula}</div>
                                {i < reaction.products.length - 1 && <span className="text-orange-500">+</span>}
                             </div>
                           ))}
                        </div>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Single Reactant → Simpler Products</p>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentLevel < REACTIONS.length - 1 ? 'Next Analysis' : 'Reactivity Duel Entry'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
