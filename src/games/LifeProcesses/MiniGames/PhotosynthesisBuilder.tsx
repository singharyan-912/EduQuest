import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Sun, 
  Droplets, 
  Wind, 
  Leaf, 
  Zap, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Ingredient {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  formula: string;
}

const INGREDIENTS: Ingredient[] = [
  { 
    id: 'light', 
    name: 'Sunlight', 
    icon: Sun, 
    color: 'bg-yellow-400', 
    description: 'Electromagnetic energy from the sun.',
    formula: 'hv'
  },
  { 
    id: 'water', 
    name: 'Water', 
    icon: Droplets, 
    color: 'bg-blue-400', 
    description: 'Absorbed by roots from the soil.',
    formula: '6H₂O'
  },
  { 
    id: 'co2', 
    name: 'Carbon Dioxide', 
    icon: Wind, 
    color: 'bg-slate-400', 
    description: 'Taken from the air via stomata.',
    formula: '6CO₂'
  }
];

interface PhotosynthesisBuilderProps {
  onComplete: () => void;
}

export function PhotosynthesisBuilder({ onComplete }: PhotosynthesisBuilderProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleIngredient = (id: string) => {
    if (isReacting || isSuccess) return;
    
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIngredients(prev => [...prev, id]);
    }
    setError(null);
  };

  const handleStartReaction = () => {
    if (selectedIngredients.length < 3) {
      setError("You need all three key ingredients to start the reaction!");
      return;
    }
    
    setIsReacting(true);
    setTimeout(() => {
      setIsReacting(false);
      setIsSuccess(true);
    }, 3000);
  };

  const reset = () => {
    setSelectedIngredients([]);
    setIsReacting(false);
    setIsSuccess(false);
    setError(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lab Controls */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-emerald-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                  <Leaf size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Bio-Reactor</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Photosynthesis Module</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Inputs:</p>
                {INGREDIENTS.map((ing) => {
                  const Icon = ing.icon;
                  const isSelected = selectedIngredients.includes(ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      disabled={isReacting || isSuccess}
                      className={`w-full group relative flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300
                        ${isSelected ? 'bg-emerald-50 border-emerald-400 shadow-md scale-[1.02]' : 'bg-white border-slate-100 hover:border-emerald-200'}
                      `}
                    >
                      <div className={`p-3 rounded-2xl ${ing.color} text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-900 leading-none">{ing.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">{ing.formula}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute right-4 text-emerald-500">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 rounded-2xl border-2 border-red-100 flex items-center gap-3 text-red-600"
                >
                  <AlertCircle size={18} />
                  <p className="text-[11px] font-black uppercase tracking-tight">{error}</p>
                </motion.div>
              )}
            </div>

            <div className="pt-6 space-y-4">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <p className="text-[11px] font-bold text-emerald-800 leading-relaxed italic">
                  "6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂"
                </p>
              </div>
              <Button 
                onClick={handleStartReaction}
                disabled={isReacting || isSuccess}
                className={`w-full py-6 rounded-[32px] font-black text-lg shadow-xl transition-all hover:scale-105 group
                  ${isSuccess ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'} text-white
                `}
              >
                {isReacting ? 'Photolysis Active...' : isSuccess ? 'Reaction Complete' : 'Trigger Synthesis'}
                <Zap className={`ml-2 transition-transform ${isReacting ? 'animate-bounce' : 'group-hover:rotate-12'}`} size={20} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Reaction Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[600px]">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]" />
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="reactor"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="relative w-full h-full flex flex-col items-center justify-center gap-12"
              >
                {/* Chloroplast / Reaction Zone */}
                <div className="relative w-80 h-80 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
                  <motion.div 
                    animate={isReacting ? { 
                      scale: [1, 1.1, 1],
                      rotate: 360,
                      borderColor: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 1)', 'rgba(16, 185, 129, 0.3)']
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-[20px] border-emerald-500/10 blur-xl"
                  />
                  
                  <div className="z-10 text-center">
                    <motion.div
                       animate={isReacting ? { y: [0, -10, 0] } : {}}
                       transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Leaf size={80} className={`${isReacting ? 'text-emerald-400' : 'text-slate-700'} transition-colors duration-500`} />
                    </motion.div>
                    <p className="mt-4 font-black italic uppercase tracking-[0.2em] text-[10px] text-slate-500">
                      Chloroplast Matrix
                    </p>
                  </div>

                  {/* Input Particles */}
                  <AnimatePresence>
                    {selectedIngredients.map((id, idx) => {
                      const ing = INGREDIENTS.find(i => i.id === id)!;
                      const Icon = ing.icon;
                      return (
                        <motion.div
                          key={id}
                          layoutId={id}
                          initial={{ scale: 0, x: idx === 0 ? -150 : idx === 1 ? 0 : 150, y: 150 }}
                          animate={{ 
                            scale: 1, 
                            x: isReacting ? 0 : (idx === 0 ? -180 : idx === 1 ? 0 : 180),
                            y: isReacting ? 0 : (idx === 1 ? -180 : 100),
                            opacity: isReacting ? [1, 0] : 1
                          }}
                          transition={{ duration: 0.8, type: 'spring' }}
                          className={`absolute p-4 rounded-2xl ${ing.color} text-white shadow-2xl z-20`}
                        >
                          <Icon size={24} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {!isReacting && (
                  <div className="flex gap-4">
                     <div className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        Thermal: 25°C
                     </div>
                     <div className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        pH: 7.2
                     </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-emerald-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-3xl">
                  <Sparkles size={60} className="text-emerald-600 animate-pulse" />
                </div>
                <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                  Starch <span className="text-emerald-200">Synthesized!</span>
                </h2>
                <p className="text-xl font-bold text-emerald-50 italic mb-12 max-w-xl">
                  Amazing work! You've converted inorganic molecules into life-sustaining energy (Glucose) and released vital Oxygen.
                </p>
                
                <div className="flex gap-4 items-center mb-12">
                   <div className="p-6 bg-white/20 rounded-[32px] border-2 border-white/20 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Produced</p>
                      <p className="text-2xl font-black">C₆H₁₂O₆</p>
                   </div>
                   <div className="p-6 bg-white/20 rounded-[32px] border-2 border-white/20 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Released</p>
                      <p className="text-2xl font-black">6O₂</p>
                   </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={reset} variant="outline" className="px-8 py-4 bg-transparent border-white/40 text-white hover:bg-white/10 rounded-2xl font-black text-sm uppercase">
                    <RotateCcw size={18} className="mr-2" /> Re-Synthesize
                  </Button>
                  <Button onClick={onComplete} className="px-12 py-4 bg-white text-emerald-600 hover:bg-emerald-50 rounded-[32px] font-black text-lg shadow-2xl flex items-center transition-transform hover:scale-105">
                    Next Station <ChevronRight size={24} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sparkle Decoration */}
          {isReacting && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="absolute inset-0 pointer-events-none"
             >
                {Array.from({ length: 20 }).map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ x: Math.random() * 800, y: Math.random() * 600, scale: 0 }}
                     animate={{ 
                       y: [null, -100], 
                       opacity: [0, 1, 0],
                       scale: [0, 1, 0]
                     }}
                     transition={{ 
                       duration: 2 + Math.random() * 2,
                       repeat: Infinity,
                       delay: Math.random() * 2
                     }}
                     className="absolute"
                   >
                      <Sparkles size={8 + Math.random() * 12} className="text-emerald-400" />
                   </motion.div>
                ))}
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
