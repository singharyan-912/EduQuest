import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightLeft, 
  ChevronRight,
  Droplets,
  Container,
  Trophy,
  AlertCircle,
  Shapes
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Ion {
  id: string;
  symbol: string;
  charge: string;
  name: string;
  color: string;
}

const CATIONS: Ion[] = [
  { id: 'na', symbol: 'Na', charge: '+', name: 'Sodium', color: 'bg-orange-500' },
  { id: 'ba', symbol: 'Ba', charge: '2+', name: 'Barium', color: 'bg-emerald-500' },
  { id: 'pb', symbol: 'Pb', charge: '2+', name: 'Lead', color: 'bg-slate-700' },
];

const ANIONS: Ion[] = [
  { id: 'cl', symbol: 'Cl', charge: '-', name: 'Chloride', color: 'bg-yellow-500' },
  { id: 'so4', symbol: 'SO₄', charge: '2-', name: 'Sulphate', color: 'bg-blue-500' },
  { id: 'i', symbol: 'I', charge: '-', name: 'Iodide', color: 'bg-purple-600' },
];

interface DoubleDisplacementRound {
  reactants: { formula: string; c: string; a: string; color: string }[];
  products: { formula: string; c: string; a: string; isPrecipitate: boolean; color: string }[];
  description: string;
}

const ROUNDS: DoubleDisplacementRound[] = [
  {
    reactants: [
      { formula: 'Na₂SO₄', c: 'na', a: 'so4', color: 'bg-orange-100' },
      { formula: 'BaCl₂', c: 'ba', a: 'cl', color: 'bg-emerald-100' }
    ],
    products: [
      { formula: 'BaSO₄', c: 'ba', a: 'so4', isPrecipitate: true, color: 'bg-white' },
      { formula: 'NaCl', c: 'na', a: 'cl', isPrecipitate: false, color: 'bg-orange-200' }
    ],
    description: "Sodium sulphate reacts with barium chloride to form a white precipitate."
  },
  {
    reactants: [
      { formula: 'Pb(NO₃)₂', c: 'pb', a: 'no3', color: 'bg-slate-200' },
      { formula: 'KI', c: 'k', a: 'i', color: 'bg-purple-100' }
    ],
    products: [
      { formula: 'PbI₂', c: 'pb', a: 'i', isPrecipitate: true, color: 'bg-yellow-400' },
      { formula: 'KNO₃', c: 'k', a: 'no3', isPrecipitate: false, color: 'bg-slate-50' }
    ],
    description: "Lead nitrate solution reacts with potassium iodide."
  }
];

interface PartnerSwapProps {
  onComplete: () => void;
}

