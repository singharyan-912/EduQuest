import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Info, 
  ArrowRight,
  LayoutGrid,
  Zap,
  Activity,
  Trophy
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface Item {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
}

const ITEMS: Item[] = [
  { id: '1', name: 'Air', type: 'gas_gas', icon: '💨', description: 'Oxygen and other gases in Nitrogen.' },
  { id: '2', name: 'Seawater', type: 'solid_liquid', icon: '🌊', description: 'Salt dissolved in water.' },
  { id: '3', name: 'Brass', type: 'solid_solid', icon: '🎺', description: 'Alloy of Zinc in Copper.' },
  { id: '4', name: 'Aerated Water', type: 'gas_liquid', icon: '🥤', description: 'CO2 dissolved in water under pressure.' },
  { id: '5', name: 'Dental Amalgam', type: 'liquid_solid', icon: '🦷', description: 'Mercury in Silver/Tin.' },
  { id: '6', name: 'Ether in Water', type: 'liquid_liquid', icon: '🧪', description: 'Miscible liquid mixture.' }
];

const CATEGORIES = [
  { id: 'gas_gas', name: 'Gas in Gas' },
  { id: 'solid_liquid', name: 'Solid in Liquid' },
  { id: 'solid_solid', name: 'Solid in Solid' },
  { id: 'gas_liquid', name: 'Gas in Liquid' },
  { id: 'liquid_solid', name: 'Liquid in Solid' },
  { id: 'liquid_liquid', name: 'Liquid in Liquid' }
];

interface SolutionSorterProps {
  onComplete: () => void;
}

export function SolutionSorter({ onComplete }: SolutionSorterProps) {
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [placedItems, setPlacedItems] = useState<Record<string, string[]>>({});
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDrop = (categoryId: string) => {
    if (!draggedId) return;
    
    const item = items.find(i => i.id === draggedId);
    if (item && item.type === categoryId) {
      setPlacedItems(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), draggedId]
      }));
      setItems(prev => prev.filter(i => i.id !== draggedId));
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      setTimeout(() => setIsSuccess(true), 1000);
    }
  }, [items]);

  const resetGame = () => {
    setItems(ITEMS);
    setPlacedItems({});
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Item Pool */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[48px] border-4 border-gray-100 shadow-xl min-h-[500px]">
              <h3 className="text-xl font-black text-gray-800 uppercase mb-8 flex items-center">
                 <LayoutGrid className="mr-3 text-blue-500" /> Mixture Pool
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <AnimatePresence>
                    {items.map((item) => (
                       <motion.div
                         key={item.id}
                         layout
                         draggable
                         onDragStart={() => setDraggedId(item.id)}
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         exit={{ scale: 0, opacity: 0 }}
                         whileHover={{ scale: 1.05, y: -5 }}
                         className="p-5 bg-blue-50 border-2 border-blue-100 rounded-3xl cursor-grab active:cursor-grabbing text-center space-y-2 group shadow-sm hover:shadow-md transition-all"
                       >
                          <span className="text-4xl group-hover:scale-125 transition-transform inline-block">{item.icon}</span>
                          <p className="font-black text-blue-900 text-sm leading-tight uppercase tracking-tighter">{item.name}</p>
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {items.length === 0 && !isSuccess && (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20 grayscale">
                    <Activity size={64} className="mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs tracking-[0.2em]">Pool Depleted</p>
                 </div>
              )}
           </div>

           <Card className="p-6 bg-slate-900 text-white rounded-3xl border-4 border-white/10 shadow-2xl">
              <div className="flex items-start space-x-3">
                 <Info size={24} className="shrink-0 text-cyan-400" />
                 <p className="text-sm font-bold leading-relaxed italic opacity-80">
                   Solutions are <b>homogeneous mixtures</b> of two or more components. Drag each example to its correct solvent-solute category.
                 </p>
              </div>
           </Card>
        </div>

        {/* Classification Arena */}
        <div className="lg:col-span-8 bg-blue-50/30 rounded-[80px] border-8 border-white shadow-inner relative grid grid-cols-2 md:grid-cols-3 gap-6 p-10 overflow-hidden min-h-[600px]">
           
           {CATEGORIES.map((cat) => (
              <div 
                key={cat.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(cat.id)}
                className={`p-6 rounded-[40px] border-4 border-dashed transition-all flex flex-col items-center justify-between min-h-[180px]
                   ${placedItems[cat.id]?.length ? 'bg-white border-green-400 shadow-xl' : 'bg-white/50 border-gray-200 hover:border-blue-400'}
                `}
              >
                 <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Target Category</p>
                    <p className="text-sm font-black text-gray-800 uppercase tracking-tighter leading-tight">{cat.name}</p>
                 </div>

                 <div className="flex items-center justify-center flex-wrap gap-2">
                    {placedItems[cat.id]?.map(id => {
                       const item = ITEMS.find(i => i.id === id);
                       return (
                          <motion.div 
                            key={id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="bg-green-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                          >
                             <CheckCircle2 size={24} />
                          </motion.div>
                       );
                    })}
                    {!placedItems[cat.id]?.length && <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-200 font-black text-2xl group-hover:scale-110 transition-transform tracking-widest">?</div>}
                 </div>
              </div>
           ))}

           {/* Feedback Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-blue-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Trophy size={100} className="mb-8 animate-bounce text-yellow-300" />
                   <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Classification Master!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl italic">You have successfully identified the physical states of all homogeneous mixtures. The lab is optimized.</p>
                   <div className="flex space-x-4">
                      <Button onClick={resetGame} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Reset Pool
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-blue-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Mixer <ArrowRight size={24} className="ml-3" />
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
