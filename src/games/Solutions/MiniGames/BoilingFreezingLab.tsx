import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight,
  Info,
  Thermometer,
  Snowflake,
  Flame
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Solute {
  name: string;
  kb: number; // ebulioscopic constant
  kf: number; // cryoscopic constant
  molarMass: number;
}

const SOLUTES: Solute[] = [
  { name: 'Glucose', kb: 0.52, kf: 1.86, molarMass: 180 },
  { name: 'Urea', kb: 0.52, kf: 1.86, molarMass: 60 },
  { name: 'Sucrose', kb: 0.52, kf: 1.86, molarMass: 342 }
];

interface BoilingFreezingLabProps {
  onComplete: () => void;
}

export function BoilingFreezingLab({ onComplete }: BoilingFreezingLabProps) {
  const [soluteIdx, setSoluteIdx] = useState(0);
  const [molality, setMolality] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const solute = SOLUTES[soluteIdx];
  
  // Colligative properties: delta T = K * m
  const deltaTb = solute.kb * molality;
  const deltaTf = solute.kf * molality;
  
  const boilingPoint = 100 + deltaTb;
  const freezingPoint = 0 - deltaTf;

  useEffect(() => {
    // Goal: Elevate boiling point above 102°C OR depress freezing below -5°C
    if (boilingPoint >= 102 || freezingPoint <= -5) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [boilingPoint, freezingPoint]);

  const resetLab = () => {
    setMolality(0);
    setIsHeating(false);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Thermal Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-emerald-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Thermometer className="mr-2 text-emerald-500" /> Colligative Lab
                 </h3>
                 <div className="px-4 py-2 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase">Goal: ΔT {">"} 2°C</div>
              </div>

              {/* Solute Selection */}
              <div className="space-y-4 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Solute</p>
                 <select 
                   value={soluteIdx}
                   onChange={(e) => setSoluteIdx(Number(e.target.value))}
                   className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-slate-900 uppercase italic"
                 >
                    {SOLUTES.map((s, idx) => (
                       <option key={s.name} value={idx}>{s.name}</option>
                    ))}
                 </select>
              </div>

              {/* Molality Slider */}
              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    <span>Molality (m)</span>
                    <span className="text-gray-900">{molality.toFixed(1)} mol/kg</span>
                 </div>
                 <input 
                   type="range" min="0" max="10" step="0.5" value={molality}
                   onChange={(e) => setMolality(Number(e.target.value))}
                   className="w-full h-4 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
                 />
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => setIsHeating(true)}
                   className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-2
                     ${isHeating ? 'bg-orange-50 border-orange-400 text-orange-600' : 'bg-slate-50 border-slate-100 text-slate-400'}
                   `}
                 >
                    <Flame size={24} />
                    <span className="text-[10px] font-black uppercase">Heat Mode</span>
                 </button>
                 <button 
                   onClick={() => setIsHeating(false)}
                   className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-2
                     ${!isHeating ? 'bg-blue-50 border-blue-400 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}
                   `}
                 >
                    <Snowflake size={24} />
                    <span className="text-[10px] font-black uppercase">Freeze Mode</span>
                 </button>
              </div>

              {/* Data Display */}
              <div className="pt-6 border-t-2 border-emerald-50 space-y-4">
                 <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl">
                    <span className="text-xs font-black text-orange-700 uppercase tracking-tighter italic">Boiling Point (Tb)</span>
                    <span className="text-2xl font-black text-orange-600 tracking-tighter">{boilingPoint.toFixed(2)}°C</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                    <span className="text-xs font-black text-blue-700 uppercase tracking-tighter italic">Freezing Point (Tf)</span>
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">{freezingPoint.toFixed(2)}°C</span>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[32px] flex items-start space-x-3">
              <Info className="text-emerald-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">
                 Colligative properties depend only on the <b>number of solute particles</b>, not their nature. Adding more solute increases the spread.
              </p>
           </div>
        </div>

        {/* Visual Lab View */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[80px] border-8 border-white shadow-3xl relative flex flex-col items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none z-10" />

           {/* Macroscopic Thermometer */}
           <div className="absolute left-12 top-12 bottom-12 w-12 bg-slate-900 rounded-full border-4 border-slate-800 flex flex-col items-center justify-end p-1">
              <motion.div 
                animate={{ height: `${(isHeating ? boilingPoint : (freezingPoint + 10)) / 120 * 100}%` }}
                className={`w-full rounded-full transition-colors duration-1000 ${isHeating ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]'}`}
              />
              <div className="absolute -top-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">{isHeating ? 'T (High)' : 'T (Low)'}</div>
           </div>

           {/* Microscopic Phase View */}
           <div className="relative w-[400px] h-[400px] bg-white/5 rounded-full border-4 border-white/10 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                 {isHeating ? (
                    <motion.div key="boil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                       {/* Rapidly moving solvent particles */}
                       {Array.from({ length: 30 }).map((_, i) => (
                          <motion.div 
                            key={`b-${i}`}
                            animate={{ 
                               x: [Math.random() * 300 - 150, Math.random() * 300 - 150],
                               y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
                               opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{ duration: 0.2 + Math.random() * 0.5, repeat: Infinity }}
                            className="absolute w-2 h-2 bg-blue-300 rounded-full blur-[1px]"
                          />
                       ))}
                       {/* Bubbles forming */}
                       {boilingPoint > 100 && (
                          Array.from({ length: 15 }).map((_, i) => (
                             <motion.div 
                               key={`bub-${i}`}
                               animate={{ y: [200, -200], opacity: [0, 1, 0], scale: [0, 1.5] }}
                               transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                               className="absolute w-6 h-6 border-2 border-white/20 bg-white/5 rounded-full"
                             />
                          ))
                       )}
                    </motion.div>
                 ) : (
                    <motion.div key="freeze" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
                       {/* Vibrating/Structured solvent particles (Ice Grid) */}
                       <div className="grid grid-cols-6 gap-6">
                          {Array.from({ length: 36 }).map((_, i) => (
                             <motion.div 
                               key={`f-${i}`}
                               animate={{ 
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, 0]
                               }}
                               transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                               className="w-4 h-4 bg-blue-100 rounded-sm shadow-[0_0_10px_rgba(219,234,254,0.5)]"
                             />
                          ))}
                       </div>
                    </motion.div>
                 )}
              </AnimatePresence>

              {/* Solute Particles (Disrupting structure) */}
              {Array.from({ length: Math.floor(molality * 4) }).map((_, i) => (
                 <motion.div 
                   key={`sol-${i}`}
                   initial={{ scale: 0 }}
                   animate={{ scale: 1, x: Math.random() * 300 - 150, y: Math.random() * 300 - 150 }}
                   className="absolute w-4 h-4 bg-emerald-500 rounded-full z-20 shadow-lg border border-white/20"
                 />
              ))}
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-emerald-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Thermometer size={100} className="mb-8 animate-pulse text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Thermal Mastery!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">By manipulating the particle count, you have successfully shifted the physical phase transition limits. Absolute precision.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetLab} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Reset Lab
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-emerald-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Molar Mass Solver <ArrowRight size={24} className="ml-3" />
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