export function PartnerSwap({ onComplete }: PartnerSwapProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const round = ROUNDS[currentRound];

  const handleSwap = () => {
    if (isSwapping || isSuccess) return;
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setIsSuccess(true);
    }, 2000);
  };

  const reset = () => {
    setIsSwapping(false);
    setIsSuccess(false);
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
        
        {/* Solution Inventory */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-pink-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-8 flex-1">
              <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
                  <Shapes size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Ion Deck</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Exchange Partners</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Cations (+)</p>
                   <div className="grid grid-cols-2 gap-2">
                      {CATIONS.map(i => (
                        <div key={i.id} className={`${i.color} p-4 rounded-2xl text-white text-center shadow-lg border-b-4 border-black/20`}>
                           <span className="text-xl font-black">{i.symbol}</span>
                           <sup className="text-[10px] font-bold">{i.charge}</sup>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Anions (-)</p>
                   <div className="grid grid-cols-2 gap-2">
                      {ANIONS.map(i => (
                        <div key={i.id} className={`${i.color} p-4 rounded-2xl text-white text-center shadow-lg border-b-4 border-black/20`}>
                           <span className="text-xl font-black">{i.symbol}</span>
                           <sup className="text-[10px] font-bold">{i.charge}</sup>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
               <div className="p-4 bg-pink-50 rounded-2xl border-2 border-pink-100 flex items-start gap-3">
                  <AlertCircle className="text-pink-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-pink-800 leading-relaxed italic">
                    Double Displacement involves <strong>exchange of ions</strong> between two compounds.
                  </p>
               </div>
            </div>
          </Card>
        </div>

        {/* Reaction Flask */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-pink-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full h-full flex flex-col items-center justify-center gap-12">
                  <div className="text-center space-y-2">
                     <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em]">Partner Exchange</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">The <span className="text-pink-400">Swap</span> Mechanism</h2>
                     <p className="text-white/30 font-bold text-sm italic italic tracking-tighter">"{round.description}"</p>
                  </div>

                  <div className="flex items-center gap-16 relative">
                     {/* Compound A */}
                     <motion.div 
                        animate={isSwapping ? { x: 50, scale: 0.95 } : {}}
                        className="w-48 h-64 border-4 border-white/20 rounded-[40px] p-4 bg-white/5 flex flex-col items-center gap-4 relative"
                     >
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10 rounded-[36px] blur-xl" />
                        <motion.div 
                          animate={isSwapping ? { x: 100 } : {}}
                          className={`${CATIONS.find(c => c.id === round.reactants[0].c)?.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl z-20`}
                        >
                           {CATIONS.find(c => c.id === round.reactants[0].c)?.symbol}
                        </motion.div>
                        <motion.div 
                          animate={isSwapping ? { x: 100 } : {}}
                          className={`${ANIONS.find(a => a.id === round.reactants[0].a)?.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl z-10`}
                        >
                           {ANIONS.find(a => a.id === round.reactants[0].a)?.symbol}
                        </motion.div>
                     </motion.div>

                     <div className="flex flex-col items-center gap-4">
                        <ArrowRightLeft size={64} className={`text-pink-500 ${isSwapping ? 'animate-spin' : ''}`} />
                        <button 
                           onClick={handleSwap}
                           className="px-8 py-3 bg-white text-slate-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
                        >
                           EXECUTE SWAP
                        </button>
                     </div>

                     {/* Compound B */}
                     <motion.div 
                        animate={isSwapping ? { x: -50, scale: 0.95 } : {}}
                        className="w-48 h-64 border-4 border-white/20 rounded-[40px] p-4 bg-white/5 flex flex-col items-center gap-4 relative"
                     >
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10 rounded-[36px] blur-xl" />
                        <motion.div 
                          animate={isSwapping ? { x: -100 } : {}}
                          className={`${CATIONS.find(c => c.id === round.reactants[1].c)?.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl z-20`}
                        >
                           {CATIONS.find(c => c.id === round.reactants[1].c)?.symbol}
                        </motion.div>
                        <motion.div 
                          animate={isSwapping ? { x: -100 } : {}}
                          className={`${ANIONS.find(a => a.id === round.reactants[1].a)?.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl z-10`}
                        >
                           {ANIONS.find(a => a.id === round.reactants[1].a)?.symbol}
                        </motion.div>
                     </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                     <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/5 flex items-center gap-3">
                        <Droplets className="text-pink-400" size={20} />
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase">State</p>
                           <p className="text-white font-black text-xs">AQUEOUS</p>
                        </div>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/5 flex items-center gap-3">
                        <Container className="text-pink-400" size={20} />
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase">Ionic Bond</p>
                           <p className="text-white font-black text-xs">DYNAMIC</p>
                        </div>
                     </div>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="relative">
                    <div className="w-32 h-32 bg-pink-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                       <Trophy size={64} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      PAIRS <span className="text-pink-400">EXCHANGED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      Ionic partners have been successfully swapped. A {round.products.find(p => p.isPrecipitate) ? 'precipitate has formed' : 'new solution is created'}.
                    </p>
                  </div>
                  
                  <div className="p-10 bg-white/5 rounded-[48px] border-4 border-pink-500/30 flex flex-col items-center gap-4">
                     <div className="flex items-center gap-8">
                        {round.products.map((p, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-3">
                             <div className={`px-10 py-5 rounded-[32px] font-black text-3xl shadow-2xl relative ${p.color} ${p.formula === 'BaSO₄' ? 'text-slate-900 border-4 border-emerald-400' : 'text-white'}`}>
                                {p.formula}
                                {p.isPrecipitate && (
                                  <motion.div 
                                    animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity }}
                                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-emerald-400 font-black text-[10px]"
                                  >
                                     PRECIPITATE ↓
                                  </motion.div>
                                )}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentRound < ROUNDS.length - 1 ? 'Next Exchange' : 'Electron Tracker Entry'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
