import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface TransformationStep {
  id: number;
  label: string;
  description: string;
  parts: {
    ovule: string;
    ovary: string;
    integuments: string;
  };
  details: string[];
}

const STEPS: TransformationStep[] = [
  {
    id: 1,
    label: "Zygote & PEN",
    description: "The immediate result of double fertilisation.",
    parts: { ovule: "Developing", ovary: "Enlarging", integuments: "Soft" },
    details: ["PEN develops into Endosperm", "Zygote starts proembryo stage"]
  },
  {
    id: 2,
    label: "Growth Phase",
    description: "Ovary begins to ripen into fruit.",
    parts: { ovule: "Hardening", ovary: "Fleshy/Dry", integuments: "Tough" },
    details: ["Endosperm provides nutrition", "Embryo reaches heart shape"]
  },
  {
    id: 3,
    label: "Maturity",
    description: "Final transformation into seed and fruit.",
    parts: { ovule: "Seed", ovary: "Fruit", integuments: "Seed Coat" },
    details: ["Seed enters dormancy", "Fruit Wall = Pericarp"]
  }
];

interface SeedBuilderProps {
  onComplete: () => void;
}

export function SeedBuilder({ onComplete }: SeedBuilderProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const step = STEPS[currentStepIdx];
  const isLastStep = currentStepIdx === STEPS.length - 1;

  const nextStep = () => {
    if (isLastStep) {
      setIsSuccess(true);
    } else {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setCurrentStepIdx(0);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Step Guide */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border-4 border-emerald-50 shadow-xl space-y-8 h-full">
              <div className="flex items-center space-x-3 text-emerald-600">
                 <Clock size={24} />
                 <h3 className="text-xl font-black uppercase tracking-tight italic">Time-Lapse: {step.label}</h3>
              </div>

              <div className="space-y-4">
                 {STEPS.map((s, idx) => (
                    <div key={s.id} className="flex items-center space-x-4">
                       <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-sm transition-all
                          ${idx === currentStepIdx ? 'bg-emerald-500 border-emerald-200 text-white scale-110 shadow-lg' : 
                            idx < currentStepIdx ? 'bg-emerald-100 border-emerald-50 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}
                       `}>
                          {idx < currentStepIdx ? <CheckCircle2 size={20} /> : s.id}
                       </div>
                       <div className={`flex-1 ${idx === currentStepIdx ? 'opacity-100' : 'opacity-40'}`}>
                          <p className="font-black text-xs uppercase tracking-widest">{s.label}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="pt-8 border-t-2 border-emerald-50 space-y-4">
                 <p className="text-sm font-bold text-gray-500 leading-relaxed italic">"{step.description}"</p>
                 <div className="space-y-2">
                    {step.details.map((detail, dIdx) => (
                       <div key={dIdx} className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 p-3 rounded-2xl">
                          <Sparkles size={14} className="shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-tight">{detail}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Visual Transformation Arena */}
        <div className="lg:col-span-8 bg-white rounded-[64px] border-8 border-emerald-50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-12 min-h-[500px]">
           
           {/* Transformation Visuals */}
           <div className="relative w-full h-full flex flex-col items-center justify-center">
              
              {/* Ovary -> Fruit Visualization */}
              <motion.div 
                 animate={{ 
                    scale: 0.8 + (currentStepIdx * 0.2),
                    backgroundColor: currentStepIdx === 0 ? '#d1fae5' : currentStepIdx === 1 ? '#fde68a' : '#f87171'
                 }}
                 className="relative w-80 h-80 rounded-full border-8 border-white/20 shadow-2xl flex items-center justify-center transition-colors duration-1000"
              >
                 <span className="absolute -top-12 text-sm font-black uppercase tracking-widest text-emerald-600/50">
                    Ovary Wall &rarr; {currentStepIdx === 2 ? 'Pericarp' : 'Developing Fruit'}
                 </span>

                 {/* Ovule -> Seed Visualization */}
                 <motion.div 
                    animate={{ 
                       scale: 0.6 + (currentStepIdx * 0.15),
                       rotate: currentStepIdx * 15,
                       backgroundColor: currentStepIdx === 0 ? '#ffffff' : currentStepIdx === 1 ? '#fcd34d' : '#92400e'
                    }}
                    className="w-48 h-56 rounded-full border-4 border-white/40 shadow-xl flex flex-col items-center justify-center space-y-4 relative overflow-hidden"
                 >
                    {/* Embryo Inside */}
                    <motion.div 
                       animate={{ 
                          scale: 0.4 + (currentStepIdx * 0.3),
                          opacity: 0.8
                       }}
                       className={`w-20 h-24 bg-emerald-400 rounded-full border-4 border-emerald-600 flex items-center justify-center
                          ${currentStepIdx === 1 ? 'rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-180' : ''}
                       `}
                    >
                       <div className="w-4 h-4 bg-emerald-200 rounded-full animate-pulse" />
                    </motion.div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${currentStepIdx === 2 ? 'text-white' : 'text-emerald-900/40'}`}>
                       {currentStepIdx === 0 ? 'Proembryo' : currentStepIdx === 1 ? 'Heart Stage' : 'Mature Seed'}
                    </span>

                    {/* Seed Coat */}
                    <div className={`absolute inset-0 border-[10px] transition-colors duration-1000 ${currentStepIdx === 2 ? 'border-amber-900/30' : 'border-transparent'}`} />
                 </motion.div>
              </motion.div>

              {/* Action Button */}
              <div className="absolute -bottom-4 z-50">
                <Button 
                  onClick={nextStep}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[32px] px-12 py-8 text-2xl font-black shadow-2xl transition-all hover:scale-105 group"
                >
                   {isLastStep ? 'Ripen Fully' : 'Pass Time'} <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
           </div>

           {/* Success Layer */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-[100] bg-emerald-600/90 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Sparkles size={80} className="mb-6 text-yellow-300 animate-bounce" />
                   <h2 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">Harvest Successful!</h2>
                   <p className="text-xl font-bold mb-10 max-w-sm">From a single microscopic cell to a nutrient-packed seed protected by fruit. Nature's design is complete.</p>
                   <div className="flex space-x-4">
                     <Button onClick={resetGame} variant="outline" className="bg-white text-emerald-600 font-black px-8 py-4 rounded-2xl">
                        <RotateCcw size={20} className="mr-2" /> Rewatch
                     </Button>
                     <Button onClick={onComplete} className="bg-white text-rose-600 font-black px-12 py-4 rounded-2xl shadow-xl flex items-center text-lg">
                        Final Mastery Phase <ArrowRight size={24} className="ml-3" />
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
