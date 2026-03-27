import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flower2, 
  Bug, 
  Target, 
  Leaf, 
  ArrowLeft, 
  Trophy, 
  Sparkles,
  Gamepad2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

// Mini-game components
import { BuildAFlower } from './MiniGames/BuildAFlower';
import { PollenJourney } from './MiniGames/PollenJourney';
import { FusionMission } from './MiniGames/FusionMission';
import { SeedBuilder } from './MiniGames/SeedBuilder';
import { ApomixisSim } from './MiniGames/ApomixisSim';

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
    title: "1. Flower Structure", 
    description: "Build-a-Flower: Assemble the parts of a perfect flower.", 
    icon: <Flower2 size={32} />, 
    color: "from-pink-400 to-rose-500",
    gameType: "build_flower"
  },
  { 
    id: 2, 
    title: "2. Pre-Fertilisation", 
    description: "Pollen Journey: Guide the pollen grain to the stigma.", 
    icon: <Bug size={32} />, 
    color: "from-yellow-400 to-orange-500",
    gameType: "pollen_journey"
  },
  { 
    id: 3, 
    title: "3. Double Fertilisation", 
    description: "Fusion Mission: Navigate the male gametes inside the ovule.", 
    icon: <Target size={32} />, 
    color: "from-purple-400 to-indigo-500",
    gameType: "fusion_mission"
  },
  { 
    id: 4, 
    title: "4. Post-Fertilisation", 
    description: "Seed Builder: Watch the transformation into seeds and fruits.", 
    icon: <Sparkles size={32} />, 
    color: "from-green-400 to-emerald-500",
    gameType: "seed_builder"
  },
  { 
    id: 5, 
    title: "5. Special Modes", 
    description: "Clone vs Multi-Life: Explore Apomixis and Polyembryony.", 
    icon: <Leaf size={32} />, 
    color: "from-cyan-400 to-blue-500",
    gameType: "apomixis_sim"
  }
];

