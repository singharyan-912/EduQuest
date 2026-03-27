import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  Beaker,
  Zap,
  Flame,
  Star,
  Info,
  Trash2,
  Trophy,
  History
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string;
  type: 'metal' | 'non-metal' | 'compound' | 'gas';
}

const CHEMICALS: Chemical[] = [
  { id: 'mg', name: 'Magnesium', formula: 'Mg', color: 'bg-slate-400', type: 'metal' },
  { id: 'o2', name: 'Oxygen', formula: 'O₂', color: 'bg-rose-400', type: 'gas' },
  { id: 'h2', name: 'Hydrogen', formula: 'H₂', color: 'bg-blue-400', type: 'gas' },
  { id: 'c', name: 'Carbon', formula: 'C', color: 'bg-slate-800', type: 'non-metal' },
  { id: 'cu', name: 'Copper', formula: 'Cu', color: 'bg-orange-600', type: 'metal' },
  { id: 'zn', name: 'Zinc', formula: 'Zn', color: 'bg-cyan-500', type: 'metal' },
  { id: 'cuso4', name: 'Copper Sulphate', formula: 'CuSO₄', color: 'bg-blue-500', type: 'compound' },
  { id: 'hcl', name: 'Hydrochloric Acid', formula: 'HCl', color: 'bg-emerald-100', type: 'compound' },
  { id: 'na2so4', name: 'Sodium Sulphate', formula: 'Na₂SO₄', color: 'bg-slate-100', type: 'compound' },
  { id: 'bacl2', name: 'Barium Chloride', formula: 'BaCl₂', color: 'bg-emerald-50', type: 'compound' },
];

const DISCOVERIES = [
  { reactants: ['mg', 'o2'], product: 'MgO', name: 'Magnesium Oxide', type: 'Combination' },
  { reactants: ['h2', 'o2'], product: 'H₂O', name: 'Water', type: 'Combination' },
  { reactants: ['c', 'o2'], product: 'CO₂', name: 'Carbon Dioxide', type: 'Combination' },
  { reactants: ['zn', 'cuso4'], product: 'ZnSO₄ + Cu', name: 'Zinc Displacement', type: 'Displacement' },
  { reactants: ['na2so4', 'bacl2'], product: 'BaSO₄ + NaCl', name: 'White Precipitate', type: 'Double Displacement' },
];

interface ChemistrySandboxProps {
  onComplete?: () => void;
}

