import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ChevronRight,
  Shield,
  Swords,
  Trophy,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Element {
  id: string;
  symbol: string;
  name: string;
  reactivity: number; // Higher is more reactive
  color: string;
}

const ELEMENTS: Element[] = [
  { id: 'k', symbol: 'K', name: 'Potassium', reactivity: 10, color: 'bg-indigo-500' },
  { id: 'na', symbol: 'Na', name: 'Sodium', reactivity: 9, color: 'bg-orange-500' },
  { id: 'ca', symbol: 'Ca', name: 'Calcium', reactivity: 8, color: 'bg-amber-500' },
  { id: 'mg', symbol: 'Mg', name: 'Magnesium', reactivity: 7, color: 'bg-slate-500' },
  { id: 'al', symbol: 'Al', name: 'Aluminium', reactivity: 6, color: 'bg-blue-400' },
  { id: 'zn', symbol: 'Zn', name: 'Zinc', reactivity: 5, color: 'bg-cyan-500' },
  { id: 'fe', symbol: 'Fe', name: 'Iron', reactivity: 4, color: 'bg-orange-900' },
  { id: 'pb', symbol: 'Pb', name: 'Lead', reactivity: 3, color: 'bg-slate-700' },
  { id: 'cu', symbol: 'Cu', name: 'Copper', reactivity: 2, color: 'bg-orange-600' },
  { id: 'ag', symbol: 'Ag', name: 'Silver', reactivity: 1, color: 'bg-slate-300' },
];

const DISPLACEMENT_ROUNDS = [
  {
    compound: { name: 'Copper Sulphate', formula: 'CuSO₄', cation: 'cu', color: 'bg-blue-600' },
    target: 'cu',
    description: "Iron nails in blue copper sulphate solution."
  },
  {
    compound: { name: 'Silver Nitrate', formula: 'AgNO₃', cation: 'ag', color: 'bg-slate-100' },
    target: 'ag',
    description: "Copper wire reacting with silver nitrate."
  },
  {
    compound: { name: 'Zinc Sulphate', formula: 'ZnSO₄', cation: 'zn', color: 'bg-slate-50' },
    target: 'zn',
    description: "Displace zinc from its solution."
  }
];

interface ElementFighterProps {
  onComplete: () => void;
}

