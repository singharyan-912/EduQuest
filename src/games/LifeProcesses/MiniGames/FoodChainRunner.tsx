import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  RotateCcw, 
  ChevronRight,
  Zap,
  Leaf,
  Bird,
  Flame,
  MousePointer2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface TrophicLevel {
  id: string;
  name: string;
  energy: number; // in Joules
  icon: any;
  color: string;
  transferRate: number; // 0.1 for 10%
}

const INITIAL_LEVELS: TrophicLevel[] = [
  { id: 'producer', name: 'Producers (Plants)', energy: 10000, icon: Leaf, color: 'emerald', transferRate: 1 },
  { id: 'herbivore', name: 'Primary Consumers', energy: 0, icon: MousePointer2, color: 'blue', transferRate: 0.1 },
  { id: 'carnivore', name: 'Secondary Consumers', energy: 0, icon: Bird, color: 'rose', transferRate: 0.1 }
];

interface FoodChainRunnerProps {
  onComplete: () => void;
}

export function FoodChainRunner({ onComplete }: FoodChainRunnerProps) {
  const [levels, setLevels] = useState<TrophicLevel[]>(INITIAL_LEVELS);
  const [isSuccess, setIsSuccess] = useState(false);
  const [totalTransferred, setTotalTransferred] = useState(0);

  const transferEnergy = (fromIdx: number) => {
    if (isSuccess || fromIdx >= levels.length - 1) return;

    const toIdx = fromIdx + 1;
    const fromLevel = levels[fromIdx];
    const toLevel = levels[toIdx];

    if (fromLevel.energy <= 0) return;

    // Transfer amount (e.g., 500J at a time)
    const amount = Math.min(fromLevel.energy, 1000);
    const received = amount * toLevel.transferRate;

    const newLevels = [...levels];
    newLevels[fromIdx] = { ...fromLevel, energy: fromLevel.energy - amount };
    newLevels[toIdx] = { ...toLevel, energy: toLevel.energy + received };

    setLevels(newLevels);
    setTotalTransferred(prev => prev + amount);

    // Check Win Condition: Carnivore reaches 100J
    if (newLevels[2].energy >= 100) {
      setIsSuccess(true);
    }
  };

  const reset = () => {
    setLevels(INITIAL_LEVELS);
    setIsSuccess(false);
    setTotalTransferred(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Ecological Dashboard */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-emerald-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Ecometer</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Energy Flow Monitor</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-slate-900 rounded-[32px] border-b-4 border-amber-500">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Carnivore Energy</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter">{Math.floor(levels[2].energy)}</span>
                    <span className="text-xs font-bold text-slate-400 mb-1">/ 100 J</span>
                  </div>
                  <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((levels[2].energy / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-start gap-3">
                  <AlertTriangle className="text-emerald-600 shrink-0 mt-1" size={18} />
                  <p className="text-[11px] font-bold text-emerald-800 leading-relaxed italic">
                    The 10% Rule: Only 10% of energy is available to the next trophic level. 90% is lost as heat!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={reset}
                variant="outline"
                className="w-full py-4 rounded-2xl font-black text-slate-400 border-2 hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
              >
                <RotateCcw size={16} className="mr-2" /> Reset Ecosystem
              </Button>
            </div>
          </Card>
        </div>

        {/* Energy Pyramid Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[600px] p-12">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           
           <div className="relative w-full max-w-2xl flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <div className="w-full flex flex-col gap-6">
                    {levels.map((level, idx) => {
                      const Icon = level.icon;
                      const isSource = idx < levels.length - 1;
                      const canTransfer = isSource && level.energy > 0;
                      
                      return (
                        <motion.div 
                          key={level.id}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`group relative flex items-center justify-between p-6 rounded-[32px] border-4 transition-all duration-300
                            ${level.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                              level.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-rose-500/10 border-rose-500/30'}
                          `}
                        >
                           <div className="flex items-center gap-6">
                              <div className={`w-16 h-16 rounded-2xl bg-${level.color}-500 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform`}>
                                 <Icon size={32} />
                              </div>
                              <div>
                                 <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{level.name}</h4>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Energy: {Math.floor(level.energy)} J</p>
                              </div>
                           </div>

                           {isSource && (
                             <button
                               onClick={() => transferEnergy(idx)}
                               disabled={!canTransfer}
                               className={`px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all
                                 ${canTransfer ? 'bg-white text-slate-900 hover:scale-105 active:scale-95' : 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'}
                               `}
                             >
                                Transfer Energy
                             </button>
                           )}

                           {/* Heat Loss Indicator */}
                           {idx > 0 && (
                             <div className="absolute -top-4 right-12 flex items-center gap-1">
                                <Flame size={14} className="text-orange-500 animate-pulse" />
                                <span className="text-[9px] font-black text-orange-500 uppercase italic">90% Energy Loss</span>
                             </div>
                           )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center space-y-8"
                  >
                    <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center shadow-3xl animate-bounce">
                       <Trophy size={60} className="text-white" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">Chain Complete!</h2>
                       <p className="text-xl font-bold text-slate-400 italic">The apex predator has been sustained.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Solar Input</p>
                          <p className="text-2xl font-black text-white underline decoration-emerald-500 underline-offset-8">10,000 J</p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Top Energy</p>
                          <p className="text-2xl font-black text-white underline decoration-rose-500 underline-offset-8">100 J</p>
                       </div>
                    </div>

                    <Button onClick={onComplete} className="mt-8 px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                       Move to Digestion <ChevronRight size={28} className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Energy Particle Decoration */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 800, 
                    y: 600,
                    opacity: 0
                  }}
                  animate={{ 
                    y: -100,
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  className="absolute"
                >
                   <Zap size={10 + Math.random() * 20} className="text-amber-500/20" />
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
