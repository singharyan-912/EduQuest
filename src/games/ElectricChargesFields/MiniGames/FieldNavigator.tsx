import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhysicsEngine, Charge, Vector2 } from '../PhysicsEngine';
import { Compass, Zap, CheckCircle2 } from 'lucide-react';

interface FieldNavigatorProps {
  onComplete: (score: number) => void;
}

export function FieldNavigator({ onComplete }: FieldNavigatorProps) {
  const [testCharge, setTestCharge] = useState<Vector2>({ x: 100, y: 300 });
  const [charges] = useState<Charge[]>([
    { x: 300, y: 200, value: 8, type: 'positive' },
    { x: 600, y: 400, value: -8, type: 'negative' },
    { x: 500, y: 150, value: 5, type: 'positive' }
  ]);
  const [goalPos] = useState<Vector2>({ x: 850, y: 300 });
  const [isFinished, setIsFinished] = useState(false);
  const [health, setHealth] = useState(100);

  const moveSpeed = 5;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return;

    let newPos = { ...testCharge };
    if (e.key === 'ArrowUp') newPos.y -= moveSpeed;
    if (e.key === 'ArrowDown') newPos.y += moveSpeed;
    if (e.key === 'ArrowLeft') newPos.x -= moveSpeed;
    if (e.key === 'ArrowRight') newPos.x += moveSpeed;

    // Apply Electric Field Influence (Drift)
    const field = PhysicsEngine.getElectricFieldAt(testCharge, charges);
    newPos.x += field.x * 0.1;
    newPos.y += field.y * 0.1;

    // Bounds and Collision
    if (newPos.x < 0 || newPos.x > 950 || newPos.y < 0 || newPos.y > 550) return;
    
    // Charge Collision (Damage)
    for (const q of charges) {
        if (PhysicsEngine.getDistance(newPos, q) < 40) {
            setHealth(h => Math.max(0, h - 5));
            return;
        }
    }

    setTestCharge(newPos);

    // Goal Check
    if (PhysicsEngine.getDistance(newPos, goalPos) < 40) {
        setIsFinished(true);
        setTimeout(() => onComplete(100), 2000);
    }
  };

  useEffect(() => {
    if (health <= 0) {
        setHealth(100);
        setTestCharge({ x: 100, y: 300 });
    }
  }, [health]);

  return (
    <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full h-[600px] bg-slate-950 rounded-[40px] overflow-hidden border-8 border-slate-900 shadow-3xl outline-none focus:ring-4 ring-indigo-500/50 transition-all"
    >
      {/* Field Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        {charges.map((q, i) => (
            [0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
                const start = {
                    x: q.x + Math.cos(angle * Math.PI/180) * 20,
                    y: q.y + Math.sin(angle * Math.PI/180) * 20
                };
                const line = PhysicsEngine.traceFieldLine(start, charges, q.type === 'positive' ? 1 : -1, 400);
                return (
                    <polyline
                        key={`${i}-${angle}`}
                        points={line.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke={q.type === 'positive' ? '#f87171' : '#60a5fa'}
                        strokeWidth="1"
                    />
                );
            })
        ))}
      </svg>

      {/* Goal Zone */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500/40 flex items-center justify-center"
        style={{ left: goalPos.x - 48, top: goalPos.y - 48 }}
      >
        <div className="w-12 h-12 rounded-full bg-green-500 shadow-xl shadow-green-500/50 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-white" />
        </div>
      </motion.div>

      {/* Static Charges */}
      {charges.map((q, i) => (
        <div 
            key={i}
            style={{ left: q.x - 30, top: q.y - 30 }}
            className={`absolute w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl
                ${q.type === 'positive' ? 'bg-red-500 shadow-red-500/30' : 'bg-blue-500 shadow-blue-500/30'}
            `}
        >
            {q.type === 'positive' ? '+' : '-'}
        </div>
      ))}

      {/* Test Charge (Player) */}
      <motion.div
        animate={{ x: testCharge.x - 20, y: testCharge.y - 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center z-50 border-2 border-indigo-400"
      >
        <div className="w-4 h-4 rounded-full bg-indigo-500" />
      </motion.div>

      {/* UI Overlays */}
      <div className="absolute top-8 left-8 space-y-4 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center space-x-4">
              <Compass className="text-indigo-400" size={20} />
              <div className="text-xs font-black text-white uppercase tracking-widest">Field Navigator</div>
          </div>
          <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                className="h-full bg-red-500"
                animate={{ width: `${health}%` }}
              />
          </div>
      </div>

      <div className="absolute bottom-8 right-8 text-right space-y-2 pointer-events-none">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Instructions</div>
          <div className="text-white font-bold text-sm bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
              Use ARROW KEYS to navigate.<br/>Avoid direct contact with Charges.
          </div>
      </div>

      {isFinished && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-3xl shadow-indigo-600/50">
            <CheckCircle2 size={80} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Mission Success</h2>
          <p className="text-xl text-gray-400 font-bold mb-12">Path Traversed: Test Charge Equilibrium Secured</p>
          <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
                <span className="text-2xl font-black text-indigo-400">+50 XP</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
