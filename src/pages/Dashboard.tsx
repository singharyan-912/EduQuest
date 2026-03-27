import { useEffect, useState } from 'react';
import { Zap, Atom, Leaf, Calculator, LucideIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Subject, UserSubjectProgress } from '../lib/supabase';
import { Loading } from '../components/ui/Loading';

interface DashboardProps {
  onNavigate: (page: any, data?: { subjectId: string; subjectName: string }) => void;
}

const iconMap: { [key: string]: LucideIcon } = {
  Zap,
  Atom,
  Flask: Zap,
  Leaf,
  Calculator,
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: UserSubjectProgress }>({});
  const [totalChaptersMap, setTotalChaptersMap] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('class', profile.class)
      .order('name');

    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError);
    } else {
      setSubjects(subjectsData || []);
      
      const { data: progressData } = await supabase
        .from('user_subject_progress')
        .select('*')
        .eq('user_id', profile.id);

      if (progressData) {
        const progressMap: { [key: string]: UserSubjectProgress } = {};
        progressData.forEach(p => {
          progressMap[p.subject_id] = p;
        });
        setProgress(progressMap);
      }

      // Fetch base chapter totals for those without progress
      const { data: chaptersData } = await supabase
         .from('chapters')
         .select('subject_id');
      
      if (chaptersData) {
         const chapterTotals: { [key: string]: number } = {};
         chaptersData.forEach(c => {
             chapterTotals[c.subject_id] = (chapterTotals[c.subject_id] || 0) + 1;
         });
         setTotalChaptersMap(chapterTotals);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  const getIconForSubject = (iconName: string) => {
    const Icon = iconMap[iconName] || Calculator;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </h1>
          <p className="text-xl text-gray-600">
            {profile ? `Explore your NCERT curriculum - Class ${profile.class}` : 'Please complete your profile or sign out and try again.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Current Level</p>
              <p className="text-5xl font-black text-blue-600">{profile?.level}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Total XP</p>
              <p className="text-5xl font-black text-green-600">{profile?.xp}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-white rounded-xl border border-yellow-100">
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Class</p>
              <p className="text-5xl font-black text-yellow-600">{profile?.class}</p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">My Subjects</h2>
            <p className="text-gray-600">Master every chapter with focused learning</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
            {subjects.length} Subjects Available
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const Icon = getIconForSubject(subject.icon);
            const subjectProgress = progress[subject.id];
            const percentage = subjectProgress?.progress_percentage || 0;
            const completedCount = subjectProgress?.chapters_completed || 0;
            const totalCount = subjectProgress?.total_chapters || totalChaptersMap[subject.id] || 0;

            return (
              <Card
                key={subject.id}
                hover
                onClick={() =>
                  onNavigate('subject', { subjectId: subject.id, subjectName: subject.name })
                }
              >
                <div className="p-8 group">
                  <div className="bg-blue-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 relative transition-transform group-hover:scale-110 duration-300">
                    <Icon size={48} className="text-blue-600" />
                    {percentage === 100 && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                        <Zap size={16} className="text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-gray-500 text-center text-sm mb-6 line-clamp-2 h-10">
                    {subject.description}
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-tighter">
                      <span>Course Progress</span>
                      <span className="text-blue-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="bg-blue-600 h-full transition-all duration-1000 ease-out rounded-full shadow-lg"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-center">
                       <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gray-100">
                        {completedCount} / {totalCount} Chapters
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
