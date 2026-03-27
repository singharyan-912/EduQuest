import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Gamepad2, Star, Trophy, CheckCircle2, Sparkles } from 'lucide-react';
import { GameComponent } from './GameComponent';
import { ChargeGameHub } from '../games/ElectricChargesFields/ChargeGameHub';
import { FlowerLabHub } from '../games/SexualReproductionFloweringPlants/FlowerLabHub';
import { HumanBodyLabHub } from '../games/HumanReproduction/HumanBodyLabHub';
import { ChemistryLabHub } from '../games/Solutions/ChemistryLabHub';
import { MathLabHub } from '../games/RelationsFunctions/MathLabHub';
import { LifeProcessHub } from '../games/LifeProcesses/LifeProcessHub';
import { ChemicalReactionLab } from '../games/ChemicalReactions/ChemicalReactionLab';
import { NumberLabHub } from '../games/RealNumbers/NumberLabHub';
import { OpticsLabHub } from '../games/LightOptics/OpticsLabHub';


interface Level {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  score?: number;
}

interface GamingArenaProps {
  chapterId: string;
  chapterName: string;
  subtopics: string[];
  gameType: string;
  onComplete: () => void;
}

export function GamingArena({ chapterId, chapterName, subtopics, gameType, onComplete }: GamingArenaProps) {
  const { profile } = useAuth();
  const [activeLevelIdx, setActiveLevelIdx] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showSandbox, setShowSandbox] = useState(false);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!profile || !chapterId) {
        setIsLoadingProgress(false);
        return;
    }
    
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('user_chapter_progress')
          .select('id, game_progress')
          .eq('user_id', profile.id)
          .eq('chapter_id', chapterId)
          .maybeSingle();
          
        if (!error && data) {
          setProgressId(data.id);
          if (data.game_progress) {
            const parsed = typeof data.game_progress === 'string' ? JSON.parse(data.game_progress) : data.game_progress;
            if (parsed.arena_completed) {
              setCompletedLevels(parsed.arena_completed);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load arena progress from database", e);
      } finally {
        setIsLoadingProgress(false); // Only render once loaded to prevent flashing states
      }
    };
    
    fetchProgress();
  }, [profile, chapterId]);

  // Save progress to Supabase when it changes
  useEffect(() => {
    if (!profile || !chapterId || isLoadingProgress) return;
    if (completedLevels.length === 0) return; // Don't save empty state initially

    const saveProgress = async () => {
      try {
        if (progressId) {
          await supabase
            .from('user_chapter_progress')
            .update({
              game_progress: {
                arena_completed: completedLevels
              }
            })
            .eq('id', progressId);
        } else {
          const { data, error } = await supabase
            .from('user_chapter_progress')
            .insert({
              user_id: profile.id,
              chapter_id: chapterId,
              completed: false, // Default to false until actually fully done
              xp_earned: 0,
              game_progress: {
                arena_completed: completedLevels
              }
            })
            .select('id')
            .single();
            
          if (!error && data) {
            setProgressId(data.id);
          }
        }
      } catch (e) {
        console.error("Failed to save arena progress to database", e);
      }
    };
    
    saveProgress();
  }, [completedLevels, profile, chapterId, progressId, isLoadingProgress]);

  const levels: Level[] = subtopics.map((topic, idx) => ({
    id: `level-${idx}`,
    title: `Level ${idx + 1}: ${topic}`,
    description: `Master the concepts of ${topic}`,
    isLocked: false,
  }));

  const handleLevelComplete = (_score: number) => {
    if (activeLevelIdx !== null) {
      if (!completedLevels.includes(activeLevelIdx)) {
        setCompletedLevels([...completedLevels, activeLevelIdx]);
      }
      setActiveLevelIdx(null);
      
      // If all levels complete
      if (completedLevels.length + 1 === levels.length) {
         // Master Game Complete
      }
    }
  };

  if (isLoadingProgress) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
            <div className="text-xl text-gray-500 font-bold animate-pulse">Loading Arena Progress...</div>
        </div>
      );
  }

  if (activeLevelIdx !== null) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => setActiveLevelIdx(null)} className="rounded-2xl border-2">
                Back to Map
            </Button>
            <div className="flex items-center space-x-4">
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Currently Playing</span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-black border-2 border-purple-200">
                    {levels[activeLevelIdx].title}
                </span>
            </div>
        </div>
        <GameComponent 
            type={gameType} 
            config={{ title: levels[activeLevelIdx].title, topic: subtopics[activeLevelIdx] }} 
            onComplete={handleLevelComplete} 
        />
      </div>
    );
  }

  if (chapterName.toLowerCase().includes('electric charges')) {
    return <ChargeGameHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase().includes('flowering plants')) {
    return <FlowerLabHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase().includes('human reproduction')) {
    return <HumanBodyLabHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase() === 'solutions') {
    return <ChemistryLabHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase() === 'relations and functions') {
    return <MathLabHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase().includes('life process')) {
    return <LifeProcessHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase().includes('chemical reaction')) {
    return <ChemicalReactionLab chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase().includes('real numbers')) {
    return <NumberLabHub chapterId={chapterId} onComplete={onComplete} />;
  }

  if (chapterName.toLowerCase().includes('light – reflection')) {
    return <OpticsLabHub chapterId={chapterId} onComplete={onComplete} />;
  }

  return (

    <div className="w-full max-w-5xl mx-auto space-y-12">
      <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-3xl text-purple-600 mb-4 border-4 border-purple-200">
              <Gamepad2 size={40} />
          </div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic">Mastery Arena</h2>
          <p className="text-xl text-gray-500 font-bold">Conquer each subtopic to become the Chapter Legend of {chapterName}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {levels.map((level, idx) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card 
              className={`p-8 rounded-[40px] border-4 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] hover:shadow-4xl cursor-pointer bg-white
                ${completedLevels.includes(idx) ? 'border-green-200 bg-green-50/30' : 'border-gray-50 hover:border-purple-300'}
              `}
              onClick={() => setActiveLevelIdx(idx)}
            >
              {completedLevels.includes(idx) && (
                <div className="absolute top-4 right-4 text-green-500">
                    <CheckCircle2 size={32} />
                </div>
              )}
              
              <div className="flex items-start space-x-6">
                 <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black shrink-0 shadow-lg
                    ${completedLevels.includes(idx) ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'}
                 `}>
                    {idx + 1}
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-gray-900">
                        {level.title}
                    </h3>
                    <p className="text-gray-400 font-bold mb-6 text-sm">
                        {level.description}
                    </p>
                    
                        <div className="flex items-center space-x-4">
                            <Button 
                                size="sm" 
                                className={`rounded-xl font-black uppercase tracking-widest px-6 ${completedLevels.includes(idx) ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                {completedLevels.includes(idx) ? 'Replay Level' : 'Battle Now'}
                            </Button>
                            {completedLevels.includes(idx) && (
                                <div className="flex items-center text-yellow-500 font-black text-sm">
                                    <Star size={16} fill="currentColor" className="mr-1" /> XP EARNED
                                </div>
                            )}
                        </div>
                 </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {completedLevels.length === levels.length && (
         <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[50px] text-center text-white shadow-3xl border-8 border-white"
         >
            <Trophy size={80} className="mx-auto mb-6 text-yellow-200 drop-shadow-lg" />
            <h2 className="text-4xl font-black mb-4 uppercase italic">Grand Master Unlocked!</h2>
            <p className="text-xl font-bold mb-8">You have conquered every subtopic in {chapterName}. You are now a Legend!</p>
            <Button 
                onClick={onComplete}
                className="bg-white text-orange-600 hover:bg-gray-100 rounded-3xl px-12 py-8 text-2xl font-black shadow-xl"
            >
                Claim Ultimate Reward
            </Button>
         </motion.div>
      )}
      {showSandbox && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-12">
           <div className="bg-gray-900 w-full max-w-4xl h-[700px] rounded-[56px] border-8 border-gray-800 p-12 text-center flex flex-col items-center justify-center space-y-8">
              <Sparkles size={100} className="text-orange-400" />
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Sandbox Mode Comming Soon</h2>
              <p className="text-xl text-gray-400 font-bold max-w-lg">We are currently building the ultimate physics playground where you can place unlimited charges and observe fields in real-time.</p>
              <Button onClick={() => setShowSandbox(false)} className="bg-orange-500 hover:bg-orange-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest">Return to Arena</Button>
           </div>
        </div>
      )}
    </div>
  );
}
