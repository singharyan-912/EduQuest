import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Info,
  Beaker,
  Zap,
  Trophy
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Solute {
  name: string;
  formula: string;
  molarMass: number;
  color: string;
}

const SOLUTES: Solute[] = [
  { name: 'Copper Sulfate', formula: 'CuSO4', molarMass: 159.6, color: 'bg-blue-500' },
  { name: 'Potassium Permanganate', formula: 'KMnO4', molarMass: 158.0, color: 'bg-purple-600' },
  { name: 'Sodium Chloride', formula: 'NaCl', molarMass: 58.4, color: 'bg-gray-100' }
];

interface ConcentrationMixerProps {
  onComplete: () => void;
}

export function ConcentrationMixer({ onComplete }: ConcentrationMixerProps) {
  const [soluteIdx, setSoluteIdx] = useState(0);
  const [soluteMass, setSoluteMass] = useState(10); // grams
  const [solventVolume, setSolventVolume] = useState(500); // mL
  const [isSuccess, setIsSuccess] = useState(false);

  const solute = SOLUTES[soluteIdx];
  const moles = soluteMass / solute.molarMass;
  const molarity = (moles / (solventVolume / 1000)).toFixed(2);
  const massPercent = ((soluteMass / (soluteMass + solventVolume)) * 100).toFixed(1);

  // Success condition: Match a target molarity
  const targetMolarity = 0.5;
  const currentMolarityVal = parseFloat(molarity);
  const isTargetMatched = Math.abs(currentMolarityVal - targetMolarity) < 0.05;

  useEffect(() => {
    if (isTargetMatched) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [isTargetMatched]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Lab Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-purple-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Zap className="mr-2 text-purple-500" /> Mixer Controls
                 </h3>
                 <div className="px-5 py-2 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Target: {targetMolarity} M</div>
              </div>

              {/* Solute Selection */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select Solute</p>
                 <div className="grid grid-cols-3 gap-3">
                    {SOLUTES.map((s, idx) => (
                       <button
                         key={s.formula}
                         onClick={() => setSoluteIdx(idx)}
                         className={`p-3 rounded-2xl border-4 transition-all text-center
                           ${soluteIdx === idx ? 'bg-purple-50 border-purple-400 scale-105 shadow-md' : 'bg-white border-slate-100 grayscale hover:grayscale-0'}
                         `}
                       >
                          <div className={`w-8 h-8 rounded-full ${s.color} mx-auto mb-2 shadow-inner`} />
                          <span className="text-[10px] font-black text-slate-900">{s.formula}</span>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Sliders */}
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-pink-400">
                       <span>Solute Mass</span>
                       <span className="text-gray-900">{soluteMass} g</span>
                    </div>
                    <input 
                      type="range" min="1" max="100" value={soluteMass}
                      onChange={(e) => setSoluteMass(Number(e.target.value))}
                      className="w-full h-4 bg-pink-100 rounded-full appearance-none cursor-pointer accent-pink-500"
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-400">
                       <span>Solvent Volume</span>
                       <span className="text-gray-900">{solventVolume} mL</span>
                    </div>
                    <input 
                      type="range" min="100" max="2000" step="50" value={solventVolume}
                      onChange={(e) => setSolventVolume(Number(e.target.value))}
                      className="w-full h-4 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>
              </div>

              {/* Real-time Math */}
              <div className="pt-8 border-t-2 border-purple-50 grid grid-cols-2 gap-4">
                 <div className="bg-purple-50 p-6 rounded-3xl text-center space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-purple-400">Molarity (M)</p>
                    <p className={`text-3xl font-black ${isTargetMatched ? 'text-green-600' : 'text-purple-600'}`}>{molarity}</p>
                 </div>
                 <div className="bg-blue-50 p-6 rounded-3xl text-center space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-400">Mass %</p>
                    <p className="text-3xl font-black text-blue-600">{massPercent}%</p>
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-amber-50/50 rounded-[32px] border-2 border-amber-100 flex items-start space-x-3">
              <Info className="text-amber-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-amber-800 leading-relaxed italic">
                 Adjust the sliders until the Molarity matches the <b>Standard Target</b>. Remember: Concentration depends on both amount and volume.
              </p>
           </div>
        </div>

        {/* Visual Lab View */}
        <div className="lg:col-span-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-[80px] border-8 border-white shadow-inner relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none z-10" />

           {/* Volumetric Flask Representation */}
           <div className="relative w-[300px] h-[500px] flex items-end justify-center">
              
              {/* Flask Neck */}
              <div className="absolute top-0 w-20 h-40 border-x-8 border-white bg-white/20 z-0" />
              
              {/* Flask Body */}
              <div className="relative w-full h-[360px] bg-white/30 rounded-[100%_100%_40%_40%] border-8 border-white shadow-2xl overflow-hidden flex flex-col justify-end">
                 {/* Liquid Level */}
                 <motion.div 
                    animate={{ height: `${(solventVolume / 2000) * 100}%` }}
                    className={`w-full transition-colors duration-1000 relative
                       ${solute.color} opacity-40
                    `}
                    style={{ opacity: 0.2 + (parseFloat(massPercent) / 50) }}
                 >
                    {/* Particles (Bubbles) */}
                    {Array.from({ length: Math.floor(parseFloat(massPercent) * 2) }).map((_, i) => (
                       <motion.div 
                         key={i}
                         initial={{ y: 200, x: Math.random() * 200 }}
                         animate={{ y: -400, opacity: [0, 1, 0] }}
                         transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                         className="absolute w-2 h-2 bg-white/40 rounded-full"
                       />
                    ))}

                    {/* Surface Wave */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-white/20 animate-pulse blur-sm" />
                 </motion.div>
              </div>

              {/* Label */}
              <div className="absolute -bottom-6 bg-slate-900 px-6 py-3 rounded-2xl shadow-xl z-20 flex items-center space-x-3 border-2 border-white/20">
                 <Beaker className="text-purple-400" size={20} />
                 <span className="text-white font-black uppercase tracking-[0.2em] text-xs font-mono">{solute.formula} SOLUTION</span>
              </div>
           </div>

           {/* Goal Feedback Marker */}
           <div className="absolute right-12 top-12 space-y-4">
              <div className="flex items-center space-x-3">
                 <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${isTargetMatched ? 'bg-green-500 border-white scale-125' : 'bg-white border-purple-200'}`}>
                    {isTargetMatched && <CheckCircle2 size={16} className="text-white" />}
                 </div>
                 <span className={`text-sm font-black uppercase italic ${isTargetMatched ? 'text-green-600' : 'text-slate-400'}`}>Target Synchronization</span>
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-purple-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Trophy size={100} className="mb-8 animate-bounce text-yellow-300 shadow-[0_0_50px_rgba(250,204,21,0.5)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Master Mixer!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic">You've successfully standardized the solution by matching the target molarity. Your volumetric precision is unmatched.</p>
                   <div className="flex space-x-4">
                      <Button onClick={() => setSoluteMass(10)} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Recalibrate
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-purple-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Solubility <ArrowRight size={24} className="ml-3" />
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
