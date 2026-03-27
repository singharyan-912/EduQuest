import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhysicsEngine, Charge, Vector2 } from '../PhysicsEngine';
import { Button } from '../../../components/ui/Button';
import { Target, Zap, RotateCcw, CheckCircle2, Sliders } from 'lucide-react';

interface ForceBlasterProps {
  onComplete: (score: number) => void;
}

export function ForceBlaster({ onComplete }: ForceBlasterProps) {
  const [playerCharge, setPlayerCharge] = useState<Charge>({ x: 200, y: 300, value: 5, type: 'positive' });
  const [targetPos] = useState<Vector2>({ x: 700, y: 300 });
  const [testCharge, setTestCharge] = useState<Vector2>({ x: 400, y: 300 });
  const [isLaunching, setIsLaunching] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [path, setPath] = useState<Vector2[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePath = () => {
    let current = { x: 400, y: 300 };
    const points: Vector2[] = [current];
    const charges = [playerCharge];
    
    // Simulating motion under electrostatic force
    let vel = { x: 0, y: 0 };
    const dt = 0.5;

    for (let i = 0; i < 200; i++) {
        const force = PhysicsEngine.getElectricFieldAt(current, charges); // Field * testCharge (q=1)
        vel.x += force.x * dt;
        vel.y += force.y * dt;
        current.x += vel.x * dt;
        current.y += vel.y * dt;

        points.push({ ...current });
        
        // Target check
        const distToTarget = PhysicsEngine.getDistance(current, targetPos);
        if (distToTarget < 30) break;
        
        // Bounds check
        if (current.x < 0 || current.x > 1000 || current.y < 0 || current.y > 600) break;
    }
    setPath(points);
  };

  useEffect(() => {
    calculatePath();
  }, [playerCharge]);

  const handleLaunch = () => {
    setIsLaunching(true);
    let currentIdx = 0;
    const interval = setInterval(() => {
        if (currentIdx >= path.length - 1) {
            clearInterval(interval);
            checkWin();
            return;
        }
        setTestCharge(path[currentIdx]);
        currentIdx++;
    }, 10);
  };

  const checkWin = () => {
    const finalPos = path[path.length - 1];
    const dist = PhysicsEngine.getDistance(finalPos, targetPos);
    if (dist < 40) {
        setIsFinished(true);
        setTimeout(() => onComplete(100), 2000);
    } else {
        setIsLaunching(false);
        setTestCharge({ x: 400, y: 300 });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-gray-900 rounded-[40px] overflow-hidden border-8 border-gray-800 shadow-3xl flex">
      {/* Simulation Area */}
      <div className="flex-1 relative">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

         {/* Target */}
         <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ left: targetPos.x - 30, top: targetPos.y - 30 }}
            className="absolute w-[60px] h-[600px] flex items-center justify-center"
         >
            <div className="w-16 h-16 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-yellow-400/20 shadow-2xl shadow-yellow-400/50">
                <Target className="text-yellow-400" size={32} />
            </div>
         </motion.div>

         {/* Trajectory Preview */}
         {!isLaunching && (
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <polyline
                    points={path.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />
             </svg>
         )}

         {/* Player Charge */}
         <motion.div
            drag
            dragConstraints={containerRef}
            onDrag={(_e, info) => setPlayerCharge(prev => ({ ...prev, x: prev.x + info.delta.x, y: prev.y + info.delta.y }))}
            style={{ left: playerCharge.x - 32, top: playerCharge.y - 32 }}
            className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl cursor-grab z-10
                ${playerCharge.type === 'positive' ? 'bg-red-500 shadow-red-500/50' : 'bg-blue-500 shadow-blue-500/50'}
            `}
         >
            {playerCharge.type === 'positive' ? '+' : '-'}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-gray-400 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
                Source: {playerCharge.value}nC
            </div>
         </motion.div>

         {/* Test Charge (Projectile) */}
         <motion.div
            style={{ left: testCharge.x - 12, top: testCharge.y - 12 }}
            className="absolute w-6 h-6 rounded-full bg-white shadow-xl shadow-white/50 z-20 flex items-center justify-center"
         >
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
         </motion.div>

         {/* Force Vector (Visual Requirement) */}
         {!isLaunching && (
             <motion.div
                style={{ 
                    left: 400, 
                    top: 300,
                    width: 4,
                    height: 60,
                    transformOrigin: 'top',
                    rotate: `${PhysicsEngine.getFieldDirection({ x: 400, y: 300 }, [playerCharge]) * (180/Math.PI) + 90}deg`,
                    scaleY: PhysicsEngine.getForce(playerCharge, { x: 400, y: 300, value: 1, type: 'positive' }) / 2
                }}
                className="absolute bg-yellow-400 rounded-full opacity-60"
             >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-yellow-400" />
             </motion.div>
         )}
      </div>

      {/* Controls Sidebar */}
      <div className="w-[300px] bg-gray-900 border-l-4 border-gray-800 p-8 flex flex-col justify-between">
         <div className="space-y-8">
            <div className="flex items-center space-x-2 text-indigo-400">
                <Zap size={20} className="fill-current" />
                <h4 className="text-xs font-black uppercase tracking-widest">Force Controls</h4>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    <label className="flex items-center"><Sliders size={12} className="mr-1" /> Charge Value</label>
                    <span className="text-white bg-white/5 px-2 py-1 rounded">{playerCharge.value}nC</span>
                </div>
                <input 
                    type="range" min="-10" max="10" step="1" 
                    value={playerCharge.value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPlayerCharge(prev => ({ ...prev, value: val, type: val >= 0 ? 'positive' : 'negative' }));
                    }}
                    className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coulomb Data</div>
                <div className="text-sm font-bold text-gray-300">
                    Force: <span className="text-yellow-400">{Math.round(PhysicsEngine.getForce(playerCharge, { x: 400, y: 300, value: 1, type: 'positive' }) * 10) / 10} mN</span>
                </div>
            </div>
         </div>

         <div className="space-y-4">
            <Button 
                onClick={handleLaunch} 
                disabled={isLaunching || isFinished}
                className="w-full py-8 text-xl font-black rounded-3xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 uppercase tracking-tight"
            >
                {isLaunching ? 'Propelling...' : 'Launch Test'}
            </Button>
            <Button 
                onClick={() => { setIsLaunching(false); setTestCharge({ x: 400, y: 300 }); }}
                variant="outline"
                className="w-full py-4 text-xs font-black rounded-2xl border-white/10 text-gray-400 hover:bg-white/5 uppercase tracking-widest"
            >
                <RotateCcw size={14} className="mr-2" /> Reset Lab
            </Button>
         </div>
      </div>

      {isFinished && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center mb-8 shadow-3xl shadow-yellow-500/50">
            <CheckCircle2 size={80} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Target Eliminated!</h2>
          <p className="text-xl text-gray-400 font-bold mb-12">Coulomb Precision: Force Mastery Confirmed</p>
          <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
                <span className="text-2xl font-black text-yellow-400">+50 XP</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
