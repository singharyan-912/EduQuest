import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  RotateCcw, 
  Trophy,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Round {
  num1: number;
  num2: number;
  factors1: number[];
  factors2: number[];
  hcf: number;
  lcm: number;
}

const ROUNDS: Round[] = [
  {
    num1: 12,
    num2: 18,
    factors1: [1, 2, 3, 4, 6, 12],
    factors2: [1, 2, 3, 6, 9, 18],
    hcf: 6,
    lcm: 36
  },
  {
    num1: 20,
    num2: 30,
    factors1: [1, 2, 4, 5, 10, 20],
    factors2: [1, 2, 3, 5, 6, 10, 15, 30],
    hcf: 10,
    lcm: 60
  }
];

interface CommonFactorArenaProps {
  onComplete: () => void;
}

export function CommonFactorArena({ onComplete }: CommonFactorArenaProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [placedFactors, setPlacedFactors] = useState<{ val: number, zone: 'A' | 'B' | 'Common' }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const round = ROUNDS[currentRound];

  const handlePlaceFactor = (val: number) => {
    if (isSuccess) return;
    
    const isCommon = round.factors1.includes(val) && round.factors2.includes(val);
    const in2 = round.factors2.includes(val);

    let correctZone: 'A' | 'B' | 'Common' = 'A';
    if (isCommon) correctZone = 'Common';
    else if (in2) correctZone = 'B';

    if (placedFactors.find(f => f.val === val)) return;

    setPlacedFactors(prev => [...prev, { val, zone: correctZone }]);
    
    // Check if all common factors are found for HCF phase
    const commonPlaced = [...placedFactors, { val, zone: correctZone }].filter(f => f.zone === 'Common').map(f => f.val);
    const actualCommons = round.factors1.filter(f => round.factors2.includes(f));
    
    if (commonPlaced.length === actualCommons.length) {
       setFeedback(`Great! HCF is the largest common factor: ${Math.max(...commonPlaced)}`);
       if (currentRound === ROUNDS.length - 1) {
          setTimeout(() => setIsSuccess(true), 2000);
       } else {
          setTimeout(() => {
             setCurrentRound(prev => prev + 1);
             setPlacedFactors([]);
             setFeedback(null);
          }, 2500);
       }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Factor Banks */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-amber-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                       <LayoutGrid size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Factor Bank</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select factors of {round.num1} & {round.num2}</p>
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-3">
                    {Array.from(new Set([...round.factors1, ...round.factors2])).sort((a,b) => a-b).map(val => (
                       <motion.button
                         key={val}
                         onClick={() => handlePlaceFactor(val)}
                         disabled={placedFactors.some(f => f.val === val)}
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center font-black text-lg transition-all
                           ${placedFactors.some(f => f.val === val) ? 'bg-slate-100 border-slate-200 text-slate-300' : 'bg-white border-slate-50 text-slate-900 hover:border-amber-400 shadow-sm'}
                         `}
                       >
                          {val}
                       </motion.button>
                    ))}
                 </div>
              </div>

              <button onClick={() => setPlacedFactors([])} className="w-full py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] mt-8">
                 <RotateCcw size={14} className="inline mr-2" /> Reset Sets
              </button>
           </Card>
        </div>

        {/* Venn Arena */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-amber-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:48px_48px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full flex flex-col items-center">
                  <header className="mb-12 text-center space-y-2">
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Venn Logic Arena</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">HCF Extraction: <span className="text-amber-400">{round.num1} VS {round.num2}</span></h2>
                  </header>

                  <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center">
                     {/* Venn Overlap Circles */}
                     <div className="absolute left-[15%] w-[60%] h-[300px] bg-indigo-500/20 rounded-full border-4 border-indigo-400/50 backdrop-blur-sm" />
                     <div className="absolute right-[15%] w-[60%] h-[300px] bg-rose-500/20 rounded-full border-4 border-rose-400/50 backdrop-blur-sm" />
                     
                     {/* Labels */}
                     <div className="absolute left-[10%] top-0 text-white font-black text-2xl drop-shadow-lg">Factors of {round.num1}</div>
                     <div className="absolute right-[10%] top-0 text-white font-black text-2xl drop-shadow-lg">Factors of {round.num2}</div>

                     {/* Zone Containers */}
                     <div className="absolute inset-0 grid grid-cols-3 z-10 p-12">
                        {/* Zone A */}
                        <div className="flex flex-wrap content-center justify-center gap-4">
                           {placedFactors.filter(f => f.zone === 'A').map(f => (
                             <motion.div key={f.val} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-indigo-500 rounded-xl text-white font-black flex items-center justify-center shadow-lg border-2 border-white/20">
                               {f.val}
                             </motion.div>
                           ))}
                        </div>
                        {/* Zone Common */}
                        <div className="flex flex-wrap content-center justify-center gap-4 bg-white/5 rounded-[40px] border-2 border-white/10 shadow-inner">
                           {placedFactors.filter(f => f.zone === 'Common').map(f => (
                             <motion.div key={f.val} initial={{ scale: 0 }} animate={{ scale: 1.2 }} className="w-14 h-14 bg-amber-500 rounded-xl text-white font-black flex items-center justify-center shadow-2xl border-4 border-white/40">
                               {f.val}
                             </motion.div>
                           ))}
                        </div>
                        {/* Zone B */}
                        <div className="flex flex-wrap content-center justify-center gap-4">
                           {placedFactors.filter(f => f.zone === 'B').map(f => (
                             <motion.div key={f.val} initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 bg-rose-500 rounded-xl text-white font-black flex items-center justify-center shadow-lg border-2 border-white/20">
                               {f.val}
                             </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-amber-500 text-white font-black rounded-3xl shadow-3xl text-xl flex items-center gap-4 italic uppercase tracking-tighter">
                       <Zap size={24} fill="currentColor" /> {feedback}
                    </motion.div>
                  )}
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Trophy size={64} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      ARENA <span className="text-amber-400">CONQUERED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      HCF is the product of common prime factors (or largest common factor), while LCM is the product of all factors in the Venn diagram.
                    </p>
                  </div>
                  
                  <div className="flex gap-8">
                     <div className="p-8 bg-white/5 rounded-[48px] border-4 border-amber-500/30 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Calculated HCF</p>
                        <div className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">High-6</div>
                     </div>
                     <div className="p-8 bg-white/5 rounded-[48px] border-4 border-indigo-500/30 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Calculated LCM</p>
                        <div className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">36-Union</div>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Enter Classification <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
