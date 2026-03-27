import { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, 
  ChevronRight, 
  RotateCcw, 
  Trophy,
  Zap,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface ProofStep {
  id: string;
  text: string;
  order: number;
}

const STEPS: ProofStep[] = [
  { id: '1', text: "Let √2 be rational. Then √2 = p/q, where p and q are coprime integers and q ≠ 0.", order: 0 },
  { id: '2', text: "Squaring both sides: 2 = p²/q², which means p² = 2q².", order: 1 },
  { id: '3', text: "Since p² = 2q², p² is divisible by 2. This implies p is also divisible by 2 (Let p = 2k).", order: 2 },
  { id: '4', text: "Substituting p = 2k: (2k)² = 2q², so 4k² = 2q², which simplifies to 2k² = q².", order: 3 },
  { id: '5', text: "Since q² = 2k², q² is divisible by 2, which means q is also divisible by 2.", order: 4 },
  { id: '6', text: "CONTRADICTION: Both p and q are divisible by 2, so they are NOT coprime. Our assumption was wrong.", order: 5 }
];

interface ProofPuzzleProps {
  onComplete: () => void;
}

export function ProofPuzzle({ onComplete }: ProofPuzzleProps) {
  const [items, setItems] = useState<ProofStep[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Shuffle steps
    setItems([...STEPS].sort(() => Math.random() - 0.5));
  }, []);

  const checkProof = () => {
    const isCorrect = items.every((item, index) => item.order === index);
    if (isCorrect) {
      setIsSuccess(true);
    } else {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Logic Log */}
        <div className="lg:col-span-1 space-y-4">
           <Card className="p-8 rounded-[40px] border-4 border-rose-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Proof Lab</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Logical Sequencing</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                       <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Target Proof</p>
                       <p className="text-sm font-black text-rose-600 italic">Prove that √2 is irrational.</p>
                    </div>
                    
                    <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100">
                       <p className="text-[10px] font-black uppercase text-rose-500 mb-2">The Goal</p>
                       <p className="text-xs font-bold text-rose-800 leading-relaxed italic">Drag items to arrange them in a logically flawless order from start to contradiction.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t-2 border-slate-50">
                 <button onClick={() => setItems([...items].sort(() => Math.random() - 0.5))} className="w-full py-4 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] border-2 border-slate-50">
                    <RotateCcw size={14} className="inline mr-2" /> Scramble Logic
                 </button>
              </div>
           </Card>
        </div>

        {/* Puzzle Arena */}
        <div className="lg:col-span-3 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[700px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-rose-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:48px_48px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative z-10 w-full flex flex-col items-center gap-12">
                  <header className="text-center space-y-2">
                     <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Contradiction Map</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">The <span className="text-rose-400">Irrationallity</span> Sequence</h2>
                  </header>

                  <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full space-y-3">
                    {items.map((item) => (
                      <Reorder.Item 
                        key={item.id} 
                        value={item}
                        className="cursor-move"
                      >
                         <Card className="p-5 bg-white/10 hover:bg-white/20 border-2 border-white/10 rounded-3xl transition-colors backdrop-blur-md">
                            <div className="flex gap-4">
                               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 font-black italic">
                                  {items.indexOf(item) + 1}
                               </div>
                               <p className="text-sm font-bold text-white italic leading-relaxed flex-1">
                                  {item.text}
                               </p>
                            </div>
                         </Card>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  <div className="flex items-center gap-6">
                     <Button 
                       onClick={checkProof}
                       className="px-12 py-6 bg-rose-600 text-white font-black rounded-[32px] text-xl shadow-2xl hover:bg-rose-500 flex items-center gap-3 active:scale-95 transition-all"
                     >
                        Validate Logic <Zap size={24} fill="white" />
                     </Button>
                     
                     {showHint && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase italic tracking-tighter">
                           <AlertTriangle size={16} /> Something is logically inconsistent!
                        </motion.div>
                     )}
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-rose-600 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Trophy size={64} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      LOGIC <span className="text-rose-500">SEALED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      Proof by contradiction successfully reconstructed. You've mathematically confirmed the existence of irrational numbers.
                    </p>
                  </div>
                  
                  <div className="p-8 bg-white/5 rounded-[48px] border-4 border-rose-500/30">
                     <div className="flex items-center gap-4 text-white font-black text-lg italic uppercase tracking-tighter">
                        <FileCheck className="text-rose-500" /> Q.E.D - Quod Erat Demonstrandum
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Final Lab Report <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
