import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3X3, 
  RotateCcw, 
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Trophy,
  Activity,
  Zap,
  LayoutGrid,
  ArrowRight,
  ArrowBigRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Element {
  symbol: string;
  name: string;
  color: string;
}

interface Molecule {
  formula: string;
  atoms: { [symbol: string]: number };
}

interface Equation {
  reactants: Molecule[];
  products: Molecule[];
  correctCoefficients: number[]; // [r1, r2, ..., p1, p2, ...]
}

const EQUATIONS: Equation[] = [
  {
    reactants: [{ formula: 'H₂', atoms: { H: 2 } }, { formula: 'O₂', atoms: { O: 2 } }],
    products: [{ formula: 'H₂O', atoms: { H: 2, O: 1 } }],
    correctCoefficients: [2, 1, 2]
  },
  {
    reactants: [{ formula: 'Mg', atoms: { Mg: 1 } }, { formula: 'O₂', atoms: { O: 2 } }],
    products: [{ formula: 'MgO', atoms: { Mg: 1, O: 1 } }],
    correctCoefficients: [2, 1, 2]
  },
  {
    reactants: [{ formula: 'Na', atoms: { Na: 1 } }, { formula: 'Cl₂', atoms: { Cl: 2 } }],
    products: [{ formula: 'NaCl', atoms: { Na: 1, Cl: 1 } }],
    correctCoefficients: [2, 1, 2]
  }
];

interface BalanceMasterProps {
  onComplete: () => void;
}

