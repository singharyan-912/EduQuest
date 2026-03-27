import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { supabase, Subject } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

interface SubjectProgress {
  subject: Subject;
  totalChapters: number;
  completedChapters: number;
  percentage: number;
}

export function Progress() {
  const { profile } = useAuth();
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchProgress();
  }, [profile]);

  const fetchProgress = async () => {
    if (!profile) return;

    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('class', profile.class);

    if (subjectsError || !subjects) {
      console.error('Error fetching subjects:', subjectsError);
      setLoading(false);
      return;
    }

    const progressData: SubjectProgress[] = [];

    for (const subject of subjects) {
      const { data: chapters } = await supabase
        .from('chapters')
        .select('id')
        .eq('subject_id', subject.id);

      const totalChapters = chapters?.length || 0;

      if (totalChapters > 0) {
        const { data: completedChapters } = await supabase
          .from('user_chapter_progress')
          .select('id')
          .eq('user_id', profile.id)
          .eq('completed', true)
          .in(
            'chapter_id',
            chapters?.map((c) => c.id) || []
          );

        const completed = completedChapters?.length || 0;
        const percentage = Math.round((completed / totalChapters) * 100);

        progressData.push({
          subject,
          totalChapters,
          completedChapters: completed,
          percentage,
        });
      }
    }

    setSubjectProgress(progressData);

    const totalChapters = progressData.reduce((sum, p) => sum + p.totalChapters, 0);
    const totalCompleted = progressData.reduce((sum, p) => sum + p.completedChapters, 0);
    const overall = totalChapters > 0 ? Math.round((totalCompleted / totalChapters) * 100) : 0;
    setOverallProgress(overall);

    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Your Progress</h1>
              <p className="text-gray-600">Track your learning journey</p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Progress</h2>
            <ProgressBar percentage={overallProgress} label="Total Completion" />
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{profile?.level}</p>
                <p className="text-sm text-gray-600">Level</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{profile?.xp}</p>
                <p className="text-sm text-gray-600">Total XP</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600">
                  {subjectProgress.reduce((sum, p) => sum + p.completedChapters, 0)}
                </p>
                <p className="text-sm text-gray-600">Chapters Done</p>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Subject-wise Progress</h2>

        <div className="space-y-4">
          {subjectProgress.map((progress) => (
            <Card key={progress.subject.id}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{progress.subject.name}</h3>
                  <span className="text-sm text-gray-600">
                    {progress.completedChapters} / {progress.totalChapters} chapters
                  </span>
                </div>
                <ProgressBar percentage={progress.percentage} />
              </div>
            </Card>
          ))}
        </div>

        {subjectProgress.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Start learning to track your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
