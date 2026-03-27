import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Layers,
  Zap,
  Binary
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Scenario {
  id: string;
  name: string;
  type: 'DISSOCIATION' | 'ASSOCIATION';
  particles: string;
  theoreticalI: number;
  description: string;
  color: string;
}

const SCENARIOS: Scenario[] = [
  { id: 'nacl', name: 'Alkali Salt (NaCl)', type: 'DISSOCIATION', particles: 'Na⁺, Cl⁻', theoreticalI: 2, description: 'Splits into two ions in aqueous solution.', color: 'bg-blue-400' },
  { id: 'mgcl2', name: 'Magnesium Salt (MgCl₂)', type: 'DISSOCIATION', particles: 'Mg²⁺, 2Cl⁻', theoreticalI: 3, description: 'Splits into three ions in aqueous solution.', color: 'bg-indigo-400' },
  { id: 'acetic', name: 'Acetic Acid (Dimer)', type: 'ASSOCIATION', particles: '(CH₃COOH)₂', theoreticalI: 0.5, description: 'Molecules pair up in non-polar solvents.', color: 'bg-orange-400' }
];

interface AssociationBreakerProps {
  onComplete: () => void;
}

export function AssociationBreaker({ onComplete }: AssociationBreakerProps) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [reactionProgress, setReactionProgress] = useState(0); // 0 to 100
  const [isSuccess, setIsSuccess] = useState(false);

  const scenario = SCENARIOS[scenarioIdx];
  
  // Calculate dynamic i value
  // For dissociation: i = 1 + (n-1)alpha
  // For association: i = 1 + (1/n - 1)alpha
  // Simplified for gameplay:
  const iValue = scenario.type === 'DISSOCIATION' 
    ? 1 + (scenario.theoreticalI - 1) * (reactionProgress / 100)
    : 1 + (scenario.theoreticalI - 1) * (reactionProgress / 100);

  useEffect(() => {
    if (reactionProgress >= 100) {
      setTimeout(() => setIsSuccess(true), 2500);
    }
  }, [reactionProgress]);

  const nextScenario = () => {
    setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    setReactionProgress(0);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Scenario Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-orange-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Layers className="mr-2 text-orange-500" /> Van't Hoff Lab
                 </h3>
                 <div className="px-5 py-2 bg-orange-600 text-white rounded-2xl font-black text-xs">Abnormal Mass</div>
              </div>

              {/* Molecule Selection */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">Select Sample</p>
                 <div className="space-y-3">
                    {SCENARIOS.map((s, idx) => (
                       <button
                         key={s.id}
                         onClick={() => { setScenarioIdx(idx); setReactionProgress(0); }}
                         className={`w-full p-4 rounded-3xl border-4 transition-all text-left flex items-center justify-between
                           ${scenarioIdx === idx ? 'bg-orange-50 border-orange-400 scale-102' : 'bg-white border-slate-100'}
                         `}
                       >
                          <div className="flex items-center gap-3">
                             <div className={`w-4 h-4 rounded-full ${s.color}`} />
                             <span className="text-xs font-black text-slate-900 tracking-tighter uppercase">{s.name}</span>
                          </div>
                          {scenarioIdx === idx && <CheckCircle2 size={16} className="text-orange-500" />}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Progress Slider (Reaction Progress) */}
              <div className="space-y-6 pt-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-orange-500">
                    <span>{scenario.type === 'DISSOCIATION' ? 'Ionization' : 'Association'} Progress</span>
                    <span className="text-gray-900">{reactionProgress}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" value={reactionProgress}
                   onChange={(e) => setReactionProgress(Number(e.target.value))}
                   className="w-full h-4 bg-orange-100 rounded-full appearance-none cursor-pointer accent-orange-500"
                 />
              </div>

              {/* Van't Hoff Display */}
              <div className="pt-8 border-t-2 border-orange-50">
                 <div className="bg-slate-900 p-8 rounded-[40px] text-center space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Binary size={48} className="text-orange-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Van't Hoff Factor (i)</p>
                       <p className="text-6xl font-black tracking-tighter text-white font-mono">
                          {iValue.toFixed(2)}
                       </p>
                    </div>
                    
                    <div className={`text-[10px] font-black uppercase italic tracking-widest px-4 py-2 rounded-xl
                       ${iValue > 1 ? 'bg-indigo-500 text-white' : iValue < 1 ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-300'}
                    `}>
                       {iValue > 1 ? 'M(obs) < M(calc) | Dissociation' : iValue < 1 ? 'M(obs) > M(calc) | Association' : 'Normal Interaction'}
                    </div>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-orange-50/50 rounded-[32px] border-2 border-orange-100 flex items-start space-x-3">
              <Info className="text-orange-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-orange-800 leading-relaxed italic">
                 When solute particles <b>fragment or cluster</b>, the number of particles in solution changes, leading to "Abnormal" colligative properties.
              </p>
           </div>
        </div>

        {/* Particle Visualization */}
        <div className="lg:col-span-8 bg-slate-50/50 rounded-[80px] border-8 border-white shadow-3xl relative flex items-center justify-center p-12 overflow-hidden min-h-[600px] border-4 border-orange-100/20">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none z-10" />

           {/* Solution Grid Container */}
           <div className="relative w-full h-[500px] grid grid-cols-4 md:grid-cols-6 gap-8 p-12 items-center justify-center">
              
              {/* Dynamic Particle Rendering */}
              {Array.from({ length: 12 }).map((_, i) => (
                 <motion.div 
                   key={`${scenario.id}-${i}`}
                   layout
                   className="relative w-16 h-16 flex items-center justify-center"
                 >
                    {scenario.type === 'DISSOCIATION' ? (
                       // Dissociation: Start as one, split into multiple
                       <div className="relative w-full h-full flex items-center justify-center">
                          <motion.div 
                            animate={{ 
                               x: reactionProgress > 50 ? -12 : 0,
                               scale: reactionProgress > 50 ? 0.8 : 1
                            }}
                            className={`w-8 h-8 rounded-full ${scenario.color} shadow-lg border-2 border-white/50 flex items-center justify-center text-[8px] font-black text-white`}
                          >
                             {scenario.id === 'nacl' ? 'Na⁺' : 'Mg²⁺'}
                          </motion.div>
                          <motion.div 
                            animate={{ 
                               x: reactionProgress > 50 ? 12 : 0,
                               y: reactionProgress > 80 && scenario.id === 'mgcl2' ? 12 : 0,
                               scale: reactionProgress > 50 ? 0.8 : 1,
                               opacity: reactionProgress > 30 ? 1 : 0
                            }}
                            className="w-8 h-8 rounded-full bg-slate-300 shadow-lg border-2 border-white/50 flex items-center justify-center text-[8px] font-black text-slate-800 ml-1"
                          >
                             Cl⁻
                          </motion.div>
                          {scenario.id === 'mgcl2' && (
                             <motion.div 
                               animate={{ 
                                  y: reactionProgress > 80 ? -12 : 0,
                                  opacity: reactionProgress > 70 ? 1 : 0
                               }}
                               className="w-8 h-8 absolute rounded-full bg-slate-300 shadow-lg border-2 border-white/50 flex items-center justify-center text-[8px] font-black text-slate-800"
                             >
                                Cl⁻
                             </motion.div>
                          )}
                       </div>
                    ) : (
                       // Association: Start as two, join into one
                       <div className="relative w-full h-full flex items-center justify-center">
                          <motion.div 
                            animate={{ 
                               x: reactionProgress > 50 ? 8 : -8,
                               rotate: reactionProgress > 50 ? 45 : 0
                            }}
                            className={`w-10 h-10 rounded-xl ${scenario.color} shadow-lg border-2 border-white/50 flex items-center justify-center text-[6px] font-black text-white`}
                          >
                             COOH
                          </motion.div>
                          <motion.div 
                            animate={{ 
                               x: reactionProgress > 50 ? -8 : 8,
                               rotate: reactionProgress > 50 ? -135 : 0
                            }}
                            className={`w-10 h-10 rounded-xl ${scenario.color} shadow-lg border-2 border-white/50 flex items-center justify-center text-[6px] font-black text-white absolute`}
                          >
                             HOOC
                          </motion.div>
                       </div>
                    )}
                 </motion.div>
              ))}
           </div>

           {/* Feedback Stats */}
           <div className="absolute top-12 left-12 bg-white/80 backdrop-blur px-6 py-4 rounded-[32px] border-4 border-orange-100 shadow-xl flex items-center space-x-3">
              <Zap className="text-orange-500" size={24} />
              <span className="text-xl font-black text-orange-700 tracking-tighter uppercase italic">
                 {reactionProgress}% Transformation
              </span>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Binary size={100} className="mb-8 animate-pulse text-orange-400" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Factor Deciphered!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">You have successfully visualized how particle splitting and clustering affects the Van't Hoff factor. The colligative puzzle is complete.</p>
                   <div className="flex space-x-4">
                      <Button onClick={nextScenario} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Next Sample
                      </Button>
                      <Button onClick={onComplete} className="bg-orange-500 text-slate-900 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Complete Chemistry Module <ArrowRight size={24} className="ml-3" />
                      </Button>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
