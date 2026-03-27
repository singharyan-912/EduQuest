import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Beaker, 
  FlaskConical, 
  Droplet, 
  Thermometer, 
  Wind, 
  Layers, 
  Binary, 
  Zap,
  LayoutGrid,
  Trophy,
  ArrowLeft,
  ChevronRight,
  Database,
  Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Mini-game components
import { SolutionSorter } from './MiniGames/SolutionSorter';
import { ConcentrationMixer } from './MiniGames/ConcentrationMixer';
import { DissolveMaster } from './MiniGames/DissolveMaster';
import { EscapeSimulator } from './MiniGames/EscapeSimulator';
import { MixingBehaviorLab } from './MiniGames/MixingBehaviorLab';
import { BoilingFreezingLab } from './MiniGames/BoilingFreezingLab';
import { FindUnknownMolarMass } from './MiniGames/FindUnknownMolarMass';
import { AssociationBreaker } from './MiniGames/AssociationBreaker';

interface Station {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  gameType: string;
}

const STATIONS: Station[] = [
  {
    id: 1,
    title: "1. Solution Sorter",
    description: "Classify mixtures based on solute-solvent physical states.",
    icon: <LayoutGrid size={32} />,
    color: "from-blue-500 to-cyan-500",
    gameType: "sorter"
  },
  {
    id: 2,
    title: "2. Concentration Mixer",
    description: "Master Molarity, Molality, and Percentage through mixing.",
    icon: <Beaker size={32} />,
    color: "from-purple-500 to-indigo-500",
    gameType: "mixer"
  },
  {
    id: 3,
    title: "3. Dissolve Master",
    description: "Simulate solubility limits and temperature effects.",
    icon: <FlaskConical size={32} />,
    color: "from-amber-500 to-orange-500",
    gameType: "dissolve"
  },
  {
    id: 4,
    title: "4. Escape Simulator",
    description: "Visualize Vapour Pressure at the particle level.",
    icon: <Wind size={32} />,
    color: "from-sky-500 to-blue-600",
    gameType: "vapour"
  },
  {
    id: 5,
    title: "5. Mixing Behavior Lab",
    description: "Ideal vs Non-ideal solutions and intermolecular forces.",
    icon: <Binary size={32} />,
    color: "from-rose-500 to-pink-500",
    gameType: "mixing_lab"
  },
  {
    id: 6,
    title: "6. Boiling & Freezing Lab",
    description: "Observe Colligative properties in real-time.",
    icon: <Thermometer size={32} />,
    color: "from-emerald-500 to-teal-500",
    gameType: "colligative"
  },
  {
    id: 7,
    title: "7. Find the Unknown",
    description: "Determine Molar Mass using boiling point elevation.",
    icon: <Search size={32} />,
    color: "from-violet-500 to-purple-600",
    gameType: "molar_mass"
  },
  {
    id: 8,
    title: "8. Association Breaker",
    description: "Visualize abnormal molar mass & Van't Hoff factor.",
    icon: <Layers size={32} />,
    color: "from-orange-500 to-red-500",
    gameType: "van_thoff"
  }
];

