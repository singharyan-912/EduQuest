import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, 
  ChevronRight,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

const REDOX_ROUNDS = [
  {
    equation: "CuO + H₂ → Cu + H₂O",
    copper: { name: 'Copper', initial: 2, final: 0, isOxidized: false },
    hydrogen: { name: 'Hydrogen', initial: 0, final: 1, isOxidized: true },
    description: "Hydrogen takes oxygen from copper oxide, reducing the metal."
  },
  {
    equation: "ZnO + C → Zn + CO",
    zinc: { name: 'Zinc', initial: 2, final: 0, isOxidized: false },
    carbon: { name: 'Carbon', initial: 0, final: 2, isOxidized: true },
    description: "Carbon reduces zinc oxide to zinc metal."
  }
];

interface ElectronTrackerProps {
  onComplete: () => void;
}

export function ElectronTracker({ onComplete }: ElectronTrackerProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const round = REDOX_ROUNDS[currentRound];

  const handleTransfer = () => {
    if (isTransferring || isSuccess) return;
    
    setIsTransferring(true);

    setTimeout(() => {
      setIsTransferring(false);
      setIsSuccess(true);
    }, 2000);
  };

  const reset = () => {
    setIsTransferring(false);
    setIsSuccess(false);
  };

  const nextLevel = () => {
    if (currentRound < REDOX_ROUNDS.length - 1) {
      setCurrentRound(prev => prev + 1);
      reset();
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Redox Glossary */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-cyan-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-8 flex-1">
               <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                  <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
                     <TrendingUp size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Redox Rules</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">OIL RIG</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-5 bg-blue-50 rounded-3xl border-2 border-blue-100">
                     <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <TrendingUp size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Oxidation</span>
                     </div>
                     <p className="text-[10px] font-bold text-blue-800 leading-relaxed italic italic"><strong>Losing</strong> electrons or <strong>Gaining</strong> oxygen.</p>
                  </div>

                  <div className="p-5 bg-rose-50 rounded-3xl border-2 border-rose-100">
                     <div className="flex items-center gap-2 mb-2 text-rose-600">
                        <TrendingDown size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Reduction</span>
                     </div>
                     <p className="text-[10px] font-bold text-rose-800 leading-relaxed italic italic"><strong>Gaining</strong> electrons or <strong>Losing</strong> oxygen.</p>
                  </div>
               </div>
            </div>

            <div className="pt-6">
               <div className="p-4 bg-cyan-50 rounded-2xl border-2 border-cyan-100 flex items-start gap-3">
                  <Activity className="text-cyan-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-cyan-800 leading-relaxed italic">Most chemical transformations are redox processes!</p>
               </div>
            </div>
          </Card>
        </div>

        {/* Electron Chamber */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-900/20 to-transparent" />
           <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full h-full flex flex-col items-center justify-center gap-12">
                  <div className="text-center space-y-4">
                     <div className="inline-block px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em]">Redox Mapping</div>
                     <h2 className="text-5xl font-extrabold text-white tracking-tighter uppercase italic leading-none">{round.equation}</h2>
                     <p className="text-white/30 font-bold text-sm italic italic tracking-tighter">"{round.description}"</p>
                  </div>

                  <div className="w-full flex justify-between items-center px-12 relative h-48">
                      {/* Left Side Element */}
                      <div className="flex flex-col items-center gap-6">
                         <div className="relative w-40 h-40 bg-white/5 border-4 border-white/10 rounded-full flex items-center justify-center group overflow-hidden">
                            <motion.div 
                              animate={isTransferring ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity }}
                              className="absolute inset-2 border-2 border-dashed border-cyan-500/30 rounded-full" 
                            />
                            <div className="flex flex-col items-center relative z-10 transition-transform group-hover:scale-110">
                               <span className="text-4xl font-black text-white">{round.equation.split(' ')[0]}</span>
                               <span className="text-[10px] font-black text-cyan-400 uppercase mt-2">Reactant 1</span>
                            </div>
                         </div>
                      </div>

                      {/* Transfer Animation Path */}
                      <div className="flex-1 px-8 relative h-1 bg-white/5 mx-4">
                         {isTransferring && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              {[1,2,3,4,5].map(i => (
                                <motion.div 
                                  key={i}
                                  initial={{ x: -100, opacity: 0 }}
                                  animate={{ x: 100, opacity: [0, 1, 0] }}
                                  transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                                  className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]"
                                />
                              ))}
                           </div>
                         )}
                         <Zap className="absolute left-1/2 -top-6 -translate-x-1/2 text-cyan-400/20" size={48} />
                      </div>

                      {/* Right Side Element */}
                      <div className="flex flex-col items-center gap-6">
                         <div className="relative w-40 h-40 bg-white/5 border-4 border-white/10 rounded-full flex items-center justify-center group overflow-hidden">
                            <motion.div 
                               animate={isTransferring ? { rotate: -360 } : {}} transition={{ duration: 1, repeat: Infinity }}
                               className="absolute inset-2 border-2 border-dashed border-rose-500/30 rounded-full" 
                            />
                            <div className="flex flex-col items-center relative z-10 transition-transform group-hover:scale-110">
                               <span className="text-4xl font-black text-white">{round.equation.split(' + ')[1].split(' ')[0]}</span>
                               <span className="text-[10px] font-black text-rose-400 uppercase mt-2">Reactant 2</span>
                            </div>
                         </div>
                      </div>
                  </div>

                  <div className="flex gap-4">
                     <Button 
                        onClick={handleTransfer}
                        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[32px] text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                     >
                        Hydrogen Oxidized
                     </Button>
                     <Button 
                        onClick={handleTransfer}
                        className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-[32px] text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                     >
                        Copper Reduced
                     </Button>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-cyan-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Atom size={64} className="animate-spin-slow" />
                  </div>
                  
                  <div>
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      REDOX <span className="text-cyan-400">SYNCED</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      Electronic balance restored. One species lost electrons (Oxidation) while the other gained them (Reduction).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 w-full max-w-2xl px-8">
                     <div className="p-8 bg-blue-600/10 border-4 border-blue-600/30 rounded-[40px] flex flex-col items-center gap-4">
                        <TrendingUp size={32} className="text-blue-500" />
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">OXIDIZED</p>
                           <p className="text-white text-3xl font-black">{round.hydrogen?.name}</p>
                        </div>
                        <div className="px-4 py-1 bg-blue-600/20 rounded-full text-blue-400 text-[10px] font-black">ST: {round.hydrogen?.initial} → {round.hydrogen?.final}</div>
                     </div>
                     <div className="p-8 bg-rose-600/10 border-4 border-rose-600/30 rounded-[40px] flex flex-col items-center gap-4">
                        <TrendingDown size={32} className="text-rose-500" />
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">REDUCED</p>
                           <p className="text-white text-3xl font-black">{round.copper?.name}</p>
                        </div>
                        <div className="px-4 py-1 bg-rose-600/20 rounded-full text-rose-400 text-[10px] font-black">ST: {round.copper?.initial} → {round.copper?.final}</div>
                     </div>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentRound < REDOX_ROUNDS.length - 1 ? 'Next Analysis' : 'Protection Master Entry'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
