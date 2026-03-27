import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Waves,
  Zap,
  Activity,
  Droplet,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface BirthStage {
  id: string;
  label: string;
  description: string;
  action: string;
}

const BIRTH_STAGES: BirthStage[] = [
  { id: 'dilation', label: 'Cervical Dilation', description: 'Longest stage where cervix opens to 10cm.', action: 'Trigger Contractions' },
  { id: 'expulsion', label: 'Expulsion', description: 'Powerful contractions deliver the baby.', action: 'Guide Delivery' },
  { id: 'placental', label: 'Placental Stage', description: 'Delivery of the afterbirth (placenta).', action: 'Complete Process' }
];

interface BirthSimulatorProps {
  onComplete: () => void;
}

export function BirthSimulator({ onComplete }: BirthSimulatorProps) {
  const [mode, setMode] = useState<'parturition' | 'lactation' | null>(null);
  const [stageIdx, setStageIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contractionStrength, setContractionStrength] = useState(0);

  const stage = BIRTH_STAGES[stageIdx];
  const isLastStage = stageIdx === BIRTH_STAGES.length - 1;

  const handleNextStage = () => {
    if (isLastStage) {
      setIsSuccess(true);
    } else {
      setStageIdx(prev => prev + 1);
      setContractionStrength(0);
    }
  };

  const triggerContraction = () => {
    setContractionStrength(prev => Math.min(prev + 20, 100));
    if (contractionStrength + 20 >= 100) {
      setTimeout(handleNextStage, 1000);
    }
  };

  const resetGame = () => {
    setMode(null);
    setStageIdx(0);
    setIsSuccess(false);
    setContractionStrength(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {!mode ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-12">
           <h2 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter text-center">Post-Gestation Phase</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
              <Card 
                onClick={() => setMode('parturition')}
                className="p-12 rounded-[56px] border-4 border-cyan-100 hover:border-cyan-400 cursor-pointer group transition-all duration-500 bg-white hover:shadow-2xl flex flex-col items-center text-center space-y-6"
              >
                 <div className="w-32 h-32 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                    <Waves size={64} />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-cyan-900">Parturition</h3>
                 <p className="text-cyan-700/60 font-bold leading-relaxed">The vigorous contractions of the uterus that result in child birth.</p>
                 <div className="pt-4 flex items-center font-black text-cyan-600 uppercase tracking-widest text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Initiate Birth <ArrowRight className="ml-2" size={16} />
                 </div>
              </Card>

              <Card 
                onClick={() => setMode('lactation')}
                className="p-12 rounded-[56px] border-4 border-emerald-100 hover:border-emerald-400 cursor-pointer group transition-all duration-500 bg-white hover:shadow-2xl flex flex-col items-center text-center space-y-6"
              >
                 <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <Droplet size={64} />
                 </div>
                 <h3 className="text-3xl font-black uppercase text-emerald-900">Lactation</h3>
                 <p className="text-emerald-700/60 font-bold leading-relaxed">Production and secretion of milk for newborn nutrition.</p>
                 <div className="pt-4 flex items-center font-black text-emerald-600 uppercase tracking-widest text-xs translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    Explore Lactation <ArrowRight className="ml-2" size={16} />
                 </div>
              </Card>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[600px]">
           {/* Info / Controls */}
           <div className="lg:col-span-4 flex flex-col space-y-6">
              <Card className={`p-8 rounded-[40px] border-4 h-full flex flex-col justify-between ${mode === 'parturition' ? 'bg-cyan-50 border-cyan-200' : 'bg-emerald-50 border-emerald-200'}`}>
                 <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                       {mode === 'parturition' ? <Waves size={24} className="text-cyan-600" /> : <Droplet size={24} className="text-emerald-600" />}
                       <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">
                          {mode === 'parturition' ? 'Birth Lab' : 'Lactation Lab'}
                       </h3>
                    </div>

                    {mode === 'parturition' ? (
                       <div className="space-y-6">
                          <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{stage.description}"</p>
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-cyan-600">
                                <span>Contraction Force</span>
                                <span>{contractionStrength}%</span>
                             </div>
                             <div className="h-4 bg-cyan-100 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${contractionStrength}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                             </div>
                          </div>
                       </div>
                    ) : (
                       <div className="space-y-6">
                          <p className="text-sm font-bold text-gray-500 leading-relaxed italic">The first milk produced is called <b>Colostrum</b>, rich in antibodies (IgA).</p>
                          <div className="bg-white/50 p-6 rounded-3xl border-2 border-emerald-100 space-y-4 font-bold text-emerald-800 text-sm">
                             <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                <span>Prolactin: Milk production</span>
                             </div>
                             <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                <span>Oxytocin: Milk ejection refex</span>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 <Button 
                   onClick={mode === 'parturition' ? triggerContraction : () => setIsSuccess(true)}
                   className={`w-full py-8 rounded-[32px] text-xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 text-white
                     ${mode === 'parturition' ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                   `}
                 >
                    {mode === 'parturition' ? stage.action : 'Mission Success'} <ChevronRight className="ml-2" />
                 </Button>
              </Card>

              <div className="p-6 bg-pink-50/50 rounded-[32px] border-2 border-pink-100 flex items-start space-x-3">
                 <Info className="text-pink-600 shrink-0 mt-1" size={18} />
                 <p className="text-xs font-bold text-pink-800 leading-relaxed italic">
                    The signals for parturition originate from the fully developed fetus and the placenta. <b>Stay synchronized</b>.
                 </p>
              </div>
           </div>

           {/* Visualization View */}
           <div className={`lg:col-span-8 rounded-[64px] border-8 shadow-2xl relative overflow-hidden flex items-center justify-center p-12 transition-all duration-700
              ${mode === 'parturition' ? 'bg-cyan-900 border-cyan-100/20' : 'bg-emerald-900 border-emerald-100/20'}
           `}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
              
              <div className="relative w-full h-full flex items-center justify-center">
                 {mode === 'parturition' ? (
                    <motion.div 
                      animate={contractionStrength > 0 ? { 
                         scale: [1, 0.95, 1],
                         opacity: [0.8, 1, 0.8]
                      } : {}}
                      transition={{ duration: 0.2, repeat: contractionStrength / 20 }}
                      className="w-96 h-96 bg-white/10 rounded-full border-8 border-cyan-400/30 flex flex-col items-center justify-center space-y-8 relative"
                    >
                       <Activity size={100} className="text-cyan-400 animate-pulse" />
                       <div className="px-6 py-2 bg-cyan-400/50 rounded-full font-black text-white uppercase tracking-widest text-xs">
                          {stage.label}
                       </div>
                       
                       {/* Wave Pulse */}
                       <motion.div 
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 2, opacity: 0 }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className="absolute inset-0 border-4 border-cyan-400/40 rounded-full"
                       />
                    </motion.div>
                 ) : (
                    <div className="relative w-full flex flex-col items-center space-y-12">
                       <Droplet size={150} className="text-emerald-400 animate-[bounce_2s_infinite] drop-shadow-[0_0_50px_rgba(52,211,153,0.3)]" />
                       <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
                          <div className="p-6 bg-white/10 rounded-3xl border-2 border-emerald-400/30 text-center">
                             <Zap size={32} className="mx-auto mb-2 text-yellow-400" />
                             <span className="font-black text-white tracking-widest uppercase text-xs">IgA Antibodies</span>
                          </div>
                          <div className="p-6 bg-white/10 rounded-3xl border-2 border-emerald-400/30 text-center">
                             <Droplet size={32} className="mx-auto mb-2 text-blue-400" />
                             <span className="font-black text-white tracking-widest uppercase text-xs">Essential Nutrients</span>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              {/* Success Overlay */}
              <AnimatePresence>
                 {isSuccess && (
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-0 z-50 backdrop-blur-2xl flex flex-col items-center justify-center text-white text-center p-12
                         ${mode === 'parturition' ? 'bg-cyan-600/95' : 'bg-emerald-600/95'}
                      `}
                   >
                      <CheckCircle2 size={100} className="mb-8 animate-bounce text-white" />
                      <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Life Cycle Complete!</h2>
                      <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">
                         {mode === 'parturition' 
                           ? "Parturition has been successfully simulated. Mother and baby are healthy." 
                           : "The miracle of nutrition through lactation is fully understood. The circle of life continues."}
                      </p>
                      <div className="flex space-x-4">
                         <Button onClick={resetGame} variant="outline" className="border-white/40 text-white font-black hover:bg-white/10 rounded-2xl">
                            <RotateCcw size={20} className="mr-2" /> Alternate Phase
                         </Button>
                         <Button onClick={onComplete} className="bg-white text-gray-900 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                            Finalize Biology Module <ArrowRight size={24} className="ml-3" />
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
