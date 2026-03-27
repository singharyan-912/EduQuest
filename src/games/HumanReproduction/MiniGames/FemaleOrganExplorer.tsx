import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Info, 
  ArrowRight,
  Eye,
  Activity,
  Trophy,
  Zap
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface OrganInfo {
  id: string;
  name: string;
  description: string;
  function: string;
  color: string;
}

const ORGANS: OrganInfo[] = [
  { 
    id: 'ovary', 
    name: 'Ovary', 
    description: 'Primary female sex organs.', 
    function: 'Produce eggs (ova) and hormones (estrogen/progesterone).',
    color: 'text-rose-500' 
  },
  { 
    id: 'fallopian', 
    name: 'Fallopian Tube', 
    description: 'Ciliated duct leading to the uterus.', 
    function: 'Site of fertilisation and passage for the egg.',
    color: 'text-pink-500' 
  },
  { 
    id: 'uterus', 
    name: 'Uterus (Womb)', 
    description: 'Pear-shaped muscular organ.', 
    function: 'Suppports embryonic development and implantation.',
    color: 'text-fuchsia-500' 
  },
  { 
    id: 'cervix', 
    name: 'Cervix', 
    description: 'Lower part of the uterus.', 
    function: 'Connects the uterus to the vagina.',
    color: 'text-purple-500' 
  }
];

interface FemaleOrganExplorerProps {
  onComplete: () => void;
}

