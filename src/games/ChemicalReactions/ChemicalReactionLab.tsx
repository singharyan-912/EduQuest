import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  Beaker, 
  Zap, 
  Flame, 
  Layers, 
  ArrowRightLeft, 
  ShieldCheck, 
  Grid3X3,
  Trophy,
  Star as StarIcon,
  Play,
  ArrowBigRight,
  Atom
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Mini-game imports will be added here
import { EquationBuilder } from './MiniGames/EquationBuilder';
import { BalanceMaster } from './MiniGames/BalanceMaster';
import { MergeLab } from './MiniGames/MergeLab';
import { BreakdownChamber } from './MiniGames/BreakdownChamber';
import { ElementFighter } from './MiniGames/ElementFighter';
import { PartnerSwap } from './MiniGames/PartnerSwap';
import { ElectronTracker } from './MiniGames/ElectronTracker';
import { ProtectionMaster } from './MiniGames/ProtectionMaster';

interface Station {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  gameType: 'equations' | 'balancing' | 'combination' | 'decomposition' | 'displacement' | 'double_displacement' | 'redox' | 'protection';
  difficulty: 'Foundation' | 'Standard' | 'Advanced';
}

const STATIONS: Station[] = [
  {
    id: 1,
    title: "Reaction Architect",
    description: "Construct correct chemical equations from reactants to products.",
    icon: FlaskConical,
    color: "blue",
    gameType: "equations",
    difficulty: "Foundation"
  },
  {
    id: 2,
    title: "Stoichiometry Pro",
    description: "Master the Law of Conservation of Mass by balancing coefficients.",
    icon: Grid3X3,
    color: "emerald",
    gameType: "balancing",
    difficulty: "Standard"
  },
  {
    id: 3,
    title: "Synthesis Merge",
    description: "Bring reactants together to form single, complex compounds.",
    icon: Layers,
    color: "purple",
    gameType: "combination",
    difficulty: "Foundation"
  },
  {
    id: 4,
    title: "Lysis Chamber",
    description: "Use heat, light, or electricity to split stable molecules.",
    icon: Flame,
    color: "orange",
    gameType: "decomposition",
    difficulty: "Standard"
  },
  {
    id: 5,
    title: "Reactivity Duel",
    description: "Displace weaker elements using the reactive power series.",
    icon: Zap,
    color: "yellow",
    gameType: "displacement",
    difficulty: "Standard"
  },
  {
    id: 6,
    title: "Ion Exchange",
    description: "Swap partners between ionic compounds to form precipitates.",
    icon: ArrowRightLeft,
    color: "pink",
    gameType: "double_displacement",
    difficulty: "Advanced"
  },
  {
    id: 7,
    title: "Electron Flow",
    description: "Track the movement of electrons in Oxidation-Reduction reactions.",
    icon: Atom,
    color: "cyan",
    gameType: "redox",
    difficulty: "Advanced"
  },
  {
    id: 8,
    title: "Corrosion Guard",
    description: "Protect materials from oxidation and atmospheric damage.",
    icon: ShieldCheck,
    color: "rose",
    gameType: "protection",
    difficulty: "Standard"
  }
];

interface ChemicalReactionLabProps {
  chapterId: string;
  onComplete: () => void;
}

