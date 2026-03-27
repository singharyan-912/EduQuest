import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Utensils, 
  Wind, 
  Zap, 
  Truck, 
  Heart, 
  Droplets, 
  Trash2,
  Trophy,
  ArrowLeft,
  ChevronRight,
  Database,
  Activity,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Mini-game placeholders (to be implemented)
import { PhotosynthesisBuilder } from './MiniGames/PhotosynthesisBuilder';
import { FoodChainRunner } from './MiniGames/FoodChainRunner';
import { DigestiveJourney } from './MiniGames/DigestiveJourney';
import { EnergyGenerator } from './MiniGames/EnergyGenerator';
import { BodyDeliverySystem } from './MiniGames/BodyDeliverySystem';
import { HeartPumpSimulator } from './MiniGames/HeartPumpSimulator';
import { WaterFlowManager } from './MiniGames/WaterFlowManager';
import { WasteManager } from './MiniGames/WasteManager';

interface Station {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  gameType: 'photosynthesis' | 'nutrition' | 'digestion' | 'respiration' | 'delivery' | 'heart' | 'water' | 'waste';
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

const STATIONS: Station[] = [
  {
    id: 1,
    title: "Photosynthesis Builder",
    description: "Harness sun, water, and CO2 to power the ultimate energy factory.",
    icon: Leaf,
    color: "from-emerald-400 to-green-600",
    gameType: 'photosynthesis',
    difficulty: 'Basic'
  },
  {
    id: 2,
    title: "Food Chain Runner",
    description: "Manage energy gain and loss in the wild race for survival.",
    icon: Utensils,
    color: "from-yellow-400 to-orange-600",
    gameType: 'nutrition',
    difficulty: 'Basic'
  },
  {
    id: 3,
    title: "Digestive Journey",
    description: "Navigate the human GI tract and deploy enzymes to unlock nutrients.",
    icon: Wind,
    color: "from-rose-400 to-pink-600",
    gameType: 'digestion',
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    title: "Energy Generator",
    description: "Power the cell! Convert glucose and oxygen into pure ATP.",
    icon: Zap,
    color: "from-blue-400 to-indigo-600",
    gameType: 'respiration',
    difficulty: 'Intermediate'
  },
  {
    id: 5,
    title: "Body Delivery",
    description: "Direct vital nutrients and oxygen through the blood highway.",
    icon: Truck,
    color: "from-red-400 to-rose-700",
    gameType: 'delivery',
    difficulty: 'Intermediate'
  },
  {
    id: 6,
    title: "Heart Pump Simulator",
    description: "Control the rhythm. Maintain circulation through the 4 chambers.",
    icon: Heart,
    color: "from-rose-500 to-red-800",
    gameType: 'heart',
    difficulty: 'Advanced'
  },
  {
    id: 7,
    title: "Water Flow Manager",
    description: "Power the ascent! Manage root pressure and transpiration pull.",
    icon: Droplets,
    color: "from-cyan-400 to-blue-600",
    gameType: 'water',
    difficulty: 'Intermediate'
  },
  {
    id: 8,
    title: "Waste Manager",
    description: "The ultimate filter. Purify blood and manage plant excretion.",
    icon: Trash2,
    color: "from-amber-600 to-brown-700",
    gameType: 'waste',
    difficulty: 'Advanced'
  }
];

interface LifeProcessHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function LifeProcessHub({ chapterId, onComplete }: LifeProcessHubProps) {
  const { user, refreshProfile } = useAuth();
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
  const [completedStations, setCompletedStations] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProgress();
  }, [user]);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_chapter_progress')
        .select('completed_stations')
        .eq('user_id', user?.id)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (!error && data) {
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
      await supabase
        .from('user_chapter_progress')
        .upsert({
          user_id: user?.id,
          chapter_id: chapterId,
          completed_stations: newCompleted,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleStationComplete = async (stationId: number) => {
    if (!completedStations.includes(stationId)) {
      const newCompleted = [...completedStations, stationId];
      setCompletedStations(newCompleted);
      await saveProgress(newCompleted);
      await supabase.rpc('add_xp', { xp_to_add: 50 });
      await refreshProfile();
    }
    setActiveStationId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Activity size={48} className="text-emerald-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] p-8">
      <AnimatePresence mode="wait">
        {!activeStationId ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto space-y-12"
          >
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-emerald-100 pb-12">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="px-5 py-2 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-lg">Life Support System</span>
                     <span className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs uppercase tracking-widest">
                        <Database size={14} /> OS: BIO-KERN-10
                     </span>
                  </div>
                  <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-[0.8]">
                     The <span className="text-emerald-600">Metabolic</span> Explorer
                  </h1>
                  <p className="max-w-2xl text-xl font-bold text-slate-500 italic leading-relaxed">
                     Explore the flow of life. Regulate nutrition, respiration, transportation, and excretion through 8 synchronized modules.
                  </p>
               </div>

               <div className="flex gap-4">
                  <div className="bg-white p-6 rounded-[40px] border-4 border-emerald-50 shadow-2xl flex items-center gap-5">
                     <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                        <Trophy size={32} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Rating</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tight italic">98.4%</p>
                     </div>
                  </div>
               </div>
            </header>

            {/* Metabolic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {STATIONS.map((s, idx) => {
                  const isCompleted = completedStations.includes(s.id);
                  const Icon = s.icon;
                  
                  return (
                    <motion.div 
                      key={s.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => setActiveStationId(s.id)}
                        className="group relative w-full text-left"
                      >
                         <Card className={`relative overflow-hidden rounded-[64px] border-4 transition-all duration-500 p-8 h-[520px] flex flex-col justify-between
                           ${isCompleted ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-white hover:border-emerald-200 shadow-3xl hover:-translate-y-4'}
                         `}>
                            {/* Energy Pulse Background */}
                            <div className={`absolute top-0 right-0 w-72 h-72 -mr-24 -mt-24 bg-gradient-to-br ${s.color} opacity-5 rounded-full group-hover:scale-125 transition-transform duration-700`} />
                            
                            {/* Icon & Specs */}
                            <div className="relative z-10 flex items-start justify-between">
                               <div className={`p-7 rounded-[38px] bg-gradient-to-br ${s.color} text-white shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                                  <Icon size={44} />
                               </div>
                               <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-400 mb-1">Station 0{idx + 1}</span>
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter italic
                                     ${s.difficulty === 'Basic' ? 'bg-emerald-100 text-emerald-700' : 
                                       s.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}
                                  `}>
                                     {s.difficulty}
                                  </span>
                               </div>
                            </div>

                            {/* Info Section */}
                            <div className="relative z-10 space-y-4">
                               <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">
                                  {s.title}
                               </h3>
                               <p className="text-[13px] font-bold text-slate-400 italic leading-relaxed pr-6">
                                  {s.description}
                               </p>
                            </div>

                            {/* Interaction Footer */}
                            <div className="relative z-10 flex items-center justify-between pt-8 border-t-2 border-slate-50">
                               {isCompleted ? (
                                 <div className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                       <Activity size={16} />
                                    </div>
                                    Flow Optimized
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Ready for Flow</span>
                                 </div>
                               )}
                               <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
                                 ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:translate-x-3'}
                               `}>
                                  <ChevronRight size={28} />
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
            className="max-w-7xl mx-auto h-full"
          >
             {/* Metabolic Game View Interface */}
             <div className="flex items-center justify-between bg-white/90 backdrop-blur-2xl p-6 rounded-[40px] border-4 border-white shadow-3xl mb-12">
                <Button onClick={() => setActiveStationId(null)} variant="outline" className="hover:bg-emerald-50 rounded-2xl font-black text-emerald-600 border-2">
                   <ArrowLeft size={20} className="mr-2" /> Abort Simulation
                </Button>
                
                <div className="flex flex-col items-center">
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                     {STATIONS.find(s => s.id === activeStationId)?.title}
                   </h2>
                   <div className="flex items-center gap-2 mt-1">
                      <Sparkles size={12} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time biological flow active</span>
                   </div>
                </div>

                <div className="bg-slate-950 px-6 py-3 rounded-2xl flex items-center gap-3 border-b-4 border-emerald-500">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-white text-[10px] font-black uppercase tracking-widest italic">Live Metabolism</span>
                </div>
             </div>

             {/* Dynamic Simulation Container */}
             <div className="w-full min-h-[700px] flex items-center justify-center bg-white/30 rounded-[80px] border-4 border-dashed border-emerald-100 p-8 shadow-inner">
                {activeStationId === 1 && <PhotosynthesisBuilder onComplete={() => handleStationComplete(1)} />}
                {activeStationId === 2 && <FoodChainRunner onComplete={() => handleStationComplete(2)} />}
                {activeStationId === 3 && <DigestiveJourney onComplete={() => handleStationComplete(3)} />}
                {activeStationId === 4 && <EnergyGenerator onComplete={() => handleStationComplete(4)} />}
                {activeStationId === 5 && <BodyDeliverySystem onComplete={() => handleStationComplete(5)} />}
                {activeStationId === 6 && <HeartPumpSimulator onComplete={() => handleStationComplete(6)} />}
                {activeStationId === 7 && <WaterFlowManager onComplete={() => handleStationComplete(7)} />}
                {activeStationId === 8 && <WasteManager onComplete={() => handleStationComplete(8)} />}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
