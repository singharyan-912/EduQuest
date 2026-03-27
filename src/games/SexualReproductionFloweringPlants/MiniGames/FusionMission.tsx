import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface FusionMissionProps {
  onComplete: () => void;
}

export function FusionMission({ onComplete }: FusionMissionProps) {
  const [maleGametes, setMaleGametes] = useState([
    { id: 'mg1', paired: false, target: null as string | null },
    { id: 'mg2', paired: false, target: null as string | null }
  ]);
  const [activeGameteId, setActiveGameteId] = useState<string | null>(null);
  const [fusions, setFusions] = useState<{egg: boolean, polar: boolean}>({ egg: false, polar: false });
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePairing = (target: 'egg' | 'polar') => {
    if (!activeGameteId) return;
    
    // Syngamy (Egg) or Triple Fusion (Polar Nuclei)
    if (target === 'egg' && !fusions.egg) {
      setFusions(prev => ({ ...prev, egg: true }));
      setMaleGametes(prev => prev.map(mg => mg.id === activeGameteId ? { ...mg, paired: true, target: 'egg' } : mg));
    } else if (target === 'polar' && !fusions.polar) {
      setFusions(prev => ({ ...prev, polar: true }));
      setMaleGametes(prev => prev.map(mg => mg.id === activeGameteId ? { ...mg, paired: true, target: 'polar' } : mg));
    }
    
    setActiveGameteId(null);
  };

  useEffect(() => {
    if (fusions.egg && fusions.polar) {
      setTimeout(() => setIsSuccess(true), 1500);
    }
  }, [fusions]);

  const resetGame = () => {
    setMaleGametes([
      { id: 'mg1', paired: false, target: null },
      { id: 'mg2', paired: false, target: null }
    ]);
    setFusions({ egg: false, polar: false });
    setIsSuccess(false);
    setActiveGameteId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[600px]">
        
        {/* Missions / Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <Card className="p-6 bg-purple-50 border-4 border-purple-200 rounded-[32px] shadow-lg">
              <h3 className="text-lg font-black text-purple-800 uppercase mb-4 flex items-center">
                 <Zap className="mr-2" size={20} /> Fusion Targets
              </h3>
              <div className="space-y-4">
                 <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${fusions.egg ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-purple-100 opacity-50'}`}>
                    <span className="font-black text-xs uppercase italic">Syngamy (Egg)</span>
                    {fusions.egg && <CheckCircle2 size={16} />}
                 </div>
                 <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${fusions.polar ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-purple-100 opacity-50'}`}>
                    <span className="font-black text-xs uppercase italic">Triple Fusion</span>
                    {fusions.polar && <CheckCircle2 size={16} />}
                 </div>
              </div>
           </Card>

           <div className="bg-white p-6 rounded-[32px] border-4 border-gray-100 shadow-xl">
             <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Male Gametes (n)</h3>
             <div className="flex space-x-4">
                {maleGametes.map(mg => (
                  <motion.button
                    key={mg.id}
                    onClick={() => !mg.paired && setActiveGameteId(mg.id)}
                    whileHover={!mg.paired ? { scale: 1.1 } : {}}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all
                      ${mg.paired ? 'bg-gray-100 border-gray-200 opacity-30 cursor-not-allowed' : 
                        activeGameteId === mg.id ? 'bg-pink-500 border-pink-300 shadow-xl scale-110' : 'bg-white border-pink-100 hover:border-pink-300 shadow-md'}
                    `}
                  >
                     <div className={`w-4 h-4 rounded-full ${mg.paired ? 'bg-gray-400' : 'bg-pink-400 animate-pulse'}`} />
                  </motion.button>
                ))}
             </div>
           </div>

           <Card className="p-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl">
              <div className="flex items-start space-x-2">
                 <Info className="text-blue-500 shrink-0 mt-1" size={16} />
                 <p className="text-[10px] font-bold text-blue-800 leading-normal">
                   Select a <b>Male Gamete</b> (pink) and then click a target inside the <b>Embryo Sac</b> to perform Double Fertilisation!
                 </p>
              </div>
           </Card>
        </div>

        {/* Ovule Microscope View */}
        <div className="lg:col-span-3 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 rounded-[64px] border-8 border-indigo-100/20 shadow-2xl relative overflow-hidden flex items-center justify-center">
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

            {/* Embryo Sac Container */}
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative w-[350px] h-[500px] bg-white/5 backdrop-blur-sm rounded-full border-[10px] border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col items-center justify-between py-12 px-8"
            >
               {/* 1. Antipodal Cells (Top) */}
               <div className="flex space-x-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-indigo-400/20 border-2 border-indigo-300/30 flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-indigo-300/50" />
                    </div>
                  ))}
               </div>
               <span className="text-[10px] font-black text-indigo-300/30 uppercase tracking-widest -mt-4">Antipodals</span>

               {/* 2. Central Cell with 2 Polar Nuclei (Center) */}
               <motion.div 
                 onClick={() => activeGameteId && handlePairing('polar')}
                 whileHover={activeGameteId ? { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' } : {}}
                 className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer relative
                    ${fusions.polar ? 'bg-yellow-400/20 border-yellow-400/50' : 'bg-white/5 border-white/10 hover:border-purple-300'}
                 `}
               >
                  <div className="flex space-x-3">
                     <div className={`w-4 h-4 rounded-full ${fusions.polar ? 'bg-yellow-300' : 'bg-white/40'}`} />
                     <div className={`w-4 h-4 rounded-full ${fusions.polar ? 'bg-yellow-300' : 'bg-white/40'}`} />
                  </div>
                  <span className="text-center px-4 leading-tight text-[10px] font-black uppercase text-white/40">
                     {fusions.polar ? 'Triple Fusion Success!' : '2 Polar Nuclei'}
                  </span>
                  
                  {activeGameteId && !fusions.polar && (
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-ping opacity-50" />
                  )}
                  
                  {/* Result: PEN */}
                  <AnimatePresence>
                     {fusions.polar && (
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute -top-8 bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-[10px] font-black uppercase"
                        >
                           Result: 3n PEN
                        </motion.div>
                     )}
                  </AnimatePresence>
               </motion.div>

               {/* 3. Egg Apparatus (Bottom) */}
               <div className="w-full flex flex-col items-center">
                  <span className="text-[10px] font-black text-emerald-300/30 uppercase tracking-widest mb-4 italic">Egg Apparatus</span>
                  <div className="flex items-center justify-center -space-x-4">
                     {/* Synergid Left */}
                     <div className="w-16 h-20 rounded-full bg-emerald-400/10 border-2 border-emerald-300/20" />
                     
                     {/* Egg Cell - MAIN TARGET */}
                     <motion.div 
                        onClick={() => activeGameteId && handlePairing('egg')}
                        whileHover={activeGameteId ? { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' } : {}}
                        className={`w-24 h-28 rounded-full border-8 z-10 flex flex-col items-center justify-center transition-all cursor-pointer relative
                           ${fusions.egg ? 'bg-green-400/30 border-green-400/80 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : 'bg-white/10 border-white/20 hover:border-emerald-300'}
                        `}
                     >
                        <div className={`w-6 h-6 rounded-full ${fusions.egg ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`} />
                        <span className="text-[10px] font-black text-white/60 uppercase mt-4">Egg Cell (n)</span>
                        
                        {activeGameteId && !fusions.egg && (
                          <div className="absolute inset-0 border-4 border-emerald-400 rounded-full animate-ping" />
                        )}

                        <AnimatePresence>
                           {fusions.egg && (
                              <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -bottom-8 bg-green-400 text-indigo-900 px-3 py-1 rounded-full text-[10px] font-black uppercase"
                              >
                                 Result: 2n Zygote
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </motion.div>

                     {/* Synergid Right */}
                     <div className="w-16 h-20 rounded-full bg-emerald-400/10 border-2 border-emerald-300/20" />
                  </div>
               </div>
            </motion.div>

            {/* Success Animation Overlay */}
            <AnimatePresence>
               {isSuccess && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="absolute inset-0 z-50 bg-indigo-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-white text-center p-12"
                 >
                    <div className="relative mb-12">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                         className="absolute -inset-8 border-4 border-dashed border-pink-400/30 rounded-full"
                       />
                       <Sparkles size={120} className="text-yellow-400 animate-pulse drop-shadow-[0_0_50px_rgba(250,204,21,0.5)]" />
                    </div>
                    <h2 className="text-6xl font-black mb-6 uppercase italic tracking-tighter">Double Fertilisation Complete!</h2>
                    <div className="grid grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
                       <div className="bg-white/5 p-6 rounded-[32px] border-2 border-green-500/30">
                          <p className="text-green-400 font-black text-2xl mb-2">SYNGAMY</p>
                          <p className="text-xs font-bold text-gray-400">Egg + Male Gametes = Zygote (2n)</p>
                       </div>
                       <div className="bg-white/5 p-6 rounded-[32px] border-2 border-yellow-500/30">
                          <p className="text-yellow-400 font-black text-2xl mb-2">TRIPLE FUSION</p>
                          <p className="text-xs font-bold text-gray-400">Polar Nuclei + Male Gametes = PEN (3n)</p>
                       </div>
                    </div>
                    <div className="flex space-x-6">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/10">
                         <RotateCcw size={20} className="mr-2" /> Reset Lab
                      </Button>
                      <Button onClick={onComplete} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black px-12 py-5 rounded-3xl shadow-[0_20px_40px_-10px_rgba(244,63,94,0.5)] flex items-center text-xl hover:scale-105 transition-transform">
                         Advanced Growth Phase <ArrowRight size={24} className="ml-3" />
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
