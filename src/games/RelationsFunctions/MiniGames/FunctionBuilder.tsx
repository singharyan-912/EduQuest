import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightLeft, 
  RotateCcw, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Zap,
  MoveRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Mapping {
  from: string;
  to: string;
}

interface FunctionBuilderProps {
  onComplete: () => void;
}

const DOMAIN = ['A', 'B', 'C'];
const CODOMAIN = ['1', '2', '3'];

export function FunctionBuilder({ onComplete }: FunctionBuilderProps) {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [goal, setGoal] = useState<'ONE-ONE' | 'ONTO'>('ONE-ONE');

  // Logic checks
  const isFunction = DOMAIN.every(d => mappings.filter(m => m.from === d).length === 1);
  
  const isOneOne = isFunction && new Set(mappings.map(m => m.to)).size === mappings.length;
  
  const isOnto = isFunction && CODOMAIN.every(c => mappings.some(m => m.to === c));

  useEffect(() => {
    if (goal === 'ONE-ONE' && isOneOne) {
      setTimeout(() => setGoal('ONTO'), 1500);
    } else if (goal === 'ONTO' && isOnto && isOneOne) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  }, [mappings, goal, isOneOne, isOnto]);

  const toggleMapping = (from: string, to: string) => {
    // A function must only have ONE-to-ONE/MANY mapping from domain. 
    // We'll enforce this by replacing the mapping if it already exists for that domain element.
    const filtered = mappings.filter(m => m.from !== from);
    setMappings([...filtered, { from, to }]);
  };

  const resetGame = () => {
    setMappings([]);
    setGoal('ONE-ONE');
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Logic Board */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-emerald-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <ArrowRightLeft className="mr-2 text-emerald-500" /> Mapping Lab
                 </h3>
                 <div className="px-5 py-2 bg-emerald-600 text-white rounded-2xl font-black text-xs">X → Y</div>
              </div>

              {/* Goal Area */}
              <div className="p-6 bg-slate-900 rounded-3xl space-y-4 border-2 border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={48} className="text-emerald-400" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">Objective</p>
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    Construct <span className="text-emerald-400">{goal}</span> Mapping
                 </h2>
              </div>

              {/* Live Logic Check */}
              <div className="space-y-4">
                 <div className={`p-5 rounded-3xl border-4 transition-all flex items-center justify-between
                   ${isFunction ? 'bg-blue-50 border-blue-200' : 'bg-rose-50 border-rose-100'}
                 `}>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">Valid Function?</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Every x has exactly one y</p>
                    </div>
                    {isFunction ? <CheckCircle2 className="text-blue-500" /> : <AlertCircle className="text-rose-500 animate-pulse" />}
                 </div>

                 <div className={`p-5 rounded-3xl border-4 transition-all flex items-center justify-between
                   ${isOneOne ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 opacity-60'}
                 `}>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">One-One (Injective)</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Distinct x → Distinct y</p>
                    </div>
                    {isOneOne ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-slate-300" />}
                 </div>

                 <div className={`p-5 rounded-3xl border-4 transition-all flex items-center justify-between
                   ${isOnto ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-100 opacity-60'}
                 `}>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">Onto (Surjective)</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Range = Codomain</p>
                    </div>
                    {isOnto ? <CheckCircle2 className="text-teal-500" /> : <AlertCircle className="text-slate-300" />}
                 </div>
              </div>
           </Card>

           <div className="p-6 bg-emerald-50/50 rounded-[32px] border-2 border-emerald-100 flex items-start space-x-3">
              <Info className="text-emerald-600 shrink-0 mt-1" size={18} />
              <p className="text-xs font-bold text-emerald-800 leading-relaxed italic">
                 A function that is both <b>One-One</b> and <b>Onto</b> is called a <b>Bijective Function</b>. This allows it to have an inverse!
              </p>
           </div>
        </div>

        {/* Visual Mapping View */}
        <div className="lg:col-span-8 bg-white rounded-[80px] border-8 border-emerald-50 shadow-inner relative flex flex-col items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] pointer-events-none" />

           <div className="relative w-full flex justify-between items-center max-w-2xl">
              
              {/* Domain Set */}
              <div className="space-y-12">
                 <div className="text-center">
                    <span className="px-6 py-2 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl">Domain (X)</span>
                 </div>
                 <div className="space-y-8">
                    {DOMAIN.map(item => (
                       <motion.div 
                         key={item}
                         className="w-24 h-24 rounded-full border-4 border-slate-100 bg-white flex items-center justify-center text-4xl font-black text-slate-400 shadow-inner relative group cursor-pointer hover:border-emerald-400 transition-all"
                       >
                          {item}
                          {mappings.find(m => m.from === item) && (
                             <motion.div layoutId={`dot-${item}`} className="absolute -right-3 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg" />
                          )}
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* Interaction Canvas (Arrows) */}
              <div className="flex-1 px-12 relative flex flex-col justify-center gap-8">
                 {DOMAIN.map(from => (
                    <div key={from} className="flex flex-col gap-2">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{from} maps to...</span>
                       <div className="flex gap-2">
                          {CODOMAIN.map(to => (
                             <button
                               key={`${from}-${to}`}
                               onClick={() => toggleMapping(from, to)}
                               className={`px-4 py-2 rounded-xl border-2 font-black transition-all
                                 ${mappings.find(m => m.from === from && m.to === to) 
                                   ? 'bg-emerald-600 border-emerald-700 text-white scale-110 shadow-lg' 
                                   : 'bg-white border-slate-100 text-slate-200 hover:border-emerald-200'}
                               `}
                             >
                                {to}
                             </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>

              {/* Codomain Set */}
              <div className="space-y-12">
                 <div className="text-center">
                    <span className="px-6 py-2 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-xl">Codomain (Y)</span>
                 </div>
                 <div className="space-y-8">
                    {CODOMAIN.map(item => {
                       const mappedCount = mappings.filter(m => m.to === item).length;
                       return (
                          <motion.div 
                            key={item}
                            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-black transition-all shadow-inner relative
                              ${mappedCount > 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-100 text-slate-200'}
                            `}
                          >
                             {item}
                             {mappedCount > 1 && (
                                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center border-4 border-white shadow-lg">
                                   {mappedCount}
                                </span>
                             )}
                             {mappedCount > 0 && (
                                <motion.div layoutId={`dot-to-${item}`} className="absolute -left-3 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg" />
                             )}
                          </motion.div>
                       );
                    })}
                 </div>
              </div>
           </div>

           {/* Feedback Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-emerald-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <MoveRight size={100} className="mb-8 animate-pulse text-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                   <h2 className="text-7xl font-black uppercase italic tracking-tighter mb-4">Function Locked!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic leading-relaxed">You have successfully mastered the art of mapping elements between sets. Injective and Surjective logic complete.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Clear Mappings
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-emerald-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Enter the Composition Lab <ArrowRight size={24} className="ml-3" />
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