export function ElementFighter({ onComplete }: ElementFighterProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedFighter, setSelectedFighter] = useState<string | null>(null);
  const [isFighting, setIsFighting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const round = DISPLACEMENT_ROUNDS[currentRound];
  const targetElement = ELEMENTS.find(e => e.id === round.target)!;

  const handleFight = (elementId: string) => {
    if (isFighting || isSuccess) return;
    
    setSelectedFighter(elementId);
    setFeedback(null);
    setIsFighting(true);

    const fighter = ELEMENTS.find(e => e.id === elementId)!;
    
    setTimeout(() => {
      if (fighter.reactivity > targetElement.reactivity) {
        setIsSuccess(true);
      } else {
        setFeedback(`${fighter.name} is less reactive than ${targetElement.name}. Displacement failed!`);
        setIsFighting(false);
      }
    }, 1500);
  };

  const nextLevel = () => {
    if (currentRound < DISPLACEMENT_ROUNDS.length - 1) {
      setCurrentRound(prev => prev + 1);
      setSelectedFighter(null);
      setIsSuccess(false);
      setIsFighting(false);
      setFeedback(null);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Reactivity Series / Roster */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-yellow-100 bg-white shadow-xl h-full flex flex-col">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-4">
                <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">The Series</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Reactivity Rank</p>
                </div>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {ELEMENTS.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleFight(e.id)}
                    disabled={isFighting || isSuccess}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between group transition-all
                      ${selectedFighter === e.id ? 'bg-yellow-600 border-yellow-400 text-white translate-x-2' : 'bg-white border-slate-50 hover:border-yellow-200'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg ${e.color} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                          {e.symbol}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest leading-none">{e.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                       {Array.from({length: 3}).map((_, i) => (
                         <div key={i} className={`w-1 h-3 rounded-full ${i < Math.ceil(e.reactivity/3.5) ? 'bg-yellow-400' : 'bg-slate-100'}`} />
                       ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
               <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-100 flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-yellow-800 leading-relaxed italic">
                    Only a <strong>more reactive</strong> element can displace a <strong>less reactive</strong> one.
                  </p>
               </div>
            </div>
          </Card>
        </div>

        {/* Battle Arena */}
        <div className="lg:col-span-9 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-yellow-900/20 to-transparent" />
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:48px_48px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full flex flex-col items-center gap-12">
                  <header className="text-center space-y-2">
                     <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">Displacement Duel</p>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Target: <span className="text-yellow-400">{round.compound.name}</span></h2>
                     <p className="text-white/40 font-bold italic text-sm">"{round.description}"</p>
                  </header>

                  <div className="flex items-center gap-16 relative">
                     {/* Challenger Selection Point */}
                     <div className="flex flex-col items-center gap-6">
                        <div className="w-48 h-48 rounded-[48px] border-4 border-dashed border-white/20 flex flex-col items-center justify-center transition-all bg-white/5 relative">
                           {selectedFighter ? (
                             <motion.div 
                               initial={{ scale: 0, x: -100 }} animate={isFighting ? { x: 100, scale: 1.1 } : { scale: 1, x: 0 }}
                               className={`${ELEMENTS.find(e => e.id === selectedFighter)!.color} p-12 rounded-[40px] shadow-3xl flex flex-col items-center justify-center text-white font-black z-20`}
                             >
                                <span className="text-5xl">{ELEMENTS.find(e => e.id === selectedFighter)!.symbol}</span>
                                <span className="text-xs uppercase tracking-[0.2em] mt-2">Challenger</span>
                             </motion.div>
                           ) : (
                             <div className="flex flex-col items-center animate-pulse">
                                <Swords size={48} className="text-white/10 mb-2" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Select Element</span>
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="text-white/10 italic font-black text-6xl">VS</div>

                     {/* Defender Compound */}
                     <div className="flex flex-col items-center gap-6">
                        <div className="w-48 h-48 rounded-[48px] border-4 border-white pb-4 shadow-3xl flex flex-col items-center justify-center relative overflow-hidden">
                           <div className={`absolute inset-0 ${round.compound.color} opacity-40`} />
                           <motion.div 
                             animate={isFighting && isSuccess ? { x: 200, opacity: 0 } : {}}
                             className={`p-10 rounded-3xl bg-white shadow-xl flex flex-col items-center justify-center text-slate-900 font-black relative z-10 transition-all`}
                           >
                              <span className="text-4xl">{targetElement.symbol}</span>
                           </motion.div>
                           <div className="mt-4 px-4 py-1 bg-white/20 rounded-full text-white font-black text-[10px] uppercase tracking-widest relative z-10">
                              {round.compound.formula.replace(targetElement.symbol, '')}
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Holding Node</span>
                     </div>
                  </div>

                  {feedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/20 border-2 border-rose-500 rounded-3xl text-rose-500 font-black text-xs uppercase italic">
                       {feedback}
                    </motion.div>
                  )}

                  <div className="flex gap-4">
                     <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                        <Shield className="text-yellow-500" size={20} />
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Reaction Energy: STABLE</span>
                     </div>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="relative">
                    <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                       <Trophy size={64} className="animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      ELEMENT <span className="text-yellow-400 text-stroke-white">KIEKED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl mx-auto">
                      Displacement complete! {ELEMENTS.find(e => e.id === selectedFighter)?.name} was reactive enough to bump {targetElement.name} out of its position.
                    </p>
                  </div>
                  
                  <div className="p-10 bg-white/5 rounded-[48px] border-4 border-yellow-500/30 flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`px-8 py-4 rounded-3xl ${ELEMENTS.find(e => e.id === selectedFighter)?.color} text-white font-black text-3xl`}>
                           {ELEMENTS.find(e => e.id === selectedFighter)?.symbol}
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase italic">Free Element</span>
                      </div>
                      <Plus className="text-yellow-500" />
                      <div className="flex flex-col items-center gap-2">
                         <div className={`px-12 py-5 rounded-[40px] bg-white text-slate-900 font-black text-4xl shadow-2xl`}>
                            {ELEMENTS.find(e => e.id === selectedFighter)?.symbol}{round.compound.formula.replace(targetElement.symbol, '')}
                         </div>
                         <span className="text-[9px] font-black text-slate-500 uppercase italic">New Compound</span>
                      </div>
                      <Plus className="text-slate-700" />
                      <div className="flex flex-col items-center gap-2 opacity-30">
                         <div className={`px-6 py-3 rounded-2xl ${targetElement.color} text-white font-black text-xl`}>
                            {targetElement.symbol}
                         </div>
                         <span className="text-[9px] font-black text-slate-500 uppercase italic">Displaced</span>
                      </div>
                  </div>

                  <Button onClick={nextLevel} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     {currentRound < DISPLACEMENT_ROUNDS.length - 1 ? 'Next Duel' : 'Ion Exchange Entry'} <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
