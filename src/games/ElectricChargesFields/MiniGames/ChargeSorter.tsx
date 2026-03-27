import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Charge } from '../PhysicsEngine';
import { CheckCircle2, Zap } from 'lucide-react';

interface ChargeSorterProps {
  onComplete: (score: number) => void;
}

export function ChargeSorter({ onComplete }: ChargeSorterProps) {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalToSolve = 10;
  
  const generateRandomCharge = (): Charge => {
    const type = Math.random() > 0.5 ? 'positive' : 'negative';
    return {
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      value: type === 'positive' ? 1 : -1,
      type
    };
  };

  useEffect(() => {
    if (charges.length === 0 && solvedCount < totalToSolve) {
      setCharges([generateRandomCharge()]);
    }
  }, [solvedCount, charges.length]);

  const handleDragEnd = (_event: any, info: any, chargeId: number) => {
    const charge = charges[chargeId];
    const finalPos = { x: charge.x + info.offset.x, y: charge.y + info.offset.y };
    
    // Zones: Positive (Left/Red), Negative (Right/Blue)
    const isPosZone = finalPos.x < 250;
    const isNegZone = finalPos.x > 550;

    if ((charge.type === 'positive' && isPosZone) || (charge.type === 'negative' && isNegZone)) {
      setSolvedCount(prev => prev + 1);
      setCharges([]);
      if (solvedCount + 1 >= totalToSolve) {
        setIsFinished(true);
        setTimeout(() => onComplete(100), 2000);
      }
    } else {
      // Snap back or animation
      setCharges([{ ...charge, x: 400, y: 300 }]); 
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-gray-900 rounded-[40px] overflow-hidden border-8 border-gray-800 shadow-3xl">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Target Zones */}
      <div className="absolute left-0 top-0 bottom-0 w-[200px] bg-red-500/10 border-r-4 border-red-500/30 flex items-center justify-center">
        <div className="text-center">
           <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-red-500/40 mb-4 animate-pulse">+</div>
           <span className="text-red-400 font-black uppercase tracking-widest text-xs">Positive Zone</span>
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-[200px] bg-blue-500/10 border-l-4 border-blue-500/30 flex items-center justify-center">
        <div className="text-center">
           <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-blue-500/40 mb-4 animate-pulse">-</div>
           <span className="text-blue-400 font-black uppercase tracking-widest text-xs">Negative Zone</span>
        </div>
      </div>

      {/* Level Info */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center space-x-8 bg-black/40 backdrop-blur-xl px-12 py-4 rounded-3xl border border-white/10 z-20">
        <div className="text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stability</div>
            <div className="text-2xl font-black text-indigo-400">{Math.round((solvedCount/totalToSolve)*100)}%</div>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Captured</div>
            <div className="text-2xl font-black text-white">{solvedCount} / {totalToSolve}</div>
        </div>
      </div>

      {/* Charges */}
      {charges.map((charge, idx) => (
        <motion.div
          key={`${charge.type}-${solvedCount}`}
          drag
          dragConstraints={containerRef}
          onDragEnd={(e, info) => handleDragEnd(e, info, idx)}
          initial={{ x: charge.x, y: charge.y, scale: 0 }}
          animate={{ scale: 1 }}
          whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
          className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-2xl cursor-grab z-10
            ${charge.type === 'positive' ? 'bg-red-500 shadow-red-500/50' : 'bg-blue-500 shadow-blue-500/50'}
          `}
        >
          {charge.type === 'positive' ? '+' : '-'}
          {/* Attraction/Repulsion Particles */}
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute inset-0 rounded-full border-4 ${charge.type === 'positive' ? 'border-red-400' : 'border-blue-400'}`}
          />
        </motion.div>
      ))}

      {isFinished && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-3xl shadow-green-500/50">
            <CheckCircle2 size={80} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Equilibrium Reached!</h2>
          <p className="text-xl text-gray-400 font-bold mb-12">Total Mastery: Charge Sorting Protocol Complete</p>
          <div className="flex items-center space-x-4">
             <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
                <span className="text-2xl font-black text-yellow-400">+50 XP</span>
             </div>
             <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">Badge</span>
                <span className="text-2xl font-black text-indigo-400 italic">Charge Master</span>
             </div>
          </div>
        </motion.div>
      )}

      {/* Smart Guidance Hint */}
      {solvedCount === 0 && !isFinished && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 3 }}
           className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-yellow-400/20 border border-yellow-400/40 px-8 py-4 rounded-2xl"
        >
           <Zap className="text-yellow-400 animate-bounce" size={24} />
           <p className="text-white text-sm font-bold uppercase tracking-widest">Hint: Drag Positive (+) to the Red Zone</p>
        </motion.div>
      )}
    </div>
  );
}
