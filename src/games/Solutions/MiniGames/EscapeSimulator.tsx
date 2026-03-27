import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight,
  Info,
  Wind,
  TrendingDown
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface EscapeSimulatorProps {
  onComplete: () => void;
}

export function EscapeSimulator({ onComplete }: EscapeSimulatorProps) {
  const [soluteConcentration, setSoluteConcentration] = useState(0); // 0 to 100
  const [isSuccess, setIsSuccess] = useState(false);

  // Vapour pressure calculation (inverse relationship with solute)
  const vapourPressure = 100 - (soluteConcentration * 0.6);
  const escapingParticlesCount = Math.floor(vapourPressure / 4);

  useEffect(() => {
    // Goal: Lower vapour pressure significantly (e.g., below 50)
    if (vapourPressure <= 50) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [vapourPressure]);

  const resetGame = () => {
    setSoluteConcentration(0);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Controls & Gauges */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-sky-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Wind className="mr-2 text-sky-500" /> Pressure Lab
                 </h3>
                 <div className="px-4 py-2 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase">GOAL: P {"<"} 50 units</div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-sky-500">
                       <span>Non-volatile Solute</span>
                       <span className="text-gray-900">{soluteConcentration}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={soluteConcentration}
                      onChange={(e) => setSoluteConcentration(Number(e.target.value))}
                      className="w-full h-4 bg-sky-100 rounded-full appearance-none cursor-pointer accent-sky-500"
                    />
                 </div>
              </div>

              {/* Real-time Gauge */}
              <div className="pt-8 border-t-2 border-sky-50">
                 <div className="bg-sky-50 p-8 rounded-[40px] text-center space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <TrendingDown size={48} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Vapour Pressure</p>
                       <p className={`text-5xl font-black tracking-tighter ${vapourPressure <= 50 ? 'text-green-600' : 'text-sky-600'}`}>
                          {vapourPressure.toFixed(1)}
                       </p>
                       <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-1">Relative Units</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-black text-sky-800 uppercase italic">
                       <span>High P</span>
                       <div className="flex-1 mx-4 h-2 bg-white rounded-full overflow-hidden">
                          <motion.div animate={{ width: `${vapourPressure}%` }} className="h-full bg-sky-500" />
                       </div>
                       <span>Low P</span>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-blue-50/50 rounded-[32px] border-2 border-blue-100 flex items-start space-x-3">
              <Info className="text-blue-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
                 According to <b>Raoult's Law</b>, adding a non-volatile solute reduces the number of solvent molecules at the surface, thereby lowering vapour pressure.
              </p>
           </div>
        </div>

        {/* Particle Visualization */}
        <div className="lg:col-span-8 bg-slate-900/95 rounded-[80px] border-8 border-white shadow-3xl relative flex items-center justify-center p-12 overflow-hidden min-h-[600px] border-4 border-sky-100/20">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />

           {/* Solution System */}
           <div className="relative w-full h-[500px] flex flex-col">
              
              {/* Vapour Phase (Top half) */}
              <div className="flex-1 relative flex items-center justify-center border-b-4 border-dashed border-white/10">
                 <div className="absolute top-6 left-6 text-[10px] font-black text-white/20 uppercase tracking-widest italic">Vapour Phase</div>
                 
                 <AnimatePresence>
                    {Array.from({ length: escapingParticlesCount }).map((_, i) => (
                       <motion.div 
                         key={`v-${i}`}
                         initial={{ opacity: 0, y: 100 }}
                         animate={{ 
                           opacity: [0, 1, 0.5, 1, 0],
                           x: [Math.random() * 500 - 250, Math.random() * 500 - 250],
                           y: [0, -200]
                         }}
                         transition={{ duration: 3 + Math.random() * 5, repeat: Infinity }}
                         className="absolute w-3 h-3 bg-sky-400 rounded-full blur-[2px] shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                       />
                    ))}
                 </AnimatePresence>
              </div>

              {/* Liquid Phase (Bottom half) */}
              <div className="flex-1 relative bg-sky-950/30 rounded-b-[40px] flex items-center justify-center overflow-hidden">
                 <div className="absolute bottom-6 left-6 text-[10px] font-black text-white/20 uppercase tracking-widest italic">Liquid Surface</div>

                 {/* Surface solvent molecules */}
                 <div className="absolute top-0 inset-x-0 h-12 flex justify-center gap-1 z-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                       <div key={i} className={`w-4 h-4 rounded-full ${i % (Math.floor(100/Math.max(soluteConcentration, 10))) === 0 && soluteConcentration > 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-sky-400 opacity-80 animate-pulse'}`} />
                    ))}
                 </div>

                 {/* Deep particles */}
                 <div className="absolute bottom-0 inset-x-0 h-32 flex flex-wrap justify-around p-8 opacity-20">
                    {Array.from({ length: 40 }).map((_, i) => (
                       <div key={i} className="w-2 h-2 bg-sky-300 rounded-full" />
                    ))}
                 </div>

                 {/* Big Solute Particles (Non-volatile) */}
                 {soluteConcentration > 0 && Array.from({ length: Math.floor(soluteConcentration / 10) }).map((_, i) => (
                    <motion.div 
                      key={`s-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, x: Math.random() * 400 - 200, y: Math.random() * 100 }}
                      className="absolute w-12 h-12 bg-orange-600/40 border-2 border-orange-500 rounded-full flex items-center justify-center text-[8px] font-black text-orange-200 uppercase tracking-tighter"
                    >
                       Solute
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-sky-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Wind size={100} className="mb-8 animate-pulse text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Pressure Diminished!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">By adding the non-volatile solute, you have successfully blocked the solvent's escape route, effectively lowering the overall vapour pressure.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Restore Pure Solvent
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-sky-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Explore Mixing Behaviors <ArrowRight size={24} className="ml-3" />
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
