import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Dna,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface CellStage {
  id: string;
  label: string;
  description: string;
  ploidy: string;
  instruction: string;
}

const SPERMATOGENESIS_STAGES: CellStage[] = [
  { id: 'gonium', label: 'Spermatogonium', description: 'Diploid parent cell.', ploidy: '2n', instruction: 'Initiate Mitosis' },
  { id: 'primary', label: 'Primary Spermatocyte', description: 'Undergoes Meiosis I.', ploidy: '2n', instruction: 'Start Meiosis I' },
  { id: 'secondary', label: 'Secondary Spermatocyte', description: 'Undergoes Meiosis II.', ploidy: 'n', instruction: 'Complete Meiosis II' },
  { id: 'spermatids', label: 'Spermatids', description: 'Haploid cells.', ploidy: 'n', instruction: 'Differentiate' },
  { id: 'spermatozoa', label: 'Spermatozoa (Sperm)', description: 'Functional male gametes.', ploidy: 'n', instruction: 'Maturity Reached' }
];

const OOGENESIS_STAGES: CellStage[] = [
  { id: 'gonium', label: 'Oogonium', description: 'Diploid parent cell.', ploidy: '2n', instruction: 'Initiate Mitosis' },
  { id: 'primary', label: 'Primary Oocyte', description: 'Arrested in Prophase I.', ploidy: '2n', instruction: 'Complete Meiosis I' },
  { id: 'secondary', label: 'Secondary Oocyte', description: 'Large haploid cell + 1st Polar Body.', ploidy: 'n', instruction: 'Release Egg (Ovulation)' },
  { id: 'ovum', label: 'Ovum', description: 'Mature female gamete + 2nd Polar Body.', ploidy: 'n', instruction: 'Fertilisation Ready' }
];

interface GametogenesisSimProps {
  onComplete: () => void;
}

