import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Trophy, 
  ChevronLeft, 
  Star,
  Focus,
  Sun,
  Glasses,
  Box,
  LayoutGrid,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MirrorMaster } from './MiniGames/MirrorMaster';
import { RayDiagramBuilder } from './MiniGames/RayDiagramBuilder';
import { FormulaLab } from './MiniGames/FormulaLab';
import { RefractionExplorer } from './MiniGames/RefractionExplorer';
import { LensLab } from './MiniGames/LensLab';
import { OpticsSandbox } from './MiniGames/OpticsSandbox';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type StationId = 'reflection' | 'diagrams' | 'formula' | 'refraction' | 'lenses' | 'sandbox';

interface Station {
  id: StationId;
  title: string;
  description: string;
  icon: any;
  color: string;
  difficulty: 'Basic' | 'Medium' | 'Advanced';
}

const STATIONS: Station[] = [
  {
    id: 'reflection',
    title: 'Mirror Master',
    description: 'Master the laws of reflection with plane and spherical mirrors.',
    icon: Sun,
    color: 'amber',
    difficulty: 'Basic'
  },
  {
    id: 'diagrams',
    title: 'Ray Builder',
    description: 'Draw principal rays to locate real and virtual images.',
    icon: LayoutGrid,
    color: 'blue',
    difficulty: 'Medium'
  },
  {
    id: 'formula',
    title: 'Formula Lab',
    description: 'Visualize the relationship between u, v, and f.',
    icon: Focus,
    color: 'teal',
    difficulty: 'Medium'
  },
  {
    id: 'refraction',
    title: 'Refraction Scout',
    description: 'Explore light bending through air, water, and glass.',
    icon: Sparkles,
    color: 'indigo',
    difficulty: 'Basic'
  },
  {
    id: 'lenses',
    title: 'Lens Genius',
    description: 'Master image formation and power of lenses.',
    icon: Glasses,
    color: 'rose',
    difficulty: 'Advanced'
  },
  {
    id: 'sandbox',
    title: 'Optics Sandbox',
    description: 'A free-play mode for ultimate optical experimentation.',
    icon: Box,
    color: 'slate',
    difficulty: 'Basic'
  }
];

interface OpticsLabHubProps {
  chapterId: string;
  onComplete: () => void;
}