export function BalanceMaster({ onComplete }: BalanceMasterProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [coefficients, setCoefficients] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const equation = EQUATIONS[currentLevel];

  useEffect(() => {
    // Initialize coefficients to 1
    const count = equation.reactants.length + equation.products.length;
    setCoefficients(new Array(count).fill(1));
    setIsSuccess(false);
  }, [currentLevel, equation]);

  const updateCoefficient = (idx: number, delta: number) => {
    setCoefficients(prev => {
      const next = [...prev];
      next[idx] = Math.max(1, Math.min(5, next[idx] + delta));
      return next;
    });
  };

  const getAtomCounts = (isReactant: boolean) => {
    const counts: { [symbol: string]: number } = {};
    const offset = isReactant ? 0 : equation.reactants.length;
    const array = isReactant ? equation.reactants : equation.products;

    array.forEach((mol, i) => {
      const coeff = coefficients[offset + i] || 1;
      Object.entries(mol.atoms).forEach(([sym, count]) => {
        counts[sym] = (counts[sym] || 0) + (count * coeff);
      });
    });
    return counts;
  };

  const checkBalance = () => {
    const reactantCounts = getAtomCounts(true);
    const productCounts = getAtomCounts(false);

    const elements = Array.from(new Set([
      ...Object.keys(reactantCounts),
      ...Object.keys(productCounts)
    ]));

    const balanced = elements.every(sym => reactantCounts[sym] === productCounts[sym]);
    
    if (balanced) {
      setIsSuccess(true);
    }
  };

  const nextLevel = () => {
    if (currentLevel < EQUATIONS.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const reactantCounts = getAtomCounts(true);
  const productCounts = getAtomCounts(false);
  const allElements = Array.from(new Set([
    ...Object.keys(reactantCounts),
    ...Object.keys(productCounts)
  ]));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Atomic Inventory */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-emerald-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-8 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Atom Inventory</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Balance L = R</p>
                </div>
              </div>

              <div className="space-y-4">
                 {allElements.map(sym => {
                   const r = reactantCounts[sym] || 0;
                   const p = productCounts[sym] || 0;
                   const isBalanced = r === p;

                   return (
                     <div key={sym} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-black text-slate-900">{sym} Atoms</span>
                           {isBalanced ? (
                             <Zap size={14} className="text-emerald-500 fill-emerald-500" />
                           ) : (
                             <span className="text-[10px] font-black text-rose-500 uppercase">Delta: {Math.abs(r-p)}</span>
                           )}
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Left</span>
                              <div className={`w-full h-8 rounded-lg flex items-center justify-center font-black transition-colors ${isBalanced ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 border-2'}`}>
                                 {r}
                              </div>
                           </div>
                           <div className="text-slate-200 mt-4">vs</div>
                           <div className="flex-1 flex flex-col items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Right</span>
                              <div className={`w-full h-8 rounded-lg flex items-center justify-center font-black transition-colors ${isBalanced ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 border-2'}`}>
                                 {p}
                              </div>
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>

            <Button 
               onClick={checkBalance} 
               disabled={isSuccess}
               className="mt-8 w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs"
            >
               Verify Stoichiometry
            </Button>
          </Card>
        </div>

        {/* Reaction Arena */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full flex flex-col items-center gap-12">
                  <header className="text-center space-y-2">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Conservation Challenge</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Balance the <span className="text-emerald-400 underline decoration-4 underline-offset-8">Equation</span></h2>
                  </header>

                  <div className="flex flex-wrap items-center justify-center gap-6 text-5xl font-black text-white bg-white/5 p-12 rounded-[48px] border-2 border-white/10 backdrop-blur-sm">
                     {/* Reactants */}
                     {equation.reactants.map((mol, idx) => (
                       <div key={`r-${idx}`} className="flex items-center gap-4 group">
                          <div className="flex flex-col items-center gap-2">
                             <div className="p-3 bg-white rounded-2xl text-slate-950 flex flex-col border-b-4 border-emerald-400">
                                <button onClick={() => updateCoefficient(idx, 1)} className="hover:text-emerald-600 transition-colors"><Plus size={20} strokeWidth={4}/></button>
                                <span className="text-4xl font-black my-1">{coefficients[idx] || 1}</span>
                                <button onClick={() => updateCoefficient(idx, -1)} className="hover:text-rose-600 transition-colors"><Minus size={20} strokeWidth={4}/></button>
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coeff</span>
                          </div>
                          <span className="tracking-tight">{mol.formula}</span>
                          {idx < equation.reactants.length - 1 && <span className="text-slate-600 mx-2">+</span>}
                       </div>
                     ))}

                     <ArrowRight size={48} className="text-emerald-500 mx-4" />

                     {/* Products */}
                     {equation.products.map((mol, idx) => {
                       const globalIdx = equation.reactants.length + idx;
                       return (
                         <div key={`p-${idx}`} className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                               <div className="p-3 bg-white rounded-2xl text-slate-950 flex flex-col border-b-4 border-emerald-400">
                                  <button onClick={() => updateCoefficient(globalIdx, 1)} className="hover:text-emerald-600 transition-colors"><Plus size={20} strokeWidth={4}/></button>
                                  <span className="text-4xl font-black my-1">{coefficients[globalIdx] || 1}</span>
                                  <button onClick={() => updateCoefficient(globalIdx, -1)} className="hover:text-rose-600 transition-colors"><Minus size={20} strokeWidth={4}/></button>
                               </div>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coeff</span>
                            </div>
                            <span className="tracking-tight">{mol.formula}</span>
                            {idx < equation.products.length - 1 && <span className="text-slate-600 mx-2">+</span>}
                         </div>
                       );
                     })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                     <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/5 flex items-center gap-3">
                        <LayoutGrid className="text-emerald-400" size={20} />
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase">Input States</p>
                           <p className="text-white font-black">GASEOUS</p>
                        </div>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border-2 border-white/5 flex items-center gap-3">
                        <Activity className="text-emerald-400" size={20} />
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase">Sim Speed</p>
                           <p className="text-white font-black">STABLE</p>
                        </div>
                     </div>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Trophy size={64} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      EQUATION <span className="text-emerald-400">BALANCED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Perfect! You've successfully applied the Law of Conservation of Mass. Every atom on the starting side is accounted for in the results.
                    </p>
                  </div>
                  
                  <div className="p-10 bg-white/5 rounded-[48px] border-4 border-emerald-500/30 flex items-center gap-4 text-4xl font-black text-white shadow-3xl">
                     {equation.reactants.map((m, i) => (
                        <span key={i}>{coefficients[i] > 1 && coefficients[i]}{m.formula}{i < equation.reactants.length - 1 ? ' + ' : ''}</span>
                     ))}
                     <ArrowRight size={32} className="text-emerald-500 mx-4" />
                     {equation.products.map((m, i) => (
                        <span key={i}>{coefficients[equation.reactants.length + i] > 1 && coefficients[equation.reactants.length + i]}{m.formula}{i < equation.products.length - 1 ? ' + ' : ''}</span>
                     ))}
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentLevel < EQUATIONS.length - 1 ? 'Next Challenge' : 'Merge Lab Entry'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
