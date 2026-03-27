import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Dna, 
  Activity, 
  Baby, 
  Heart, 
  ArrowLeft, 
  Trophy, 
  Sparkles,
  Gamepad2,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Waves
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Mini-game components
import { MaleSystemBuilder } from './MiniGames/MaleSystemBuilder';
import { FemaleOrganExplorer } from './MiniGames/FemaleOrganExplorer';
import { GametogenesisSim } from './MiniGames/GametogenesisSim';
import { CycleManager } from './MiniGames/CycleManager';
import { JourneyToLife } from './MiniGames/JourneyToLife';
import { GrowthTimeline } from './MiniGames/GrowthTimeline';
import { BirthSimulator } from './MiniGames/BirthSimulator';

interface Station {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gameType: string;
}

const STATIONS: Station[] = [
  { 
    id: 1, 
    title: "1. Male System", 
    description: "Build the System: Assemble the male reproductive anatomy.", 
    icon: <User size={32} />, 
    color: "from-blue-400 to-indigo-500",
    gameType: "male_system"
  },
  { 
    id: 2, 
    title: "2. Female System", 
    description: "Organ Explorer: Interactive guide to female anatomy.", 
    icon: <User size={32} className="text-pink-200" />, 
    color: "from-pink-400 to-rose-500",
    gameType: "female_system"
  },
  { 
    id: 3, 
    title: "3. Gametogenesis", 
    description: "Cell Factory: Simulate meiosis and gamete formation.", 
    icon: <Dna size={32} />, 
    color: "from-purple-400 to-fuchsia-500",
    gameType: "gametogenesis"
  },
  { 
    id: 4, 
    title: "4. Menstrual Cycle", 
    description: "Cycle Manager: Master the hormonal rhythms.", 
    icon: <Activity size={32} />, 
    color: "from-red-400 to-orange-500",
    gameType: "menstrual_cycle"
  },
  { 
    id: 5, 
    title: "5. Fertilisation", 
    description: "Journey to Life: Guide the spark of new life.", 
    icon: <Sparkles size={32} />, 
    color: "from-yellow-400 to-amber-500",
    gameType: "fertilisation"
  },
  { 
    id: 6, 
    title: "6. Embryo Growth", 
    description: "Growth Timeline: Witness the miracle of development.", 
    icon: <Baby size={32} />, 
    color: "from-green-400 to-emerald-500",
    gameType: "pregnancy"
  },
  { 
    id: 7, 
    title: "7. Birth & Care", 
    description: "Birth Simulator: Navigate parturition and lactation.", 
    icon: <Waves size={32} />, 
    color: "from-cyan-400 to-teal-500",
    gameType: "birth"
  }
];

