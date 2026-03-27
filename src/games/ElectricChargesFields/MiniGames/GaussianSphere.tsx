import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhysicsEngine, Charge } from '../PhysicsEngine';
import { Button } from '../../../components/ui/Button';
import { Circle, Zap, CheckCircle2, Info } from 'lucide-react';

interface GaussianSphereProps {
  onComplete: (score: number) => void;
}

export function GaussianSphere({ onComplete }: GaussianSphereProps) {
  const [charges] = useState<Charge[]>([
    { x: 300, y: 300, value: 5, type: 'positive' },
    { x: 500, y: 300, value: -3, type: 'negative' },
    { x: 400, y: 450, value: 10, type: 'positive' },
    { x: 700, y: 200, value: -4, type: 'negative' }
  ]);
  const [sphere, setSphere] = useState<{ x: number, y: number, r: number }>({ x: 400, y: 300, r: 100 });
  const [isFinished, setIsFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateEnclosedCharge = () => {
    let total = 0;
    charges.forEach(q => {
        const dist = PhysicsEngine.getDistance(q, { x: sphere.x, y: sphere.y });
        if (dist < sphere.r) {
            total += q.value;
        }
    });
    return total;
  };

  const enclosedCharge = calculateEnclosedCharge();
  const flux = enclosedCharge; // In units of q/epsilon0

  const handleDrag = (_e: any, info: any) => {
    setSphere(prev => ({ ...prev, x: prev.x + info.delta.x, y: prev.y + info.delta.y }));
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-indigo-950 rounded-[40px] overflow-hidden border-8 border-indigo-900 shadow-3xl flex text-white">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Gaussian Surface */}
        <motion.div
            drag
            dragMomentum={false}
            onDrag={handleDrag}
            style={{ 
                left: sphere.x - sphere.r, 
                top: sphere.y - sphere.r,
                width: sphere.r * 2,
                height: sphere.r * 2
            }}
            className="absolute rounded-full border-4 border-dashed border-yellow-400 bg-yellow-400/10 cursor-move z-30 flex items-center justify-center shadow-3xl shadow-yellow-400/20"
        >
            <div className="absolute inset-0 animate-pulse border-8 border-white/5 rounded-full" />
            <Circle className="text-yellow-400/50" size={40} />
            
            {/* Flux Lines Visualization */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                    <motion.line
                        key={a}
                        x1={sphere.r + Math.cos(a * Math.PI/180) * (sphere.r - 20)}
                        y1={sphere.r + Math.sin(a * Math.PI/180) * (sphere.r - 20)}
                        x2={sphere.r + Math.cos(a * Math.PI/180) * (sphere.r + 40)}
                        y2={sphere.r + Math.sin(a * Math.PI/180) * (sphere.r + 40)}
                        stroke={enclosedCharge >= 0 ? "#facc15" : "#60a5fa"}
                        strokeWidth="3"
                        strokeDasharray="4,4"
                        animate={{ strokeDashoffset: [0, 8] }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />
                ))}
            </svg>
        </motion.div>

        {/* Charges */}
        {charges.map((q, i) => (
            <div 
                key={i}
                style={{ left: q.x - 20, top: q.y - 20 }}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl z-20
                    ${q.type === 'positive' ? 'bg-red-500' : 'bg-blue-500'}
                `}
            >
                {q.value > 0 ? `+${q.value}` : q.value}
            </div>
        ))}
      </div>

      {/* Sidebar Controls */}
      <div className="w-[350px] bg-slate-900 border-l-4 border-slate-800 p-8 flex flex-col justify-between">
         <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
                    <Zap className="text-white" size={24} />
                </div>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Gauss Lab</h4>
            </div>

            <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 space-y-4">
                <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Net Enclosed Charge (Σq)</div>
                    <div className={`text-4xl font-black italic tracking-tighter ${enclosedCharge >= 0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {enclosedCharge} nC
                    </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-1">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Total Flux (Φ)</div>
                    <div className="text-2xl font-black text-white text-right">
                        {flux} units
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    <label>Sphere Radius</label>
                    <span className="text-white bg-white/5 px-2 py-1 rounded">{sphere.r}m</span>
                </div>
                <input 
                    type="range" min="50" max="250" step="10"
                    value={sphere.r}
                    onChange={(e) => setSphere(prev => ({ ...prev, r: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-start space-x-3">
                <div className="shrink-0 mt-1">
                    <Info size={16} className="text-blue-400" />
                </div>
                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase">
                    Gauss's Law states: Φ = Σq / ε₀. Only charges **inside** the surface contribute to net flux.
                </p>
            </div>
         </div>

         <div className="space-y-4 pt-8">
            <p className="text-[10px] font-black text-center text-gray-500 uppercase tracking-widest mb-2">Objective: Enclose charges to reach +12nC net charge</p>
            <Button 
                onClick={() => {
                    if (enclosedCharge === 12) {
                        setIsFinished(true);
                        setTimeout(() => onComplete(100), 2000);
                    }
                }}
                className={`w-full py-8 text-xl font-black rounded-3xl uppercase tracking-tighter transition-all
                    ${enclosedCharge === 12 
                        ? 'bg-green-500 hover:bg-green-600 shadow-3xl shadow-green-500/40 text-white' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                `}
            >
                Verify Surface
            </Button>
         </div>
      </div>

      {isFinished && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-indigo-950/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-3xl shadow-green-500/50">
            <CheckCircle2 size={80} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Law Verified!</h2>
          <p className="text-xl text-gray-400 font-bold mb-12">Total Flux: {flux} | Surface Topology: Stable</p>
          <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
                <span className="text-2xl font-black text-yellow-400">+50 XP</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
