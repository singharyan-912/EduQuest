import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabase, Chapter, UserChapterProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';
import { ChapterAccordion } from '../components/ChapterAccordion';

interface SubjectPageProps {
  subjectId: string;
  subjectName: string;
  onNavigate: (
    page: any,
    data?: { chapterId: string; chapterName: string; subjectName: string }
  ) => void;
  onBack: () => void;
}

export function SubjectPage({ subjectId, subjectName, onNavigate, onBack }: SubjectPageProps) {
  const { profile } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: UserChapterProgress }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, [subjectId]);

  const fetchChapters = async () => {
    const { data: chaptersData, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('subject_id', subjectId)
      .order('order_num');

    if (chaptersError) {
      console.error('Error fetching chapters:', chaptersError);
      setLoading(false);
      return;
    }

    setChapters(chaptersData || []);

    if (profile) {
      const { data: progressData, error: progressError } = await supabase
        .from('user_chapter_progress')
        .select('*')
        .eq('user_id', profile.id)
        .in(
          'chapter_id',
          chaptersData?.map((c) => c.id) || []
        );

      if (!progressError && progressData) {
        const progressMap: { [key: string]: UserChapterProgress } = {};
        progressData.forEach((p) => {
          progressMap[p.chapter_id] = p;
        });
        setProgress(progressMap);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{subjectName}</h1>
          <p className="text-xl text-gray-600">
            {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <ChapterAccordion 
          chapters={chapters} 
          progress={progress as any} 
          onStart={(chapter: any) => 
            onNavigate('chapter', {
              chapterId: chapter.id,
              chapterName: chapter.name,
              subjectName,
            })
          } 
        />
      </div>
    </div>
  );
}
