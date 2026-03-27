import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  RotateCcw, 
  ChevronRight,
  Sun,
  Wind,
  Plus,
  ArrowUp,
  CloudRain,
  Leaf,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface WaterFlowManagerProps {
  onComplete: () => void;
}

export function WaterFlowManager({ onComplete }: WaterFlowManagerProps) {
  const [waterLevel, setWaterLevel] = useState(0);
  const [stomataOpen, setStomataOpen] = useState(false);
  const [rootPressure, setRootPressure] = useState(20);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hydration, setHydration] = useState(50);

  // Transpiration Pull simulation
  useEffect(() => {
    if (isSuccess) return;
    
    const interval = setInterval(() => {
      // If stomata are open, water moves up faster but hydration drops
      if (stomataOpen) {
        setWaterLevel(prev => Math.min(prev + (rootPressure / 10) + 5, 100));
        setHydration(prev => Math.max(0, prev - 2));
      } else {
        // Limited movement from root pressure only
        setWaterLevel(prev => Math.min(prev + (rootPressure / 20), 100));
        setHydration(prev => Math.min(100, prev + 1));
      }

      if (waterLevel >= 100 && hydration > 20) {
        setIsSuccess(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [stomataOpen, rootPressure, waterLevel, hydration, isSuccess]);

  const increasePressure = () => {
    setRootPressure(prev => Math.min(prev + 10, 100));
  };

  const reset = () => {
    setWaterLevel(0);
    setStomataOpen(false);
    setRootPressure(20);
    setHydration(50);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Plant Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-cyan-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Hydro-Control</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Xylem Terminal</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Pressure Console */}
                <div className="p-6 bg-slate-900 rounded-[32px] border-b-4 border-cyan-500">
                   <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">Root Osmotic Pressure</p>
                   <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-white italic tracking-tighter">{rootPressure}</span>
                      <span className="text-xs font-bold text-slate-500 mb-1">kPa</span>
                   </div>
                   <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"
                        animate={{ width: `${rootPressure}%` }}
                      />
                   </div>
                </div>

                {/* Hydration Alert */}
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leaf Hydration</span>
                      <span className={`text-[10px] font-black ${hydration < 30 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                         {hydration}%
                      </span>
                   </div>
                   <div className="h-1.5 bg-slate-200 rounded-full">
                      <motion.div className={`h-full rounded-full ${hydration < 30 ? 'bg-rose-500' : 'bg-emerald-500'}`} animate={{ width: `${hydration}%` }} />
                   </div>
                </div>

                <div className="p-4 bg-cyan-50 rounded-2xl border-2 border-cyan-100 flex items-start gap-3">
                   <AlertTriangle className="text-cyan-600 shrink-0 mt-1" size={18} />
                   <p className="text-[11px] font-bold text-cyan-800 leading-relaxed italic">
                     Leaves lose water through Stomata. This creates a suction force (Transpiration Pull) that lifts water from roots.
                   </p>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
               <button 
                 onClick={increasePressure}
                 className="w-full py-5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group transition-all active:scale-95"
               >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Hydrate Roots
               </button>
               <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                  <RotateCcw size={16} className="mr-2 inline" /> Reset Fluid Dynamics
               </Button>
            </div>
          </Card>
        </div>

        {/* Xylem Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           {/* Trunk Background */}
           <div className="absolute inset-y-0 w-32 bg-white/5 border-x-2 border-white/10" />
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full h-full flex flex-col items-center justify-between py-12">
                  {/* Leaf/Stomata Zone */}
                  <div className="relative flex flex-col items-center gap-4">
                     <motion.div 
                        animate={stomataOpen ? { opacity: [0.3, 1, 0.3], y: -50 } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -top-12 flex gap-1"
                     >
                        {[1, 2, 3].map(i => <CloudRain key={i} size={20} className="text-cyan-400" />)}
                     </motion.div>
                     
                     <div className="p-6 bg-emerald-500/20 border-2 border-emerald-500/30 rounded-[32px] text-white flex flex-col items-center">
                        <Leaf size={48} className="text-emerald-400 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Transpiration Site</span>
                        
                        <button 
                          onClick={() => setStomataOpen(!stomataOpen)}
                          className={`mt-4 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-tighter transition-all
                            ${stomataOpen ? 'bg-cyan-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}
                          `}
                        >
                           {stomataOpen ? 'Stomata Open (Venting)' : 'Stomata Closed'}
                        </button>
                     </div>
                  </div>

                  {/* Water Lift Visualization */}
                  <div className="relative w-24 h-64 bg-white/5 border-2 border-white/10 rounded-full flex items-end overflow-hidden">
                     <motion.div 
                        className="w-full bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                        animate={{ height: `${waterLevel}%` }}
                        transition={{ duration: 0.5 }}
                     />
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ArrowUp size={48} className={`text-white/20 transition-all ${stomataOpen ? 'animate-bounce text-cyan-400 opacity-100' : ''}`} />
                     </div>
                  </div>

                  {/* Root System */}
                  <div className="p-6 bg-cyan-900/40 border-2 border-cyan-800 rounded-[32px] text-white flex flex-col items-center">
                     <Droplets size={40} className="text-cyan-400 mb-2 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Absorption Zone</span>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-cyan-500 rounded-full flex items-center justify-center shadow-3xl">
                     <Trophy size={64} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      ASCENT <span className="text-cyan-400">SUCCESSFUL!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Water has reached the leaves against gravity. Transpiration pull and root pressure have successfully maintained the ascent of sap.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Lift Height</p>
                        <p className="text-2xl font-black">100m (Sim)</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Flow State</p>
                        <p className="text-2xl font-black text-cyan-400 tracking-tighter italic">LAMINAR</p>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Final Module: Nephro-Tech <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