interface HumanBodyLabHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function HumanBodyLabHub({ chapterId, onComplete }: HumanBodyLabHubProps) {
  const { profile, refreshProfile } = useAuth();
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
  const [completedStations, setCompletedStations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from Supabase
  useEffect(() => {
    if (!profile || !chapterId) return;

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_chapter_progress')
          .select('game_progress')
          .eq('user_id', profile.id)
          .eq('chapter_id', chapterId)
          .maybeSingle();

        if (!error && data?.game_progress) {
          const parsed = typeof data.game_progress === 'string' ? JSON.parse(data.game_progress) : data.game_progress;
          if (parsed.completed_stations) {
            setCompletedStations(parsed.completed_stations);
          }
        }
      } catch (e) {
        console.error("Error fetching human reproduction progress:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [profile, chapterId]);

  // Save progress to Supabase
  useEffect(() => {
    if (!profile || !chapterId || isLoading) return;

    const saveProgress = async () => {
      try {
        await supabase
          .from('user_chapter_progress')
          .upsert({
            user_id: profile.id,
            chapter_id: chapterId,
            game_progress: {
              completed_stations: completedStations
            },
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,chapter_id' });
      } catch (e) {
        console.error("Error saving human reproduction progress:", e);
      }
    };

    saveProgress();
  }, [completedStations, profile, chapterId, isLoading]);

  const handleStationComplete = async (stationId: number) => {
    if (!completedStations.includes(stationId)) {
      setCompletedStations(prev => [...prev, stationId]);
      const { error } = await supabase.rpc('add_xp', { amount: 150 });
      if (!error) refreshProfile();
    }
    setActiveStationId(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-black animate-pulse uppercase tracking-widest">Accessing Human Body Lab...</p>
      </div>
    );
  }

  // Station Detail View (Mini-Game Placeholder)
  if (activeStationId !== null) {
    const station = STATIONS.find(s => s.id === activeStationId);
    return (
      <div className="w-full min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-12">
            <Button 
              variant="outline" 
              onClick={() => setActiveStationId(null)}
              className="rounded-3xl border-4 hover:bg-gray-50 font-black uppercase tracking-tight scale-110"
            >
              <ArrowLeft size={20} className="mr-2" /> Body Map
            </Button>
            <div className="flex items-center space-x-6">
              <span className={`px-8 py-3 rounded-[32px] text-white font-black text-lg shadow-xl bg-gradient-to-r ${station?.color}`}>
                Mission {station?.id}: {station?.title.split('. ')[1]}
              </span>
            </div>
          </header>

          <Card className="p-16 min-h-[700px] flex flex-col items-center justify-center bg-gray-50/50 border-8 border-gray-100 rounded-[80px] shadow-inner relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)] pointer-events-none" />
             
             {/* Dynamic Mini-Game Rendering */}
             <div className="relative z-10 w-full text-center">
                {station?.gameType === 'male_system' ? (
                  <MaleSystemBuilder onComplete={() => handleStationComplete(1)} />
                ) : station?.gameType === 'female_system' ? (
                  <FemaleOrganExplorer onComplete={() => handleStationComplete(2)} />
                ) : station?.gameType === 'gametogenesis' ? (
                  <GametogenesisSim onComplete={() => handleStationComplete(3)} />
                ) : station?.gameType === 'menstrual_cycle' ? (
                  <CycleManager onComplete={() => handleStationComplete(4)} />
                ) : station?.gameType === 'fertilisation' ? (
                  <JourneyToLife onComplete={() => handleStationComplete(5)} />
                ) : station?.gameType === 'pregnancy' ? (
                  <GrowthTimeline onComplete={() => handleStationComplete(6)} />
                ) : station?.gameType === 'birth' ? (
                  <BirthSimulator onComplete={() => handleStationComplete(7)} />
                ) : (
                  <>
                    <div className={`w-40 h-40 rounded-[48px] bg-gradient-to-r ${station?.color} mx-auto mb-12 flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform duration-500`}>
                       {station?.icon}
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">
                       {station?.title.split('. ')[1]} Simulator
                    </h2>
                    <p className="text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-bold leading-relaxed">
                       Prepare for a high-fidelity biological journey. This interactive mission is designed to teach complex processes through direct interaction.
                    </p>
                    <Button 
                      onClick={() => handleStationComplete(activeStationId)}
                      className={`bg-gradient-to-r ${station?.color} text-white px-16 py-10 rounded-[40px] text-3xl font-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform active:scale-95`}
                    >
                       Complete Mission (Dev Bypass)
                    </Button>
                  </>
                )}
             </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-16">
      <header className="text-center space-y-8 relative">
        <motion.div 
          initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-8 bg-blue-50 rounded-[48px] text-blue-600 mb-4 border-8 border-white shadow-2xl"
        >
          <Stethoscope size={80} className="animate-pulse" />
        </motion.div>
        
        <div className="space-y-4">
           <h1 className="text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
             Human Body <span className="text-blue-600">Lab Hub</span>
           </h1>
           <p className="text-3xl text-gray-400 font-bold max-w-4xl mx-auto italic tracking-tight">
             Step into the ultimate biological simulator and decode the miracle of human life.
           </p>
        </div>

        <div className="flex justify-center items-center space-x-8 pt-8">
           <div className="bg-white px-8 py-4 rounded-[32px] shadow-xl border-4 border-blue-50 flex items-center space-x-4">
              <Trophy className="text-yellow-500" size={32} />
              <span className="text-xl font-black text-gray-800 tracking-tight uppercase">{completedStations.length} / {STATIONS.length} Secrets Unlocked</span>
           </div>
           <div className="bg-white px-8 py-4 rounded-[32px] shadow-xl border-4 border-blue-50 flex items-center space-x-4">
              <Sparkles className="text-blue-500" size={32} />
              <span className="text-xl font-black text-gray-800 tracking-tight uppercase">{profile?.xp || 0} Body Tech XP</span>
           </div>
        </div>
      </header>

      {/* Lab Stations Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-32">
        {STATIONS.map((station, idx) => {
          const isCompleted = completedStations.includes(station.id);
          
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <Card 
                className={`p-10 rounded-[64px] border-8 transition-all duration-500 relative overflow-hidden group h-full flex flex-col cursor-pointer
                  ${isCompleted ? 'border-green-200 bg-green-50/20' : 'border-white bg-white hover:border-blue-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]'}
                `}
                onClick={() => setActiveStationId(station.id)}
              >
                {isCompleted && (
                  <div className="absolute top-8 right-10 text-green-500 scale-150">
                    <CheckCircle2 size={32} />
                  </div>
                )}

                <div className={`w-24 h-24 rounded-[40px] bg-gradient-to-br ${station.color} flex items-center justify-center text-white shadow-xl mb-10 group-hover:rotate-12 transition-transform duration-300`}>
                  {station.icon}
                </div>

                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                    {station.title}
                  </h3>
                  <p className="text-gray-400 font-bold text-base leading-relaxed">
                    {station.description}
                  </p>
                </div>

                <div className="pt-10 flex items-center font-black text-sm uppercase tracking-widest text-blue-600 group-hover:translate-x-4 transition-transform">
                  <span>{isCompleted ? 'Re-Initiate' : 'Initiate Mission'}</span>
                  <ChevronRight size={20} className="ml-2" />
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Sandbox Exploratorium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -10 }}
          className="md:col-span-2 lg:col-span-1 xl:col-span-1"
        >
          <Card className="p-10 rounded-[64px] border-8 border-dashed border-gray-100 bg-gray-50/50 h-full flex flex-col justify-center items-center text-center space-y-8 group cursor-pointer hover:border-solid hover:bg-blue-50 transition-all duration-300">
             <div className="w-28 h-28 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-blue-400 shadow-xl group-hover:scale-110 group-hover:text-blue-600 transition-all">
                <Gamepad2 size={56} />
             </div>
             <div>
                <h3 className="text-3xl font-black text-gray-400 uppercase italic tracking-tighter group-hover:text-blue-900 transition-colors">Free Explorer</h3>
                <p className="text-gray-300 font-bold text-sm tracking-widest uppercase mt-2 group-hover:text-blue-400 transition-colors">Sandbox Simulation</p>
             </div>
          </Card>
        </motion.div>
      </div>

      {completedStations.length === STATIONS.length && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-20 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[80px] text-center text-white shadow-[0_40px_100px_rgba(37,99,235,0.4)] border-8 border-white/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <Heart size={150} className="mx-auto mb-12 text-pink-400 drop-shadow-[0_0_50px_rgba(244,114,182,0.5)] animate-pulse" />
          <h2 className="text-7xl font-black mb-8 uppercase italic tracking-tighter leading-none">Biological Mastermind</h2>
          <p className="text-3xl font-bold mb-16 max-w-4xl mx-auto text-blue-100 leading-tight">
            You've successfully decoded the most complex machine in existence—the human body. Your expertise in life sciences is now complete.
          </p>
          <Button 
            onClick={onComplete}
            className="bg-white text-blue-900 hover:bg-blue-50 rounded-[40px] px-20 py-12 text-4xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase italic tracking-tighter"
          >
            Claim Grand Surgeon Badge
          </Button>
        </motion.div>
      )}
    </div>
  );
}
