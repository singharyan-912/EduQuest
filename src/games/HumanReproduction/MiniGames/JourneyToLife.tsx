import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface JourneyPhase {
  id: 'fertilisation' | 'cleavage' | 'implantation';
  label: string;
  description: string;
}

const PHASES: JourneyPhase[] = [
  { id: 'fertilisation', label: 'Fertilisation', description: 'Fusion of sperm and egg in the ampullary-isthmic junction.' },
  { id: 'cleavage', label: 'Cleavage', description: 'Rapid mitotic divisions as the zygote moves toward the uterus.' },
  { id: 'implantation', label: 'Implantation', description: 'The blastocyst embeds into the thickened endometrium.' }
];

interface JourneyToLifeProps {
  onComplete: () => void;
}

export function JourneyToLife({ onComplete }: JourneyToLifeProps) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const phase = PHASES[phaseIdx];
  const isLastPhase = phaseIdx === PHASES.length - 1;

  const nextPhase = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (isLastPhase) {
        setIsSuccess(true);
      } else {
        setPhaseIdx(prev => prev + 1);
      }
    }, 2000);
  };

  const resetGame = () => {
    setPhaseIdx(0);
    setIsAnimating(false);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Progress & Info */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-yellow-50 bg-white shadow-xl space-y-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="flex items-center space-x-3">
                    <Sparkles className="text-yellow-500" size={24} />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Life Journey</h3>
                 </div>
                 
                 <div className="space-y-2">
                    {PHASES.map((p, idx) => (
                       <div key={p.id} className={`flex items-center space-x-3 transition-all ${idx === phaseIdx ? 'opacity-100 scale-105' : 'opacity-30'}`}>
                          <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-xs
                             ${idx < phaseIdx ? 'bg-green-500 border-white text-white' : 'bg-white border-yellow-400 text-yellow-600'}
                          `}>
                             {idx < phaseIdx ? <CheckCircle2 size={18} /> : idx + 1}
                          </div>
                          <span className="font-black text-xs uppercase tracking-widest">{p.label}</span>
                       </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t-2 border-yellow-50 space-y-4">
                    <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{phase.description}"</p>
                 </div>
              </div>

              <Button 
                onClick={nextPhase}
                disabled={isAnimating || isSuccess}
                className="w-full py-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-[32px] font-black text-xl shadow-xl transition-all hover:scale-105 group disabled:opacity-50"
              >
                 {isAnimating ? 'Simulating...' : isLastPhase ? 'Finalize Attachment' : 'Progress Stage'} <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
           </Card>

           <div className="p-6 bg-amber-50/50 rounded-[32px] border-2 border-amber-100 flex items-start space-x-3">
              <Info className="text-amber-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-amber-800 leading-relaxed italic">
                 Successful fertilization requires the arrival of both sperm and ovum at the same time in the ampullary region.
              </p>
           </div>
        </div>

        {/* Journey Arena */}
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-950 via-purple-950 to-amber-950 rounded-[80px] border-8 border-white shadow-2xl relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]" />
           
           {/* Dynamic Stage Rendering */}
           <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                 {phase.id === 'fertilisation' && (
                    <motion.div 
                      key="fert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ scale: 2, opacity: 0 }}
                      className="relative w-96 h-96 flex items-center justify-center"
                    >
                       {/* Ovum */}
                       <div className="relative w-64 h-64 bg-yellow-200/20 rounded-full border-8 border-yellow-400/50 shadow-[0_0_100px_rgba(250,204,21,0.3)] flex items-center justify-center">
                          <div className="w-12 h-12 bg-yellow-400 rounded-full animate-pulse" />
                          <div className="absolute inset-0 border-[20px] border-white/10 rounded-full blur-md" />
                          <span className="absolute -top-8 font-black text-yellow-500 text-xs uppercase tracking-widest">Ovum (n)</span>
                       </div>

                       {/* Sperm Attack */}
                       {Array.from({ length: 15 }).map((_, i) => (
                          <motion.div 
                             key={i}
                             initial={{ x: 300 * Math.cos(i), y: 300 * Math.sin(i), rotate: i * 30 }}
                             animate={isAnimating && i === 0 ? { x: 0, y: 0 } : { x: 100 * Math.cos(i), y: 100 * Math.sin(i) }}
                             transition={{ duration: 2 }}
                             className={`absolute w-12 h-4 rounded-full flex items-center ${i === 0 ? 'scale-150 z-10' : 'opacity-40 animate-pulse'}`}
                          >
                             <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                             <div className="w-8 h-1 bg-white/50 rounded-full origin-left -ml-1 border-y border-white/20" />
                          </motion.div>
                       ))}
                    </motion.div>
                 )}

                 {phase.id === 'cleavage' && (
                    <motion.div 
                       key="cleave" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
                       className="relative w-96 h-96 flex items-center justify-center"
                    >
                       <div className="grid grid-cols-2 gap-2 p-4 bg-white/5 rounded-full border-4 border-white/10 shadow-2xl">
                          {Array.from({ length: isAnimating ? 8 : 4 }).map((_, i) => (
                             <motion.div 
                                key={i}
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-16 h-16 bg-white/20 rounded-full border-2 border-white/40 flex items-center justify-center"
                             >
                                <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                             </motion.div>
                          ))}
                       </div>
                       <span className="absolute -bottom-12 font-black text-white/50 text-xs uppercase tracking-widest">Morula stage (8-16 cells)</span>
                    </motion.div>
                 )}

                 {phase.id === 'implantation' && (
                    <motion.div 
                       key="implant" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                       className="relative w-full h-full flex items-center justify-between px-12"
                    >
                       {/* Blastocyst */}
                       <motion.div 
                          animate={isAnimating ? { x: 350 } : {}}
                          transition={{ duration: 2 }}
                          className="w-32 h-32 bg-white/10 rounded-full border-8 border-yellow-400 flex flex-col items-center justify-center p-2 relative shadow-[0_0_50px_rgba(250,204,21,0.2)]"
                       >
                          <div className="grid grid-cols-3 gap-1">
                             {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-white/20 rounded-full" />
                             ))}
                          </div>
                          <span className="text-[8px] font-black text-white mt-2">BLASTOCYST</span>
                       </motion.div>

                       {/* Thick Endometrium */}
                       <div className="w-40 h-full bg-red-800/40 rounded-l-[100px] border-l-[30px] border-red-600/30 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 flex flex-col justify-around rotate-12 opacity-30">
                             {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="w-full h-1 bg-red-400" />
                             ))}
                          </div>
                          <motion.span 
                             animate={isAnimating ? { opacity: 1, scale: 1.2 } : { opacity: 0.3 }}
                             className="text-white font-black text-sm uppercase vertical-rl tracking-[0.5em] rotate-90"
                          >
                             ENDOMETRIUM
                          </motion.span>
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Feedback */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                   className="absolute inset-0 bg-yellow-600/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Zap size={100} className="mb-8 animate-pulse text-white" />
                   <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Journey to Life Success!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">The cell has successfully navigated the fallopian tube and embedded into the uterine wall. Pregnancy has officially begun.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/40 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Re-Journey
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-yellow-700 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Growth Phase <ArrowRight size={24} className="ml-3" />
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
