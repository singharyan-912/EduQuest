import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Binary, 
  RotateCcw, 
  Zap,
  Box
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export function NumberSandbox() {
  const [inputValue, setInputValue] = useState("");
  const [stats, setStats] = useState<{
    val: number | null;
    isPrime: boolean;
    factors: number[];
    isPerfectSquare: boolean;
  } | null>(null);

  const analyzeNumber = (val: string) => {
    const n = parseInt(val);
    if (isNaN(n) || n < 1) return;

    const factors: number[] = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) factors.push(i);
    }

    const isPrime = factors.length === 2;
    const isPerfectSquare = Math.sqrt(n) % 1 === 0;

    setStats({
      val: n,
      isPrime,
      factors,
      isPerfectSquare
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-200 shadow-sm">
           <Box size={14} /> Unrestricted Experimentation
        </div>
        <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          NUMBER <span className="text-indigo-600">SANDBOX</span>
        </h2>
        <p className="text-xl text-slate-400 font-bold italic max-w-2xl mx-auto">
          Input any positive integer to analyze its prime signature and logical properties.
        </p>
      </div>

      <div className="max-w-xl mx-auto flex flex-col items-center gap-8">
         <div className="relative w-full">
            <input 
              type="number"
              placeholder="Enter Number (e.g. 120)"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                analyzeNumber(e.target.value);
              }}
              className="w-full h-32 px-12 bg-white border-8 border-slate-100 rounded-[48px] text-5xl font-black text-slate-900 placeholder:text-slate-200 focus:border-indigo-500 focus:outline-none transition-all shadow-4xl focus:shadow-indigo-200/50"
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-3xl animate-pulse">
               <Zap size={32} fill="currentColor" />
            </div>
         </div>

         <AnimatePresence mode="wait">
            {stats && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                 <Card className="p-10 rounded-[56px] border-4 border-slate-100 bg-white space-y-6">
                    <header className="flex items-center gap-4 text-indigo-600 font-black italic uppercase text-lg tracking-tighter">
                       <GitBranch /> Decomposition
                    </header>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Primality</span>
                          <span className={stats.isPrime ? 'text-emerald-500' : 'text-slate-900'}>{stats.isPrime ? 'Prime' : 'Composite'}</span>
                       </div>
                       <div className="h-4 bg-slate-50 rounded-full border-2 border-slate-100 overflow-hidden">
                          <div className={`h-full transition-all ${stats.isPrime ? 'bg-emerald-500 w-full' : 'bg-slate-300 w-1/3'}`} />
                       </div>
                       
                       <div className="pt-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">All Factors ({stats.factors.length})</p>
                          <div className="flex flex-wrap gap-2">
                             {stats.factors.map(f => (
                               <div key={f} className="px-4 py-2 bg-indigo-50 text-indigo-600 border-2 border-indigo-100 rounded-xl font-black text-sm">
                                  {f}
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </Card>

                 <Card className="p-10 rounded-[56px] border-4 border-slate-100 bg-slate-900 text-white space-y-6 shadow-3xl">
                    <header className="flex items-center gap-4 text-indigo-400 font-black italic uppercase text-lg tracking-tighter">
                       <Binary size={24} /> Algebraic Identity
                    </header>
                    
                    <div className="space-y-8">
                       <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-lg ${stats.isPerfectSquare ? 'bg-emerald-400' : 'bg-white/10 text-white'}`}>
                             {stats.isPerfectSquare ? 'YES' : 'NO'}
                          </div>
                          <div>
                             <h4 className="text-xl font-black uppercase tracking-tighter italic">Perfect Square</h4>
                             <p className="text-xs text-slate-400 font-bold italic leading-none">Can be expressed as n²</p>
                          </div>
                       </div>

                       <div className="p-6 bg-white/5 rounded-[40px] border-2 border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Simulation Log</p>
                          <p className="text-sm font-bold italic leading-relaxed text-slate-300">
                             The number {stats.val} has {stats.factors.length} divisors. It is {stats.isPrime ? 'indivisible except by itself and 1' : `a composite structure built from ${stats.factors.filter(f => f > 1 && stats.factors.includes(f)).length} smaller nodes`}.
                          </p>
                       </div>

                       <div className="flex gap-3">
                          <div className="flex-1 px-4 py-4 bg-white/10 rounded-2xl flex flex-col items-center gap-1">
                             <span className="text-xl font-black italic">±{stats.val}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Integer Set</span>
                          </div>
                          <div className="flex-1 px-4 py-4 bg-indigo-600 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all cursor-pointer">
                             <RotateCcw size={16} />
                             <span className="text-[8px] font-black uppercase tracking-widest text-indigo-200">Re-Run Analysis</span>
                          </div>
                       </div>
                    </div>
                 </Card>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
