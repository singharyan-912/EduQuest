import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Binary,
  Zap,
  TrendingUp,
  TrendingDown,
  Equal
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface MixtureType {
  name: string;
  liquidA: string;
  liquidB: string;
  behavior: 'IDEAL' | 'POSITIVE' | 'NEGATIVE';
  interaction: string;
  deltaV: string;
}

const MIXTURES: MixtureType[] = [
  { name: 'n-Hexane + n-Heptane', liquidA: 'Hexane', liquidB: 'Heptane', behavior: 'IDEAL', interaction: 'A-B ≈ A-A, B-B', deltaV: 'ΔV = 0' },
  { name: 'Ethanol + Acetone', liquidA: 'Ethanol', liquidB: 'Acetone', behavior: 'POSITIVE', interaction: 'A-B < A-A, B-B', deltaV: 'ΔV > 0 (Expansion)' },
  { name: 'Chloroform + Acetone', liquidA: 'Chloroform', liquidB: 'Acetone', behavior: 'NEGATIVE', interaction: 'A-B > A-A, B-B', deltaV: 'ΔV < 0 (Contraction)' }
];

interface MixingBehaviorLabProps {
  onComplete: () => void;
}

export function MixingBehaviorLab({ onComplete }: MixingBehaviorLabProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isMixed, setIsMixed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selected = selectedIdx !== null ? MIXTURES[selectedIdx] : null;

  const handleMix = () => {
    setIsMixed(true);
    if (selectedIdx !== null) {
      setTimeout(() => setIsSuccess(true), 3000);
    }
  };

  const resetLab = () => {
    setSelectedIdx(null);
    setIsMixed(false);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Selection & Analysis */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-rose-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Binary className="mr-2 text-rose-500" /> Interaction Lab
                 </h3>
                 <div className="px-4 py-2 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Binary Pairs</div>
              </div>

              {/* Mixture Selection */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">Select Components</p>
                 <div className="space-y-3">
                    {MIXTURES.map((m, idx) => (
                       <button
                         key={m.name}
                         disabled={isMixed}
                         onClick={() => setSelectedIdx(idx)}
                         className={`w-full p-4 rounded-3xl border-4 transition-all text-left flex items-center justify-between
                           ${selectedIdx === idx ? 'bg-rose-50 border-rose-400 scale-102 shadow-md' : 'bg-white border-slate-100 hover:border-rose-200'}
                           ${isMixed && selectedIdx !== idx ? 'opacity-50 grayscale' : ''}
                         `}
                       >
                          <span className="text-xs font-black text-slate-900 tracking-tighter uppercase italic">{m.name}</span>
                          {selectedIdx === idx && <CheckCircle2 size={16} className="text-rose-500" />}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Interaction Details (Hidden until mixed) */}
              <AnimatePresence>
                 {isMixed && selected && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-6 border-t-2 border-rose-50"
                    >
                       <div className="p-4 bg-slate-900 rounded-3xl space-y-2">
                          <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest italic">Molecular Forces</p>
                          <p className="text-lg font-black text-white tracking-tighter">{selected.interaction}</p>
                       </div>
                       <div className={`p-4 rounded-3xl space-y-2 border-4 text-center
                          ${selected.behavior === 'IDEAL' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                            selected.behavior === 'POSITIVE' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-purple-50 border-purple-200 text-purple-800'}
                       `}>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Delta Volume</p>
                          <p className="text-2xl font-black tracking-tighter italic">{selected.deltaV}</p>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>

              {!isMixed && (
                 <Button 
                   disabled={selectedIdx === null}
                   onClick={handleMix}
                   className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    Start Mixing <Zap size={20} className="fill-rose-400 text-rose-400" />
                 </Button>
              )}
           </Card>

           <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-[32px] flex items-start space-x-3">
              <Info className="text-rose-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-rose-800 leading-relaxed italic">
                <b>Non-ideal solutions</b> occur when A-B interactions differ from pure A-A/B-B interactions, causing non-zero ΔH and ΔV.
              </p>
           </div>
        </div>

        {/* Visual Lab View */}
        <div className="lg:col-span-8 bg-white rounded-[80px] border-8 border-rose-50 shadow-inner relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] pointer-events-none" />

           {/* Mixing Tubes */}
           <div className="relative flex items-end gap-12 h-[450px]">
              
              {/* Tube A */}
              {!isMixed ? (
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-64 border-x-4 border-b-4 border-slate-200 rounded-b-3xl relative overflow-hidden bg-slate-50/30">
                       <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} className="absolute bottom-0 inset-x-0 bg-blue-400/30" />
                       <div className="absolute inset-0 p-4 grid grid-cols-2 gap-2 opacity-40">
                          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-4 h-4 bg-blue-500 rounded-full" />)}
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Liquid A</span>
                 </div>
              ) : null}

              {/* Mixing Vessel */}
              <div className="flex flex-col items-center gap-6">
                 <div className="w-48 h-80 border-x-8 border-b-8 border-slate-100 bg-white/50 rounded-b-[48px] relative overflow-hidden shadow-inner group">
                    
                    {/* Mixing Animation */}
                    {isMixed && (
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ 
                            height: selected?.behavior === 'IDEAL' ? '50%' : 
                                     selected?.behavior === 'POSITIVE' ? '55.5%' : '44.5%'
                         }}
                         className={`absolute bottom-0 inset-x-0 transition-all duration-2000 ease-out
                           ${selected?.behavior === 'IDEAL' ? 'bg-gradient-to-t from-blue-300 to-rose-300' :
                             selected?.behavior === 'POSITIVE' ? 'bg-gradient-to-t from-orange-400 to-amber-200' : 'bg-gradient-to-t from-purple-400 to-indigo-200'}
                         `}
                         style={{ opacity: 0.4 }}
                       >
                          {/* Vortex/Particles */}
                          <div className="absolute inset-0 flex items-center justify-center">
                             {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div 
                                  key={i}
                                  animate={{ 
                                     rotate: 360,
                                     scale: [1, 1.2, 1],
                                     x: [Math.random() * 20 - 10, Math.random() * 20 - 10],
                                     y: [Math.random() * 20 - 10, Math.random() * 20 - 10]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute w-4 h-4 rounded-full blur-[1px]"
                                  style={{ 
                                     backgroundColor: i % 2 === 0 ? '#60A5FA' : '#FB7185',
                                     left: `${20 + Math.random() * 60}%`,
                                     top: `${20 + Math.random() * 60}%`
                                  }}
                                />
                             ))}
                          </div>
                          
                          {/* Level Indicators */}
                          <div className="absolute left-0 right-0 h-4 border-t-2 border-white/50 border-dashed top-0" />
                       </motion.div>
                    )}

                    {!isMixed && (
                       <div className="absolute inset-0 flex items-center justify-center text-slate-200 opacity-20">
                          <Binary size={100} />
                       </div>
                    )}
                 </div>
                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] font-mono">Reaction Chamber</span>
              </div>

              {/* Tube B */}
              {!isMixed ? (
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-64 border-x-4 border-b-4 border-slate-200 rounded-b-3xl relative overflow-hidden bg-slate-50/30">
                       <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} className="absolute bottom-0 inset-x-0 bg-rose-400/30" />
                       <div className="absolute inset-0 p-4 grid grid-cols-2 gap-2 opacity-40">
                          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-4 h-4 bg-rose-500 rounded-full" />)}
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Liquid B</span>
                 </div>
              ) : null}
           </div>

           {/* Behavior Tags */}
           <AnimatePresence>
              {isMixed && selected && (
                 <motion.div 
                   initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                   className="absolute right-12 top-12 space-y-4"
                 >
                    <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border-2 transition-all shadow-xl
                       ${selected.behavior === 'IDEAL' ? 'bg-blue-600 border-white text-white' : 
                         selected.behavior === 'POSITIVE' ? 'bg-orange-600 border-white text-white scale-110' : 'bg-purple-600 border-white text-white scale-90'}
                    `}>
                       {selected.behavior === 'IDEAL' ? <Equal size={20} /> : 
                        selected.behavior === 'POSITIVE' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                       <span className="font-black uppercase italic tracking-tighter">{selected.behavior}</span>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-rose-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Binary size={100} className="mb-8 animate-pulse text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Deviation Mastered!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">By analyzing the intermolecular forces and volume effects, you have successfully decoded the hidden behavior of this binary solution.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetLab} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Start New Pair
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-rose-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Colligative Lab <ArrowRight size={24} className="ml-3" />
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
