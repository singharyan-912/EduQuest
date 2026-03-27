import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  RotateCcw, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Relation {
  from: number;
  to: number;
}

interface RelationMatcherProps {
  onComplete: () => void;
}

const ELEMENTS = [1, 2, 3];

export function RelationMatcher({ onComplete }: RelationMatcherProps) {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [goal, setGoal] = useState<'REFLEXIVE' | 'SYMMETRIC' | 'TRANSITIVE'>('REFLEXIVE');

  // Property calculation
  const isReflexive = ELEMENTS.every(e => relations.some(r => r.from === e && r.to === e));
  
  const isSymmetric = relations.every(r => 
    r.from === r.to || relations.some(r2 => r2.from === r.to && r2.to === r.from)
  ) && relations.length > 0;

  const isTransitive = relations.every(r1 => 
    relations.every(r2 => {
      if (r1.to === r2.from) {
        return relations.some(r3 => r3.from === r1.from && r3.to === r2.to);
      }
      return true;
    })
  ) && relations.length > 0;

  useEffect(() => {
    if (goal === 'REFLEXIVE' && isReflexive) {
      setTimeout(() => setGoal('SYMMETRIC'), 1500);
    } else if (goal === 'SYMMETRIC' && isSymmetric && isReflexive) {
      setTimeout(() => setGoal('TRANSITIVE'), 1500);
    } else if (goal === 'TRANSITIVE' && isTransitive && isReflexive && isSymmetric) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [relations, goal, isReflexive, isSymmetric, isTransitive]);

  const toggleRelation = (from: number, to: number) => {
    const exists = relations.find(r => r.from === from && r.to === to);
    if (exists) {
      setRelations(relations.filter(r => !(r.from === from && r.to === to)));
    } else {
      setRelations([...relations, { from, to }]);
    }
  };

  const resetGame = () => {
    setRelations([]);
    setGoal('REFLEXIVE');
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Logic Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-blue-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Network className="mr-2 text-blue-500" /> Property Tracker
                 </h3>
                 <div className="px-5 py-2 bg-blue-600 text-white rounded-2xl font-black text-xs">A = {"{1,2,3}"}</div>
              </div>

              {/* Goal Indicator */}
              <div className="p-6 bg-slate-900 rounded-3xl space-y-4 border-2 border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={48} className="text-blue-400" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 italic font-mono">Current Objective</p>
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    Build <span className="text-blue-400">{goal}</span> Relation
                 </h2>
              </div>

              {/* Live Checks */}
              <div className="space-y-4">
                 <div className={`p-5 rounded-3xl border-4 transition-all flex items-center justify-between
                   ${isReflexive ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 opacity-60'}
                 `}>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">Reflexive</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">∀a ∈ A, (a,a) ∈ R</p>
                    </div>
                    {isReflexive ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-slate-300" />}
                 </div>

                 <div className={`p-5 rounded-3xl border-4 transition-all flex items-center justify-between
                   ${isSymmetric ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 opacity-60'}
                 `}>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">Symmetric</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">(a,b) ∈ R ⇒ (b,a) ∈ R</p>
                    </div>
                    {isSymmetric ? <CheckCircle2 className="text-indigo-500" /> : <AlertCircle className="text-slate-300" />}
                 </div>

                 <div className={`p-5 rounded-3xl border-4 transition-all flex items-center justify-between
                   ${isTransitive ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100 opacity-60'}
                 `}>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">Transitive</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">(a,b),(b,c) ∈ R ⇒ (a,c) ∈ R</p>
                    </div>
                    {isTransitive ? <CheckCircle2 className="text-rose-500" /> : <AlertCircle className="text-slate-300" />}
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-blue-50/50 rounded-[32px] border-2 border-blue-100 flex items-start space-x-3">
              <Info className="text-blue-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
                 <b>Equivalence Relation</b>: When a relation satisfies all three properties simultaneously, it becomes an Equivalence Relation. Toggle arrows to experiment!
              </p>
           </div>
        </div>

        {/* Visual Set View */}
        <div className="lg:col-span-8 bg-slate-50/50 rounded-[80px] border-8 border-white shadow-3xl relative flex items-center justify-center p-12 overflow-hidden min-h-[600px] border-4 border-blue-100/20">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none" />

           {/* Set Mapping Grid */}
           <div className="relative w-full h-[500px] flex items-center justify-center">
              
              {/* Elements */}
              {ELEMENTS.map((e, idx) => (
                 <motion.div 
                   key={e}
                   layoutId={`node-${e}`}
                   className="absolute"
                   style={{ 
                      left: idx === 0 ? '50%' : idx === 1 ? '20%' : '80%',
                      top: idx === 0 ? '20%' : '75%',
                      transform: 'translate(-50%, -50%)'
                   }}
                 >
                    <div className="relative group">
                       <motion.button
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.9 }}
                         className="w-24 h-24 rounded-full bg-white border-8 border-blue-500 shadow-2xl flex items-center justify-center text-4xl font-black text-blue-600 relative z-20"
                       >
                          {e}
                       </motion.button>
                       {/* Dropdown-like interaction for mapping would be complex to draw arrows from here, 
                           let's use a simpler "click from, click to" or an interactive grid for mapping.
                           Let's use a mapping grid below the visualizer for simplicity in this artifact. */}
                    </div>
                 </motion.div>
              ))}

              {/* Simple Mapping Grid for Interaction */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-white/80 backdrop-blur rounded-3xl shadow-xl flex gap-4 border-2 border-slate-100 z-50">
                 {ELEMENTS.map(from => (
                    <div key={from} className="flex flex-col gap-2 p-2 border-r last:border-0 border-slate-100">
                       <span className="text-[10px] font-black text-slate-400 uppercase text-center">{from} →</span>
                       <div className="flex gap-2">
                          {ELEMENTS.map(to => (
                             <button
                               key={`${from}-${to}`}
                               onClick={() => toggleRelation(from, to)}
                               className={`w-10 h-10 rounded-xl border-2 font-black transition-all
                                 ${relations.find(r => r.from === from && r.to === to) 
                                   ? 'bg-blue-600 border-blue-700 text-white scale-110' 
                                   : 'bg-white border-slate-100 text-slate-300 hover:border-blue-200'}
                               `}
                             >
                                {to}
                             </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              {/* Visual Arrows (Simplified for now) */}
              <div className="absolute inset-0 pointer-events-none opacity-50">
                 {relations.map((r, i) => (
                    <motion.div 
                      key={`${r.from}-${r.to}-${i}`}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      className="text-blue-400 font-black text-[10px] absolute italic uppercase tracking-widest whitespace-nowrap"
                      style={{ 
                         left: `${30 + (r.from * 10) + (r.to * 5)}%`,
                         top: `${30 + (i * 10)}%`
                      }}
                    >
                       ( {r.from} , {r.to} )
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-blue-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <CheckCircle2 size={100} className="mb-8 animate-bounce text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Mapping Mastered!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">You have successfully constructed an Equivalence Relation. All properties are perfectly balanced.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Redefine Set
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-blue-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Type Analysis <ArrowRight size={24} className="ml-3" />
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
