import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  RotateCcw, 
  ChevronRight,
  Heart,
  Wind,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  Droplets,
  Trophy
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Node {
  id: string;
  name: string;
  type: 'supply' | 'demand' | 'relay';
  bloodType: 'oxygenated' | 'deoxygenated';
  icon: any;
  color: string;
}

const NODES: Node[] = [
  { id: 'lungs', name: 'Lungs', type: 'supply', bloodType: 'oxygenated', icon: Wind, color: 'blue' },
  { id: 'brain', name: 'Brain', type: 'demand', bloodType: 'oxygenated', icon: Activity, color: 'rose' },
  { id: 'muscle', name: 'Muscles', type: 'demand', bloodType: 'oxygenated', icon: Zap, color: 'rose' },
  { id: 'digestive', name: 'Digestive System', type: 'demand', bloodType: 'oxygenated', icon: Droplets, color: 'rose' }
];

interface BodyDeliverySystemProps {
  onComplete: () => void;
}

export function BodyDeliverySystem({ onComplete }: BodyDeliverySystemProps) {
  const [delivered, setDelivered] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activePump, setActivePump] = useState<string | null>(null);

  const deliverBlood = (nodeId: string) => {
    if (delivered.includes(nodeId) || isSuccess) return;
    
    setActivePump(nodeId);
    setTimeout(() => {
      setDelivered(prev => [...prev, nodeId]);
      setActivePump(null);
      
      if (delivered.length + 1 === NODES.filter(n => n.type === 'demand').length) {
         setIsSuccess(true);
      }
    }, 1500);
  };

  const reset = () => {
    setDelivered([]);
    setIsSuccess(false);
    setActivePump(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Logistics Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-red-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Bio-Logistics</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Vascular Highway</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="p-6 bg-slate-900 rounded-[32px] border-b-4 border-red-500">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">System Saturation</p>
                    <div className="flex items-end gap-2">
                       <span className="text-4xl font-black text-white italic tracking-tighter">
                          {Math.floor((delivered.length / 3) * 100)}%
                       </span>
                    </div>
                    <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-red-500"
                         animate={{ width: `${(delivered.length / 3) * 100}%` }}
                       />
                    </div>
                 </div>

                 <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-100 flex items-start gap-3">
                    <Info className="text-red-600 shrink-0 mt-1" size={18} />
                    <p className="text-[11px] font-bold text-red-800 leading-relaxed italic">
                      In humans, blood flows twice through the heart in one full cycle. This is called Double Circulation.
                    </p>
                 </div>
              </div>
            </div>

            <div className="pt-6">
              <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                <RotateCcw size={16} className="mr-2 inline" /> Clear Highways
              </Button>
            </div>
          </Card>
        </div>

        {/* Circulatory Map */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

           <div className="relative w-full h-full flex flex-col items-center justify-around">
              {/* Lungs Supply */}
              <motion.div 
                className="p-6 bg-blue-500/20 border-2 border-blue-500/30 rounded-[32px] flex items-center gap-4 text-white"
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
              >
                 <div className="p-4 bg-blue-500 rounded-2xl shadow-xl">
                    <Wind size={32} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Lungs</h4>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Oxygenation Station</p>
                 </div>
              </motion.div>

              {/* Central Pump (Heart) */}
              <div className="relative">
                 <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-40 h-40 bg-red-500 rounded-full shadow-[0_0_80px_rgba(239,68,68,0.4)] flex items-center justify-center border-8 border-white group relative"
                 >
                    <Heart size={64} className="text-white fill-white" />
                    
                    {/* Pulsing Arteries */}
                    <AnimatePresence>
                       {activePump && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }}
                            className="absolute inset-0 border-4 border-red-500 rounded-full"
                          />
                       )}
                    </AnimatePresence>
                 </motion.div>
                 <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-black text-[10px] text-white/50 uppercase tracking-[0.3em] italic">Cardiac Pump</span>
              </div>

              {/* Demand Nodes */}
              <div className="w-full flex justify-between gap-4 px-12">
                 {NODES.filter(n => n.type === 'demand').map((node, idx) => {
                    const isDelivered = delivered.includes(node.id);
                    const isActive = activePump === node.id;
                    const Icon = node.icon;

                    return (
                       <button
                         key={node.id}
                         onClick={() => deliverBlood(node.id)}
                         disabled={isDelivered || isActive || isSuccess}
                         className="flex flex-col items-center gap-4 group"
                       >
                          <div className={`relative w-24 h-24 rounded-[32px] border-4 flex items-center justify-center transition-all duration-500 shadow-2xl
                            ${isDelivered ? 'bg-red-500 border-white text-white' : 
                              isActive ? 'bg-red-200 border-red-400 text-red-600 scale-110' : 'bg-slate-900 border-slate-800 text-slate-600 group-hover:border-red-400'}
                          `}>
                             <Icon size={32} />
                             {isDelivered && (
                               <motion.div 
                                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                                 className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
                               >
                                  <ArrowUpRight size={16} />
                               </motion.div>
                             )}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest italic transition-colors
                            ${isDelivered ? 'text-white' : 'text-slate-500'}
                          `}>
                             {node.name}
                          </span>
                       </button>
                    );
                 })}
              </div>
           </div>

           {/* Completion Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-red-600/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-12 text-center"
                >
                   <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-3xl">
                      <Trophy size={60} className="text-red-600 animate-pulse" />
                   </div>
                   <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                     TRANSPORT <span className="text-red-200">OPTIMIZED!</span>
                   </h2>
                   <p className="text-xl font-bold text-red-50 italic mb-12 max-w-xl">
                     Efficiency: 100%. All organs have received oxygenated blood. Your circulatory system is a masterpiece of logistics.
                   </p>
                   
                   <Button onClick={onComplete} className="px-16 py-6 bg-white text-red-600 hover:bg-red-50 rounded-[40px] text-xl font-black shadow-2xl flex items-center transition-transform hover:scale-105">
                     Enter Cardiac Control <ChevronRight size={28} className="ml-2" />
                   </Button>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
