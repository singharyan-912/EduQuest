import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight,
  Info,
  Activity,
  Zap,
  Droplet,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface CyclePhase {
  name: string;
  days: string;
  description: string;
  hormones: string;
  liningState: 'thin' | 'growing' | 'thick' | 'shedding';
}

const PHASES: CyclePhase[] = [
  { name: 'Menstrual Phase', days: '1-5', description: 'Uterine lining sheds.', hormones: 'Low Estrogen/Progesterone', liningState: 'shedding' },
  { name: 'Follicular Phase', days: '6-13', description: 'Follicle matures, lining regenerates.', hormones: 'Rising Estrogen', liningState: 'growing' },
  { name: 'Ovulatory Phase', days: '14', description: 'Egg released from ovary.', hormones: 'LH Surge', liningState: 'thick' },
  { name: 'Luteal Phase', days: '15-28', description: 'Lining thickens for potential pregnancy.', hormones: 'High Progesterone', liningState: 'thick' }
];

interface CycleManagerProps {
  onComplete: () => void;
}

export function CycleManager({ onComplete }: CycleManagerProps) {
  const [day, setDay] = useState(1);
  const [estrogen, setEstrogen] = useState(20);
  const [progesterone, setProgesterone] = useState(10);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync day with phase
  const getPhase = (currentDay: number): CyclePhase => {
    if (currentDay <= 5) return PHASES[0];
    if (currentDay <= 13) return PHASES[1];
    if (currentDay === 14) return PHASES[2];
    return PHASES[3];
  };

  const phase = getPhase(day);

  useEffect(() => {
    if (day === 28) {
      setTimeout(() => setIsSuccess(true), 1500);
    }
  }, [day]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Controls & Meters */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-red-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Activity className="mr-2 text-red-500" /> Hormone Lab
                 </h3>
                 <div className="px-4 py-2 bg-red-600 text-white rounded-2xl font-black text-xs">DAY {day}</div>
              </div>

              {/* Sliders */}
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-400">
                       <span>Estrogen</span>
                       <span className="text-gray-900">{estrogen}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={estrogen}
                      onChange={(e) => setEstrogen(Number(e.target.value))}
                      className="w-full h-4 bg-red-100 rounded-full appearance-none cursor-pointer accent-red-500"
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-orange-400">
                       <span>Progesterone</span>
                       <span className="text-gray-900">{progesterone}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={progesterone}
                      onChange={(e) => setProgesterone(Number(e.target.value))}
                      className="w-full h-4 bg-orange-100 rounded-full appearance-none cursor-pointer accent-orange-500"
                    />
                 </div>
              </div>

              {/* Phase Info */}
              <div className="pt-8 border-t-2 border-red-50 space-y-4">
                 <div className="flex items-center space-x-2">
                    <Droplet className="text-red-500" size={20} />
                    <span className="text-lg font-black text-red-700 uppercase italic tracking-tight">{phase.name}</span>
                 </div>
                 <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{phase.description}"</p>
                 <div className="bg-red-50 p-4 rounded-2xl font-black text-red-600 text-[10px] uppercase tracking-widest">
                    Hormones: {phase.hormones}
                 </div>
              </div>

              <Button 
                onClick={() => setDay(prev => Math.min(prev + 1, 28))}
                className="w-full py-8 bg-red-600 hover:bg-red-700 text-white rounded-[32px] font-black text-xl shadow-xl transition-all hover:scale-105 group"
              >
                 Advance Day <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
           </Card>

           <div className="p-6 bg-orange-50/50 rounded-[32px] border-2 border-orange-100 flex items-start space-x-3">
              <Info className="text-orange-500 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-orange-800 leading-relaxed italic">
                 The menstrual cycle is a rhythmic preparation of the uterus for potential implantation. Master the hormone levels to sustain the lining.
              </p>
           </div>
        </div>

        {/* Visual Uterus & Lining Simulator */}
        <div className="lg:col-span-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-[80px] border-8 border-white shadow-inner relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           {/* Microscope Frame */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none z-10" />

           {/* Uterus Representation */}
           <motion.div 
             animate={{ scale: 1 + (progesterone / 500) }}
             className="relative w-[400px] h-[500px] bg-red-100/50 rounded-[50%_50%_40%_40%] border-4 border-red-200 overflow-hidden shadow-2xl flex items-center justify-center"
           >
              {/* Uterine Lining (Endometrium) */}
              <motion.div 
                 animate={{ 
                    height: phase.liningState === 'shedding' ? '20%' : 20 + (day * 2) + '%',
                    backgroundColor: phase.liningState === 'shedding' ? '#ef4444' : '#fecaca',
                    opacity: phase.liningState === 'shedding' ? 0.8 : 1
                 }}
                 className="absolute bottom-0 inset-x-0 w-full rounded-t-[100px] transition-colors duration-1000"
              >
                 {/* Blood Flow Animation for Menstrual Phase */}
                 {phase.liningState === 'shedding' && (
                    <div className="absolute inset-0 overflow-hidden">
                       {Array.from({ length: 10 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 500, opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            className="absolute w-2 h-8 bg-red-600 rounded-full blur-[2px]"
                            style={{ left: `${i * 10}%` }}
                          />
                       ))}
                    </div>
                 )}

                 {/* Nutrients / Blood Vessels for Luteal Phase */}
                 {day >= 15 && (
                    <div className="absolute inset-0 flex flex-wrap justify-around p-8 opacity-40">
                       {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="w-1 h-12 bg-red-400 rounded-full rotate-45" />
                       ))}
                    </div>
                 )}
              </motion.div>

              {/* Central Space */}
              <div className="z-10 text-center space-y-4">
                 <div className="w-24 h-24 bg-white/30 rounded-full border-4 border-white/40 flex items-center justify-center">
                    {day === 14 ? (
                       <motion.div 
                         initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1] }}
                         className="w-12 h-12 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-center font-black text-[10px] text-yellow-900"
                       >
                          EGG
                       </motion.div>
                    ) : (
                       <Zap size={32} className="text-white/40" />
                    )}
                 </div>
                 <p className="text-[10px] font-black uppercase text-red-900/30 tracking-widest">{phase.liningState.toUpperCase()} STAGE</p>
              </div>
           </motion.div>

           {/* Feedback Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-red-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Trophy size={100} className="mb-8 animate-bounce text-yellow-300" />
                   <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Cycle Mastered!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl">You've successfully managed the hormonal feedback loops of a complete 28-day menstrual cycle. The uterus is primed for the next mission.</p>
                   <div className="flex space-x-4">
                      <Button onClick={() => setDay(1)} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Reset Cycle
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-red-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Fertilisation <ArrowRight size={24} className="ml-3" />
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
