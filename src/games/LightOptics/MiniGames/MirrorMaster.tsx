import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  RotateCcw, 
  Target, 
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

type MirrorType = 'plane' | 'concave' | 'convex';

interface Level {
  targetX: number;
  targetY: number;
  mirrorType: MirrorType;
  description: string;
}

const LEVELS: Level[] = [
  { targetX: 80, targetY: 40, mirrorType: 'plane', description: "Hit the sensor using a plane mirror." },
  { targetX: 70, targetY: 60, mirrorType: 'concave', description: "Focus the ray into the target using a converging mirror." },
  { targetX: 90, targetY: 30, mirrorType: 'convex', description: "Use the divergence of a convex mirror to hit a high target." }
];

interface MirrorMasterProps {
  onComplete: () => void;
}

export function MirrorMaster({ onComplete }: MirrorMasterProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [angle, setAngle] = useState(45);
  const [isSuccess, setIsSuccess] = useState(false);
  const [beamPath, setBeamPath] = useState<{ x: number, y: number }[]>([]);

  const level = LEVELS[currentLevel];

  useEffect(() => {
    calculateRays();
  }, [angle, currentLevel]);

  const calculateRays = () => {
    const startX = 10;
    const startY = 80;
    const mirrorX = 50;
    const mirrorY = 50;

    const path = [{ x: startX, y: startY }, { x: mirrorX, y: mirrorY }];
    
    // Simple reflection logic for simulation
    let reflectedAngle = angle;
    if (level.mirrorType === 'concave') reflectedAngle -= 15;
    if (level.mirrorType === 'convex') reflectedAngle += 15;

    const endX = mirrorX + Math.cos((reflectedAngle * Math.PI) / 180) * 40;
    const endY = mirrorY - Math.sin((reflectedAngle * Math.PI) / 180) * 40;

    path.push({ x: endX, y: endY });
    setBeamPath(path);

    // Hit detection
    const dist = Math.sqrt(Math.pow(endX - level.targetX, 2) + Math.pow(endY - level.targetY, 2));
    if (dist < 5) {
      if (!isSuccess) setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setIsSuccess(false);
      setAngle(45);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="p-8 rounded-[40px] border-4 border-slate-100 bg-white shadow-xl h-full flex flex-col">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                       <Sun size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Mirror Control</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Angle of Incidence</p>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-sm font-black text-slate-900 uppercase italic">Rotation</span>
                       <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-amber-500 shadow-sm border border-slate-100">{angle}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="90" value={angle} 
                      onChange={(e) => setAngle(parseInt(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-amber-500"
                    />
                 </div>

                 <div className="space-y-4">
                    <div className="p-4 bg-slate-900 rounded-2xl border-4 border-slate-800 text-white italic">
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Objective</p>
                       <p className="text-xs font-bold leading-relaxed">{level.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <div className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest text-center ${level.mirrorType === 'plane' ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Plane</div>
                       <div className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest text-center ${level.mirrorType === 'concave' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Concave</div>
                       <div className={`flex-1 py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest text-center ${level.mirrorType === 'convex' ? 'bg-rose-100 border-rose-300 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Convex</div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-50 flex items-center justify-between">
                 <button onClick={() => setAngle(45)} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors">
                    <RotateCcw size={20} />
                 </button>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Level {currentLevel + 1} / {LEVELS.length}</span>
              </div>
           </Card>
        </div>

        {/* Simulation Arena */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[64px] border-8 border-white shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[550px]">
           <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
           
           {/* Principal Axis */}
           <div className="absolute w-full h-px bg-slate-800 top-1/2 left-0 pointer-events-none" />

           {/* Sensor/Target */}
           <motion.div 
             animate={{ 
               scale: isSuccess ? [1, 1.2, 1] : 1,
               rotate: isSuccess ? [0, 10, -10, 0] : 0
             }}
             transition={{ repeat: isSuccess ? Infinity : 0 }}
             style={{ left: `${level.targetX}%`, top: `${level.targetY}%` }}
             className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20 border-4 ${isSuccess ? 'bg-emerald-500 border-emerald-300 text-white shadow-3xl shadow-emerald-500/50' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
           >
              <Target size={24} />
           </motion.div>

           {/* Ray Source */}
           <div className="absolute left-[10%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-16 h-8 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-xl" />
              <div className="w-4 h-4 bg-amber-500 rounded-full shadow-3xl shadow-amber-500 blur-[2px] animate-pulse" />
           </div>

           {/* Mirror Visualization */}
           <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
              <motion.div 
                animate={{ rotate: (angle - 45) }}
                className={`w-4 h-32 rounded-full shadow-2xl ${
                  level.mirrorType === 'plane' ? 'bg-gradient-to-b from-slate-400 to-slate-200 border-2 border-white/50' :
                  level.mirrorType === 'concave' ? 'bg-blue-400 rounded-l-[50px] border-r-4 border-blue-200 shadow-blue-500/50' :
                  'bg-rose-400 rounded-r-[50px] border-l-4 border-rose-200 shadow-rose-500/50'
                }`}
              />
           </div>

           {/* Rays SVG */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                       <feMergeNode in="coloredBlur"/>
                       <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                 </filter>
              </defs>
              <motion.polyline
                points={beamPath.map(p => `${(p.x * 10).toFixed(0)},${(p.y * 10).toFixed(0)}`).join(' ')}
                fill="none"
                stroke={isSuccess ? "#10b981" : "#f59e0b"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                style={{
                   vectorEffect: 'non-scaling-stroke'
                }}
                viewBox="0 0 1000 1000"
              />
           </svg>

           {/* Success Overlay */}
           <AnimatePresence>
             {isSuccess && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="absolute inset-0 flex items-center justify-center bg-emerald-950/40 backdrop-blur-md z-30"
               >
                  <div className="text-center space-y-8 p-12 bg-white rounded-[64px] border-b-[16px] border-emerald-100 shadow-4xl max-w-md">
                     <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white shadow-3xl shadow-emerald-500/50">
                        <Trophy size={48} className="animate-bounce" />
                     </div>
                     <div>
                        <h2 className="text-5xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">
                          REFLECTION <span className="text-emerald-500">MASTERED!</span>
                        </h2>
                        <p className="text-slate-400 font-bold italic mt-2">Angle of incidence = Angle of reflection.</p>
                     </div>
                     <Button onClick={nextLevel} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl text-xl shadow-2xl hover:scale-105 transition-all">
                        {currentLevel === LEVELS.length - 1 ? 'Unlock Ray Lab' : 'Next Wave'} <ChevronRight className="ml-2 inline" />
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
