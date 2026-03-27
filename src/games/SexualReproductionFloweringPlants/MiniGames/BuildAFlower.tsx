import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Info, 
  Sparkles,
  ArrowRight,
  Flower2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface FlowerPart {
  id: string;
  name: string;
  description: string;
  type: 'vegetative' | 'male' | 'female';
  color: string;
  icon: string;
}

const PARTS: FlowerPart[] = [
  { id: 'sepals', name: 'Sepals (Calyx)', description: 'Protect the flower in the bud stage.', type: 'vegetative', color: 'bg-green-500', icon: '🍃' },
  { id: 'petals', name: 'Petals (Corolla)', description: 'Brightly colored to attract pollinators.', type: 'vegetative', color: 'bg-pink-400', icon: '🌸' },
  { id: 'stamen', name: 'Stamen (Androecium)', description: 'Male reproductive organ (Anther + Filament).', type: 'male', color: 'bg-yellow-400', icon: '🌾' },
  { id: 'pistil', name: 'Pistil (Gynoecium)', description: 'Female reproductive organ (Stigma, Style, Ovary).', type: 'female', color: 'bg-purple-400', icon: '🏺' }
];

interface BuildAFlowerProps {
  onComplete: () => void;
}

export function BuildAFlower({ onComplete }: BuildAFlowerProps) {
  const [placedParts, setPlacedParts] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (partId: string) => {
    if (!placedParts.includes(partId)) {
      setPlacedParts(prev => [...prev, partId]);
      // Small vibration-like feedback or sound effect logic here
    }
  };

  useEffect(() => {
    if (placedParts.length === PARTS.length) {
      setTimeout(() => setShowSuccess(true), 1000);
    }
  }, [placedParts]);

  const resetGame = () => {
    setPlacedParts([]);
    setShowSuccess(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Inventory Side */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border-4 border-gray-100 shadow-xl">
             <h3 className="text-xl font-black text-gray-800 uppercase mb-6 flex items-center">
                <Flower2 className="mr-3 text-pink-500" /> Flower Parts
             </h3>
             <div className="space-y-4">
                {PARTS.map((part) => (
                  <motion.div
                    key={part.id}
                    draggable={!placedParts.includes(part.id)}
                    onDragStart={() => setDraggedId(part.id)}
                    whileHover={!placedParts.includes(part.id) ? { scale: 1.02, x: 5 } : {}}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-grab active:cursor-grabbing
                      ${placedParts.includes(part.id) 
                        ? 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed' 
                        : 'bg-white border-pink-100 hover:border-pink-300 shadow-sm'}
                    `}
                  >
                    <div className="flex items-center space-x-4">
                       <span className="text-3xl">{part.icon}</span>
                       <div>
                          <p className="font-black text-gray-800 leading-tight">{part.name.split(' (')[0]}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{part.type}</p>
                       </div>
                    </div>
                    {placedParts.includes(part.id) && <CheckCircle2 className="text-green-500" size={20} />}
                  </motion.div>
                ))}
             </div>
          </div>

          <Card className="p-6 bg-blue-50/50 border-2 border-blue-100 rounded-3xl">
             <div className="flex items-start space-x-3">
                <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                <p className="text-sm font-bold text-blue-800 leading-relaxed">
                   Drag the parts from the inventory and drop them onto the central <b>thalamus</b> (base) to build the flower!
                </p>
             </div>
          </Card>
        </div>

        {/* Construction Arena */}
        <div className="lg:col-span-8 relative aspect-square bg-gradient-to-b from-sky-50 to-white rounded-[64px] border-8 border-white shadow-inner flex items-center justify-center p-12 overflow-hidden">
           
           {/* Visual Guides & Animations */}
           <div 
             className="relative w-full h-full flex items-center justify-center"
             onDragOver={(e) => e.preventDefault()}
             onDrop={() => draggedId && handleDrop(draggedId)}
           >
              {/* Thalamus (Base) */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-48 h-24 bg-green-700/20 rounded-full blur-2xl absolute bottom-20" 
              />
              <div className="w-40 h-16 bg-gradient-to-b from-green-600 to-green-800 rounded-full border-4 border-green-500/30 relative z-0 flex items-center justify-center">
                 <span className="text-green-100 text-xs font-black uppercase tracking-tighter opacity-50">Thalamus</span>
              </div>

              {/* Placed Elements with Animations */}
              <AnimatePresence>
                {placedParts.includes('sepals') && (
                  <motion.div 
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="absolute z-10 flex space-x-8 -bottom-4"
                  >
                    <div className="w-16 h-20 bg-green-500 rounded-full rotate-45 border-4 border-green-600 shadow-lg" />
                    <div className="w-16 h-20 bg-green-500 rounded-full -rotate-45 border-4 border-green-600 shadow-lg" />
                  </motion.div>
                )}

                {placedParts.includes('petals') && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-x-0 top-0 bottom-16 flex items-center justify-center"
                  >
                    {[0, 60, 120, 180, 240, 300].map(deg => (
                       <div 
                         key={deg}
                         style={{ transform: `rotate(${deg}deg) translateY(-80px)` }}
                         className="absolute w-32 h-40 bg-pink-400 rounded-full border-8 border-pink-500 shadow-2xl opacity-90"
                       />
                    ))}
                  </motion.div>
                )}

                {placedParts.includes('stamen') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 flex space-x-12 bottom-12"
                  >
                    {[1, 2, 3, 4].map(i => (
                       <div key={i} className="flex flex-col items-center">
                          <div className="w-6 h-10 bg-yellow-400 rounded-lg border-2 border-yellow-500 shadow-md animate-pulse" />
                          <div className="w-1 h-20 bg-yellow-200/50" />
                       </div>
                    ))}
                  </motion.div>
                )}

                {placedParts.includes('pistil') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute z-30 bottom-16 flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-full border-4 border-purple-600 shadow-lg relative">
                       <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-purple-600/50 uppercase">Stigma</span>
                    </div>
                    <div className="w-2 h-24 bg-purple-300" />
                    <div className="w-24 h-24 bg-purple-600 rounded-full border-8 border-purple-700 shadow-2xl flex items-center justify-center">
                       <div className="w-8 h-8 bg-purple-400 rounded-full animate-pulse" />
                    </div>
                    <span className="text-purple-900 text-xs font-black uppercase mt-2 tracking-widest">Ovary</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder guides when empty */}
              {placedParts.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-64 h-64 border-4 border-dashed border-gray-200 rounded-full animate-pulse flex items-center justify-center">
                      <p className="text-gray-300 font-black uppercase tracking-widest text-sm">Drop Parts Here</p>
                   </div>
                </div>
              )}
           </div>

           {/* Feedback Overlay */}
           <AnimatePresence>
             {showSuccess && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="absolute inset-0 z-[100] bg-pink-500/90 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-12"
               >
                  <Sparkles size={100} className="mb-8 text-yellow-300 animate-bounce" />
                  <h2 className="text-5xl font-black mb-4 uppercase italic tracking-tighter">Perfect Bloom!</h2>
                  <p className="text-xl font-bold mb-12 max-w-md">You've successfully identified all the vegetative and reproductive organs of a flowering plant.</p>
                  <div className="flex space-x-4">
                    <Button onClick={resetGame} variant="outline" className="bg-white text-pink-500 font-black px-8 py-4 rounded-2xl">
                       <RotateCcw size={20} className="mr-2" /> Rebuild
                    </Button>
                    <Button onClick={onComplete} className="bg-white text-rose-600 font-black px-12 py-4 rounded-2xl shadow-xl flex items-center text-lg">
                       Continue Journey <ArrowRight size={24} className="ml-3" />
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
