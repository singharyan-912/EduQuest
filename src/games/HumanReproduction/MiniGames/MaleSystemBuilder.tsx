import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Info, 
  ArrowRight,
  User,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Organ {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const ORGANS: Organ[] = [
  { id: 'testes', name: 'Testes', description: 'Primary sex organs that produce sperm and testosterone.', icon: '🟠', color: 'bg-blue-400' },
  { id: 'epididymis', name: 'Epididymis', description: 'Stores sperm for maturation.', icon: '🌀', color: 'bg-indigo-400' },
  { id: 'vas_deferens', name: 'Vas Deferens', description: 'Transports mature sperm to the urethra.', icon: '➰', color: 'bg-blue-500' },
  { id: 'vesicle', name: 'Seminal Vesicle', description: 'Secretes alkaline fluid to nourish sperm.', icon: '💧', color: 'bg-cyan-400' },
  { id: 'prostate', name: 'Prostate Gland', description: 'Produces fluid that contributes to semen volume.', icon: '🍩', color: 'bg-sky-400' },
  { id: 'urethra', name: 'Urethra', description: 'Common passage for both urine and semen.', icon: '🚇', color: 'bg-blue-600' }
];

interface MaleSystemBuilderProps {
  onComplete: () => void;
}

export function MaleSystemBuilder({ onComplete }: MaleSystemBuilderProps) {
  const [placedOrgans, setPlacedOrgans] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (id: string) => {
    if (!placedOrgans.includes(id)) {
      setPlacedOrgans(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (placedOrgans.length === ORGANS.length) {
      setTimeout(() => setIsSuccess(true), 1000);
    }
  }, [placedOrgans]);

  const resetGame = () => {
    setPlacedOrgans([]);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Inventory */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[48px] border-4 border-gray-100 shadow-xl">
              <h3 className="text-xl font-black text-gray-800 uppercase mb-8 flex items-center">
                 <User className="mr-3 text-blue-500" /> Organ Inventory
              </h3>
              <div className="space-y-4">
                 {ORGANS.map((organ) => (
                    <motion.div
                      key={organ.id}
                      draggable={!placedOrgans.includes(organ.id)}
                      onDragStart={() => setDraggedId(organ.id)}
                      whileHover={!placedOrgans.includes(organ.id) ? { scale: 1.02, x: 5 } : {}}
                      className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between cursor-grab active:cursor-grabbing
                        ${placedOrgans.includes(organ.id) 
                          ? 'bg-gray-50 border-gray-100 opacity-30 cursor-not-allowed shadow-none' 
                          : 'bg-white border-blue-50 hover:border-blue-200 shadow-md'}
                      `}
                    >
                       <div className="flex items-center space-x-4">
                          <span className="text-3xl">{organ.icon}</span>
                          <div>
                             <p className="font-black text-gray-800 leading-tight">{organ.name}</p>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Male Anatomy</p>
                          </div>
                       </div>
                       {placedOrgans.includes(organ.id) && <CheckCircle2 className="text-green-500" size={24} />}
                    </motion.div>
                 ))}
              </div>
           </div>

           <Card className="p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl">
              <div className="flex items-start space-x-3 text-blue-800">
                 <Info size={24} className="shrink-0" />
                 <p className="text-sm font-bold leading-relaxed italic">
                   Drag the organs and drop them onto the <b>Anatomical Map</b> to complete the system. Follow the pathway of sperm from production to exit.
                 </p>
              </div>
           </Card>
        </div>

        {/* Assembly Map */}
        <div className="lg:col-span-8 bg-gray-50/50 rounded-[80px] border-8 border-white shadow-inner relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div 
             className="relative w-full h-full flex items-center justify-center cursor-crosshair"
             onDragOver={(e) => e.preventDefault()}
             onDrop={() => draggedId && handleDrop(draggedId)}
           >
              {/* Silhouette Placeholder */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 0.05 }}
                className="absolute inset-0 flex items-center justify-center -translate-y-8"
              >
                 <User size={500} strokeWidth={1} />
              </motion.div>

              {/* Central Pathway Visualization */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                 <path d="M 400 500 Q 400 400 450 350 T 500 250" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray="20 10" />
              </svg>

              {/* Dynamic Placed Organs */}
              <AnimatePresence>
                 {placedOrgans.includes('testes') && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-8">
                       <div className="w-20 h-24 bg-blue-400 rounded-full border-4 border-blue-600 shadow-2xl flex items-center justify-center">
                          <Zap size={32} className="text-blue-100 opacity-50" />
                       </div>
                       <div className="w-20 h-24 bg-blue-400 rounded-full border-4 border-blue-600 shadow-2xl" />
                    </motion.div>
                 )}

                 {placedOrgans.includes('epididymis') && (
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute bottom-28 left-1/2 -translate-x-1/2 flex space-x-16">
                       <div className="w-12 h-16 bg-indigo-500 rounded-full border-4 border-indigo-700 shadow-lg -rotate-12" />
                       <div className="w-12 h-16 bg-indigo-500 rounded-full border-4 border-indigo-700 shadow-lg rotate-12" />
                    </motion.div>
                 )}

                 {placedOrgans.includes('vas_deferens') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-40 inset-x-0 flex justify-center h-48 pointer-events-none">
                       <div className="w-40 h-full border-l-8 border-r-8 border-blue-300 rounded-[100px] border-t-8 border-transparent" />
                    </motion.div>
                 )}

                 {placedOrgans.includes('prostate') && (
                    <motion.div initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12">
                       <div className="w-24 h-24 bg-sky-500 rounded-full border-8 border-sky-400 shadow-xl flex items-center justify-center">
                          <div className="w-8 h-8 bg-blue-900 rounded-full opacity-20" />
                       </div>
                    </motion.div>
                 )}

                 {placedOrgans.includes('urethra') && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 200 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 w-8 bg-blue-700 rounded-full border-x-4 border-blue-800 shadow-lg" />
                 )}
              </AnimatePresence>

              {/* Start Guide */}
              {placedOrgans.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-80 h-80 border-4 border-dashed border-gray-100 rounded-full animate-pulse flex flex-col items-center justify-center space-y-4">
                      <Zap size={64} className="text-gray-100" />
                      <p className="text-gray-200 font-black uppercase tracking-[0.2em] text-sm italic">Anatomy DropZone</p>
                   </div>
                </div>
              )}
           </div>

           {/* Feedback */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-x-12 bottom-12 z-50 bg-blue-600 rounded-[40px] p-8 text-white shadow-2xl flex items-center justify-between border-4 border-white/20"
                >
                   <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg">
                        <Activity className="animate-pulse" size={32} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black uppercase italic tracking-tighter">System Synchronized!</h2>
                         <p className="text-blue-100 font-bold opacity-80">Pathway for sperm movement is fully established and operational.</p>
                      </div>
                   </div>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Re-Assemble
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-blue-600 font-black px-10 py-4 rounded-2xl shadow-xl flex items-center text-lg hover:scale-105 transition-transform">
                         Continue Exploration <ArrowRight className="ml-2" />
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
