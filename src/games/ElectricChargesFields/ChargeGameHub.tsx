import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Gamepad2, Lock, Star, Trophy, Sparkles, Home, Play, CheckCircle2 } from 'lucide-react';
import { ChargeSorter } from './MiniGames/ChargeSorter';
import { FlowOrBlock } from './MiniGames/FlowOrBlock';
import { ForceBlaster } from './MiniGames/ForceBlaster';
import { NetForceBuilder } from './MiniGames/NetForceBuilder';
import { FieldNavigator } from './MiniGames/FieldNavigator';
import { DrawField } from './MiniGames/DrawField';
import { GaussianSphere } from './MiniGames/GaussianSphere';

interface Level {
  id: number;
  title: string;
  description: string;
  gameType: string;
}

const PHYSICS_LEVELS: Level[] = [
  { id: 1, title: "Charge Sorter", description: "Sort charges into their respective zones.", gameType: "charge_sorter" },
  { id: 2, title: "Flow or Block", description: "Build paths using conductors and insulators.", gameType: "flow_block" },
  { id: 3, title: "Force Blaster", description: "Use Coulomb's law to hit targets.", gameType: "force_blaster" },
  { id: 4, title: "Net Force Builder", description: "Balance multiple charges in equilibrium.", gameType: "net_force" },
  { id: 5, title: "Field Navigator", description: "Navigate a test charge through an electric field.", gameType: "field_navigator" },
  { id: 6, title: "Draw the Field", description: "Trace electric field lines correctly.", gameType: "draw_field" },
  { id: 7, title: "Flux Gate", description: "Calculate flux passing through rotated surfaces.", gameType: "flux_gate" },
  { id: 8, title: "Dipole Maker", description: "Construct dipoles and observe their fields.", gameType: "dipole_maker" },
  { id: 9, title: "Rotate the Dipole", description: "Manage torque in a uniform electric field.", gameType: "rotate_dipole" },
  { id: 10, title: "Charge Painter", description: "Apply continuous charge distributions.", gameType: "charge_painter" },
  { id: 11, title: "Gaussian Sphere", description: "Apply Gauss's law to enclosed charges.", gameType: "gauss_sphere" },
  { id: 12, title: "Symmetry Solver", description: "Solve fields for symmetric distributions.", gameType: "symmetry_solver" },
];

