import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  ChevronRight, 
  RotateCcw, 
  AlertCircle,
  Trophy,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface TreeNode {
  id: string;
  value: number;
  parentId: string | null;
  children: string[];
  isPrime: boolean;
  level: number;
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

const levels = [
  { target: 24, description: "Start simple: Factorize 24" },
  { target: 60, description: "A bigger challenge: 60" },
  { target: 126, description: "Mastery level: 126" }
];

interface PrimeFactorQuestProps {
  onComplete: () => void;
}

export function PrimeFactorQuest({ onComplete }: PrimeFactorQuestProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    initLevel();
  }, [currentLevel]);

  const initLevel = () => {
    const target = levels[currentLevel].target;
    setNodes([{
      id: 'root',
      value: target,
      parentId: null,
      children: [],
      isPrime: checkIfPrime(target),
      level: 0
    }]);
    setError(null);
    setIsSuccess(false);
  };

  const checkIfPrime = (val: number) => {
    if (val < 2) return false;
    for (let i = 2; i <= Math.sqrt(val); i++) {
        if (val % i === 0) return false;
    }
    return true;
  };

  const splitNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || node.isPrime || node.children.length > 0) return;

    // Smallest prime factor
    let factor1 = 0;
    for (let p of PRIMES) {
      if (node.value % p === 0) {
        factor1 = p;
        break;
      }
    }

    if (factor1 === 0) return;

    const factor2 = node.value / factor1;

    const newId1 = `${nodeId}-f1`;
    const newId2 = `${nodeId}-f2`;

    const newNode1: TreeNode = {
      id: newId1,
      value: factor1,
      parentId: nodeId,
      children: [],
      isPrime: checkIfPrime(factor1),
      level: node.level + 1
    };

    const newNode2: TreeNode = {
      id: newId2,
      value: factor2,
      parentId: nodeId,
      children: [],
      isPrime: checkIfPrime(factor2),
      level: node.level + 1
    };

    setNodes(prev => {
      const updatedNodes = prev.map(n => n.id === nodeId ? { ...n, children: [newId1, newId2] } : n);
      return [...updatedNodes, newNode1, newNode2];
    });

    checkCompletion([...nodes, newNode1, newNode2]);
  };

  const checkCompletion = (currentNodes: TreeNode[]) => {
    const leafNodes = currentNodes.filter(n => n.children.length === 0);
    const allLeafPrimes = leafNodes.every(n => n.isPrime);
    const product = leafNodes.reduce((acc, n) => acc * n.value, 1);

    if (allLeafPrimes && product === levels[currentLevel].target) {
      setIsSuccess(true);
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const renderTree = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    return (
      <div key={nodeId} className="flex flex-col items-center gap-8 relative">
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          onClick={() => splitNode(node.id)}
          className={`
            w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-xl shadow-lg border-b-4 transition-all
            ${node.isPrime ? 'bg-emerald-500 text-white border-emerald-700 cursor-default' : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-500 hover:scale-110'}
            ${node.children.length > 0 ? 'opacity-50 grayscale' : ''}
          `}
        >
          {node.value}
          {node.isPrime && <span className="text-[10px] uppercase mt-1 opacity-70">Prime</span>}
        </motion.button>

        {node.children.length > 0 && (
          <div className="flex gap-16 relative">
             {/* Lines */}
             <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-8 border-x-2 border-t-2 border-indigo-200 rounded-t-xl" />
             {node.children.map(cid => renderTree(cid))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Game Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6 rounded-[32px] border-4 border-indigo-50 bg-white">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                     <Target size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Current Goal</p>
                    <p className="text-2xl font-black text-slate-900">{levels[currentLevel].target}</p>
                  </div>
               </div>
               
               <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Prime Factors Found</p>
                  <div className="flex flex-wrap gap-2">
                     {nodes.filter(n => n.children.length === 0 && n.isPrime).map((n, i) => (
                       <div key={i} className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                         {n.value}
                       </div>
                     ))}
                     {nodes.filter(n => n.children.length === 0 && !n.isPrime).map((n, i) => (
                       <div key={i} className="w-8 h-8 rounded-lg bg-slate-200 text-slate-400 flex items-center justify-center font-black text-xs">
                         ?
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-4 border-t-2 border-slate-50">
                  <button onClick={initLevel} className="w-full py-3 text-slate-400 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors">
                     <RotateCcw size={14} /> Reset Tree
                  </button>
               </div>
            </div>
          </Card>
          
          <div className="p-6 bg-indigo-600 rounded-[32px] text-white space-y-2">
             <div className="flex items-center gap-2">
               <Zap size={16} fill="white" />
               <span className="text-[10px] font-black uppercase tracking-widest">Logic Tip</span>
             </div>
             <p className="text-xs font-bold leading-relaxed text-indigo-100 italic">
               The Fundamental Theorem of Arithmetic states that every composite number can be uniquely factorized into primes.
             </p>
          </div>
        </div>

        {/* Tree Arena */}
        <div className="lg:col-span-3 bg-slate-900 rounded-[48px] p-12 relative overflow-hidden flex items-center justify-center min-h-[600px] border-8 border-white shadow-2xl">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px]" />
           <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-900/20 to-transparent" />
           
           <AnimatePresence mode="wait">
             {!isSuccess ? (
               <div className="relative z-10 w-full flex flex-col items-center">
                  <header className="mb-12 text-center space-y-2">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Factor Evolution</p>
                     <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Decompose the <span className="text-indigo-400">Nucleus</span></h2>
                  </header>

                  <div className="mt-8 scale-90">
                     {renderTree('root')}
                  </div>
               </div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                 className="relative z-10 flex flex-col items-center text-center gap-8"
               >
                  <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-3xl text-white">
                     <Trophy size={64} className="animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                      ARITHMETIC <span className="text-emerald-400 underline decoration-8 underline-offset-8">RESOLVED!</span>
                    </h2>
                    <p className="text-xl font-bold text-slate-400 italic max-w-md mx-auto">
                      All leaves are prime. The unique factorization fingerprint for {levels[currentLevel].target} is found.
                    </p>
                  </div>

                  <div className="flex gap-4 items-center bg-white/5 p-8 rounded-[40px] border-4 border-emerald-500/20 shadow-2xl">
                     <div className="text-5xl font-black text-white">{levels[currentLevel].target}</div>
                     <div className="text-3xl text-slate-600">=</div>
                     <div className="flex gap-3">
                        {nodes.filter(n => n.children.length === 0).map((n, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-2xl font-black">
                                {n.value}
                             </div>
                             {i < nodes.filter(n => n.children.length === 0).length - 1 && <span className="text-slate-600 font-black text-2xl">×</span>}
                          </div>
                        ))}
                     </div>
                  </div>

                  <Button onClick={nextLevel} className="px-12 py-6 bg-white text-slate-950 font-black rounded-3xl text-xl hover:scale-105 transition-transform flex items-center group">
                     {currentLevel < levels.length - 1 ? 'Next Sequence' : 'Arena Entrance'} <ChevronRight className="ml-2 group-hover:translate-x-2 transition-all" />
                  </Button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
