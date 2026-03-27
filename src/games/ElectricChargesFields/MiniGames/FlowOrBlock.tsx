import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Zap, CheckCircle2, RotateCcw } from 'lucide-react';

interface FlowOrBlockProps {
  onComplete: (score: number) => void;
}

type MaterialType = 'conductor' | 'insulator' | 'empty';

interface Cell {
  x: number;
  y: number;
  type: MaterialType;
  isActive: boolean;
}

export function FlowOrBlock({ onComplete }: FlowOrBlockProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const GRID_SIZE = 6;

  // Initialize Grid
  useEffect(() => {
    const initialGrid: Cell[][] = Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => ({
        x, y, type: 'empty', isActive: false
      }))
    );
    
    // Add some random static insulators
    initialGrid[1][2].type = 'insulator';
    initialGrid[3][4].type = 'insulator';
    initialGrid[4][1].type = 'insulator';

    setGrid(initialGrid);
  }, []);

  const handleCellClick = (x: number, y: number) => {
    if (isSimulating || isFinished) return;
    
    setGrid(prev => {
      const newGrid = [...prev];
      const cell = newGrid[y][x];
      
      if (cell.type === 'insulator') return prev; // Cannot change static insulators
      
      newGrid[y][x] = {
        ...cell,
        type: cell.type === 'empty' ? 'conductor' : 'empty'
      };
      
      return newGrid;
    });
  };

  const simulateFlow = () => {
    setIsSimulating(true);
    // Clear previous active states when re-simulating
    let currentGrid = [...grid.map(row => [...row.map(c => ({...c, isActive: false}))])];
    
    // Start flow from top-left (0,0)
    if (currentGrid[0][0].type !== 'conductor') {
        currentGrid[0][0].type = 'conductor'; 
    }
    
    let activeCells = [{ x: 0, y: 0 }];
    currentGrid[0][0].isActive = true;
    setGrid(currentGrid);

    const stepFlow = setInterval(() => {
        const newActive: {x: number, y: number}[] = [];
        let reachedEnd = false;

        currentGrid = currentGrid.map(row => row.map(c => ({...c})));

        activeCells.forEach(cell => {
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            directions.forEach(([dx, dy]) => {
                const nx = cell.x + dx;
                const ny = cell.y + dy;

                if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
                    const nextCell = currentGrid[ny][nx];
                    if (nextCell.type === 'conductor' && !nextCell.isActive) {
                        nextCell.isActive = true;
                        newActive.push({ x: nx, y: ny });
                        if (nx === GRID_SIZE - 1 && ny === GRID_SIZE - 1) {
                            reachedEnd = true;
                        }
                    }
                }
            });
        });

        if (newActive.length === 0 || reachedEnd) {
            clearInterval(stepFlow);
            if (reachedEnd) {
                // Calculate score based on efficiency (fewer conductors used = higher score)
                let conductorsUsed = 0;
                currentGrid.forEach(row => row.forEach(c => {
                    if (c.type === 'conductor') conductorsUsed++;
                }));
                const calculatedScore = Math.max(10, 100 - (conductorsUsed - (GRID_SIZE * 2)) * 5);
                setScore(calculatedScore);
                setIsFinished(true);
                setTimeout(() => onComplete(calculatedScore), 2500);
            } else {
                setIsSimulating(false);
            }
        } else {
            activeCells = newActive;
            setGrid(currentGrid);
        }
    }, 200);
  };

  const resetGrid = () => {
    setGrid(prev => prev.map(row => row.map(c => ({
        ...c, 
        isActive: false, 
        // Keep insulators and conductors, just reset the flow
    }))));
    setIsSimulating(false);
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-[40px] overflow-hidden border-8 border-slate-800 shadow-3xl p-8 flex flex-col items-center">
        
        <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Flow or Block</h3>
            <p className="text-gray-400 font-bold">Build a continuous path of <span className="text-yellow-400">Conductors</span> from START to FINISH. <span className="text-red-400">Insulators</span> block the flow.</p>
        </div>

        <div className="relative flex-1 aspect-square max-h-[400px]">
           <div className="absolute -left-12 top-0 bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-lg rotate-[-90deg] translate-y-12">Start</div>
           <div className="absolute -right-12 bottom-0 bg-green-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-lg rotate-[90deg] -translate-y-12">Finish</div>
           
           <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-2 bg-slate-800/50 p-2 rounded-3xl border-4 border-slate-700/50">
              {grid.map((row, y) => row.map((cell, x) => (
                  <motion.div 
                    key={`${x}-${y}`}
                    whileHover={{ scale: cell.type === 'insulator' ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCellClick(x, y)}
                    className={`relative rounded-xl cursor-pointer transition-colors duration-300 border-2 overflow-hidden
                        ${cell.type === 'empty' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : ''}
                        ${cell.type === 'conductor' ? 'bg-yellow-500/20 border-yellow-500/50' : ''}
                        ${cell.type === 'insulator' ? 'bg-red-900/40 border-red-500/30 cursor-not-allowed hidden-diagonal-stripes' : ''}
                        ${(x === 0 && y === 0) ? 'ring-4 ring-indigo-500/50' : ''}
                        ${(x === GRID_SIZE-1 && y === GRID_SIZE-1) ? 'ring-4 ring-green-500/50 bg-green-900/20 border-green-500/50' : ''}
                    `}
                  >
                      {/* Active Current Flow Animation */}
                      <AnimatePresence>
                         {cell.isActive && (
                             <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)] flex items-center justify-center z-10"
                             >
                                 <Zap size={20} className="text-yellow-800 animate-pulse" />
                             </motion.div>
                         )}
                      </AnimatePresence>
                      {cell.type === 'insulator' && (
                          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)]" />
                      )}
                  </motion.div>
              )))}
           </div>
        </div>

        <div className="flex space-x-4 mt-8">
            <Button onClick={resetGrid} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 rounded-2xl w-14 h-14 p-0 flex items-center justify-center">
                <RotateCcw size={24} />
            </Button>
            <Button 
                onClick={simulateFlow} 
                className={`bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-12 py-6 font-black uppercase tracking-widest ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSimulating || isFinished}
            >
                Ignite Circuit
            </Button>
        </div>

        <AnimatePresence>
        {isFinished && (
            <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center"
            >
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(34,197,94,0.5)]">
                <CheckCircle2 size={80} className="text-white" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter uppercase">Circuit Complete!</h2>
            <p className="text-xl text-gray-400 font-bold mb-12">The charge successfully flowed from start to finish.</p>
            <div className="flex space-x-6">
                <div className="bg-white/5 px-8 py-4 rounded-3xl border border-white/10">
                    <span className="text-[10px] font-black text-gray-500 block uppercase tracking-widest mb-1">Efficiency Score</span>
                    <span className="text-3xl font-black text-green-400">{score}%</span>
                </div>
                <div className="bg-white/5 px-8 py-4 rounded-3xl border border-white/10">
                    <span className="text-[10px] font-black text-gray-500 block uppercase tracking-widest mb-1">XP Earned</span>
                    <span className="text-3xl font-black text-yellow-400">+50 XP</span>
                </div>
            </div>
            </motion.div>
        )}
        </AnimatePresence>
    </div>
  );
}
