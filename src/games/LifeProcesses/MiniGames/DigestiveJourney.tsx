import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  RotateCcw, 
  ChevronRight,
  Zap,
  Activity,
  Wind,
  Droplets,
  CheckCircle2,
  AlertCircle,
  FlaskConical
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Organ {
  id: string;
  name: string;
  description: string;
  enzyme: string;
  substrate: string;
  product: string;
  color: string;
}

const ORGANS: Organ[] = [
  { 
    id: 'mouth', 
    name: 'Buccal Cavity', 
    description: 'Mechanical breakdown and starch digestion begins here.',
    enzyme: 'Salivary Amylase',
    substrate: 'Starch',
    product: 'Maltose (Sugar)',
    color: 'bg-rose-400'
  },
  { 
    id: 'stomach', 
    name: 'Stomach', 
    description: 'Highly acidic environment where protein digestion starts.',
    enzyme: 'Pepsin',
    substrate: 'Proteins',
    product: 'Peptones',
    color: 'bg-orange-400'
  },
  { 
    id: 'intestine', 
    name: 'Small Intestine', 
    description: 'Final digestion and absorption of nutrients into blood.',
    enzyme: 'Lipase & Trypsin',
    substrate: 'Fats & Peptones',
    product: 'Fatty Acids & Amino Acids',
    color: 'bg-emerald-400'
  }
];

interface DigestiveJourneyProps {
  onComplete: () => void;
}

export function DigestiveJourney({ onComplete }: DigestiveJourneyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEnzyme, setSelectedEnzyme] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const organ = ORGANS[currentStep];

  const handleEnzymeSelect = (enzyme: string) => {
    setSelectedEnzyme(enzyme);
    const correct = enzyme === organ.enzyme;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct && currentStep === ORGANS.length - 1) {
      setTimeout(() => setIsSuccess(true), 1500);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    setSelectedEnzyme(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setSelectedEnzyme(null);
    setShowResult(false);
    setIsCorrect(false);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Journey Status */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-rose-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                  <Utensils size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Enzyme Lab</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Gastrointestinal Phase</p>
                </div>
              </div>

              <div className="space-y-4">
                {ORGANS.map((o, idx) => (
                  <div key={o.id} className={`flex items-center gap-3 transition-opacity ${idx === currentStep ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-2
                      ${idx < currentStep ? 'bg-emerald-500 border-white text-white' : 
                        idx === currentStep ? 'bg-white border-rose-400 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-400'}
                    `}>
                      {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-slate-600">{o.name}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-slate-50">
                 <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                   "{organ.description}"
                 </p>
              </div>
            </div>

            <div className="pt-6">
              <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                <RotateCcw size={16} className="mr-2" /> Restart Journey
              </Button>
            </div>
          </Card>
        </div>

        {/* GI Tract Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <motion.div 
                 key={organ.id}
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                 className="w-full max-w-2xl flex flex-col items-center gap-12"
               >
                  {/* Organic Structure Visualization */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                     <motion.div 
                        animate={{ 
                           scale: [1, 1.05, 1],
                           rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className={`absolute inset-0 rounded-[64px] ${organ.color} opacity-20 blur-3xl`}
                     />
                     <div className={`relative z-10 w-48 h-48 rounded-[48px] border-4 border-white/20 flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-md`}>
                        <Activity size={48} className="text-white/50 mb-4 animate-pulse" />
                        <span className="text-white font-black text-xl uppercase italic tracking-tighter text-center">{organ.name}</span>
                        <div className="mt-4 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                           <span className="text-[10px] font-black text-white/70 uppercase italic">Substrate: {organ.substrate}</span>
                        </div>
                     </div>
                  </div>

                  {/* Interaction Panel */}
                  <div className="w-full space-y-6">
                     {!showResult ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[organ.enzyme, 'Bile Juice', 'Hydrochloric Acid', 'Pancreatic Juice'].sort().map((e) => (
                            <button
                              key={e}
                              onClick={() => handleEnzymeSelect(e)}
                              className="p-6 bg-white/10 border-2 border-white/5 rounded-[32px] text-white font-black tracking-tighter uppercase text-left hover:bg-white/20 hover:border-white transition-all group overflow-hidden relative"
                            >
                               <div className="flex items-center gap-4">
                                  <div className="p-3 bg-white/10 rounded-xl">
                                     <FlaskConical size={20} className="text-rose-400 group-hover:rotate-12 transition-transform" />
                                  </div>
                                  <span className="text-md italic">{e}</span>
                               </div>
                               <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                            </button>
                          ))}
                       </div>
                     ) : (
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                         className={`p-10 rounded-[40px] border-4 flex flex-col items-center text-center gap-6
                           ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-rose-500/10 border-rose-500/30 text-white'}
                         `}
                       >
                          <div className={`p-6 rounded-full ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} shadow-2xl`}>
                             {isCorrect ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
                          </div>
                          <div>
                             <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
                               {isCorrect ? 'Reaction Successful!' : 'Digestion Failed!'}
                             </h4>
                             <p className="text-slate-300 font-bold italic">
                               {isCorrect 
                                 ? `${organ.enzyme} successfully converted ${organ.substrate} into ${organ.product}.`
                                 : "That enzyme doesn't work on this substrate in this organ. Try again."}
                             </p>
                          </div>
                          
                          {isCorrect ? (
                            !isSuccess && (
                              <Button onClick={nextStep} className="mt-4 px-12 py-4 bg-white text-slate-950 font-black rounded-3xl hover:scale-105 transition-transform flex items-center">
                                Advance Food Bolus <ChevronRight size={20} className="ml-2" />
                              </Button>
                            )
                          ) : (
                             <Button onClick={() => setShowResult(false)} className="mt-4 px-12 py-4 bg-rose-500 text-white font-black rounded-3xl hover:bg-rose-600">
                                Try Again
                             </Button>
                          )}
                       </motion.div>
                     )}
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-3xl">
                     <Zap size={64} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      NUTRITION <span className="text-rose-400">COMPLETE!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Complex food has been broken down into simple molecules and absorbed into the bloodstream. You are ready to power the cells!
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Amino Acids</p>
                        <p className="text-2xl font-black">100%</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Glucose</p>
                        <p className="text-2xl font-black">100%</p>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Go to Cellular Powerhouse <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
