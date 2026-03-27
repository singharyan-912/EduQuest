import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Clock,
  Baby,
  Heart,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface GrowthStage {
  month: number;
  label: string;
  description: string;
  milestone: string;
  details: string[];
}

const STAGES: GrowthStage[] = [
  { 
    month: 1, 
    label: "Formation Begins", 
    description: "Heart is the first organ to be formed.", 
    milestone: "Heart Functioning",
    details: ["Embryo is about 0.5 cm long", "Neural tube develops"]
  },
  { 
    month: 2, 
    label: "Limbs & Digits", 
    description: "The embryo develops limbs and digits.", 
    milestone: "Limb Development",
    details: ["Major organs continue forming", "Face begins to take shape"]
  },
  { 
    month: 3, 
    label: "First Trimester", 
    description: "Most major organ systems are formed.", 
    milestone: "Organogenesis Complete",
    details: ["External genitalia visible", "Fetus starts moving slightly"]
  },
  { 
    month: 5, 
    label: "First Movements", 
    description: "Hair appears on the head, first movements observed.", 
    milestone: "Fetal Animation",
    details: ["Fetus becomes much more active", "Vernix caseosa formed"]
  },
  { 
    month: 9, 
    label: "Full Maturity", 
    description: "Fetus is fully developed and ready for delivery.", 
    milestone: "Parturition Ready",
    details: ["Organs fully functional", "Positioned for birth"]
  }
];

interface GrowthTimelineProps {
  onComplete: () => void;
}

export function GrowthTimeline({ onComplete }: GrowthTimelineProps) {
  const [stageIdx, setStageIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const stage = STAGES[stageIdx];
  const isLastStage = stageIdx === STAGES.length - 1;

  const nextStage = () => {
    if (isLastStage) {
      setIsSuccess(true);
    } else {
      setStageIdx(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Timeline Slider & Info */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-green-50 bg-white shadow-xl space-y-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="flex items-center space-x-3">
                    <Clock className="text-green-500" size={24} />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Growth Timeline</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Gestation Progress</span>
                       <span className="text-3xl font-black text-green-600">Month {stage.month}</span>
                    </div>
                    <div className="relative h-4 bg-green-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(stageIdx + 1) / STAGES.length * 100}%` }}
                         className="absolute inset-0 bg-green-500"
                       />
                    </div>
                 </div>

                 <div className="pt-8 border-t-2 border-green-50 space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Current Phase</p>
                       <p className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{stage.label}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{stage.description}"</p>
                    <div className="space-y-2">
                       {stage.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-center space-x-2 text-green-800 bg-green-50 p-3 rounded-2xl">
                             <CheckCircle2 size={14} className="shrink-0" />
                             <span className="text-[10px] font-black uppercase tracking-tight">{detail}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <Button 
                onClick={nextStage}
                className="w-full py-8 bg-green-600 hover:bg-green-700 text-white rounded-[32px] font-black text-xl shadow-xl transition-all hover:scale-105 group"
              >
                 {isLastStage ? 'Ready for Birth' : 'Advance Month'} <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
           </Card>

           <div className="p-6 bg-emerald-50/50 rounded-[32px] border-2 border-emerald-100 flex items-start space-x-3">
              <Info className="text-emerald-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">
                 The average duration of human pregnancy is 9 months, termed as the <b>gestation period</b>.
              </p>
           </div>
        </div>

        {/* Development Arena */}
        <div className="lg:col-span-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[80px] border-8 border-white shadow-inner relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none z-10" />

           {/* Fetus Representation */}
           <div className="relative w-full h-full flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                 <motion.div 
                    key={stageIdx}
                    initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                    animate={{ scale: 0.5 + (stageIdx * 0.15), opacity: 1, rotate: 0 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="relative"
                 >
                    {/* Fetus Silhouette */}
                    <div className={`w-80 h-96 bg-white rounded-full border-8 border-green-200 shadow-2xl flex flex-col items-center justify-center p-8 transition-colors duration-1000
                       ${stageIdx === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}
                    `}>
                       {stageIdx === 0 ? (
                          <div className="relative">
                             <Heart size={100} className="text-red-500 animate-[pulse_1s_infinite] drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]" />
                             <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-black text-red-400 text-[10px] uppercase tracking-widest">Active Heart</span>
                          </div>
                       ) : (
                          <motion.div 
                             animate={{ y: [0, -10, 0] }}
                             transition={{ duration: 3, repeat: Infinity }}
                             className="flex flex-col items-center space-y-8"
                          >
                             <Baby size={150} className="text-green-600 opacity-80" />
                             <div className="flex space-x-4">
                                <Activity className="text-green-400 animate-pulse" />
                                <span className="font-black text-green-500 uppercase tracking-widest italic">{stage.milestone}</span>
                             </div>
                          </motion.div>
                       )}
                    </div>

                    {/* Fluid / Protective Layer */}
                    <motion.div 
                       animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.1, 0.2, 0.1]
                       }}
                       transition={{ duration: 4, repeat: Infinity }}
                       className="absolute -inset-12 bg-blue-300 rounded-full blur-3xl pointer-events-none"
                    />
                 </motion.div>
              </AnimatePresence>

              {/* Month Markers */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-12 pb-12 opacity-10 font-black text-[120px] text-gray-900 overflow-hidden pointer-events-none">
                 <span>{stage.month}</span>
                 <span>MONTHS</span>
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-green-600/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Baby size={120} className="mb-8 animate-bounce text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Development Peak!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">The fetus has completed its incredible journey of growth. At 9 months, the body is fuly equipped for external life.</p>
                   <div className="flex space-x-4">
                      <Button onClick={() => setStageIdx(0)} variant="outline" className="border-white/40 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Rewatch Growth
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-green-700 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Deliver the Miracle <ArrowRight size={24} className="ml-3" />
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