export function ChemicalReactionLab({ chapterId, onComplete }: ChemicalReactionLabProps) {
  const { profile, refreshProfile } = useAuth();
  const [activeStationId, setActiveStationId] = useState<number | null>(null);
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
      console.error("Error fetching chem lab progress:", e);
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
          xp: profile.xp + xpReward
        }).eq('id', profile.id);
        await refreshProfile();
      }
    }
    setActiveStationId(null);

    if (completedStations.length + 1 === STATIONS.length) {
      onComplete();
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-400 font-black animate-pulse uppercase tracking-widest">Initialising Laboratory...</div>;

  return (
    <div className="w-full bg-slate-50 min-h-screen p-8 rounded-[60px]">
      <AnimatePresence mode="wait">
        {!activeStationId ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto space-y-12"
          >
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-slate-200 pb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest">
                  <Beaker size={16} /> Virtual Simulation Lab
                </div>
                <h1 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  Chemical <span className="text-blue-600">Reactions</span>
                </h1>
                <p className="text-xl text-slate-500 font-bold italic">Transform matter through 8 core experimental modules.</p>
              </div>
              <div className="flex gap-4">
                 <div className="p-6 bg-white rounded-[32px] border-4 border-slate-100 shadow-xl text-center min-w-[140px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mastery</p>
                    <p className="text-4xl font-black text-slate-900">{Math.round((completedStations.length / STATIONS.length) * 100)}%</p>
                 </div>
                 <div className="p-6 bg-blue-600 rounded-[32px] shadow-xl text-center min-w-[140px] text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">XP Bonus</p>
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
                      ${isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-blue-400 hover:shadow-4xl'}
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
                       <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">React-Sim v1.0</span>
                       <div className={`p-3 rounded-2xl transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                          <Play size={20} fill="currentColor" />
                       </div>
                    </div>

                    {/* Decor Overlay */}
                    <div className={`absolute -bottom-12 -right-12 w-48 h-48 opacity-5 group-hover:opacity-10 transition-opacity
                      ${isCompleted ? 'text-emerald-500' : `text-${station.color}-500`}
                    `}>
                       <Icon size={192} />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Lab Footer/Stats */}
            <div className="p-12 bg-slate-900 rounded-[56px] text-white flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-blue-600">
               <div className="flex items-center gap-8">
                  <div className="w-24 h-24 bg-blue-500 rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse">
                     <FlaskConical size={48} className="text-white" />
                  </div>
                  <div>
                     <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">Chemical Master Certification</h4>
                     <p className="text-slate-400 font-bold italic">Complete all simulations to earn the "Redox Pro" achievement badge.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="text-center px-8 py-4 bg-white/5 rounded-3xl border border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Badges</p>
                     <div className="flex gap-2">
                        <Trophy size={20} className={completedStations.length >= 4 ? 'text-yellow-400' : 'text-slate-700'} />
                        <StarIcon size={20} className={completedStations.length >= 6 ? 'text-blue-400' : 'text-slate-700'} />
                        <ShieldCheck size={20} className={completedStations.length === 8 ? 'text-emerald-400' : 'text-slate-700'} />
                     </div>
                  </div>
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
                onClick={() => setActiveStationId(null)}
                className="rounded-2xl border-4 border-slate-200 bg-white font-black text-slate-400 hover:text-blue-600 hover:border-blue-100 py-6 px-8 flex items-center gap-2"
              >
                <ArrowBigRight className="rotate-180" size={24} /> Back to Lab Terminal
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Simulation</span>
                <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black border-b-4 border-blue-500 italic uppercase italic tracking-tighter">
                  {STATIONS.find(s => s.id === activeStationId)?.title}
                </div>
              </div>
            </div>

            <Card className="bg-white rounded-[64px] border-8 border-slate-100 shadow-4xl p-12 relative overflow-hidden min-h-[700px]">
                {activeStationId === 1 && <EquationBuilder onComplete={() => handleStationComplete(1)} />}
                {activeStationId === 2 && <BalanceMaster onComplete={() => handleStationComplete(2)} />}
                {activeStationId === 3 && <MergeLab onComplete={() => handleStationComplete(3)} />}
                {activeStationId === 4 && <BreakdownChamber onComplete={() => handleStationComplete(4)} />}
                {activeStationId === 5 && <ElementFighter onComplete={() => handleStationComplete(5)} />}
                {activeStationId === 6 && <PartnerSwap onComplete={() => handleStationComplete(6)} />}
                {activeStationId === 7 && <ElectronTracker onComplete={() => handleStationComplete(7)} />}
                {activeStationId === 8 && <ProtectionMaster onComplete={() => handleStationComplete(8)} />}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
