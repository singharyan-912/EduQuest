import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Wind, 
  Bug, 
  Target,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface PollenJourneyProps {
  onComplete: () => void;
}

export function PollenJourney({ onComplete }: PollenJourneyProps) {
  const [isCapturingAgent, setIsCapturingAgent] = useState(false);
  const [agentType, setAgentType] = useState<'wind' | 'insect' | null>(null);
  const [phase, setPhase] = useState<'stigma' | 'style' | 'ovule'>('stigma');
  const [tubeLength, setTubeLength] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle movement through the style
  useEffect(() => {
    if (phase === 'style') {
      const interval = setInterval(() => {
        setTubeLength(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPhase('ovule');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleAgentSelect = (type: 'wind' | 'insect') => {
    setAgentType(type);
    setIsCapturingAgent(true);
    setTimeout(() => {
      setPhase('style');
    }, 1500);
  };

  const handleOvuleEntry = () => {
    setIsSuccess(true);
  };

  const resetGame = () => {
    setPhase('stigma');
    setTubeLength(0);
    setAgentType(null);
    setIsCapturingAgent(false);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-4">
           <Card className="p-6 bg-yellow-50 border-4 border-yellow-200 rounded-[32px] shadow-lg">
              <h3 className="text-lg font-black text-yellow-800 uppercase mb-4 flex items-center">
                 <Target className="mr-2" size={20} /> Current Phase
              </h3>
              <div className="space-y-3">
                 {['stigma', 'style', 'ovule'].map((p) => (
                    <div key={p} className={`flex items-center space-x-3 p-3 rounded-2xl transition-all ${phase === p ? 'bg-yellow-400 text-white shadow-md scale-105' : 'bg-white/50 text-yellow-800/40'}`}>
                       <div className={`w-3 h-3 rounded-full ${phase === p ? 'bg-white' : 'bg-yellow-200'}`} />
                       <span className="font-black text-xs uppercase tracking-widest">{p}</span>
                    </div>
                 ))}
              </div>
           </Card>

           <div className="p-6 bg-blue-50/50 rounded-3xl border-2 border-blue-100 flex items-start space-x-3">
              <Info className="text-blue-500 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-blue-800 leading-relaxed">
                Choose a pollination agent to land on the <b>stigma</b>, then watch the <b>pollen tube</b> grow through the <b>style</b>!
              </p>
           </div>
        </div>

        {/* Animation Arena */}
        <div className="lg:col-span-3 aspect-[4/5] bg-white rounded-[48px] border-8 border-gray-100 shadow-2xl relative overflow-hidden flex flex-col pt-12">
            
            {/* Pollination Agents Overlay (Initial Phase) */}
            <AnimatePresence>
              {phase === 'stigma' && !isCapturingAgent && (
                <motion.div 
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center"
                >
                   <h3 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tighter italic">Select Pollination Agent</h3>
                   <div className="flex space-x-8">
                      <Button 
                        onClick={() => handleAgentSelect('wind')}
                        className="flex flex-col items-center p-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-[32px] transition-all hover:scale-110"
                      >
                         <Wind size={48} className="mb-4" />
                         <span className="font-black uppercase tracking-widest text-xs">Anemophily (Wind)</span>
                      </Button>
                      <Button 
                        onClick={() => handleAgentSelect('insect')}
                        className="flex flex-col items-center p-8 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-[32px] transition-all hover:scale-110"
                      >
                         <Bug size={48} className="mb-4" />
                         <span className="font-black uppercase tracking-widest text-xs">Entomophily (Insect)</span>
                      </Button>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Path View */}
            <div className="flex-1 relative flex flex-col items-center pr-24">
               {/* Stigma (Top) */}
               <div className="w-48 h-12 bg-orange-100 rounded-full border-4 border-orange-200 relative z-20 flex items-center justify-center">
                  <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Stigma</span>
                  
                  {/* Pollen Grain Animation */}
                  {isCapturingAgent && (
                    <motion.div 
                      layoutId="pollen"
                      initial={{ y: -100, x: agentType === 'wind' ? -100 : 0 }}
                      animate={{ y: 0, x: 0 }}
                      className="absolute w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg flex items-center justify-center"
                    >
                       <div className="w-1 h-1 bg-yellow-600 rounded-full animate-ping" />
                    </motion.div>
                  )}
               </div>

               {/* Style (Middle Tube) */}
               <div className="w-16 flex-1 bg-orange-50/50 border-x-4 border-orange-100 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,orange_1px,transparent_1px)] bg-[length:10px_10px]" />
                  
                  {/* Growing Pollen Tube */}
                  {phase !== 'stigma' && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${tubeLength}%` }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-4 bg-yellow-300 border-x-2 border-yellow-400 shadow-inner rounded-b-full flex items-end justify-center"
                    >
                       <div className="w-6 h-6 bg-yellow-400 rounded-full shrink-0 -mb-3 shadow-md" />
                    </motion.div>
                  )}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-orange-200 uppercase -rotate-90">Long Style</span>
               </div>

               {/* Ovary (Bottom) */}
               <div className="w-64 h-64 bg-green-50 rounded-full border-8 border-green-100 relative -mt-12 z-10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-green-100 to-transparent" />
                  
                  {/* Ovule / Egg Apparatus */}
                  <motion.div 
                    animate={phase === 'ovule' ? { scale: 1.1 } : { scale: 1 }}
                    className="w-32 h-40 bg-white rounded-full border-4 border-green-200 shadow-xl relative z-20 flex items-center justify-center cursor-pointer hover:border-green-400 transition-colors"
                    onClick={() => phase === 'ovule' && handleOvuleEntry()}
                  >
                     <div className="space-y-4 flex flex-col items-center">
                        <div className="flex space-x-2">
                           <div className="w-4 h-4 bg-purple-200 rounded-full" />
                           <div className="w-4 h-4 bg-purple-200 rounded-full" />
                        </div>
                        <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-green-600" />
                        <span className="text-[10px] font-black text-green-600 uppercase">Wait for Pollen</span>
                     </div>

                     {/* Highlight trigger when ready */}
                     {phase === 'ovule' && !isSuccess && (
                       <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-ping pointer-events-none" />
                     )}
                  </motion.div>
                  <span className="absolute bottom-6 text-[10px] font-black text-green-400 uppercase tracking-widest">Ovary</span>
               </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
               {isSuccess && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute inset-0 z-50 bg-green-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-12"
                 >
                    <CheckCircle2 size={100} className="mb-8 text-white animate-bounce" />
                    <h2 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">Target Reached!</h2>
                    <p className="text-xl font-bold mb-12 max-w-md">The pollen tube has successfully navigated the style and entered the ovule through the micropyle.</p>
                    <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="bg-white text-green-600 font-black px-8 py-4 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Restart
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-green-700 font-black px-12 py-4 rounded-2xl shadow-xl flex items-center text-lg">
                         Proceed to Fertilisation <ArrowRight size={24} className="ml-3" />
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