interface FlowerLabHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function FlowerLabHub({ chapterId, onComplete }: FlowerLabHubProps) {
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
        console.error("Error fetching biology progress:", e);
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
        console.error("Error saving biology progress:", e);
      }
    };

    saveProgress();
  }, [completedStations, profile, chapterId, isLoading]);

  const handleStationComplete = async (stationId: number) => {
    if (!completedStations.includes(stationId)) {
      setCompletedStations(prev => [...prev, stationId]);
      
      // Award XP via RPC or similar (assumed helper exists in context or lib)
      const { error } = await supabase.rpc('add_xp', { amount: 100 });
      if (!error) refreshProfile();
    }
    setActiveStationId(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-pink-600 font-black animate-pulse uppercase tracking-widest">Entering Flower Lab...</p>
      </div>
    );
  }

  // Station Detail View (Mini-Game Placeholder)
  if (activeStationId !== null) {
    const station = STATIONS.find(s => s.id === activeStationId);
    return (
      <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveStationId(null)}
              className="rounded-2xl border-2 hover:bg-gray-100 font-bold"
            >
              <ArrowLeft size={20} className="mr-2" /> Back to Lab Map
            </Button>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-xl text-white font-black bg-gradient-to-r ${station?.color}`}>
                Station {station?.id}: {station?.title.split('. ')[1]}
              </span>
            </div>
          </header>

          <Card className="p-12 min-h-[600px] flex flex-col items-center justify-center bg-white border-4 border-gray-100 rounded-[48px] shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent pointer-events-none" />
             
             {/* Dynamic Mini-Game Rendering */}
             <div className="relative z-10 w-full text-center">
                {station?.gameType === 'build_flower' ? (
                  <BuildAFlower onComplete={() => handleStationComplete(1)} />
                ) : station?.gameType === 'pollen_journey' ? (
                  <PollenJourney onComplete={() => handleStationComplete(2)} />
                ) : station?.gameType === 'fusion_mission' ? (
                  <FusionMission onComplete={() => handleStationComplete(3)} />
                ) : station?.gameType === 'seed_builder' ? (
                  <SeedBuilder onComplete={() => handleStationComplete(4)} />
                ) : station?.gameType === 'apomixis_sim' ? (
                  <ApomixisSim onComplete={() => handleStationComplete(5)} />
                ) : (
                  <>
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${station?.color} mx-auto mb-8 flex items-center justify-center text-white shadow-xl animate-bounce`}>
                       {station?.icon}
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">
                       {station?.title.split('. ')[1]} Mission
                    </h2>
                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-bold leading-relaxed">
                       Currently in development. Get ready for an immersive biological simulation!
                    </p>
                    <Button 
                      onClick={() => handleStationComplete(activeStationId)}
                      className={`bg-gradient-to-r ${station?.color} text-white px-12 py-8 rounded-3xl text-2xl font-black shadow-2xl hover:scale-105 transition-transform`}
                    >
                       Complete Simulation (Dev Bypass)
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
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <header className="text-center space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-6 bg-pink-100 rounded-[40px] text-pink-600 mb-4 border-4 border-pink-200 shadow-xl"
        >
          <Flower2 size={64} className="animate-pulse" />
        </motion.div>
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
          Flower Lab Hub
        </h1>
        <p className="text-2xl text-gray-500 font-bold max-w-3xl mx-auto leading-relaxed">
          Embark on an interactive journey through the intricate world of plant reproduction.
        </p>

        <div className="flex justify-center items-center space-x-8 pt-4">
           <div className="bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-pink-50 flex items-center space-x-3">
              <Trophy className="text-yellow-500" size={24} />
              <span className="text-lg font-black text-gray-700">{completedStations.length} / {STATIONS.length} Stations Conquered</span>
           </div>
           <div className="bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-pink-50 flex items-center space-x-3">
              <Sparkles className="text-purple-500" size={24} />
              <span className="text-lg font-black text-gray-700">{profile?.xp} XP Accumulated</span>
           </div>
        </div>
      </header>

      {/* Lab Stations Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {STATIONS.map((station, idx) => {
          const isCompleted = completedStations.includes(station.id);
          
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="h-full"
            >
              <Card 
                className={`p-8 rounded-[48px] border-4 transition-all duration-500 relative overflow-hidden group h-full flex flex-col cursor-pointer
                  ${isCompleted ? 'border-green-200 bg-green-50/20' : 'border-gray-50 bg-white hover:border-pink-300 shadow-xl hover:shadow-2xl'}
                `}
                onClick={() => setActiveStationId(station.id)}
              >
                {isCompleted && (
                  <div className="absolute top-6 right-8 text-green-500 animate-bounce">
                    <CheckCircle2 size={36} />
                  </div>
                )}

                <div className={`w-20 h-20 rounded-[32px] bg-gradient-to-br ${station.color} flex items-center justify-center text-white shadow-lg mb-8 group-hover:rotate-12 transition-transform duration-300`}>
                  {station.icon}
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-pink-600 transition-colors">
                    {station.title}
                  </h3>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed">
                    {station.description}
                  </p>
                </div>

                <div className="pt-8 flex items-center font-black text-xs uppercase tracking-widest text-pink-600 transition-all group-hover:translate-x-2">
                  <span>{isCompleted ? 'Enter Station Again' : 'Enter Station'}</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </Card>
            </motion.div>
          );
        })}

        {/* Sandbox Exploratorium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <Card className="p-8 rounded-[48px] border-4 border-dashed border-cyan-400 bg-cyan-50/30 h-full flex flex-col justify-center items-center text-center space-y-6 group cursor-pointer hover:border-solid hover:bg-cyan-50 transition-all duration-300">
             <div className="w-24 h-24 bg-cyan-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                <Gamepad2 size={48} />
             </div>
             <div>
                <h3 className="text-3xl font-black text-cyan-900 uppercase italic tracking-tighter">Sandbox Explorer</h3>
                <p className="text-cyan-700/60 font-bold text-sm">Free-play biological simulator</p>
             </div>
          </Card>
        </motion.div>
      </div>

      {completedStations.length === STATIONS.length && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-[64px] text-center text-white shadow-[0_35px_60px_-15px_rgba(244,63,94,0.3)] border-8 border-white/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
             <Flower2 size={200} />
          </div>
          <Trophy size={100} className="mx-auto mb-8 text-yellow-300 drop-shadow-2xl animate-bounce" />
          <h2 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">Botanical Masterpiece!</h2>
          <p className="text-2xl font-bold mb-12 max-w-2xl mx-auto text-pink-50">
            You've decoded the secrets of floral life. Your mastery over plant reproduction is now legendary!
          </p>
          <Button 
            onClick={onComplete}
            className="bg-white text-rose-600 hover:bg-rose-50 rounded-[32px] px-16 py-10 text-3xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Claim Grand Master Badge
          </Button>
        </motion.div>
      )}
    </div>
  );
}