export function ChemistrySandbox({ onComplete }: ChemistrySandboxProps) {
  useEffect(() => {
    // onComplete is provided but not strictly required for sandbox finish
  }, [onComplete]);
  const [selectedInBooth, setSelectedInBooth] = useState<string[]>([]);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);
  const [reactionResult, setReactionResult] = useState<any>(null);

  const toggleToBooth = (id: string) => {
    if (isReacting) return;
    if (selectedInBooth.includes(id)) {
      setSelectedInBooth(prev => prev.filter(x => x !== id));
    } else if (selectedInBooth.length < 3) {
      setSelectedInBooth(prev => [...prev, id]);
    }
  };

  const triggerExperiment = () => {
    if (selectedInBooth.length < 2) return;
    
    setIsReacting(true);
    setReactionResult(null);

    // Check for discoveries
    const match = DISCOVERIES.find(d => 
      d.reactants.length === selectedInBooth.length && 
      d.reactants.every(r => selectedInBooth.includes(r))
    );

    setTimeout(() => {
      setIsReacting(false);
      if (match) {
        setReactionResult(match);
        if (!discoveries.includes(match.name)) {
          setDiscoveries(prev => [...prev, match.name]);
        }
      } else {
        setReactionResult({ name: "Unknown Result", product: "?", type: "Inert / No reaction observed" });
      }
    }, 2000);
  };

  const clearBooth = () => {
    setSelectedInBooth([]);
    setReactionResult(null);
    setIsReacting(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chemical Library */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-slate-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-6 flex-1">
               <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                  <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                     <FlaskConical size={24} />
                  </div>
                  <div>
                     <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Library</h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Select Reactants</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {CHEMICALS.map(c => {
                    const isSelected = selectedInBooth.includes(c.id);
                    return (
                      <button 
                        key={c.id} 
                        onClick={() => toggleToBooth(c.id)}
                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group
                          ${isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-200'}
                        `}
                      >
                         <div className={`w-10 h-10 rounded-2xl ${c.color} flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-110 transition-transform`}>
                            {c.formula}
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-tighter text-center">{c.name}</span>
                      </button>
                    );
                  })}
               </div>
            </div>

            <div className="pt-6 space-y-3">
               <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 flex items-start gap-3">
                  <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-blue-800 leading-relaxed italic">
                    Discover 5 unique reaction patterns to unlock the sandbox master badge.
                  </p>
               </div>
               <Button onClick={clearBooth} variant="outline" className="w-full py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest text-slate-400">
                  <Trash2 size={16} className="mr-2" /> Reset Table
               </Button>
            </div>
          </Card>
        </div>

        {/* Reaction Experimental Booth */}
        <div className="lg:col-span-6 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-blue-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px]" />

           <header className="relative z-10 text-center">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2">Experimental Booth</p>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none italic">Unrestricted <span className="text-blue-400">Synthesis</span></h2>
           </header>

           <div className="relative flex-1 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                 {isReacting ? (
                   <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-8">
                      <div className="relative">
                         <div className="w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
                         <Zap className="text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" size={64} />
                      </div>
                      <p className="text-white font-black italic animate-pulse">COLLIDING PARTICLES...</p>
                   </motion.div>
                 ) : reactionResult ? (
                   <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center flex flex-col items-center gap-6">
                      <div className="p-8 bg-white/5 rounded-[48px] border-2 border-white/10 backdrop-blur-xl">
                         <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic">{reactionResult.type}</p>
                         <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">{reactionResult.name}</h3>
                         <div className="text-6xl font-black text-blue-400">{reactionResult.product}</div>
                      </div>
                      <Button onClick={() => setReactionResult(null)} className="px-10 py-4 bg-white text-slate-950 font-black rounded-3xl">NEXT EXPERIMENT</Button>
                   </motion.div>
                 ) : (
                   <div className="flex gap-8 items-center">
                      {selectedInBooth.length > 0 ? (
                        selectedInBooth.map(id => {
                          const c = CHEMICALS.find(x => x.id === id)!;
                          return (
                            <motion.div
                              key={id}
                              initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }}
                              className={`${c.color} p-10 rounded-[40px] text-white font-black text-3xl shadow-3xl border-4 border-white/20`}
                            >
                               {c.formula}
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="p-16 border-4 border-dashed border-white/10 rounded-[56px] text-center space-y-6">
                           <Beaker size={64} className="text-white/10 mx-auto" />
                           <p className="text-white/20 font-black italic max-w-[200px]">SELECT CHEMICALS FROM THE LIBRARY TO BEGIN</p>
                        </div>
                      )}
                   </div>
                 )}
              </AnimatePresence>
           </div>

           <div className="relative z-10 w-full pt-12 flex flex-col items-center gap-6">
              <Button 
                onClick={triggerExperiment}
                disabled={selectedInBooth.length < 2 || isReacting || reactionResult}
                className={`px-20 py-8 rounded-[40px] font-black text-xl uppercase italic tracking-tighter shadow-3xl transform transition-all active:scale-95
                  ${selectedInBooth.length < 2 || isReacting || reactionResult ? 'bg-slate-800 text-slate-600 grayscale' : 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:rotate-1'}
                `}
              >
                 <Flame className="mr-3 inline" /> TRIGGER INTERACTION
              </Button>
           </div>
        </div>

        {/* Discovery Log */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-slate-900 bg-slate-900 text-white shadow-xl h-full flex flex-col">
              <div className="space-y-8 flex-1">
                 <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="p-3 bg-white/5 rounded-2xl text-blue-400">
                       <History size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none">Discovery Log</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Progress: {discoveries.length}/5</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    {discoveries.length === 0 ? (
                      <div className="p-8 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/5 space-y-4">
                         <Star size={32} className="text-slate-800 mx-auto" />
                         <p className="text-[10px] font-black uppercase text-slate-600 italic">No scientific breakthroughs yet.</p>
                      </div>
                    ) : (
                      discoveries.map((name, i) => (
                        <motion.div 
                          key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                          className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3"
                        >
                           <Trophy size={16} className="text-yellow-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest italic">{name}</span>
                        </motion.div>
                      ))
                    )}
                 </div>
              </div>

              {discoveries.length >= 5 && (
                <div className="pt-6 animate-bounce">
                   <div className="p-6 bg-blue-600 rounded-[32px] text-center shadow-3xl">
                      <Star size={32} className="text-white mx-auto mb-2" fill="currentColor" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Master Chemist Award UNLOCKED</p>
                   </div>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
