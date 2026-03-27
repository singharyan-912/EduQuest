import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, 
  ChevronRight, 
  RotateCcw, 
  Trophy,
  Info,
  Hash
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface NumberItem {
  val: string;
  type: 'rational' | 'irrational';
  explanation: string;
  expansion: string;
}

const NUMBERS: NumberItem[] = [
  { val: "2/3", type: "rational", explanation: "Represented as p/q, where q ≠ 0.", expansion: "0.6666..." },
  { val: "√2", type: "irrational", explanation: "No finite p/q form exists.", expansion: "1.41421356..." },
  { val: "0.125", type: "rational", explanation: "Terminating decimal expansion.", expansion: "0.125" },
  { val: "π", type: "irrational", explanation: "Non-terminating, non-repeating.", expansion: "3.14159265..." },
  { val: "√9", type: "rational", explanation: "Perfect square (√9 = 3).", expansion: "3.0" },
  { val: "√3", type: "irrational", explanation: "Non-terminating/repeating expansion.", expansion: "1.73205081..." }
];

interface NumberSorterProps {
  onComplete: () => void;
}

export function NumberSorter({ onComplete }: NumberSorterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedRationals, setPlacedRationals] = useState<NumberItem[]>([]);
  const [placedIrrationals, setPlacedIrrationals] = useState<NumberItem[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const currentItem = NUMBERS[currentIndex];

  const handleDragSort = (targetType: 'rational' | 'irrational') => {
    if (isSuccess || !currentItem) return;

    if (targetType === currentItem.type) {
      if (targetType === 'rational') setPlacedRationals(prev => [...prev, currentItem]);
      else setPlacedIrrationals(prev => [...prev, currentItem]);

      if (currentIndex < NUMBERS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsSuccess(true);
      }
    } else {
      setErrorCount(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Info & Rules */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-blue-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                       <Hash size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Identity Check</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Rational vs Irrational</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
                       <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Rational</p>
                       <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">Terminating or repeating decimals that can be p/q.</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100">
                       <p className="text-[10px] font-black text-rose-600 uppercase mb-2">Irrational</p>
                       <p className="text-xs font-bold text-rose-800 leading-relaxed italic">Non-terminating and non-repeating decimals.</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t-2 border-slate-50">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    <span className="text-xs font-black text-slate-900">{currentIndex + 1}/{NUMBERS.length}</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentIndex + 1) / NUMBERS.length) * 100}%` }} />
                 </div>
              </div>
           </Card>
        </div>

        {/* Sorting Arena */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full h-full flex flex-col items-center justify-between">
                  {/* Current Target */}
                  <div className="flex flex-col items-center text-center gap-6 mt-8">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Identification Request</p>
                     
                     <motion.div 
                       key={currentIndex}
                       initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                       className="w-48 h-48 bg-white rounded-[56px] shadow-3xl text-slate-900 flex flex-col items-center justify-center p-8 border-b-[12px] border-blue-500"
                     >
                        <span className="text-5xl font-black italic tracking-tighter leading-none mb-2">{currentItem.val}</span>
                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {currentItem.expansion}
                        </div>
                     </motion.div>
                     
                     {errorCount > 0 && (
                       <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase italic tracking-tighter">
                          <RotateCcw size={14} /> Think about the decimal expansion pattern!
                       </div>
                     )}
                  </div>

                  {/* Bins */}
                  <div className="w-full flex gap-12 mt-12 mb-12">
                     <button 
                       onClick={() => handleDragSort('rational')}
                       className="flex-1 group"
                     >
                        <div className="h-48 bg-emerald-500/10 rounded-[48px] border-4 border-dashed border-emerald-500/30 flex flex-col items-center justify-center gap-4 transition-all group-hover:bg-emerald-500/20 group-hover:border-emerald-500">
                           <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                              <Binary size={32} />
                           </div>
                           <span className="text-lg font-black text-emerald-500 uppercase tracking-widest italic">Rational Bin</span>
                           <div className="flex gap-1">
                              {placedRationals.map((_, i) => <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full" />)}
                           </div>
                        </div>
                     </button>

                     <button 
                        onClick={() => handleDragSort('irrational')}
                        className="flex-1 group"
                     >
                        <div className="h-48 bg-rose-500/10 rounded-[48px] border-4 border-dashed border-rose-500/30 flex flex-col items-center justify-center gap-4 transition-all group-hover:bg-rose-500/20 group-hover:border-rose-500">
                           <div className="w-16 h-16 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                              <Info size={32} />
                           </div>
                           <span className="text-lg font-black text-rose-500 uppercase tracking-widest italic">Irrational Bin</span>
                           <div className="flex gap-1">
                              {placedIrrationals.map((_, i) => <div key={i} className="w-2 h-2 bg-rose-500 rounded-full" />)}
                           </div>
                        </div>
                     </button>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Trophy size={64} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      IDENTITY <span className="text-blue-400">UNVEILED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      You correctly categorized terminating and repeating decimals as Rational, and non-terminating non-repeating as Irrational.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                     <div className="p-6 bg-white/5 rounded-[40px] border-4 border-emerald-500/20">
                        <p className="text-[10px] font-black text-emerald-500 uppercase mb-4">The Rationalists</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                           {placedRationals.map((n, i) => (
                             <div key={i} className="px-4 py-2 bg-emerald-500/20 text-emerald-100 rounded-xl font-black text-sm">{n.val}</div>
                           ))}
                        </div>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[40px] border-4 border-rose-500/20">
                        <p className="text-[10px] font-black text-rose-500 uppercase mb-4">The Outliers</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                           {placedIrrationals.map((n, i) => (
                             <div key={i} className="px-4 py-2 bg-rose-500/20 text-rose-100 rounded-xl font-black text-sm">{n.val}</div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Logic Proof Entry <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
