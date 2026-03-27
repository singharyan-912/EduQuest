import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings2, 
  ArrowRight,
  Zap,
  Cpu,
  ArrowDown
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface FunctionMachineProps {
  onComplete: () => void;
}

const FUNCTIONS = [
  { id: 'f1', label: 'f(x) = 2x', fn: (x: number) => 2 * x, color: 'text-blue-500' },
  { id: 'f2', label: 'f(x) = x + 3', fn: (x: number) => x + 3, color: 'text-blue-500' },
  { id: 'g1', label: 'g(x) = x²', fn: (x: number) => x * x, color: 'text-orange-500' },
  { id: 'g2', label: 'g(x) = x - 5', fn: (x: number) => x - 5, color: 'text-orange-500' },
];

export function FunctionMachine({ onComplete }: FunctionMachineProps) {
  const [inputVal, setInputVal] = useState<number>(2);
  const [selectedF, setSelectedF] = useState(FUNCTIONS[0]);
  const [selectedG, setSelectedG] = useState(FUNCTIONS[2]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: Start, 1: After F, 2: After G (Result)
  const [history, setHistory] = useState<{f: string, g: string, input: number, output: number}[]>([]);

  const midVal = selectedF.fn(inputVal);
  const finalVal = selectedG.fn(midVal);

  const startProcessing = () => {
    setIsProcessing(true);
    setStep(0);
    
    setTimeout(() => setStep(1), 1500);
    setTimeout(() => {
      setStep(2);
      setIsProcessing(false);
      const newEntry = { f: selectedF.label, g: selectedG.label, input: inputVal, output: finalVal };
      setHistory(prev => [newEntry, ...prev].slice(0, 3));
      
      if (history.length >= 2) {
        // Condition for completion: Experimented with 3 combinations
        // onComplete();
      }
    }, 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Machine Configuration */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[48px] border-4 border-orange-50 bg-white shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter flex items-center">
                    <Settings2 className="mr-2 text-orange-500" /> Machine Config
                 </h3>
                 <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">v1.2-COMP</div>
              </div>

              {/* Input Selector */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Step 1: Raw Input (x)</p>
                 <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                       <button
                         key={v}
                         onClick={() => setInputVal(v)}
                         disabled={isProcessing}
                         className={`w-12 h-12 rounded-2xl border-4 font-black transition-all
                           ${inputVal === v ? 'bg-slate-900 border-slate-700 text-white scale-110' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200'}
                         `}
                       >
                          {v}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Function Choice f(x) */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Step 2: Primary Machine (f)</p>
                 <div className="grid grid-cols-1 gap-2">
                    {FUNCTIONS.filter(f => f.id.startsWith('f')).map(f => (
                       <button
                         key={f.id}
                         onClick={() => setSelectedF(f)}
                         disabled={isProcessing}
                         className={`p-4 rounded-3xl border-4 font-black text-left transition-all flex items-center justify-between
                           ${selectedF.id === f.id ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-100'}
                         `}
                       >
                          <span className="italic">{f.label}</span>
                          {selectedF.id === f.id && <Zap size={16} />}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Function Choice g(x) */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Step 3: Secondary Machine (g)</p>
                 <div className="grid grid-cols-1 gap-2">
                    {FUNCTIONS.filter(f => f.id.startsWith('g')).map(f => (
                       <button
                         key={f.id}
                         onClick={() => setSelectedG(f)}
                         disabled={isProcessing}
                         className={`p-4 rounded-3xl border-4 font-black text-left transition-all flex items-center justify-between
                           ${selectedG.id === f.id ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 text-slate-400 hover:border-orange-100'}
                         `}
                       >
                          <span className="italic">{f.label}</span>
                          {selectedG.id === f.id && <Zap size={16} />}
                       </button>
                    ))}
                 </div>
              </div>

              <Button 
                onClick={startProcessing}
                disabled={isProcessing}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-[32px] text-lg uppercase italic tracking-tighter hover:scale-105 transition-transform"
              >
                 {isProcessing ? 'Processing...' : 'Run Composition (g ∘ f)'}
              </Button>
           </Card>

           {/* History/Logs */}
           <Card className="p-6 rounded-[32px] border-4 border-slate-100 bg-white/50 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Composition Logs</p>
              {history.map((h, i) => (
                 <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-100 pb-2 last:border-0 italic">
                    <span>g(f({h.input}))</span>
                    <ArrowRight size={12} className="text-slate-300" />
                    <span className="font-black text-slate-900">{h.output}</span>
                 </div>
              ))}
              {history.length >= 3 && (
                <Button onClick={onComplete} className="w-full bg-emerald-500 text-white font-black py-3 rounded-2xl text-xs uppercase italic tracking-widest hover:bg-emerald-600 transition-colors">
                   Finalize Experiment
                </Button>
              )}
           </Card>
        </div>

        {/* Visual Factory View */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded-[80px] border-8 border-slate-800 shadow-3xl relative flex flex-col items-center justify-center p-12 overflow-hidden min-h-[700px]">
           
           <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
           <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />

           {/* Factory Grid Overlay */}
           <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

           {/* The Pipe Flow */}
           <div className="relative w-full max-w-md space-y-12 flex flex-col items-center">
              
              {/* Input Hopper */}
              <div className="relative z-10">
                 <motion.div 
                   animate={isProcessing && step === 0 ? { y: 20, opacity: 0 } : { y: 0, opacity: 1 }}
                   className="w-24 h-24 rounded-[32px] bg-slate-800 border-4 border-slate-700 flex flex-col items-center justify-center shadow-2xl"
                 >
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Input x</span>
                    <span className="text-4xl font-black text-white italic tracking-tighter">{inputVal}</span>
                 </motion.div>
                 <ArrowDown className="mx-auto text-slate-700 mt-4 animate-bounce" size={32} />
              </div>

              {/* Machine F */}
              <motion.div 
                animate={isProcessing && step === 1 ? { scale: 1.05, borderColor: '#3B82F6' } : { scale: 1, borderColor: '#334155' }}
                className="w-full bg-slate-800 border-8 border-slate-700 rounded-[48px] p-8 relative overflow-hidden shadow-2xl transition-all duration-500"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cpu size={80} className="text-blue-400" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center text-blue-400 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]`}>
                       <Settings2 size={40} className={isProcessing && step === 1 ? 'animate-spin' : ''} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Core Processor F</p>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter">{selectedF.label}</h3>
                    </div>
                 </div>

                 {/* Internal Value Animation */}
                 <AnimatePresence>
                    {isProcessing && step === 1 && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-5xl font-black text-blue-500 italic drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      >
                         {midVal}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>

              <ArrowDown className={`mx-auto transition-colors duration-500 ${step >= 1 ? 'text-blue-500' : 'text-slate-700'}`} size={32} />

              {/* Machine G */}
              <motion.div 
                animate={isProcessing && step === 2 ? { scale: 1.05, borderColor: '#F97316' } : { scale: 1, borderColor: '#334155' }}
                className="w-full bg-slate-800 border-8 border-slate-700 rounded-[48px] p-8 relative overflow-hidden shadow-2xl transition-all duration-500"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Cpu size={80} className="text-orange-400" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl bg-orange-500/20 flex items-center justify-center text-orange-400 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]`}>
                       <Settings2 size={40} className={isProcessing && step === 2 ? 'animate-spin' : ''} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest italic">Power Core G</p>
                       <h3 className="text-3xl font-black text-white italic tracking-tighter">{selectedG.label}</h3>
                    </div>
                 </div>

                 {/* Internal Value Animation */}
                 <AnimatePresence>
                    {isProcessing && step === 2 && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-5xl font-black text-orange-500 italic drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                      >
                         {finalVal}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>

              {/* Output Collection */}
              <div className="w-full flex justify-center">
                 <motion.div 
                   animate={step === 2 && !isProcessing ? { scale: 1.2, backgroundColor: '#0ea5e9' } : { scale: 1, backgroundColor: '#1e293b' }}
                   className="px-12 py-6 rounded-3xl bg-slate-800 border-4 border-slate-700 flex flex-col items-center shadow-2xl transition-all duration-500 min-w-[200px]"
                 >
                    <span className={`text-[10px] font-black uppercase tracking-widest italic mb-2 ${step === 2 && !isProcessing ? 'text-white' : 'text-slate-500'}`}>Final Result Y</span>
                    <span className="text-5xl font-black text-white italic tracking-tighter">
                       {step === 2 && !isProcessing ? finalVal : '?'}
                    </span>
                 </motion.div>
              </div>
           </div>

           {/* Feedback Decoration */}
           <div className="absolute bottom-12 left-12 space-y-2 opacity-30">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" /> <span className="text-white text-[8px] font-black uppercase italic tracking-widest">Processing Layer 01</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse delay-150" /> <span className="text-white text-[8px] font-black uppercase italic tracking-widest">Mapping Logic Sync</span></div>
           </div>
        </div>
      </div>
    </div>
  );
}
