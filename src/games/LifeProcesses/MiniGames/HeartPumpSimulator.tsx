import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  RotateCcw, 
  ChevronRight,
  Activity,
  Zap,
  Volume2,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface HeartPumpSimulatorProps {
  onComplete: () => void;
}

export function HeartPumpSimulator({ onComplete }: HeartPumpSimulatorProps) {
  const [bpm, setBpm] = useState(0);
  const [pumping, setPumping] = useState(false);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastClick, setLastClick] = useState(0);
  const [combo, setCombo] = useState(0);

  const handlePump = () => {
    if (isSuccess) return;
    
    const now = Date.now();
    const diff = lastClick ? now - lastClick : 800; // Expected ~75 BPM (~800ms)
    
    setPumping(true);
    setLastClick(now);

    // Calculate accuracy (Target 800ms for 75 BPM)
    const accuracy = Math.abs(diff - 800);
    
    if (accuracy < 150) {
      setScore(prev => prev + 10);
      setCombo(prev => prev + 1);
      setBpm(Math.floor(60000 / diff));
    } else {
      setCombo(0);
    }

    if (score >= 200) {
      setIsSuccess(true);
    }

    setTimeout(() => setPumping(false), 200);
  };

  const reset = () => {
    setBpm(0);
    setScore(0);
    setCombo(0);
    setIsSuccess(false);
    setLastClick(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ECG Dashboard */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 rounded-[40px] border-4 border-rose-100 bg-white shadow-xl flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Cardio-Graph</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Rhythm Diagnostic</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-slate-950 rounded-[32px] border-b-4 border-rose-500 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20">
                      <motion.div 
                        animate={{ x: [-400, 400] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-[400px] h-full border-r-2 border-emerald-500 shadow-[2px_0_10px_rgba(16,185,129,1)]"
                      />
                   </div>
                   <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 relative z-10">Current BPM</p>
                   <div className="flex items-end gap-2 relative z-10">
                      <span className="text-5xl font-black text-white italic tracking-tighter">{bpm || '--'}</span>
                      <span className="text-xs font-bold text-slate-500 mb-2">Steady</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Accuracy</p>
                      <p className="text-xl font-black text-slate-900 italic">{combo > 0 ? 'PRIME' : 'SYNCING'}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Combo</p>
                      <p className="text-xl font-black text-rose-500 italic">x{combo}</p>
                   </div>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100 flex items-start gap-3">
                   <AlertCircle className="text-rose-600 shrink-0 mt-1" size={18} />
                   <p className="text-[11px] font-bold text-rose-800 leading-relaxed italic">
                     Maintain a rhythm of ~72-80 BPM to ensure optimal circulation to all tissues.
                   </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button onClick={reset} variant="outline" className="w-full py-4 text-slate-400 border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest border-2">
                <RotateCcw size={16} className="mr-2 inline" /> Reset Pacer
              </Button>
            </div>
          </Card>
        </div>

        {/* Heart Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[650px] p-12">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#ef4444_1px,transparent_1px)] [background-size:60px_60px]" />

           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative w-full flex flex-col items-center gap-12">
                  {/* Progress Ring */}
                  <div className="relative w-80 h-80 flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="160" cy="160" r="140" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        <motion.circle 
                          cx="160" cy="160" r="140" fill="transparent" stroke="#ef4444" strokeWidth="12"
                          strokeDasharray="880"
                          animate={{ strokeDashoffset: 880 - (880 * (score / 200)) }}
                          transition={{ type: 'spring', damping: 20 }}
                        />
                     </svg>
                     
                     <motion.button
                       whileTap={{ scale: 0.9 }}
                       onClick={handlePump}
                       className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-300 shadow-3xl
                         ${pumping ? 'bg-rose-500 scale-105' : 'bg-rose-600 hover:scale-105'}
                       `}
                     >
                        <Heart 
                          size={120} 
                          className={`text-white transition-all ${pumping ? 'fill-white' : 'fill-transparent'}`} 
                        />
                        <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-ping" />
                        
                        {/* Chamber Labels */}
                        <div className="absolute -top-12 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Auricles</div>
                        <div className="absolute -bottom-12 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Ventricles</div>
                     </motion.button>
                  </div>

                  <div className="space-y-4 text-center">
                     <p className="text-xl font-black text-white italic tracking-tighter uppercase italic">
                        {score < 50 ? 'Initializing Valve Check' : score < 150 ? 'Steady Pulsation Detect' : 'Circulation Mastered'}
                     </p>
                     <div className="flex gap-4 justify-center">
                        <div className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                           <Zap size={12} className="text-yellow-400" /> V: 70ml/beat
                        </div>
                        <div className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                           <Volume2 size={12} className="text-rose-400" /> Lub-Dub Correct
                        </div>
                     </div>
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-rose-500 rounded-full flex items-center justify-center shadow-3xl">
                     <Trophy size={64} className="text-white animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                      CARDIAC <span className="text-rose-400">MASTERED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-xl">
                      Double circulation verified. All four chambers are working in perfect synchronization to maintain blood pressure.
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Avg. Rate</p>
                        <p className="text-2xl font-black">76 BPM</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[32px] border-2 border-white/10 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500">Saturation</p>
                        <p className="text-2xl font-black">100%</p>
                     </div>
                  </div>

                  <Button onClick={onComplete} className="px-16 py-6 bg-white text-slate-950 font-black rounded-[40px] text-xl shadow-2xl hover:scale-105 transition-transform flex items-center group">
                     Move to Plant Transport <ChevronRight size={28} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
