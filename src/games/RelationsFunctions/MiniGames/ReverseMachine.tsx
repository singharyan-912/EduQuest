import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  CheckCircle2, 
  Zap,
  Activity,
  ArrowLeftRight,
  MoveLeft,
  MoveRight,
  Info
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Mapping {
  from: string;
  to: string;
}

interface ReverseMachineProps {
  onComplete: () => void;
}

const X_SET = ['A', 'B', 'C'];
const Y_SET = ['1', '2', '3'];

export function ReverseMachine({ onComplete }: ReverseMachineProps) {
  const [isInverted, setIsInverted] = useState(false);
  const mappings = [
    { from: 'A', to: '1' },
    { from: 'B', to: '2' },
    { from: 'C', to: '3' }
  ];

  const toggleOrder = () => {
    setIsInverted(!isInverted);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Inversion Control */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-purple-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <RefreshCw className={`mr-2 text-purple-500 ${isInverted ? 'animate-spin' : ''}`} /> Logic Inverter
                 </h3>
                 <div className="px-4 py-2 bg-purple-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">f⁻¹(y) = x</div>
              </div>

              {/* Status Area */}
              <div className="p-6 bg-slate-900 rounded-3xl space-y-4 border-2 border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={48} className="text-purple-400" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 italic">Current State</p>
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    {isInverted ? 'Inverse Mapping' : 'Forward Mapping'}
                 </h2>
              </div>

              {/* Toggle Mechanism */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Reality Warp Toggle</p>
                 <button 
                   onClick={toggleOrder}
                   className={`w-full p-8 rounded-[32px] border-4 transition-all duration-500 flex flex-col items-center justify-center gap-4
                     ${isInverted ? 'bg-purple-600 border-purple-700 shadow-[0_0_40px_rgba(147,51,234,0.3)]' : 'bg-white border-slate-100 shadow-xl'}
                   `}
                 >
                    <div className={`p-4 rounded-full ${isInverted ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600 animate-pulse'}`}>
                       <ArrowLeftRight size={32} />
                    </div>
                    <span className={`text-xl font-black uppercase italic tracking-tighter ${isInverted ? 'text-white' : 'text-slate-900'}`}>
                       {isInverted ? 'Return to Forward' : 'Activate Inverse'}
                    </span>
                 </button>
              </div>

              {/* Completion Logic */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <CheckCircle2 size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 italic">Function is Bijective (Required for Inverse)</span>
                 </div>
                 <Button 
                   onClick={onComplete}
                   className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl text-xs uppercase italic tracking-widest hover:scale-105 transition-all shadow-lg"
                 >
                    Finalize Module Learning
                 </Button>
              </div>
           </Card>

           <div className="p-6 bg-purple-50/50 rounded-[32px] border-2 border-purple-100 flex items-start space-x-3">
              <Info className="text-purple-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-purple-800 leading-relaxed italic">
                 <b>Inverse Check</b>: For a function to have an inverse, it must be 1-to-1 (distinct values) AND Onto (no leftover values). Flip to see how the arrows reverse!
              </p>
           </div>
        </div>

        {/* Visual Inverse View */}
        <div className="lg:col-span-8 bg-[#FDFCFE] rounded-[80px] border-8 border-purple-50 shadow-inner relative flex flex-col items-center justify-center p-12 overflow-hidden min-h-[700px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(147,51,234,0.03)_100%)] pointer-events-none" />

           {/* Mirror Effect Center Line */}
           <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-gradient-to-b from-transparent via-purple-200 to-transparent opacity-50" />

           <div className="relative w-full flex justify-between items-center max-w-2xl h-[400px]">
              
              {/* Set X (LHS) */}
              <motion.div 
                animate={isInverted ? { x: 400, opacity: 0.5 } : { x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="space-y-12 relative z-10"
              >
                 <div className="text-center">
                    <span className="px-6 py-2 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl">Set X</span>
                 </div>
                 <div className="space-y-8">
                    {X_SET.map(item => (
                       <div 
                         key={item}
                         className="w-24 h-24 rounded-full border-4 border-slate-100 bg-white flex items-center justify-center text-4xl font-black text-slate-400 shadow-xl"
                       >
                          {item}
                       </div>
                    ))}
                 </div>
              </motion.div>

              {/* The Reversing Arrows Container */}
              <div className="flex-1 flex flex-col justify-center items-center h-full relative">
                 <AnimatePresence mode="wait">
                    {isInverted ? (
                      <motion.div 
                        key="inverse"
                        initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                        className="space-y-16"
                      >
                         <MoveLeft size={80} className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                         <MoveLeft size={80} className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-delay-100" />
                         <MoveLeft size={80} className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-delay-200" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="forward"
                        initial={{ opacity: 0, rotate: 180, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -180, scale: 0.5 }}
                        className="space-y-16"
                      >
                         <MoveRight size={80} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                         <MoveRight size={80} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                         <MoveRight size={80} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Set Y (RHS) */}
              <motion.div 
                animate={isInverted ? { x: -400, opacity: 1 } : { x: 0, opacity: 0.5 }}
                transition={{ type: "spring", damping: 15 }}
                className="space-y-12 relative z-10"
              >
                 <div className="text-center">
                    <span className={`px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl transition-colors duration-500
                      ${isInverted ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white opacity-50'}
                    `}>Set Y</span>
                 </div>
                 <div className="space-y-8">
                    {Y_SET.map(item => (
                       <div 
                         key={item}
                         className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-black shadow-xl transition-all duration-500
                           ${isInverted ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-slate-100 text-slate-200'}
                         `}
                       >
                          {item}
                       </div>
                    ))}
                 </div>
              </motion.div>

           </div>

           {/* Mathematical Formula Overlay */}
           <div className="mt-20 p-8 bg-slate-900 rounded-[32px] border-4 border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 bg-white rounded-full scale-150 rotate-12 transition-transform group-hover:rotate-45" />
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl">
                    <Activity size={32} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest italic">Inversion Theorem</p>
                    <h4 className="text-3xl font-black text-white italic tracking-tighter">
                       If f: X → Y is Bijective, then f⁻¹: Y → X exists.
                    </h4>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
