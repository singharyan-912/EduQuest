import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  RotateCcw, 
  ChevronRight,
  Flame,
  Zap,
  Layers,
  Sparkles,
  Trophy,
  ArrowDown
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Reactant {
  id: string;
  name: string;
  formula: string;
  color: string;
}

interface CombinationReaction {
  reactants: string[]; // ids
  product: {
    name: string;
    formula: string;
    description: string;
    color: string;
  }
}

const REACTANTS: Reactant[] = [
  { id: 'c', name: 'Carbon', formula: 'C', color: 'bg-slate-700' },
  { id: 'o2', name: 'Oxygen', formula: 'O₂', color: 'bg-rose-400' },
  { id: 'mg', name: 'Magnesium', formula: 'Mg', color: 'bg-slate-400' },
  { id: 'h2', name: 'Hydrogen', formula: 'H₂', color: 'bg-blue-400' },
  { id: 'ca', name: 'Calcium', formula: 'Ca', color: 'bg-orange-300' },
  { id: 'cl2', name: 'Chlorine', formula: 'Cl₂', color: 'bg-emerald-400' },
];

const REACTIONS: CombinationReaction[] = [
  {
    reactants: ['c', 'o2'],
    product: {
      name: "Carbon Dioxide",
      formula: "CO₂",
      description: "Carbon burns in oxygen to form CO₂ gas.",
      color: "bg-slate-500"
    }
  },
  {
    reactants: ['mg', 'o2'],
    product: {
      name: "Magnesium Oxide",
      formula: "MgO",
      description: "Magnesium combines with oxygen to form a white powder.",
      color: "bg-amber-100"
    }
  },
  {
    reactants: ['ca', 'o2'],
    product: {
      name: "Calcium Oxide",
      formula: "CaO",
      description: "Also known as quicklime, vital for construction.",
      color: "bg-orange-100"
    }
  }
];

interface MergeLabProps {
  onComplete: () => void;
}

export function MergeLab({ onComplete }: MergeLabProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedReactants, setSelectedReactants] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reaction = REACTIONS[currentLevel];

  const handleDragEnd = (id: string) => {
    if (selectedReactants.includes(id) || isMerging || isSuccess) return;
    
    const newSelected = [...selectedReactants, id];
    setSelectedReactants(newSelected);

    // If we have required reactants, trigger merge
    if (newSelected.length === reaction.reactants.length && 
        newSelected.every(r => reaction.reactants.includes(r))) {
      setIsMerging(true);
      setTimeout(() => {
        setIsMerging(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  const reset = () => {
    setSelectedReactants([]);
    setIsMerging(false);
    setIsSuccess(false);
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
        
        {/* Ingredient Shelf */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-purple-100 bg-white shadow-xl h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Precursors</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select to merge</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {REACTANTS.map((r) => {
                  const isUsed = selectedReactants.includes(r.id);
                  return (
                    <motion.button
                      key={r.id}
                      onClick={() => handleDragEnd(r.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isUsed || isSuccess}
                      className={`p-6 rounded-[24px] border-4 flex items-center justify-between group transition-all
                        ${isUsed ? 'bg-slate-100 border-slate-200 opacity-50 grayscale' : 'bg-white border-slate-50 hover:border-purple-300 shadow-sm'}
                      `}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ${r.color}`}>
                             {r.formula}
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-900">{r.name}</span>
                       </div>
                       <Plus size={16} className="text-slate-300 group-hover:text-purple-500" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t-4 border-slate-50">
               <button onClick={reset} className="w-full py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors">
                  <RotateCcw size={14} className="inline mr-2" /> Reset Reaction
               </button>
            </div>
          </Card>
        </div>

        {/* Fusion Zone */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-purple-900/40 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:32px_32px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full aspect-video flex flex-col items-center justify-center">
                  {/* Target Goal */}
                  <div className="absolute top-0 flex flex-col items-center text-center">
                     <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] mb-4">Fusion Objective</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">
                        Collect Reactants for <span className="text-purple-400">{reaction.product.name}</span>
                     </h2>
                     <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black uppercase tracking-widest italic">
                        Missing: {reaction.reactants.filter(r => !selectedReactants.includes(r)).length} Elements
                     </div>
                  </div>

                  {/* Fusion Reactor */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 border-4 border-dashed border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]"
                     />
                     
                     <AnimatePresence>
                        {selectedReactants.map((rid, idx) => {
                          const r = REACTANTS.find(item => item.id === rid)!;
                          return (
                            <motion.div
                              key={`${rid}-${idx}`}
                              initial={{ scale: 0, x: (idx-0.5)*300, y: 100 }}
                              animate={isMerging ? { x: 0, y: 0, scale: 0.5, opacity: 0 } : { scale: 1, x: (idx - (selectedReactants.length-1)/2) * 100, y: 0 }}
                              className={`${r.color} w-20 h-20 rounded-[28px] flex items-center justify-center text-white font-black text-xl shadow-2xl border-4 border-white/20`}
                            >
                               {r.formula}
                            </motion.div>
                          );
                        })}
                     </AnimatePresence>

                     {isMerging && (
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1.5 }}
                          className="absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-[0_0_100px_white]"
                        >
                           <Sparkles size={64} className="text-purple-600 animate-spin" />
                        </motion.div>
                     )}
                  </div>

                  <ArrowDown size={32} className="text-purple-500 mt-12 animate-bounce" />
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="relative">
                    <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center shadow-3xl text-white">
                       <Trophy size={64} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      SYNTHESIS <span className="text-purple-400">MASTERED</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      Multiple elements have combined to form a single substance: <strong className="text-white">{reaction.product.name} ({reaction.product.formula})</strong>.
                    </p>
                  </div>
                  
                  <div className="p-8 bg-white/5 rounded-[48px] border-4 border-purple-500/30 flex flex-col items-center gap-4">
                     <div className="flex items-center gap-4 text-3xl font-black text-white">
                        {reaction.reactants.map((r, i) => (
                          <div key={i} className="flex items-center gap-4">
                             <div className="px-6 py-2 bg-white/10 rounded-2xl">{REACTANTS.find(x => x.id === r)!.formula}</div>
                             {i < reaction.reactants.length - 1 && <span className="text-purple-400">+</span>}
                          </div>
                        ))}
                        <ChevronRight className="text-purple-500 mx-2" />
                        <div className={`px-12 py-4 rounded-[32px] text-white shadow-xl ${reaction.product.color}`}>
                           {reaction.product.formula}
                        </div>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Reactants → Single Product</p>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentLevel < REACTIONS.length - 1 ? 'Next Synthesis' : 'Lysis Chamber Entry'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