interface ChemistryLabHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function ChemistryLabHub({ chapterId, onComplete }: ChemistryLabHubProps) {
  const { user, refreshProfile } = useAuth();
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
  const [completedStations, setCompletedStations] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [user, chapterId]);

  const loadProgress = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_chapter_progress')
        .select('completed_stations')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .single();

      if (data?.completed_stations) {
        setCompletedStations(data.completed_stations as number[]);
      }
    } catch (err) {
      console.error('Error loading chemistry progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newCompleted: number[]) => {
    if (!user) return;
    try {
      await supabase.from('user_chapter_progress').upsert({
        user_id: user.id,
        chapter_id: chapterId,
        completed_stations: newCompleted,
        last_accessed: new Promise(resolve => resolve(new Date().toISOString()))
      });
    } catch (err) {
      console.error('Error saving chemistry progress:', err);
    }
  };

  const handleStationComplete = async (id: number) => {
    if (!completedStations.includes(id)) {
      const newCompleted = [...completedStations, id];
      setCompletedStations(newCompleted);
      await saveProgress(newCompleted);
      
      // Add XP via Supabase RPC
      await supabase.rpc('add_xp', { amount: 150 });
      await refreshProfile();
    }
    setActiveStationId(null);
  };

  const station = STATIONS.find(s => s.id === activeStationId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <FlaskConical size={64} className="text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {activeStationId === null ? (
          <motion.div 
            key="hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto space-y-12"
          >
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[48px] border-4 border-blue-100 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
               <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center space-x-3 bg-blue-600 text-white px-6 py-2 rounded-2xl font-black uppercase tracking-widest text-xs">
                     <Database size={16} /> <span>Chemistry Lab Map</span>
                  </div>
                  <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                     Solutions <span className="text-blue-600">Sim Lab</span>
                  </h1>
                  <p className="text-xl text-gray-400 font-bold max-w-xl">
                     Explore the microscopic world of molecules. Master concentration, solubility, and colligative properties through high-fidelity simulations.
                  </p>
               </div>
               
               <div className="relative z-10 bg-blue-50 p-8 rounded-[40px] border-2 border-blue-100 flex flex-col items-center">
                  <div className="text-4xl font-black text-blue-600 mb-1">{completedStations.length}/{STATIONS.length}</div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Missions Complete</div>
                  <div className="w-48 h-3 bg-blue-200 rounded-full mt-4 overflow-hidden shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${(completedStations.length / STATIONS.length) * 100}%` }}
                        className="h-full bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.5)]"
                     />
                  </div>
               </div>
            </header>

            {/* Stations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {STATIONS.map((station) => (
                  <Card 
                    key={station.id}
                    onClick={() => setActiveStationId(station.id)}
                    className="p-8 rounded-[48px] border-4 border-gray-100 hover:border-blue-400 transition-all duration-500 cursor-pointer group bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden"
                  >
                     {completedStations.includes(station.id) && (
                        <div className="absolute top-6 right-6 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg z-20">
                           <Trophy size={20} />
                        </div>
                     )}

                     <div className={`w-20 h-20 rounded-[32px] bg-gradient-to-br ${station.color} mb-8 flex items-center justify-center text-white shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500`}>
                        {station.icon}
                     </div>

                     <h3 className="text-2xl font-black text-gray-800 mb-3 tracking-tighter uppercase leading-tight group-hover:text-blue-600 transition-colors">
                        {station.title}
                     </h3>
                     <p className="text-sm font-bold text-gray-400 leading-relaxed group-hover:text-gray-600 transition-colors">
                        {station.description}
                     </p>

                     <div className="mt-8 pt-6 border-t-2 border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Mission Active</span>
                        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-2 shadow-sm">
                           <ChevronRight size={20} />
                        </div>
                     </div>
                  </Card>
               ))}
            </div>

            {/* Sandbox Mode & Final Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 pb-20">
               <Card className="lg:col-span-2 p-10 rounded-[56px] bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-white/10 shadow-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/microfabrics.png')]" />
                  <div className="relative z-10 w-32 h-32 bg-white/10 backdrop-blur-xl rounded-[40px] flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 shrink-0">
                     <Binary size={64} className="animate-pulse" />
                  </div>
                  <div className="relative z-10 space-y-4">
                     <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Chemistry Sandbox Exploratorium</h2>
                     <p className="text-slate-400 font-bold text-lg leading-relaxed">
                        Experiment freely with any solute and solvent combinations. Observe particle behavior and phase changes without constraints.
                     </p>
                     <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-black px-10 py-4 rounded-2xl text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                        Enter Sandbox Mode <Zap size={20} className="fill-slate-900" />
                     </Button>
                  </div>
               </Card>

               <div className="flex flex-col justify-between space-y-8">
                  <Card className="p-8 rounded-[48px] bg-white border-4 border-gray-100 flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <Droplet size={32} />
                     </div>
                     <div>
                        <div className="text-xs font-black text-slate-300 uppercase tracking-widest">Global Status</div>
                        <div className="text-2xl font-black text-gray-800 tracking-tighter">Liquid Dynamics</div>
                     </div>
                  </Card>
                  
                  {completedStations.length === STATIONS.length && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-600 p-10 rounded-[56px] text-white text-center space-y-6 shadow-2xl border-4 border-white/20"
                    >
                       <Trophy size={64} className="mx-auto" />
                       <h2 className="text-4xl font-black leading-none tracking-tighter uppercase italic">Sim Master Unlocked!</h2>
                       <Button onClick={onComplete} className="w-full bg-white text-green-600 font-black py-6 rounded-3xl text-xl hover:bg-green-50">
                          Claim Badge & Finish
                       </Button>
                    </motion.div>
                  )}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="game" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto space-y-8"
          >
             {/* Game Header */}
             <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-[32px] border-2 border-white shadow-xl">
                <Button onClick={() => setActiveStationId(null)} variant="outline" className="hover:bg-slate-100 rounded-2xl font-black text-slate-400">
                   <ArrowLeft size={20} className="mr-2" /> Back to Lab Map
                </Button>
                
                <div className="flex flex-col items-center">
                   <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">{station?.title.split('. ')[1]}</h2>
                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest tracking-[0.3em]">Chemistry Simulation Module</div>
                </div>

                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <Trophy size={20} />
                   </div>
                   <div className="px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-xs">150 XP</div>
                </div>
             </div>

             {/* Dynamic Mini-Game Rendering */}
             <Card className="bg-white border-4 border-white shadow-3xl rounded-[64px] min-h-[600px] flex items-center justify-center p-12 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                
                <div className="relative z-10 w-full text-center">
                   {station?.gameType === 'sorter' ? (
                     <SolutionSorter onComplete={() => handleStationComplete(1)} />
                   ) : station?.gameType === 'mixer' ? (
                     <ConcentrationMixer onComplete={() => handleStationComplete(2)} />
                   ) : station?.gameType === 'dissolve' ? (
                     <DissolveMaster onComplete={() => handleStationComplete(3)} />
                   ) : station?.gameType === 'vapour' ? (
                     <EscapeSimulator onComplete={() => handleStationComplete(4)} />
                   ) : station?.gameType === 'mixing_lab' ? (
                     <MixingBehaviorLab onComplete={() => handleStationComplete(5)} />
                   ) : station?.gameType === 'colligative' ? (
                     <BoilingFreezingLab onComplete={() => handleStationComplete(6)} />
                   ) : station?.gameType === 'molar_mass' ? (
                     <FindUnknownMolarMass onComplete={() => handleStationComplete(7)} />
                   ) : station?.gameType === 'van_thoff' ? (
                     <AssociationBreaker onComplete={() => handleStationComplete(8)} />
                   ) : (
                     <>
                       <div className={`w-40 h-40 rounded-[48px] bg-gradient-to-r ${station?.color} mx-auto mb-12 flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform duration-500`}>
                          {station?.icon}
                       </div>
                       <h2 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">
                          {station?.title.split('. ')[1]} Simulator
                       </h2>
                       <p className="text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-bold leading-relaxed">
                          Enter the microscopic realm. Use particle-level simulations to master this chemistry concept.
                       </p>
                       <Button 
                         onClick={() => station && handleStationComplete(station.id)}
                         className={`bg-gradient-to-r ${station?.color} text-white px-16 py-10 rounded-[40px] text-3xl font-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform active:scale-95`}
                       >
                          Complete Mission (Dev Bypass)
                       </Button>
                     </>
                   )}
                </div>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