export function GametogenesisSim({ onComplete }: GametogenesisSimProps) {
  const [mode, setMode] = useState<'sperm' | 'egg' | null>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const stages = mode === 'sperm' ? SPERMATOGENESIS_STAGES : OOGENESIS_STAGES;
  const stage = stages[currentStageIdx];
  const isLastStage = currentStageIdx === stages.length - 1;

  const nextStage = () => {
    if (isLastStage) {
      setIsSuccess(true);
    } else {
      setCurrentStageIdx(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setMode(null);
    setCurrentStageIdx(0);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {!mode ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-12">
           <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter text-center">Select Cell Lineage</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
              <Card 
                onClick={() => setMode('sperm')}
                className="p-12 rounded-[56px] border-4 border-blue-100 hover:border-blue-400 cursor-pointer group transition-all duration-500 bg-white hover:shadow-2xl flex flex-col items-center text-center space-y-6"
              >
                 <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Activity size={64} />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-blue-900">Spermatogenesis</h3>
                 <p className="text-blue-700/60 font-bold leading-relaxed">Continuous production of millions of sperm from puberty onwards.</p>
                 <div className="pt-4 flex items-center font-black text-blue-600 uppercase tracking-widest text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Initiate Factory <ArrowRight className="ml-2" size={16} />
                 </div>
              </Card>

              <Card 
                onClick={() => setMode('egg')}
                className="p-12 rounded-[56px] border-4 border-pink-100 hover:border-pink-400 cursor-pointer group transition-all duration-500 bg-white hover:shadow-2xl flex flex-col items-center text-center space-y-6"
              >
                 <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                    <Sparkles size={64} />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-pink-900">Oogenesis</h3>
                 <p className="text-pink-700/60 font-bold leading-relaxed">Discontinuous process starting before birth, resulting in one functional egg.</p>
                 <div className="pt-4 flex items-center font-black text-pink-600 uppercase tracking-widest text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Initiate Factory <ArrowRight className="ml-2" size={16} />
                 </div>
              </Card>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[600px]">
           {/* Controls */}
           <div className="lg:col-span-4 flex flex-col space-y-6">
              <Card className={`p-8 rounded-[40px] border-4 h-full flex flex-col justify-between ${mode === 'sperm' ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200'}`}>
                 <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                       <Layers size={24} className={mode === 'sperm' ? 'text-blue-600' : 'text-pink-600'} />
                       <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Meiosis Tracker</h3>
                    </div>
                    
                    <div className="space-y-4">
                       {stages.map((s, idx) => (
                          <div key={s.id} className="flex items-center space-x-3">
                             <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-xs transition-all
                                ${idx === currentStageIdx ? 'bg-white border-blue-400 text-blue-600 scale-110 shadow-lg' : 
                                  idx < currentStageIdx ? 'bg-green-500 border-white text-white' : 'bg-gray-100 border-gray-200 text-gray-300'}
                             `}>
                                {idx < currentStageIdx ? <CheckCircle2 size={20} /> : idx + 1}
                             </div>
                             <span className={`text-xs font-black uppercase tracking-widest ${idx === currentStageIdx ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s.label}
                             </span>
                          </div>
                       ))}
                    </div>

                    <div className="pt-6 border-t-2 border-gray-100 space-y-3">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Stage Goal</p>
                       <p className="text-lg font-bold text-gray-700 leading-tight">"{stage.description}"</p>
                       <div className="bg-white/50 px-4 py-2 rounded-2xl border-2 border-blue-100 inline-block font-black text-blue-600">
                          Ploidy: {stage.ploidy}
                       </div>
                    </div>
                 </div>

                 <Button 
                   onClick={nextStage}
                   disabled={isSuccess}
                   className={`w-full py-8 rounded-[32px] text-xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 text-white
                     ${mode === 'sperm' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'}
                   `}
                 >
                    {isLastStage ? 'Finish Differentiation' : stage.instruction} <ChevronRight className="ml-2" />
                 </Button>
              </Card>

              <div className="p-6 bg-yellow-50/50 rounded-[32px] border-2 border-yellow-100 flex items-start space-x-3">
                 <Info className="text-yellow-600 shrink-0 mt-1" size={18} />
                 <p className="text-xs font-bold text-yellow-800 leading-relaxed italic">
                    Gametogenesis ensures the maintenance of species chromosome number (n) through reduction division.
                 </p>
              </div>
           </div>

           {/* Simulator View */}
           <div className={`lg:col-span-8 rounded-[64px] border-8 shadow-2xl relative overflow-hidden flex items-center justify-center p-12 transition-all duration-700
              ${mode === 'sperm' ? 'bg-blue-900 border-blue-100/20' : 'bg-pink-900 border-pink-100/20'}
           `}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
              
              {/* Cell Arena */}
              <div className="relative w-full h-full flex items-center justify-center">
                 
                 {/* Visual Cell Representation */}
                 <motion.div 
                    animate={{ 
                       scale: [1, 1.02, 1],
                       borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 70%", "60% 40% 30% 70% / 50% 50% 50% 50%", "40% 60% 70% 30% / 40% 50% 60% 70%"] 
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    className={`relative w-80 h-80 bg-white/10 backdrop-blur-md border-8 border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] flex items-center justify-center
                      ${currentStageIdx >= 2 ? 'border-dashed' : ''}
                    `}
                 >
                    {/* Nucleus & DNA */}
                    <AnimatePresence mode="wait">
                       <motion.div 
                          key={currentStageIdx}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.5, opacity: 0 }}
                          className="flex flex-col items-center justify-center space-y-4"
                       >
                          <Dna size={80} className={`text-white transition-all duration-1000 ${currentStageIdx >= 2 ? 'opacity-50 blur-[1px]' : 'opacity-100'}`} />
                          <div className="bg-white/20 px-6 py-2 rounded-full font-black text-white text-3xl">
                             {stage.ploidy}
                          </div>
                       </motion.div>
                    </AnimatePresence>

                    {/* Polar Body Animation for Oogenesis */}
                    {mode === 'egg' && currentStageIdx >= 2 && (
                       <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute -top-12 -right-12 w-16 h-16 bg-pink-400 rounded-full border-4 border-white/30 flex items-center justify-center italic font-black text-white text-[10px] text-center px-2"
                       >
                          1st Polar Body
                       </motion.div>
                    )}

                    {/* Division Particles */}
                    <AnimatePresence>
                       {currentStageIdx > 0 && Array.from({ length: 4 }).map((_, i) => (
                          <motion.div 
                             key={i}
                             initial={{ x: 0, y: 0 }}
                             animate={{ x: (i % 2 === 0 ? 1 : -1) * 150, y: (i < 2 ? 1 : -1) * 150 }}
                             className="absolute w-12 h-12 bg-white/20 rounded-full blur-xl"
                          />
                       ))}
                    </AnimatePresence>
                 </motion.div>

                 {/* Labels */}
                 <div className="absolute top-12 font-black text-white/20 uppercase tracking-[1em] text-xs">Cell Factory</div>
                 <div className="absolute bottom-12 font-black text-white/20 uppercase tracking-widest text-xs italic">Stage: {stage.label}</div>
              </div>

              {/* Success Overlay */}
              <AnimatePresence>
                 {isSuccess && (
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-0 z-50 backdrop-blur-2xl flex flex-col items-center justify-center text-white text-center p-12
                         ${mode === 'sperm' ? 'bg-blue-600/95' : 'bg-pink-600/95'}
                      `}
                   >
                      <Zap size={100} className="mb-8 animate-pulse text-yellow-300" />
                      <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Gametogenesis Complete!</h2>
                      <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl">
                         {mode === 'sperm' 
                           ? 'Successful production of four haploid spermatozoa. The male factory is operational.' 
                           : 'Highly efficient production of one large haploid ovum and polar bodies. Ready for fertilization.'}
                      </p>
                      <div className="flex space-x-4">
                         <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                            <RotateCcw size={20} className="mr-2" /> Change Lineage
                         </Button>
                         <Button onClick={onComplete} className="bg-white text-gray-900 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                            Finish Lab Module <ArrowRight size={24} className="ml-3" />
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
