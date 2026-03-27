import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Thermometer,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  FlaskConical
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface SoluteData {
  name: string;
  baseSolubility: number; // g per 100mL at 20C
  tempFactor: number; // how much solubility increases per 10C
  color: string;
}

const SOLUTES: SoluteData[] = [
  { name: 'Sugar (Sucrose)', baseSolubility: 200, tempFactor: 50, color: 'bg-white' },
  { name: 'Salt (NaCl)', baseSolubility: 36, tempFactor: 0.5, color: 'bg-blue-100' },
  { name: 'KNO3', baseSolubility: 32, tempFactor: 120, color: 'bg-yellow-100' }
];

interface DissolveMasterProps {
  onComplete: () => void;
}

export function DissolveMaster({ onComplete }: DissolveMasterProps) {
  const [soluteIdx, setSoluteIdx] = useState(0);
  const [temp, setTemp] = useState(20); // Celsius
  const [addedMass, setAddedMass] = useState(0); // grams
  const [isSuccess, setIsSuccess] = useState(false);

  const solute = SOLUTES[soluteIdx];
  
  // Calculate dynamic solubility limit based on temperature
  // Linear approximation for simulation purposes
  const currentSolubility = solute.baseSolubility + (solute.tempFactor * (temp - 20) / 10);
  
  const dissolvedMass = Math.min(addedMass, currentSolubility);
  const undissolvedMass = Math.max(0, addedMass - currentSolubility);
  
  const saturationState = addedMass === 0 
    ? 'EMPTY' 
    : undissolvedMass > 0 
      ? 'SATURATED' 
      : 'UNSATURATED';

  useEffect(() => {
    // Goal: Create a saturated solution at a specific temperature
    if (saturationState === 'SATURATED' && temp >= 80) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [saturationState, temp]);

  const resetGame = () => {
    setAddedMass(0);
    setTemp(20);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Lab Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-amber-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Thermometer className="mr-2 text-amber-500" /> Solubility Lab
                 </h3>
                 <div className="px-4 py-2 bg-amber-600 text-white rounded-2xl font-black text-xs">GOAL: SATURATE @ 80°C</div>
              </div>

              {/* Solute Selection */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select Solute</p>
                 <div className="grid grid-cols-3 gap-3">
                    {SOLUTES.map((s, idx) => (
                       <button
                         key={s.name}
                         onClick={() => setSoluteIdx(idx)}
                         className={`p-3 rounded-2xl border-4 transition-all text-center
                           ${soluteIdx === idx ? 'bg-amber-50 border-amber-400 scale-105 shadow-md' : 'bg-white border-slate-100 grayscale hover:grayscale-0'}
                         `}
                       >
                          <div className={`w-8 h-8 rounded-full ${s.color} mx-auto mb-2 border-2 border-slate-200`} />
                          <span className="text-[8px] font-black text-slate-900 uppercase">{s.name.split(' (')[0]}</span>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Sliders */}
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-amber-500">
                       <span>Temperature</span>
                       <span className="text-gray-900">{temp}°C</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={temp}
                      onChange={(e) => setTemp(Number(e.target.value))}
                      className="w-full h-4 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-500"
                    />
                 </div>
                 <div className="space-y-4 text-center">
                    <Button 
                      onClick={() => setAddedMass(prev => prev + 10)}
                      className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                       Add 10g {solute.name.split(' (')[0]}
                    </Button>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                       Total Added: {addedMass}g
                    </div>
                 </div>
              </div>

              {/* Saturation Display */}
              <div className="pt-8 border-t-2 border-amber-50">
                 <div className={`p-6 rounded-3xl text-center space-y-2 border-4 transition-all
                    ${saturationState === 'SATURATED' ? 'bg-red-50 border-red-200 text-red-600' : 
                      saturationState === 'UNSATURATED' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-400'}
                 `}>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Solution State</p>
                    <p className="text-2xl font-black tracking-tighter uppercase italic">{saturationState}</p>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-blue-50/50 rounded-[32px] border-2 border-blue-100 flex items-start space-x-3">
              <Info className="text-blue-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
                 Most solids dissolve better at <b>higher temperatures</b>. Increase the heat to dissolve more solute into the same volume.
              </p>
           </div>
        </div>

        {/* Visual Lab Area */}
        <div className="lg:col-span-8 bg-gradient-to-br from-slate-50 to-amber-50 rounded-[80px] border-8 border-white shadow-inner relative flex flex-col items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none z-10" />

           {/* Beaker Representation */}
           <div className="relative w-[350px] h-[450px] bg-white/20 rounded-b-[40px] border-x-8 border-b-8 border-white shadow-2xl flex flex-col justify-end overflow-hidden">
              
              {/* Dissolved Solute Visualization (Cloudy/Color change) */}
              <motion.div 
                animate={{ 
                   height: '90%',
                   backgroundColor: saturationState === 'SATURATED' ? '#fef3c7' : '#f8fafc'
                }}
                className="w-full relative origin-bottom transition-colors duration-1000"
              >
                 {/* Moving Particles */}
                 {Array.from({ length: Math.floor(dissolvedMass / 5) }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        x: [Math.random() * 300, Math.random() * 300],
                        y: [Math.random() * 300, Math.random() * 300],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
                      className={`absolute w-3 h-3 rounded-full blur-[2px] ${solute.color}`}
                    />
                 ))}

                 {/* Temperature Heat Waves */}
                 {temp > 50 && (
                   <div className="absolute inset-0 flex justify-around opacity-20">
                      {Array.from({ length: 10 }).map((_, i) => (
                         <motion.div 
                           key={i}
                           animate={{ y: [0, -400], opacity: [0, 1, 0] }}
                           transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                           className="w-1 h-20 bg-orange-400 rounded-full blur-md"
                         />
                      ))}
                   </div>
                 )}
              </motion.div>

              {/* Undissolved Solute (Settled at bottom) */}
              <AnimatePresence>
                 {undissolvedMass > 0 && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(undissolvedMass, 100)}%` }}
                      className={`absolute bottom-0 inset-x-0 ${solute.color} border-t-4 border-white shadow-inner z-20 overflow-hidden flex flex-wrap p-2`}
                    >
                       {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-white/30 rounded-full m-1 blur-[1px]" />
                       ))}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Feedback Stats */}
           <div className="relative mt-12 grid grid-cols-2 gap-8 w-full max-w-lg">
              <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border-2 border-white shadow-lg text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Concentration</p>
                 <p className="text-xl font-black text-slate-800 tracking-tighter italic">{(dissolvedMass / 100).toFixed(2)} g/mL</p>
              </div>
              <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border-2 border-white shadow-lg text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Limit @ {temp}°C</p>
                <p className="text-xl font-black text-amber-600 tracking-tighter italic">{currentSolubility.toFixed(0)} g/100mL</p>
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-amber-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <FlaskConical size={100} className="mb-8 animate-pulse text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Saturation Achieved!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic">You have successfully manipulated the temperature to reach a state of dynamic equilibrium at high heat. Perfect saturation.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Reset Beaker
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-amber-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Vapour Pressure <ArrowRight size={24} className="ml-3" />
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