export function OpticsLabHub({ chapterId, onComplete }: OpticsLabHubProps) {
  const { profile } = useAuth();
  const [activeStation, setActiveStation] = useState<StationId | null>(null);
  const [completedStations, setCompletedStations] = useState<StationId[]>([]);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (profile) {
      setXp(profile.xp || 0);
      loadProgress();
    }
  }, [profile]);

  const loadProgress = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from('user_chapter_progress')
      .select('game_progress')
      .eq('user_id', profile.id)
      .eq('chapter_id', chapterId)
      .maybeSingle();

    if (data?.game_progress?.completed_stations) {
      setCompletedStations(data.game_progress.completed_stations);
    }
  };

  const handleStationComplete = async (stationId: StationId) => {
    if (!completedStations.includes(stationId)) {
      const newCompleted = [...completedStations, stationId];
      setCompletedStations(newCompleted);
      
      const xpGain = stationId === 'sandbox' ? 10 : 50;
      const newXp = xp + xpGain;
      setXp(newXp);

      if (profile) {
        await supabase.from('profiles').update({ xp: newXp }).eq('id', profile.id);
        await supabase.from('user_chapter_progress').upsert({
          user_id: profile.id,
          chapter_id: chapterId,
          game_progress: { completed_stations: newCompleted },
          updated_at: new Date().toISOString()
        });
      }
    }
    setActiveStation(null);
  };

  const renderActiveGame = () => {
    switch (activeStation) {
      case 'reflection': return <MirrorMaster onComplete={() => handleStationComplete('reflection')} />;
      case 'diagrams': return <RayDiagramBuilder onComplete={() => handleStationComplete('diagrams')} />;
      case 'formula': return <FormulaLab onComplete={() => handleStationComplete('formula')} />;
      case 'refraction': return <RefractionExplorer onComplete={() => handleStationComplete('refraction')} />;
      case 'lenses': return <LensLab onComplete={() => handleStationComplete('lenses')} />;
      case 'sandbox': return <OpticsSandbox onComplete={() => handleStationComplete('sandbox')} />;
      default: return null;
    }
  };

  if (activeStation) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto flex flex-col h-full">
          <header className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveStation(null)}
              className="rounded-2xl border-2 border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="mr-2" /> Back to Lab Map
            </Button>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-black text-slate-500 uppercase tracking-widest">
                Currently Testing: <span className="text-white">{STATIONS.find(s => s.id === activeStation)?.title}</span>
              </div>
            </div>
          </header>
          <div className="flex-1 flex items-center justify-center">
            {renderActiveGame()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-6 border-b-4 border-slate-100 italic">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-amber-500">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Module 10-04</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            OPTICS <span className="text-slate-400 font-light">LAB</span> MAP
          </h1>
          <p className="text-xl text-slate-500 font-bold max-w-xl">
            Simulate reflection and refraction phenomena through real-time ray tracing and visual reasoning.
          </p>
        </div>

        <div className="flex gap-4">
          <Card className="px-8 py-6 bg-slate-900 rounded-[32px] border-b-8 border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Chapter XP</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-white italic">{xp}</span>
              <Trophy className="text-amber-400" size={28} />
            </div>
          </Card>
          <Card className="px-8 py-6 bg-white rounded-[32px] border-b-8 border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-slate-900 italic">Visionary</span>
              <Star className="text-indigo-500" size={28} fill="currentColor" />
            </div>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STATIONS.map((station, idx) => {
          const Icon = station.icon;
          const isCompleted = completedStations.includes(station.id);
          const colorClass = 
            station.color === 'amber' ? 'bg-amber-500 text-amber-500 shadow-amber-200' :
            station.color === 'blue' ? 'bg-blue-500 text-blue-500 shadow-blue-200' :
            station.color === 'teal' ? 'bg-teal-500 text-teal-500 shadow-teal-200' :
            station.color === 'indigo' ? 'bg-indigo-500 text-indigo-500 shadow-indigo-200' :
            station.color === 'rose' ? 'bg-rose-500 text-rose-500 shadow-rose-200' :
            'bg-slate-500 text-slate-500 shadow-slate-200';

          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                onClick={() => setActiveStation(station.id)}
                className={`group relative h-full p-8 rounded-[48px] border-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-4xl overflow-hidden
                  ${isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-50 bg-white hover:border-slate-900'}
                `}
              >
                {isCompleted && (
                  <div className="absolute top-6 right-8 text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> Mastered
                  </div>
                )}

                <div className="relative z-10 space-y-8">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-b-8 group-hover:scale-110 transition-transform duration-500
                    ${isCompleted ? 'bg-emerald-500 text-white border-emerald-600' : `${colorClass} text-white border-black/10`}
                  `}>
                    <Icon size={40} />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                      {station.title}
                    </h3>
                    <p className="text-slate-400 font-bold leading-relaxed pr-8">
                      {station.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Level</span>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {station.difficulty}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="p-12 bg-slate-900 rounded-[64px] border-b-[16px] border-slate-800 flex flex-col md:flex-row items-center justify-between gap-12 text-white italic">
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
            The Science of <span className="text-amber-400 italic">Vision</span>
          </h2>
          <p className="text-slate-400 font-bold max-w-md">
            Everything you see is the result of light rays reflecting or refracting into your eyes. Master these paths to understand the world.
          </p>
        </div>
        <div className="flex gap-4">
           {STATIONS.filter(s => completedStations.includes(s.id)).length === STATIONS.length ? (
             <Button onClick={onComplete} className="px-12 py-6 bg-emerald-500 text-white font-black rounded-[32px] text-xl shadow-2xl hover:bg-emerald-400">
               Chapter Mastered! <ChevronLeft className="ml-2 rotate-180" />
             </Button>
           ) : (
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-16 h-16 bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center text-slate-600">
                   <Trophy size={24} />
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
