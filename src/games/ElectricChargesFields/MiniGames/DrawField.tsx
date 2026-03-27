import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhysicsEngine, Charge, Vector2 } from '../PhysicsEngine';
import { Pencil, CheckCircle2, RefreshCcw, Sparkles } from 'lucide-react';

interface DrawFieldProps {
  onComplete: (score: number) => void;
}

export function DrawField({ onComplete }: DrawFieldProps) {
  const [charges] = useState<Charge[]>([
    { x: 300, y: 300, value: 10, type: 'positive' },
    { x: 600, y: 300, value: -10, type: 'negative' }
  ]);
  const [lines, setLines] = useState<Vector2[][]>([]);
  const [currentLine, setCurrentLine] = useState<Vector2[] | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [validationScore, setValidationScore] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFinished) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCurrentLine([point]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!currentLine || isFinished) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setCurrentLine([...currentLine, point]);
  };

  const handlePointerUp = () => {
    if (!currentLine) return;
    setLines([...lines, currentLine]);
    setCurrentLine(null);
    validateLines([...lines, currentLine]);
  };

  const validateLines = (allLines: Vector2[][]) => {
    // Basic validation: Check if lines roughly follow the field vector at each point
    let TotalCorrectPoints = 0;
    let totalSampledPoints = 0;

    allLines.forEach(line => {
        if (line.length < 5) return;
        
        // Sample 5 points along the line
        for (let i = 1; i < line.length; i += Math.floor(line.length/5)) {
            const p = line[i];
            const prevP = line[i-1];
            
            const drawnDir = Math.atan2(p.y - prevP.y, p.x - prevP.x);
            const actualDir = PhysicsEngine.getFieldDirection(p, charges);
            
            // Allow 30 degrees error
            const diff = Math.abs(drawnDir - actualDir);
            const normalizedDiff = Math.min(diff, 2 * Math.PI - diff);
            
            if (normalizedDiff < 0.5) { // ~30 degrees
                TotalCorrectPoints++;
            }
            totalSampledPoints++;
        }
    });

    const score = totalSampledPoints > 0 ? (TotalCorrectPoints / totalSampledPoints) * 100 : 0;
    setValidationScore(Math.round(score));

    if (score > 80 && allLines.length >= 6) {
        setIsFinished(true);
        setTimeout(() => onComplete(100), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[600px] bg-slate-900 rounded-[40px] overflow-hidden border-8 border-slate-800 shadow-3xl cursor-crosshair touch-none"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Charges */}
        {charges.map((q, i) => (
          <div 
              key={i}
              style={{ left: q.x - 30, top: q.y - 30 }}
              className={`absolute w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl z-20 pointer-events-none
                  ${q.type === 'positive' ? 'bg-red-500 shadow-red-500/30' : 'bg-blue-500 shadow-blue-500/30'}
              `}
          >
              {q.type === 'positive' ? '+' : '-'}
          </div>
        ))}

        {/* Drawn Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {lines.map((line, i) => (
             <polyline
                key={i}
                points={line.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#a5b4fc"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
             />
          ))}
          {currentLine && (
             <polyline
                points={currentLine.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
             />
          )}
        </svg>

        {/* UI HUD */}
        <div className="absolute top-8 left-8 flex items-center space-x-6 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
           <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg">
              <Pencil className="text-white" size={24} />
           </div>
           <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Physics Accuracy</div>
              <div className="text-2xl font-black text-white">{validationScore}%</div>
           </div>
           <div className="h-10 w-px bg-white/10" />
           <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lines Traced</div>
              <div className="text-2xl font-black text-indigo-400">{lines.length} / 6</div>
           </div>
        </div>

        <button 
            onClick={() => { setLines([]); setValidationScore(0); }}
            className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
        >
            <RefreshCcw size={20} />
        </button>

        {isFinished && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-3xl shadow-indigo-600/50">
              <Sparkles size={80} className="text-white" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Field Master!</h2>
            <p className="text-xl text-gray-400 font-bold mb-12">Accuracy: {validationScore}% | Symmetry: Perfect</p>
            <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                  <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
                  <span className="text-2xl font-black text-indigo-400 font-black">+50 XP</span>
            </div>
          </motion.div>
        )}

        {/* Instruction overlay */}
        {lines.length === 0 && (
           <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <p className="text-white font-black text-xs uppercase tracking-[0.3em] opacity-40 animate-pulse">
                Click & Drag to trace the electric field lines
              </p>
           </div>
        )}
      </div>

      <div className="bg-indigo-600/10 border-4 border-indigo-500/20 p-8 rounded-[40px] flex items-start space-x-6">
          <div className="p-4 bg-indigo-500 rounded-3xl shrink-0">
             <Pencil className="text-white" size={32} />
          </div>
          <div>
             <h4 className="text-xl font-black text-gray-800 uppercase italic">Pro-Tip: Field Rules</h4>
             <p className="text-gray-500 font-bold leading-relaxed mt-2">
                Recall that field lines always **emerge** from positive charges and **terminate** at negative charges. The density of lines indicates field strength. Try to trace the curves with high precision to reach 80%+ accuracy!
             </p>
          </div>
      </div>
    </div>
  );
}
