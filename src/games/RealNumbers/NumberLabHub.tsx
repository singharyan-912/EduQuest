import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  GitBranch, 
  Binary, 
  FileCheck, 
  Play, 
  Trophy, 
  History,
  Star as StarIcon,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Mini-game imports
import { PrimeFactorQuest } from './MiniGames/PrimeFactorQuest';
import { CommonFactorArena } from './MiniGames/CommonFactorArena';
import { NumberSorter } from './MiniGames/NumberSorter';
import { ProofPuzzle } from './MiniGames/ProofPuzzle';
import { NumberSandbox } from './MiniGames/NumberSandbox';

interface Station {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  gameType: 'fta' | 'hcf_lcm' | 'rational_irrational' | 'proofs' | 'sandbox';
  difficulty: 'Foundation' | 'Standard' | 'Advanced' | 'Freeplay';
}

const STATIONS: Station[] = [
  {
    id: 1,
    title: "Prime Factor Quest",
    description: "Break complex numbers into their atomic prime factors using factor trees.",
    icon: GitBranch,
    color: "indigo",
    gameType: "fta",
    difficulty: "Foundation"
  },
  {
    id: 2,
    title: "Factor Arena",
    description: "Battle for the common ground. Find HCF and LCM using visual sets.",
    icon: Network,
    color: "amber",
    gameType: "hcf_lcm",
    difficulty: "Standard"
  },
  {
    id: 3,
    title: "Number Sorter",
    description: "Identity crisis! Categorize numbers into Rational and Irrational bins.",
    icon: Binary,
    color: "blue",
    gameType: "rational_irrational",
    difficulty: "Standard"
  },
  {
    id: 4,
    title: "Proof Puzzle",
    description: "The logic of contradiction. Build step-by-step proofs for irrationality.",
    icon: FileCheck,
    color: "rose",
    gameType: "proofs",
    difficulty: "Advanced"
  }
];