interface ChargeGameHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function ChargeGameHub({ chapterId, onComplete }: ChargeGameHubProps) {
  const { profile, refreshProfile } = useAuth();
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [unlockedLevels] = useState<number[]>(PHYSICS_LEVELS.map(l => l.id));
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showSandbox, setShowSandbox] = useState(false);

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!profile || !chapterId) return;
    
    const fetchProgress = async () => {
      console.log("Fetching game progress for:", { userId: profile.id, chapterId });
      try {
        const { data, error } = await supabase
          .from('user_chapter_progress')
          .select('game_progress')
          .eq('user_id', profile.id)
          .eq('chapter_id', chapterId)
          .maybeSingle();
          
        if (error) {
          console.error("Supabase Error fetching progress:", error);
        } else if (data?.game_progress) {
          console.log("Loaded progress data:", data.game_progress);
          const parsed = typeof data.game_progress === 'string' ? JSON.parse(data.game_progress) : data.game_progress;
          // Keep everything unlocked, but sync completed status
          if (parsed.completed) setCompletedLevels(parsed.completed);
        } else {
          console.log("No existing progress found for this chapter.");
        }
      } catch (e) {
        console.error("Failed to load game progress from database", e);
      }
    };
    
    fetchProgress();
  }, [profile, chapterId]);

  // Save progress to Supabase when it changes
  useEffect(() => {
    if (!profile || !chapterId) return;
    // Save progress updates

    const saveProgress = async () => {
      const progressToSave = {
        user_id: profile.id,
        chapter_id: chapterId,
        game_progress: {
          unlocked: unlockedLevels,
          completed: completedLevels
        }
      };
      
      console.log("Saving game progress:", progressToSave);
      
      try {
        const { error } = await supabase
          .from('user_chapter_progress')
          .upsert(progressToSave, { 
            onConflict: 'user_id,chapter_id' 
          });
          
        if (error) {
          console.error("Supabase Error saving progress:", error);
        } else {
          console.log("Successfully saved game progress to database.");
        }
      } catch (e) {
        console.error("Failed to save game progress to database", e);
      }
    };
    
    saveProgress();
  }, [unlockedLevels, completedLevels, profile, chapterId]);

  const awardXP = async (amount: number) => {
    if (!profile) return;
    try {
      const newXP = profile.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
        
      await refreshProfile();
    } catch (e) {
      console.error("Failed to award XP:", e);
    }
  };

  const handleLevelComplete = async (levelId: number) => {
    if (!completedLevels.includes(levelId)) {
        setCompletedLevels(prev => [...prev, levelId]);
        await awardXP(50); // 50 XP per successful level
    }
    setActiveLevelId(null);
    
    // Auto-complete the whole hub if they finish all
    if (levelId === PHYSICS_LEVELS.length) {
        onComplete();
    }
  };

  const renderGame = () => {
    switch (activeLevelId) {
      case 1:
        return <ChargeSorter onComplete={() => handleLevelComplete(1)} />;
      case 2:
        return <FlowOrBlock onComplete={() => handleLevelComplete(2)} />;
      case 3:
        return <ForceBlaster onComplete={() => handleLevelComplete(3)} />;
      case 4:
        return <NetForceBuilder onComplete={() => handleLevelComplete(4)} />;
      case 5:
        return <FieldNavigator onComplete={() => handleLevelComplete(5)} />;
      case 6:
        return <DrawField onComplete={() => handleLevelComplete(6)} />;
      case 11:
        return <GaussianSphere onComplete={() => handleLevelComplete(11)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[600px] bg-gray-900 rounded-[40px] border-8 border-gray-800 text-center p-12">
             <div className="p-8 bg-indigo-500/10 rounded-full mb-8 border-4 border-indigo-500/20">
                <Lock size={80} className="text-indigo-400 opacity-50" />
             </div>
             <h3 className="text-4xl font-black text-white mb-4 uppercase italic">Prototyping Underway</h3>
             <p className="text-gray-400 font-bold max-w-md">The physics laboratory is currently calibrating Level {activeLevelId}. Please master the previous levels first!</p>
             <div className="flex space-x-4 mt-12">
                 <Button onClick={() => handleLevelComplete(activeLevelId as number)} className="bg-green-600 hover:bg-green-700 rounded-2xl px-8 py-6 font-black uppercase tracking-widest">
                    Skip & Unlock Next
                 </Button>
                 <Button onClick={() => setActiveLevelId(null)} className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 py-6 font-black uppercase tracking-widest">
                    Return to Hub
                 </Button>
             </div>
          </div>
        );
    }
  };

  if (activeLevelId !== null) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
            <Button variant="outline" onClick={() => setActiveLevelId(null)} className="rounded-2xl border-white/10 text-white hover:bg-white/5">
                <Home className="mr-2" size={20} /> Exit to Hub
            </Button>
            <div className="flex items-center space-x-6">
                <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">
                    Level {activeLevelId}: {PHYSICS_LEVELS.find(l => l.id === activeLevelId)?.title}
                </h4>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex items-center text-yellow-400 font-black">
                    <Star size={20} fill="currentColor" className="mr-2" /> 50 XP POTENTIAL
                </div>
            </div>
        </div>
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 pb-20">
      <header className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-6 bg-indigo-600 rounded-[35px] text-white shadow-3xl shadow-indigo-500/30 border-4 border-white"
          >
              <Gamepad2 size={50} />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic">Electro Arena</h2>
            <p className="text-xl text-gray-400 font-bold">Master Electric Charges & Field with 12 Physics Challenges</p>
          </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PHYSICS_LEVELS.map((level) => (
          <motion.div
            key={level.id}
            whileHover={unlockedLevels.includes(level.id) ? { scale: 1.02 } : {}}
          >
            <Card 
              className={`p-8 rounded-[48px] border-4 transition-all duration-300 relative overflow-hidden group h-full bg-white cursor-pointer hover:shadow-4xl border-gray-50 hover:border-indigo-400`}
              onClick={() => setActiveLevelId(level.id)}
            >
               
               <div className="flex flex-col h-full space-y-6">
                  <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-2xl font-black shadow-lg
                     ${completedLevels.includes(level.id) ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}
                  `}>
                    {completedLevels.includes(level.id) ? <CheckCircle2 size={32} /> : level.id}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-gray-900">
                        {level.title}
                    </h3>
                    <p className="text-gray-400 font-bold text-sm leading-relaxed">
                        {level.description}
                    </p>
                  </div>

                  <div className={`flex items-center font-black text-xs uppercase tracking-widest pt-4 group-hover:translate-x-2 transition-transform
                      ${completedLevels.includes(level.id) ? 'text-green-600' : 'text-indigo-600'}`}>
                      <span>{completedLevels.includes(level.id) ? 'Replay Mission' : 'Begin Mission'}</span> 
                      <Play size={14} className="ml-2 fill-current" />
                  </div>
               </div>
            </Card>
          </motion.div>
        ))}

        {/* Sandbox Tile */}
        <motion.div whileHover={{ scale: 1.02 }}>
           <Card 
            className="p-8 rounded-[48px] border-4 border-dashed border-orange-400 bg-orange-50/30 cursor-pointer hover:shadow-4xl transition-all h-full flex flex-col justify-center items-center text-center space-y-6 group"
            onClick={() => setShowSandbox(true)}
           >
              <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/20 group-hover:rotate-12 transition-transform">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-orange-900 uppercase">Sandbox Mode</h3>
                <p className="text-orange-700/60 font-bold text-sm">Free-play physics playground</p>
              </div>
           </Card>
        </motion.div>
      </div>

      {unlockedLevels.length > 4 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-12 rounded-[56px] text-white flex flex-col md:flex-row items-center justify-between border-8 border-white/10 shadow-4xl">
           <div className="flex items-center space-x-8 mb-8 md:mb-0">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center">
                 <Trophy size={50} className="text-yellow-400" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                 <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Charge Master Path</h4>
                 <p className="text-white/60 font-bold">You are {Math.round((completedLevels.length/12)*100)}% through the curriculum!</p>
              </div>
           </div>
           <Button onClick={() => onComplete()} className="bg-white text-indigo-600 hover:bg-gray-100 px-12 py-8 rounded-3xl text-2xl font-black shadow-2xl">
              Claim Final Reward
           </Button>
        </div>
      )}

      {showSandbox && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-12">
           <div className="bg-gray-900 w-full max-w-4xl h-[700px] rounded-[56px] border-8 border-gray-800 p-12 text-center flex flex-col items-center justify-center space-y-8">
              <Sparkles size={100} className="text-orange-400" />
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Sandbox Mode Coming Soon</h2>
              <p className="text-xl text-gray-400 font-bold max-w-lg">We are currently building the ultimate physics playground where you can place unlimited charges and observe fields in real-time.</p>
              <Button onClick={() => setShowSandbox(false)} className="bg-orange-500 hover:bg-orange-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest">Return to Arena</Button>
           </div>
        </div>
      )}
    </div>
  );
}
