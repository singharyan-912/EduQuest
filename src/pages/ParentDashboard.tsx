import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { LogOut, User as UserIcon, Activity, Trophy, ShieldAlert, BarChart3, Clock, CheckCircle2, TrendingUp, Target } from 'lucide-react';
import { AnalyticsCharts } from '../components/parent/AnalyticsCharts';
import { PerformanceCard } from '../components/parent/PerformanceCard';
import { WeaknessSection } from '../components/parent/WeaknessSection';

interface ParentDashboardProps {
  onNavigate: (page: any) => void;
}

export function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const { profile, signOut, setIsParentView } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjectProgress, setSubjectProgress] = useState<any[]>([]);
  const [chapterProgress, setChapterProgress] = useState<any[]>([]);
  
  useEffect(() => {
    if (profile) {
      fetchProgress();
    }
  }, [profile]);

  const fetchProgress = async () => {
    try {
      const { data: sp } = await supabase
        .from('user_subject_progress')
        .select('*, subjects(*)')
        .eq('user_id', profile?.id);
        
      const { data: cp } = await supabase
        .from('user_chapter_progress')
        .select('*, chapters(name, subject_id, topics)')
        .eq('user_id', profile?.id);

      setSubjectProgress(sp || []);
      setChapterProgress(cp || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsParentView(false);
    onNavigate('login');
  };

  if (loading || !profile) return <Loading />;

  // Calculate some overview stats
  const totalChaptersCompleted = chapterProgress.filter(c => c.completed).length;
  const overallProgressPercent = subjectProgress.length > 0 
    ? Math.round(subjectProgress.reduce((acc, curr) => acc + (curr.progress_percentage || 0), 0) / subjectProgress.length)
    : 0;

  // Derive Activity Tracking metrics (Simulated based on existing XP)
  const quizzesAttempted = Math.floor(profile.xp / 50) + totalChaptersCompleted * 2;
  const timeSpentHours = Math.max(1, Math.floor(quizzesAttempted * 0.4) + totalChaptersCompleted * 1.5).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-md shadow-inner border border-white/30 hidden sm:block">
                  <UserIcon size={40} className="text-white drop-shadow-md" />
                </div>
                <div>
                   <h1 className="text-4xl font-black tracking-tight drop-shadow-md">Parent Portal</h1>
                   <p className="text-blue-200 font-medium text-lg flex items-center mt-1">
                      Monitoring <strong className="text-white ml-2 px-3 py-1 bg-white/10 rounded-lg">{profile.full_name}</strong>
                   </p>
                </div>
            </div>
            
            <Button 
               variant="outline" 
               onClick={handleLogout}
               className="border-white/30 text-white hover:bg-white hover:text-indigo-900 transition-all shadow-md font-bold px-6 py-2 rounded-xl"
            >
               <LogOut className="mr-2" size={18} /> Logout Portal
            </Button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
          
          {/* 1. OVERVIEW SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-blue-500 flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
                 <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <UserIcon size={32} className="text-blue-600" />
                 </div>
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Class Enrolled</p>
                 <h3 className="text-4xl font-black text-gray-900 mt-1">Class {profile.class}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-yellow-500 flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
                 <div className="bg-yellow-50 p-4 rounded-full mb-4">
                    <Trophy size={32} className="text-yellow-600" />
                 </div>
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total XP</p>
                 <h3 className="text-4xl font-black text-gray-900 mt-1">{profile.xp}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-purple-500 flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
                 <div className="bg-purple-50 p-4 rounded-full mb-4">
                    <TrendingUp size={32} className="text-purple-600" />
                 </div>
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Current Level</p>
                 <h3 className="text-4xl font-black text-gray-900 mt-1">Lvl {profile.level}</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-green-500 flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
                 <div className="bg-green-50 p-4 rounded-full mb-4">
                    <Target size={32} className="text-green-600" />
                 </div>
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Overall Syllabus Progress</p>
                 <h3 className="text-4xl font-black text-gray-900 mt-1">{overallProgressPercent}%</h3>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* LEFT COLUMN: Subject Performance & Charts */}
             <div className="col-span-1 lg:col-span-2 space-y-8">
                 
                 {/* 2. SUBJECT-WISE PERFORMANCE */}
                 <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                     <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                        <BarChart3 className="mr-3 text-indigo-500" /> Subject Performance
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         {subjectProgress.length === 0 ? (
                            <p className="text-gray-500 col-span-2 py-8 text-center bg-gray-50 rounded-2xl font-medium border border-dashed border-gray-300">
                                No subject progress found yet. Ask your child to start exploring chapters!
                            </p>
                         ) : (
                             subjectProgress.map(sp => (
                                <PerformanceCard key={sp.id} progress={sp} />
                             ))
                         )}
                     </div>
                 </div>

                 {/* 6. ANALYTICS VISUALIZATION */}
                 <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                     <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
                        <Activity className="mr-3 text-indigo-500" /> Progress Analytics
                     </h2>
                     <AnalyticsCharts subjectProgress={subjectProgress} xpHistory={profile.xp} />
                 </div>

             </div>

             {/* RIGHT COLUMN: Actionable Insights */}
             <div className="col-span-1 space-y-8">
                 
                 {/* 3 & 4. WEAKNESS & STRENGTH ANALYSIS */}
                 <WeaknessSection subjectProgress={subjectProgress} chapterProgress={chapterProgress} />

                 {/* 5. ACTIVITY TRACKING */}
                 <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
                     <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center relative z-10">
                        <Clock className="mr-3 text-blue-500" /> Recent Activity
                     </h2>
                     <div className="space-y-6 relative z-10">
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                             <div className="flex items-center space-x-3">
                                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Clock size={20} /></div>
                                 <span className="font-bold text-gray-700">Time Spent</span>
                             </div>
                             <span className="font-black text-xl text-blue-600">{timeSpentHours} hrs</span>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                             <div className="flex items-center space-x-3">
                                 <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><CheckCircle2 size={20} /></div>
                                 <span className="font-bold text-gray-700">Quizzes Taken</span>
                             </div>
                             <span className="font-black text-xl text-purple-600">{quizzesAttempted}</span>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                             <div className="flex items-center space-x-3">
                                 <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Trophy size={20} /></div>
                                 <span className="font-bold text-gray-700">Chapters Conquered</span>
                             </div>
                             <span className="font-black text-xl text-green-600">{totalChaptersCompleted}</span>
                         </div>
                     </div>
                 </div>

                 {/* 7. RECOMMENDATIONS */}
                 <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl shadow-lg p-8 border-2 border-indigo-100">
                     <h2 className="text-xl font-black text-indigo-900 mb-4 flex items-center">
                        <ShieldAlert className="mr-3 text-indigo-500" /> Actionable Recommendations
                     </h2>
                     <ul className="space-y-3">
                        {subjectProgress.length === 0 ? (
                           <li className="text-indigo-800 font-medium">Encourage your child to log in and take their first quiz to generate recommendations!</li>
                        ) : (
                           <>
                             {subjectProgress.sort((a,b) => (a.progress_percentage || 0) - (b.progress_percentage || 0)).slice(0, 2).map((sp, idx) => (
                               <li key={idx} className="flex items-start bg-white p-4 rounded-xl shadow-sm">
                                  <div className="w-2 h-2 mt-2 bg-red-400 rounded-full mr-3 shrink-0"></div>
                                  <span className="text-gray-700 font-semibold text-sm">Have them focus more time on <strong>{sp.subjects?.name}</strong> to improve their subject mastery.</span>
                               </li>
                             ))}
                             {chapterProgress.filter(c => !c.completed).slice(0, 1).map((cp, idx) => (
                               <li key={idx} className="flex items-start bg-white p-4 rounded-xl shadow-sm">
                                  <div className="w-2 h-2 mt-2 bg-yellow-400 rounded-full mr-3 shrink-0"></div>
                                  <span className="text-gray-700 font-semibold text-sm">Remind them to complete the unfinished chapter: <strong>{cp.chapters?.name}</strong>.</span>
                               </li>
                             ))}
                             <li className="flex items-start bg-white p-4 rounded-xl shadow-sm">
                                <div className="w-2 h-2 mt-2 bg-green-400 rounded-full mr-3 shrink-0"></div>
                                <span className="text-gray-700 font-semibold text-sm">Excellent ongoing momentum! Keep motivating them to earn {100 - (profile.xp % 100)} more XP for the next level.</span>
                             </li>
                           </>
                        )}
                     </ul>
                 </div>

             </div>
          </div>
      </div>
    </div>
  );
}