export function FemaleOrganExplorer({ onComplete }: FemaleOrganExplorerProps) {
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [activeOrganId, setActiveOrganId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOrganClick = (id: string) => {
    setActiveOrganId(id);
    if (!discoveredIds.includes(id)) {
      setDiscoveredIds(prev => [...prev, id]);
    }
    
    if (discoveredIds.length + (discoveredIds.includes(id) ? 0 : 1) === ORGANS.length) {
      setTimeout(() => setIsSuccess(true), 2000);
    }
  };

  const activeOrgan = ORGANS.find(o => o.id === activeOrganId);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Anatomical Visualizer */}
        <div className="lg:col-span-8 bg-pink-50/30 rounded-[80px] border-8 border-white shadow-inner relative flex items-center justify-center p-12 overflow-hidden min-h-[600px]">
           
           {/* Microscope View Effect */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none" />

           {/* Interactive Diagram (Simplified Vector Representation) */}
           <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Uterus & Cervix */}
              <motion.button
                onClick={() => handleOrganClick('uterus')}
                whileHover={{ scale: 1.05 }}
                className={`absolute w-32 h-40 bg-pink-200 rounded-[50%_50%_40%_40%] border-4 shadow-xl transition-all flex items-center justify-center
                  ${activeOrganId === 'uterus' ? 'border-fuchsia-500 shadow-fuchsia-200' : 'border-pink-300 hover:border-pink-400'}
                `}
              >
                 <div className="w-16 h-20 border-2 border-fuchsia-400/20 rounded-full" />
              </motion.button>

              <motion.button
                onClick={() => handleOrganClick('cervix')}
                whileHover={{ scale: 1.1 }}
                className={`absolute w-12 h-16 bg-pink-300 rounded-full border-2 bottom-[30%] left-1/2 -translate-x-1/2 shadow-lg z-10
                  ${activeOrganId === 'cervix' ? 'border-purple-500' : 'border-pink-400'}
                `}
              />

              {/* Fallopian Tubes & Ovaries (Mirrored) */}
              {[1, -1].map((side) => (
                <div key={side} className="contents">
                  {/* Tube */}
                  <motion.button
                    onClick={() => handleOrganClick('fallopian')}
                    whileHover={{ scale: 1.05 }}
                    style={{ scaleX: side }}
                    className={`absolute w-40 h-8 bg-pink-200 top-[40%] left-1/2 rounded-full border-4 origin-left
                      ${activeOrganId === 'fallopian' ? 'border-pink-500' : 'border-pink-300'}
                    `}
                  />
                  {/* Ovary */}
                  <motion.button
                    onClick={() => handleOrganClick('ovary')}
                    whileHover={{ scale: 1.1 }}
                    className={`absolute w-16 h-12 bg-rose-200 rounded-full border-4 top-[35%] z-20 shadow-md flex items-center justify-center
                      ${side === 1 ? 'right-12' : 'left-12'}
                      ${activeOrganId === 'ovary' ? 'border-rose-500 scale-110 shadow-rose-200' : 'border-rose-300 hover:border-rose-400'}
                    `}
                  >
                     <Zap size={16} className={`text-rose-400 ${activeOrganId === 'ovary' ? 'animate-pulse' : 'opacity-0'}`} />
                  </motion.button>
                </div>
              ))}

              {/* Discovery Counters */}
              <div className="absolute top-12 left-12 bg-white/80 backdrop-blur px-6 py-4 rounded-[32px] border-4 border-pink-100 shadow-xl flex items-center space-x-3">
                 <Eye className="text-pink-500" size={24} />
                 <span className="text-xl font-black text-pink-700 tracking-tighter uppercase">{discoveredIds.length} / {ORGANS.length} Identified</span>
              </div>
           </div>

           {/* Success Overlay */}
           <AnimatePresence>
              {isSuccess && (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 bg-pink-600/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white text-center p-12"
                >
                   <Trophy size={100} className="mb-8 animate-bounce text-yellow-300" />
                   <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">Anatomy Decoded!</h2>
                   <p className="text-2xl font-bold opacity-80 mb-12 max-w-2xl">You have successfully identified the core structures of the female reproductive system and their physiological roles.</p>
                   <div className="flex space-x-4">
                      <Button onClick={() => setDiscoveredIds([])} variant="outline" className="border-white/20 text-white font-black hover:bg-white/10 rounded-2xl">
                         <RotateCcw size={20} className="mr-2" /> Restart Lab
                      </Button>
                      <Button onClick={onComplete} className="bg-white text-pink-600 font-black px-12 py-5 rounded-[32px] shadow-2xl hover:scale-105 transition-transform flex items-center text-xl">
                         Advance to Gametogenesis <ArrowRight size={24} className="ml-3" />
                      </Button>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-4 space-y-6">
           <AnimatePresence mode="wait">
              {activeOrgan ? (
                <motion.div
                  key={activeOrgan.id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="bg-white p-10 rounded-[48px] border-4 border-pink-100 shadow-2xl space-y-8"
                >
                   <header className="space-y-2">
                      <div className={`text-sm font-black uppercase tracking-widest ${activeOrgan.color} flex items-center`}>
                         <Activity size={16} className="mr-2" /> Structural Detail
                      </div>
                      <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">{activeOrgan.name}</h3>
                   </header>

                   <div className="space-y-6">
                      <div className="bg-pink-50 p-6 rounded-3xl space-y-2">
                         <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Anatomical Description</p>
                         <p className="text-lg font-bold text-gray-700 leading-snug">{activeOrgan.description}</p>
                      </div>
                      <div className="bg-fuchsia-50 p-6 rounded-3xl space-y-2">
                         <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">Primary Function</p>
                         <p className="text-lg font-bold text-gray-700 leading-snug">{activeOrgan.function}</p>
                      </div>
                   </div>

                   <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between text-gray-400 italic font-bold">
                      <span className="text-xs">Discovery Phase Complete</span>
                      <CheckCircle2 size={24} className="text-green-500" />
                   </div>
                </motion.div>
              ) : (
                <div className="bg-white p-10 rounded-[48px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                   <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                      <Eye size={48} />
                   </div>
                   <p className="text-xl font-black text-gray-300 uppercase tracking-tighter">Click on an organ to explore its biological role</p>
                </div>
              )}
           </AnimatePresence>

           <Card className="p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl">
              <div className="flex items-start space-x-3 text-rose-800">
                 <Info size={24} className="shrink-0" />
                 <p className="text-sm font-bold leading-relaxed italic">
                    The female reproductive system is designed for hormone production, egg release, and supporting life during pregnancy. Each organ has a specific, vital role.
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
