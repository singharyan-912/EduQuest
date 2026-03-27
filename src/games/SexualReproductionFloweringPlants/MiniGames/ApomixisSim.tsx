import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight,
  Info,
  Zap,
  Layers,
  Sparkles,
  Copy
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface ApomixisSimProps {
  onComplete: () => void;
}

export function ApomixisSim({ onComplete }: ApomixisSimProps) {
  const [mode, setMode] = useState<'apomixis' | 'polyembryony' | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [embryoCount, setEmbryoCount] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const startApomixis = () => {
    setIsCloning(true);
    setTimeout(() => {
      setIsSuccess(true);
    }, 2000);
  };

  const addEmbryo = () => {
    if (embryoCount < 5) {
      setEmbryoCount(prev => prev + 1);
      if (embryoCount + 1 === 5) {
        setTimeout(() => setIsSuccess(true), 1500);
      }
    }
  };

  const resetGame = () => {
    setMode(null);
    setIsCloning(false);
    setEmbryoCount(1);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {!mode ? (
        <div className="flex flex-col items-center justify-center space-y-12 py-20">
           <motion.h2 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter text-center"
           >
              Choose Special Mode
           </motion.h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
              <Card 
                onClick={() => setMode('apomixis')}
                className="p-12 rounded-[56px] border-4 border-cyan-100 hover:border-cyan-400 cursor-pointer group transition-all duration-500 bg-white hover:shadow-2xl flex flex-col items-center text-center space-y-6"
              >
                 <div className="w-32 h-32 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                    <Copy size={64} />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-cyan-900 leading-tight">Apomixis</h3>
                 <p className="text-cyan-700/60 font-bold leading-relaxed">
                    Formation of seeds without fertilisation. A form of asexual reproduction that mimics sexual reproduction.
                 </p>
                 <div className="pt-4 flex items-center font-black text-cyan-600 uppercase tracking-widest text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Start Cloning <ArrowRight className="ml-2" size={16} />
                 </div>
              </Card>

              <Card 
                onClick={() => setMode('polyembryony')}
                className="p-12 rounded-[56px] border-4 border-orange-100 hover:border-orange-400 cursor-pointer group transition-all duration-500 bg-white hover:shadow-2xl flex flex-col items-center text-center space-y-6"
              >
                 <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <Layers size={64} />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-orange-900 leading-tight">Polyembryony</h3>
                 <p className="text-orange-700/60 font-bold leading-relaxed">
                    Occurrence of more than one embryo in a seed. Commonly seen in Citrus and Mango.
                 </p>
                 <div className="pt-4 flex items-center font-black text-orange-600 uppercase tracking-widest text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Multi-Embryo Mode <ArrowRight className="ml-2" size={16} />
                 </div>
              </Card>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[600px]">
           {/* Controls */}
           <div className="lg:col-span-4 flex flex-col space-y-6">
              <Card className={`p-8 rounded-[40px] border-4 h-full flex flex-col justify-between ${mode === 'apomixis' ? 'bg-cyan-50 border-cyan-200' : 'bg-orange-50 border-orange-200'}`}>
                 <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                       {mode === 'apomixis' ? <Copy size={24} className="text-cyan-600" /> : <Layers size={24} className="text-orange-600" />}
                       <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
                          {mode === 'apomixis' ? 'Clone Lab' : 'Embryo Multiplier'}
                       </h3>
                    </div>
                    
                    <p className="text-sm font-bold text-gray-500 leading-relaxed">
                       {mode === 'apomixis' 
                         ? 'Trigger the nucellar cells to develop directly into an embryo, bypassing the fusion mission!' 
                         : 'Stimulate multiple cells in the embryo sac or nucellus to develop into embryos simultaneously.'}
                    </p>

                    {mode === 'polyembryony' && (
                       <div className="bg-white/50 p-6 rounded-3xl border-2 border-orange-100 flex items-center justify-between">
                          <span className="font-black text-orange-900 uppercase tracking-widest text-xs">Embryos:</span>
                          <span className="text-3xl font-black text-orange-600">{embryoCount} / 5</span>
                       </div>
                    )}
                 </div>

                 <Button 
                   onClick={mode === 'apomixis' ? startApomixis : addEmbryo}
                   disabled={isCloning || (mode === 'polyembryony' && embryoCount >= 5)}
                   className={`w-full py-8 rounded-[32px] text-xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 text-white
                     ${mode === 'apomixis' ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-orange-500 hover:bg-orange-600'}
                   `}
                 >
                    {mode === 'apomixis' ? 'Trigger Apomixis' : 'Add Embryo Cell'}
                 </Button>
              </Card>

              <div className="p-6 bg-pink-50/50 rounded-[32px] border-2 border-pink-100 flex items-start space-x-3">
                 <Info className="text-pink-500 shrink-0 mt-1" size={18} />
                 <p className="text-xs font-bold text-pink-800 leading-relaxed">
                    Apomictic seeds are <b>clones</b>! Polyembryony results in multiple identical or varied embryos within one seed.
                 </p>
              </div>
           </div>

           {/* Simulator View */}
           <div className={`lg:col-span-8 rounded-[64px] border-8 shadow-2xl relative overflow-hidden flex items-center justify-center p-12 transition-all duration-500 ${mode === 'apomixis' ? 'bg-cyan-900 border-cyan-100/20' : 'bg-orange-900 border-orange-100/20'}`}>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]" />
              
              {/* Seed Container */}
              <motion.div 
                animate={isCloning ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-80 h-[450px] bg-white/5 backdrop-blur-md rounded-full border-[10px] border-white/10 relative flex items-center justify-center overflow-hidden"
              >
                 {mode === 'apomixis' ? (
                   <AnimatePresence>
                      {isCloning ? (
                        <motion.div 
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="flex flex-col items-center space-y-8"
                        >
                           <Zap size={80} className="text-cyan-400 animate-pulse" />
                           <div className="w-32 h-40 bg-cyan-400/30 rounded-full border-4 border-cyan-400 animate-bounce flex items-center justify-center">
                              <Copy size={40} className="text-cyan-200" />
                           </div>
                           <span className="font-black text-cyan-300 uppercase tracking-widest text-xs">Cloning via Nucellus...</span>
                        </motion.div>
                      ) : (
                        <div className="w-16 h-16 bg-white/10 rounded-full border-4 border-dashed border-white/30 animate-spin" />
                      )}
                   </AnimatePresence>
                 ) : (
                   <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: embryoCount }).map((_, i) => (
                        <motion.div 
                           key={i}
                           initial={{ scale: 0, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           transition={{ type: 'spring', damping: 10 }}
                           className="w-20 h-24 bg-orange-400/40 border-4 border-orange-400 rounded-full flex items-center justify-center"
                        >
                           <div className="w-4 h-4 bg-orange-200 rounded-full animate-ping" />
                        </motion.div>
                      ))}
                   </div>
                 )}

                 {/* Labels */}
                 <div className="absolute top-12 font-black text-white/20 uppercase tracking-[1em] text-xs">Seed</div>
                 <div className="absolute bottom-12 font-black text-white/20 uppercase tracking-widest text-xs">
                    {mode === 'apomixis' ? 'Asexual Loop' : 'Hyper-reproduction'}
                 </div>
              </motion.div>

              {/* Success Overlay */}
              <AnimatePresence>
                 {isSuccess && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 1.1 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className={`absolute inset-0 z-50 backdrop-blur-2xl flex flex-col items-center justify-center text-white text-center p-12
                        ${mode === 'apomixis' ? 'bg-cyan-600/95' : 'bg-orange-600/95'}
                     `}
                   >
                      <Sparkles size={100} className="mb-8 text-white animate-bounce" />
                      <h2 className="text-6xl font-black mb-4 uppercase italic tracking-tighter">
                         {mode === 'apomixis' ? 'Clone Army Initialized!' : 'Multi-Life Paradox!'}
                      </h2>
                      <p className="text-xl font-bold mb-12 max-w-md">
                         {mode === 'apomixis' 
                           ? "Genetic clones created without the need for fusion. Efficient and powerful asexual strategy." 
                           : "The seed is packed with multiple life forms, ensuring a higher survival rate for the species."}
                      </p>
                      <div className="flex space-x-4">
                         <Button onClick={resetGame} variant="outline" className="bg-white/10 border-white/20 text-white font-black px-8 py-4 rounded-2xl">
                            <RotateCcw size={20} className="mr-2" /> Change Mode
                         </Button>
                         <Button onClick={onComplete} className="bg-white text-gray-900 font-black px-12 py-4 rounded-2xl shadow-xl flex items-center text-lg">
                            Finish Biology Lab <ArrowRight size={24} className="ml-3" />
                         </Button>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      )}
    </div>
  );
}
