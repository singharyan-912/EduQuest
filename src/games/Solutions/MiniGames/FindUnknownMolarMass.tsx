import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight,
  Info,
  Search,
  FlaskConical
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface MysterySolute {
  id: string;
  name: string;
  molarMass: number;
}

const MYSTERY_SOLUTES: MysterySolute[] = [
  { id: 'A', name: 'Urea', molarMass: 60 },
  { id: 'B', name: 'Glucose', molarMass: 180 },
  { id: 'C', name: 'Sucrose', molarMass: 342 }
];

interface FindUnknownMolarMassProps {
  onComplete: () => void;
}

export function FindUnknownMolarMass({ onComplete }: FindUnknownMolarMassProps) {
  const [targetSolute] = useState(() => MYSTERY_SOLUTES[Math.floor(Math.random() * MYSTERY_SOLUTES.length)]);
  const [guessMass, setGuessMass] = useState(100);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scenario: 10g of unknown in 100g water (Kb = 0.52)
  const soluteWeight = 10;
  const solventWeight = 0.1; // kg
  const Kb = 0.52;
  
  // Observed Delta Tb (Truth)
  const observedDeltaTb = Kb * (soluteWeight / targetSolute.molarMass) / solventWeight;
  
  // Player's Simulated Delta Tb based on guess
  const simulatedDeltaTb = Kb * (soluteWeight / guessMass) / solventWeight;

  const isMatched = Math.abs(simulatedDeltaTb - observedDeltaTb) < 0.01;

  useEffect(() => {
    if (isMatched) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [isMatched]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Lab Problem Area */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-violet-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Search className="mr-2 text-violet-500" /> Scenario Analysis
                 </h3>
                 <div className="px-5 py-2 bg-violet-600 text-white rounded-2xl font-black text-xs">Mystery Solute</div>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl space-y-4 border-2 border-white/10">
                 <div className="flex justify-between items-center text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Solute Mass</span>
                    <span className="font-black">10.00 g</span>
                 </div>
                 <div className="flex justify-between items-center text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-400">Solvent (H2O)</span>
                    <span className="font-black">100.00 g</span>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 italic">Observed ΔTb</span>
                    <span className="text-2xl font-black text-cyan-400 tracking-tighter">{observedDeltaTb.toFixed(3)}°C</span>
                 </div>
              </div>

              {/* Slider for Molar Mass Adjustment */}
              <div className="space-y-6 pt-4">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-violet-500">
                    <span>Estimate Molar Mass (M)</span>
                    <span className="text-gray-900">{guessMass} g/mol</span>
                 </div>
                 <input 
                   type="range" min="30" max="400" step="1" value={guessMass}
                   onChange={(e) => setGuessMass(Number(e.target.value))}
                   className="w-full h-4 bg-violet-100 rounded-full appearance-none cursor-pointer accent-violet-500"
                 />
                 <div className="flex justify-between text-[8px] font-black text-slate-300">
                    <span>30</span>
                    <span>400</span>
                 </div>
              </div>

              <div className="bg-violet-50 p-6 rounded-3xl text-center space-y-1 border-2 border-violet-100">
                 <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Predicted ΔTb</p>
                 <p className={`text-4xl font-black ${isMatched ? 'text-green-600' : 'text-violet-600'}`}>{simulatedDeltaTb.toFixed(3)}°C</p>
              </div>
           </Card>

           <div className="p-6 bg-blue-50/50 rounded-[32px] border-2 border-blue-100 flex items-start space-x-3">
              <Info className="text-blue-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
                 The <b>Molar Mass</b> is inversely proportional to the elevation in boiling point. Adjust the mass until your prediction matches the laboratory observation.
              </p>
           </div>
        </div>

        {/* Visual Lab Solver */}
        <div className="lg:col-span-8 bg-slate-50 rounded-[80px] border-8 border-white shadow-inner relative flex flex-col items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none" />

           {/* Analytical Balance View */}
           <div className="relative w-full max-w-lg bg-white p-12 rounded-[56px] border-4 border-slate-100 shadow-2xl space-y-8">
              <div className="flex items-center justify-center gap-12">
                 <div className="w-32 h-32 bg-violet-100 rounded-3xl flex items-center justify-center text-violet-600 relative overflow-hidden">
                    <FlaskConical size={64} className="relative z-10" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-violet-200/50 scale-150 transform origin-center" />
                 </div>
                 <div className="text-center space-y-2">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Analytical Identity</div>
                    <h2 className={`text-5xl font-black tracking-tighter uppercase transition-colors ${isMatched ? 'text-green-600' : 'text-slate-900 animate-pulse'}`}>
                       {isMatched ? targetSolute.name : 'Unknown'}
                    </h2>
                    <div className="text-sm font-bold text-slate-400">Sample Code: #SOL-8821</div>
                 </div>
              </div>

              <div className="pt-8 border-t-2 border-slate-50 grid grid-cols-2 gap-8">
                 <div className="text-center p-6 bg-slate-50 rounded-3xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Error Margin</div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter">
                       ±{Math.abs(simulatedDeltaTb - observedDeltaTb).toFixed(4)}
                    </div>
                 </div>
                 <div className="text-center p-6 bg-slate-50 rounded-3xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Solubility Code</div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter italic">CH-SOL-M</div>
                 </div>
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-violet-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Search size={100} className="mb-8 animate-bounce text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Identity Discovered!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">By aligning the theoretical colligative data with observed shifts, you have successfully identified the unknown molecule as <b>{targetSolute.name}</b>.</p>
                   <div className="flex space-x-4">
                      <Button onClick={() => window.location.reload()} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> New Mystery
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-violet-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Explore Van't Hoff Factor <ArrowRight size={24} className="ml-3" />
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