interface NumberLabHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function NumberLabHub({ chapterId, onComplete }: NumberLabHubProps) {
  const { profile, refreshProfile } = useAuth();
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [completedStations, setCompletedStations] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [profile, chapterId]);

  const fetchProgress = async () => {
    if (!profile) return;
    try {
      const { data } = await supabase
        .from('user_chapter_progress')
        .select('game_progress')
        .eq('user_id', profile.id)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      if (data?.game_progress?.completedStations) {
        setCompletedStations(data.game_progress.completedStations);
      }
    } catch (e) {
      console.error("Error fetching math lab progress:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newCompleted: number[]) => {
    if (!profile) return;
    await supabase.from('user_chapter_progress').upsert({
      user_id: profile.id,
      chapter_id: chapterId,
      game_progress: { completedStations: newCompleted },
      updated_at: new Date().toISOString()
    });
  };

  const handleStationComplete = async (stationId: number) => {
    if (!completedStations.includes(stationId)) {
      const newCompleted = [...completedStations, stationId];
      setCompletedStations(newCompleted);
      await saveProgress(newCompleted);

      // Award XP
      if (profile) {
        const xpReward = 50;
        await supabase.from('profiles').update({
          xp: (profile.xp || 0) + xpReward
        }).eq('id', profile.id);
        await refreshProfile();
      }
    }
    setActiveStationId(null);

    if (completedStations.length + 1 === STATIONS.length) {
      onComplete();
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-400 font-black animate-pulse uppercase tracking-widest">Initialising Number Lab...</div>;

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-8 rounded-[60px]">
      <AnimatePresence mode="wait">
        {!activeStationId && !showSandbox ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto space-y-12"
          >
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-200 pb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest">
                  <Binary size={16} /> Mathematics Simulation Terminal
                </div>
                <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  Real <span className="text-indigo-600">Numbers</span>
                </h1>
                <p className="text-xl text-slate-500 font-bold italic">Explore the fundamental architecture of the number system.</p>
              </div>
              <div className="flex gap-4">
                 <div className="p-6 bg-white rounded-[32px] border-4 border-slate-100 shadow-xl text-center min-w-[140px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Logic Mastery</p>
                    <p className="text-4xl font-black text-slate-900">{Math.round((completedStations.length / STATIONS.length) * 100)}%</p>
                 </div>
                 <div className="p-6 bg-indigo-600 rounded-[32px] shadow-xl text-center min-w-[140px] text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">XP Earnt</p>
                    <p className="text-4xl font-black">+{completedStations.length * 50}</p>
                 </div>
              </div>
            </header>

            {/* Hub Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATIONS.map((station) => {
                const isCompleted = completedStations.includes(station.id);
                const Icon = station.icon;
                
                return (
                  <Card 
                    key={station.id}
                    onClick={() => setActiveStationId(station.id)}
                    className={`relative p-8 rounded-[48px] border-4 transition-all duration-500 cursor-pointer overflow-hidden group h-full flex flex-col justify-between
                      ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-indigo-400 hover:shadow-4xl'}
                    `}
                  >
                    <div className="relative z-10 space-y-6">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3
                        ${isCompleted ? 'bg-emerald-500 text-white' : `bg-${station.color}-100 text-${station.color}-600`}
                      `}>
                        <Icon size={40} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                              {station.difficulty}
                           </span>
                           {isCompleted && (
                             <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500 text-white rounded-full">
                               Complete
                             </span>
                           )}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none mb-3">
                          {station.title}
                        </h3>
                        <p className="text-sm font-bold text-slate-400 leading-relaxed italic">
                          {station.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-slate-50 flex items-center justify-between">
                       <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">LogicSim v1.0</span>
                       <div className={`p-3 rounded-2xl transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                          <Play size={20} fill="currentColor" />
                       </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col md:flex-row gap-6">
               <div className="flex-1 p-10 bg-slate-900 rounded-[56px] text-white flex items-center justify-between gap-8 border-b-8 border-indigo-600">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-indigo-500 rounded-[32px] flex items-center justify-center shadow-3xl">
                        <History size={32} className="text-white" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-2">Number Sandbox</h4>
                        <p className="text-slate-400 font-bold italic">Unrestricted experimentation with any real number.</p>
                     </div>
                  </div>
                  <Button onClick={() => setShowSandbox(true)} className="px-10 py-5 bg-white text-slate-900 font-black rounded-3xl hover:bg-slate-100">
                     Open Sandbox <ChevronRight className="ml-2" />
                  </Button>
               </div>

               <div className="md:w-1/3 p-10 bg-white rounded-[56px] border-4 border-slate-100 flex flex-col justify-center items-center text-center">
                  <div className="flex gap-2 mb-4">
                     <Trophy size={24} className={completedStations.length >= 2 ? 'text-yellow-400' : 'text-slate-100'} />
                     <StarIcon size={24} className={completedStations.length >= 3 ? 'text-indigo-400' : 'text-slate-100'} />
                     <FileCheck size={24} className={completedStations.length === 4 ? 'text-emerald-400' : 'text-slate-100'} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Achievements</p>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-12 flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => { setActiveStationId(null); setShowSandbox(false); }}
                className="rounded-2xl border-4 border-slate-200 bg-white font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-100 py-6 px-8 flex items-center gap-2"
              >
                Back to Lab Terminal
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live logic session</span>
                <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black border-b-4 border-indigo-500 italic uppercase">
                  {showSandbox ? "Sandbox Mode" : STATIONS.find(s => s.id === activeStationId)?.title}
                </div>
              </div>
            </div>

            <Card className="bg-white rounded-[64px] border-8 border-slate-100 shadow-4xl p-12 relative overflow-hidden min-h-[700px]">
                {activeStationId === 1 && <PrimeFactorQuest onComplete={() => handleStationComplete(1)} />}
                {activeStationId === 2 && <CommonFactorArena onComplete={() => handleStationComplete(2)} />}
                {activeStationId === 3 && <NumberSorter onComplete={() => handleStationComplete(3)} />}
                {activeStationId === 4 && <ProofPuzzle onComplete={() => handleStationComplete(4)} />}
                {showSandbox && <NumberSandbox />}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
