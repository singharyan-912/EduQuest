import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  ArrowRightLeft, 
  Settings2, 
  RefreshCw,
  Trophy,
  ArrowLeft,
  ChevronRight,
  Database,
  Search,
  LayoutGrid
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Mini-game components (Placeholder imports)
import { RelationMatcher } from './MiniGames/RelationMatcher';
import { FunctionBuilder } from './MiniGames/FunctionBuilder';
import { FunctionMachine } from './MiniGames/FunctionMachine';
import { ReverseMachine } from './MiniGames/ReverseMachine';

interface Station {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  gameType: 'relation' | 'function' | 'composition' | 'inverse';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

const STATIONS: Station[] = [
  {
    id: 1,
    title: "Relation Matcher",
    description: "Build Reflexive, Symmetric, and Transitive mappings between sets.",
    icon: Network,
    color: "from-blue-500 to-indigo-600",
    gameType: 'relation',
    difficulty: 'Basic'
  },
  {
    id: 2,
    title: "Function Builder",
    description: "Map elements to create One-One and Onto functions.",
    icon: ArrowRightLeft,
    color: "from-emerald-500 to-teal-600",
    gameType: 'function',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: "Function Machine",
    description: "Visualize f(g(x)) and g(f(x)) composition step-by-step.",
    icon: Settings2,
    color: "from-orange-500 to-rose-600",
    gameType: 'composition',
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    title: "Reverse Machine",
    description: "Find the inverse of a function by reversing the logic flow.",
    icon: RefreshCw,
    color: "from-purple-500 to-pink-600",
    gameType: 'inverse',
    difficulty: 'Advanced'
  }
];

interface MathLabHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function MathLabHub({ chapterId, onComplete }: MathLabHubProps) {
  const { user, refreshProfile } = useAuth();
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
  const [completedStations, setCompletedStations] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_chapter_progress')
        .select('completed_stations')
        .eq('user_id', user?.id)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (data) {
        setCompletedStations(data.completed_stations || []);
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newCompleted: number[]) => {
    try {
      const { error: upsertError } = await supabase
        .from('user_chapter_progress')
        .upsert({
          user_id: user?.id,
          chapter_id: chapterId,
          completed_stations: newCompleted,
          updated_at: new Date().toISOString()
        });

      if (upsertError) throw upsertError;
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleStationComplete = async (stationId: number) => {
    if (!completedStations.includes(stationId)) {
      const newCompleted = [...completedStations, stationId];
      setCompletedStations(newCompleted);
      await saveProgress(newCompleted);
      
      // Award XP
      await supabase.rpc('add_xp', { xp_to_add: 50 });
      await refreshProfile();
    }
    setActiveStationId(null);
  };

  const station = STATIONS.find(s => s.id === activeStationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Settings2 size={48} className="text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <AnimatePresence mode="wait">
        {!activeStationId ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto space-y-12"
          >
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-200 pb-12">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="px-4 py-1.5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest italic">Math Experiment 02</span>
                     <span className="flex items-center gap-1.5 text-slate-400 font-extrabold text-xs uppercase tracking-widest">
                        <Database size={14} /> ID: REL-FUN-2026
                     </span>
                  </div>
                  <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
                     Math Lab <span className="text-blue-600">Explorer</span>
                  </h1>
                  <p className="max-w-2xl text-xl font-bold text-slate-500 leading-relaxed italic">
                     Welcome to the Relations & Functions laboratory. Map the connections, build logic machines, and decode the underlying patterns of mathematics.
                  </p>
               </div>

               <div className="flex gap-4">
                  <div className="bg-white p-6 rounded-[32px] border-4 border-slate-200 shadow-xl flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                        <Trophy size={32} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight italic">#12,240</p>
                     </div>
                  </div>
               </div>
            </header>

            {/* Station Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
               <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 hidden lg:block" />
               
               {STATIONS.map((s, idx) => {
                  const isCompleted = completedStations.includes(s.id);
                  const Icon = s.icon;
                  
                  return (
                    <motion.div 
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <button
                        onClick={() => setActiveStationId(s.id)}
                        className="group relative w-full text-left"
                      >
                         <Card className={`relative overflow-hidden rounded-[56px] border-4 transition-all duration-500 p-8 h-[500px] flex flex-col justify-between
                           ${isCompleted ? 'bg-slate-50 border-slate-200' : 'bg-white border-white hover:border-slate-300 shadow-2xl hover:-translate-y-4'}
                         `}>
                            {/* Visual Background */}
                            <div className={`absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 bg-gradient-to-br ${s.color} opacity-5 rounded-full`} />
                            
                            {/* Top info */}
                            <div className="relative z-10 flex items-start justify-between">
                               <div className={`p-6 rounded-[32px] bg-gradient-to-br ${s.color} text-white shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                                  <Icon size={40} />
                               </div>
                               <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-400">Station {idx + 1}</span>
                                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mt-1 italic
                                     ${s.difficulty === 'Basic' ? 'bg-emerald-100 text-emerald-700' : 
                                       s.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'}
                                  `}>
                                     {s.difficulty}
                                  </span>
                               </div>
                            </div>

                            {/* Center Info */}
                            <div className="relative z-10 space-y-4">
                               <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                                  {s.title}
                                </h3>
                               <p className="text-sm font-bold text-slate-500 leading-relaxed italic pr-4">
                                  {s.description}
                               </p>
                            </div>

                            {/* Completion Status */}
                            <div className="relative z-10 flex items-center justify-between pt-8 border-t-2 border-slate-50">
                               {isCompleted ? (
                                 <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-xs">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                       <LayoutGrid size={16} />
                                    </div>
                                    Sync Complete
                                 </div>
                               ) : (
                                 <div className="text-slate-400 font-extrabold uppercase text-xs flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                                    Awaiting Mapping
                                 </div>
                               )}
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                                 ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-2'}
                               `}>
                                  <ChevronRight size={24} />
                               </div>
                            </div>
                         </Card>
                      </button>
                    </motion.div>
                  );
               })}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-7xl mx-auto"
          >
             {/* Game Header */}
             <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border-2 border-white shadow-xl mb-8">
                <Button onClick={() => setActiveStationId(null)} variant="outline" className="hover:bg-slate-100 rounded-2xl font-black text-slate-400">
                   <ArrowLeft size={20} className="mr-2" /> Back to Lab Map
                </Button>
                
                <div className="flex flex-col items-center">
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{station?.title}</h2>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Experiment active</span>
                </div>

                <div className="bg-slate-900 px-6 py-3 rounded-2xl flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-white text-[10px] font-black uppercase tracking-widest italic">Live Processing</span>
                </div>
             </div>

             {/* Game View */}
             <div className="w-full h-full min-h-[600px] flex items-center justify-center">
                {station?.gameType === 'relation' ? (
                  <RelationMatcher onComplete={() => handleStationComplete(1)} />
                ) : station?.gameType === 'function' ? (
                  <FunctionBuilder onComplete={() => handleStationComplete(2)} />
                ) : station?.gameType === 'composition' ? (
                  <FunctionMachine onComplete={() => handleStationComplete(3)} />
                ) : station?.gameType === 'inverse' ? (
                  <ReverseMachine onComplete={() => handleStationComplete(4)} />
                ) : (
                  <div className="text-center space-y-4">
                     <p className="text-2xl font-black text-slate-300 uppercase italic">Station under maintenance</p>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
