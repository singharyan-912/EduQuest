import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhysicsEngine, Charge, Vector2 } from '../PhysicsEngine';
import { Button } from '../../../components/ui/Button';
import { Crosshair, Zap, CheckCircle2 } from 'lucide-react';

interface NetForceBuilderProps {
  onComplete: (score: number) => void;
}

export function NetForceBuilder({ onComplete }: NetForceBuilderProps) {
  const [fixedCharges] = useState<Charge[]>([
    { x: 200, y: 300, value: 4, type: 'positive' }, // +4Q
    { x: 800, y: 300, value: 1, type: 'positive' }  // +1Q
  ]);
  const [testCharge, setTestCharge] = useState<Vector2>({ x: 500, y: 450 });
  const [netForce, setNetForce] = useState<Vector2>({ x: 0, y: 0 });
  const [isFinished, setIsFinished] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate net force vector (actually Electric Field vector for purely visual magnitude)
    const field = PhysicsEngine.getElectricFieldAt(testCharge, fixedCharges);
    setNetForce(field);
  }, [testCharge, fixedCharges]);

  const verifyEquilibrium = () => {
    const magnitude = Math.hypot(netForce.x, netForce.y);
    // If net force magnitude is very close to zero, it's in equilibrium
    // The exact analytical null point is at x = 600, y = 300
    const distToTarget = PhysicsEngine.getDistance(testCharge, { x: 600, y: 300 });

    if (distToTarget < 30 || magnitude < 0.05) {
      setIsFinished(true);
      setTimeout(() => onComplete(100), 2500);
    } else {
        // Just shake or show error (using a simple visual cue)
        const el = document.getElementById('test-charge');
        if (el) {
            el.animate([
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], { duration: 400 });
        }
    }
  };

  const handleDrag = (_e: any, info: any) => {
    setTestCharge(prev => ({
        x: Math.max(50, Math.min(950, prev.x + info.delta.x)),
        y: Math.max(50, Math.min(550, prev.y + info.delta.y))
    }));
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-[40px] overflow-hidden border-8 border-slate-800 shadow-3xl text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="absolute top-8 left-8 flex items-center space-x-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 z-20">
          <Crosshair className="text-indigo-400" />
          <span className="font-black uppercase tracking-widest text-sm">Find the Null Point</span>
      </div>

      {/* Net Force HUD */}
      <div className="absolute bottom-8 left-8 flex items-center space-x-6 bg-black/40 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 z-20">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
             <Zap className="text-indigo-400" />
          </div>
          <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Net Force Magnitude (ΣF)</div>
              <div className={`text-2xl font-black ${Math.hypot(netForce.x, netForce.y) < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.hypot(netForce.x, netForce.y).toFixed(3)} N/C
              </div>
          </div>
      </div>

      {/* Verify Button */}
      <div className="absolute bottom-8 right-8 z-20">
          <Button onClick={verifyEquilibrium} className="bg-indigo-600 hover:bg-indigo-700 px-10 py-6 text-lg font-black rounded-2xl uppercase tracking-widest shadow-xl">
              Lock Position
          </Button>
      </div>

      <div ref={containerRef} className="absolute inset-0">
          {/* Fixed Charges */}
          {fixedCharges.map((q, i) => (
              <div 
                  key={i}
                  className="absolute w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_40px_rgba(239,68,68,0.4)] z-10"
                  style={{ left: q.x - 40, top: q.y - 40 }}
              >   
                  <div className="absolute -top-8 text-sm text-red-300 tracking-widest">+ {q.value}q</div>
                  +
              </div>
          ))}

          {/* Test Charge (Draggable) */}
          <motion.div
              id="test-charge"
              drag
              dragMomentum={false}
              onDrag={handleDrag}
              style={{ left: testCharge.x - 24, top: testCharge.y - 24 }}
              className="absolute w-12 h-12 rounded-full border-4 border-yellow-400 bg-yellow-500/20 flex items-center justify-center cursor-grab active:cursor-grabbing z-30 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
          >
              <div className="w-4 h-4 rounded-full bg-yellow-400" />

              {/* Force Vector Arrow */}
              <svg className="absolute inset-0 w-[400px] h-[400px] pointer-events-none -translate-x-[176px] -translate-y-[176px] overflow-visible">
                  <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
                      </marker>
                  </defs>
                  {Math.hypot(netForce.x, netForce.y) > 0.05 && (
                      <line 
                          x1="200" y1="200" 
                          x2={200 + netForce.x * 20} 
                          y2={200 + netForce.y * 20}
                          stroke="#f87171" 
                          strokeWidth="4"
                          markerEnd="url(#arrow)"
                      />
                  )}
              </svg>
          </motion.div>
      </div>

      {isFinished && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-3xl shadow-green-500/50">
            <CheckCircle2 size={80} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Perfect Balance!</h2>
          <p className="text-xl text-gray-400 font-bold mb-12">You successfully located the electrostatic null point (equilibrium).</p>
          <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
              <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
              <span className="text-2xl font-black text-yellow-400">+50 XP</span>
          </div>
        </motion.div>
      )}

      {/* Guide text */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none text-center">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest max-w-sm">
             Drag the yellow test charge until the red net force vector disappears entirely.
          </p>
      </div>
    </div>
  );
}
