import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  RotateCcw, 
  CheckCircle2,
  Plus,
  ArrowRight,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Molecule {
  id: string;
  name: string;
  formula: string;
  color: string;
  atoms: { type: string; count: number; color: string }[];
}

const REACTANTS: Molecule[] = [
  { id: 'h2', name: 'Hydrogen', formula: 'H₂', color: 'bg-blue-400', atoms: [{ type: 'H', count: 2, color: 'bg-blue-300' }] },
  { id: 'o2', name: 'Oxygen', formula: 'O₂', color: 'bg-rose-400', atoms: [{ type: 'O', count: 2, color: 'bg-rose-300' }] },
  { id: 'mg', name: 'Magnesium', formula: 'Mg', color: 'bg-slate-400', atoms: [{ type: 'Mg', count: 1, color: 'bg-slate-300' }] },
  { id: 'na', name: 'Sodium', formula: 'Na', color: 'bg-orange-400', atoms: [{ type: 'Na', count: 1, color: 'bg-orange-300' }] },
  { id: 'cl2', name: 'Chlorine', formula: 'Cl₂', color: 'bg-emerald-400', atoms: [{ type: 'Cl', count: 2, color: 'bg-emerald-300' }] },
];

const REACTIONS = [
  {
    reactants: ['h2', 'o2'],
    product: { id: 'h2o', name: 'Water', formula: 'H₂O', color: 'bg-cyan-500', atoms: [{ type: 'H', count: 2, color: 'bg-blue-300' }, { type: 'O', count: 1, color: 'bg-rose-300' }] },
    description: "Hydrogen burns in oxygen to form water."
  },
  {
    reactants: ['mg', 'o2'],
    product: { id: 'mgo', name: 'Magnesium Oxide', formula: 'MgO', color: 'bg-amber-600', atoms: [{ type: 'Mg', count: 1, color: 'bg-slate-300' }, { type: 'O', count: 1, color: 'bg-rose-300' }] },
    description: "Magnesium burns with a dazzling white flame."
  },
  {
    reactants: ['na', 'cl2'],
    product: { id: 'nacl', name: 'Sodium Chloride', formula: 'NaCl', color: 'bg-slate-100', atoms: [{ type: 'Na', count: 1, color: 'bg-orange-300' }, { type: 'Cl', count: 1, color: 'bg-emerald-300' }] },
    description: "Sodium reacts vigorously with chlorine to form table salt."
  }
];

interface EquationBuilderProps {
  onComplete: () => void;
}

export function EquationBuilder({ onComplete }: EquationBuilderProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedReactants, setSelectedReactants] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const reaction = REACTIONS[currentLevel];

  const toggleReactant = (id: string) => {
    if (isReacting || isSuccess) return;
    setFeedback(null);
    setSelectedReactants(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const triggerReaction = () => {
    const isCorrect = selectedReactants.length === reaction.reactants.length &&
                      selectedReactants.every(r => reaction.reactants.includes(r));

    if (isCorrect) {
      setIsReacting(true);
      setTimeout(() => {
        setIsReacting(false);
        setIsSuccess(true);
      }, 2000);
    } else {
      setFeedback("Incorrect reactants for this reaction. Try again!");
    }
  };

  const nextLevel = () => {
    if (currentLevel < REACTIONS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setSelectedReactants([]);
      setIsSuccess(false);
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  const reset = () => {
    setSelectedReactants([]);
    setIsSuccess(false);
    setIsReacting(false);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lab Table / Reactants Selection */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-blue-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                  <FlaskConical size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Reactant Deck</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select chemical inputs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {REACTANTS.map((m) => {
                  const isSelected = selectedReactants.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleReactant(m.id)}
                      className={`p-4 rounded-[24px] border-4 transition-all text-center group
                        ${isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'}
                      `}
                    >
                       <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-sm
                         ${isSelected ? 'bg-white text-blue-600' : `${m.color} text-white`}
                       `}>
                          {m.formula}
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-tighter">{m.name}</p>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-start gap-3">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] font-bold text-rose-800 leading-relaxed italic">{feedback}</p>
                </div>
              )}
            </div>

            <div className="pt-6 space-y-3">
               <button 
                 onClick={triggerReaction}
                 disabled={selectedReactants.length === 0 || isReacting || isSuccess}
                 className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group transition-all active:scale-95
                   ${selectedReactants.length > 0 && !isReacting && !isSuccess ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                 `}
               >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Trigger Reaction
               </button>
               <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                  <RotateCcw size={16} className="mr-2 inline" /> Clear Flask
               </Button>
            </div>
          </Card>
        </div>

        {/* Reaction Chamber */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-blue-900/40 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="flex items-center gap-12 mb-12">
                     <div className="flex flex-wrap justify-center gap-4 max-w-sm">
                        {selectedReactants.length > 0 ? (
                           selectedReactants.map((rid, idx) => {
                             const m = REACTANTS.find(r => r.id === rid)!;
                             return (
                               <motion.div 
                                 key={`${rid}-${idx}`}
                                 initial={{ scale: 0, x: -50 }} animate={{ scale: 1, x: 0 }}
                                 className={`${m.color} p-6 rounded-[32px] text-white font-black text-2xl shadow-2xl border-b-4 border-black/20`}
                               >
                                  {m.formula}
                               </motion.div>
                             );
                           })
                        ) : (
                           <div className="p-8 border-4 border-dashed border-white/10 rounded-[40px] text-white/20 font-black text-lg text-center">
                              ADD REACTANTS<br/>TO CHAMBER
                           </div>
                        ) }
                     </div>
                     <ArrowRight size={48} className={`text-white/20 transition-all ${isReacting ? 'animate-pulse text-blue-500 opacity-100' : ''}`} />
                     <div className="w-40 h-40 border-4 border-dashed border-white/10 rounded-[48px] flex items-center justify-center bg-white/5">
                        <span className="text-white/10 font-black italic">PRODUCING...</span>
                     </div>
                  </div>

                  {isReacting && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                       <div className="w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
                       <div className="grid grid-cols-4 gap-4">
                          {[1,2,3,4,5,6,7,8].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ 
                                x: [0, (Math.random()-0.5)*200, 0], 
                                y: [0, (Math.random()-0.5)*200, 0],
                                scale: [1, 1.5, 1]
                              }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"
                            />
                          ))}
                       </div>
                    </motion.div>
                  )}

                  <div className="text-center">
                    <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em]">Target Observation</p>
                    <p className="text-white text-2xl font-black italic mt-2 italic">"{reaction.description}"</p>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="relative">
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                       <CheckCircle2 size={64} />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-blue-500 rounded-full"
                    />
                  </div>

                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      REACTION <span className="text-blue-400">COMPLETE!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Success! You've combined the correct reactants to form <strong>{reaction.product.name} ({reaction.product.formula})</strong>.
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-center p-8 bg-white/5 rounded-[40px] border-2 border-white/10">
                     <div className="flex gap-3">
                        {reaction.reactants.map(rid => (
                          <div key={rid} className="px-6 py-3 bg-white/10 rounded-2xl text-white font-black">{rid.toUpperCase()}</div>
                        ))}
                     </div>
                     <ArrowRight size={24} className="text-blue-400" />
                     <div className="px-8 py-4 bg-blue-600 rounded-[32px] text-white font-black text-3xl shadow-xl">
                        {reaction.product.formula}
                     </div>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentLevel < REACTIONS.length - 1 ? 'Next Experiment' : 'Master Balancing'} <ArrowRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
