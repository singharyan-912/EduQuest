import { ArrowLeft, ArrowRight, BookOpen, Sparkles, CheckCircle2, Gamepad2, Zap, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GamingArena } from '../components/GamingArena';
import { supabase, Chapter, UserChapterProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';
import { LearningModule } from '../components/LearningModule';
import { QuizComponent } from '../components/QuizComponent';
import { ResultScreen } from '../components/ResultScreen';
import { useState, useEffect } from 'react';
import { getInteractiveSlides } from '../data/interactiveSlides';

interface ChapterPageProps {
  chapterId: string;
  chapterName: string;
  subjectName: string;
  onBack: () => void;
}

type ActiveMode = 'overview' | 'learning' | 'challenge' | 'result';
type ChallengeType = 'quiz' | 'game' | 'rapid';

const generateDynamicSlides = (chapter: Chapter, subjectName: string) => {
  const topics = chapter.topics || [];
  return topics.map((topic) => ({
    title: topic,
    content: `${topic} is a key part of ${chapter.name}. Understanding ${topic} allows us to explore deeper into ${subjectName}.`,
    visual: `https://images.unsplash.com/photo-1516339901600-2e1a62dc0c45?w=800&auto=format&fit=crop&q=60`
  }));
};

export function ChapterPage({ chapterId, chapterName, subjectName, onBack }: ChapterPageProps) {
  const { profile, refreshProfile } = useAuth();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [progress, setProgress] = useState<UserChapterProgress | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingChapter, setCompletingChapter] = useState(false);
  
  // Interactive State
  const [activeMode, setActiveMode] = useState<ActiveMode>('overview');
  const [challengeType, setChallengeType] = useState<ChallengeType | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [bonusXP, setBonusXP] = useState(0);
  const [lastScore, setLastScore] = useState<number | undefined>(undefined);
  const [lastTotal, setLastTotal] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchChapterDetails();
  }, [chapterId]);

  const fetchChapterDetails = async () => {
    setLoading(true);
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .maybeSingle();

    if (chapterError) {
      console.error('Error fetching chapter:', chapterError);
    } else {
      setChapter(chapterData);
    }

    // Fetch new large question bank
    const { data: questionData } = await supabase
        .from('questions')
        .select('*')
        .eq('chapter_id', chapterId);
    
    if (questionData && questionData.length > 0) {
        setQuestions(questionData.map(q => ({
            ...q,
            correct: q.correct_index // Normalize naming
        })));
    }

    if (profile) {
      const { data: progressData } = await supabase
        .from('user_chapter_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('chapter_id', chapterId)
        .maybeSingle();

      setProgress(progressData);
    }

    setLoading(false);
  };

  const updateProgressAndXP = async (xpToEarn: number) => {
    if (!profile || !chapter) return;

    setCompletingChapter(true);
    try {
      if (progress) {
        await supabase
          .from('user_chapter_progress')
          .update({
            completed: true,
            xp_earned: (progress.xp_earned || 0) + xpToEarn,
            completed_at: new Date().toISOString(),
          })
          .eq('id', progress.id);
      } else {
        await supabase.from('user_chapter_progress').insert({
          user_id: profile.id,
          chapter_id: chapterId,
          completed: true,
          xp_earned: xpToEarn,
          completed_at: new Date().toISOString(),
        });
      }

      const newXP = profile.xp + xpToEarn;
      const newLevel = Math.floor(newXP / 100) + 1;

      await supabase
        .from('profiles')
        .update({
          xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      // Force-sync user_subject_progress manually to ensure dashboard updates
      if (chapter.subject_id) {
         const { count: totalChapters } = await supabase
            .from('chapters')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', chapter.subject_id);

         const { data: allUserProgress } = await supabase
            .from('user_chapter_progress')
            .select('chapter_id')
            .eq('user_id', profile.id)
            .eq('completed', true);

         const { data: subjectChapters } = await supabase
            .from('chapters')
            .select('id')
            .eq('subject_id', chapter.subject_id);

         const subjectChapterIds = new Set(subjectChapters?.map(c => c.id) || []);
         const completedCount = allUserProgress?.filter(p => subjectChapterIds.has(p.chapter_id)).length || 0;
         const progressPercent = totalChapters ? Math.round((completedCount * 100) / totalChapters) : 0;

         const { data: existingProgress } = await supabase
            .from('user_subject_progress')
            .select('id')
            .eq('user_id', profile.id)
            .eq('subject_id', chapter.subject_id)
            .maybeSingle();

         if (existingProgress) {
            await supabase
              .from('user_subject_progress')
              .update({
                  chapters_completed: completedCount,
                  total_chapters: totalChapters || 0,
                  progress_percentage: progressPercent,
                  updated_at: new Date().toISOString(),
              })
              .eq('id', existingProgress.id);
         } else {
            await supabase
              .from('user_subject_progress')
              .insert({
                  user_id: profile.id,
                  subject_id: chapter.subject_id,
                  chapters_completed: completedCount,
                  total_chapters: totalChapters || 0,
                  progress_percentage: progressPercent,
                  updated_at: new Date().toISOString(),
              });
         }
      }

      await refreshProfile();
      await fetchChapterDetails();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setCompletingChapter(false);
    }
  };

  const handleLearningComplete = () => {
    const earned = 30; // Base XP for finishing the advanced lesson
    setXpEarned(earned);
    setBonusXP(0);
    updateProgressAndXP(earned);
    setActiveMode('result');
  };

  const handleChallengeComplete = (score: number, total: number = 5, speedBonus: number = 0) => {
    const baseXP = Math.round((score / total) * 50); 
    setXpEarned(baseXP);
    setBonusXP(speedBonus);
    setLastScore(score);
    setLastTotal(total);
    updateProgressAndXP(baseXP + speedBonus);
    setActiveMode('result');
  };

  if (loading) return <Loading />;
  if (!chapter) return <div className="p-8 text-center mt-20">Chapter not found</div>;

  // RENDER MODES
  if (activeMode === 'learning') {
    const customSlides = getInteractiveSlides(chapterName);
    const learningSlides = customSlides.length > 0 
      ? customSlides 
      : (Array.isArray(chapter.learning_slides) && chapter.learning_slides.length > 0
          ? chapter.learning_slides 
          : generateDynamicSlides(chapter, subjectName));
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <Button variant="outline" onClick={() => setActiveMode('overview')} className="mb-12 border-2 rounded-2xl shadow-sm">
                <ArrowLeft className="mr-2" /> Exit Journey
            </Button>
            <LearningModule 
                slides={learningSlides} 
                pyqUrl={chapter.pyq_url}
                onComplete={handleLearningComplete} 
            />
        </div>
      </div>
    );
  }

  if (activeMode === 'challenge' && (challengeType === 'quiz' || challengeType === 'rapid')) {
    // If we have DB questions, use them. Otherwise fallback to chapter.topics
    const topicsArr = Array.isArray(chapter.topics) ? chapter.topics : [];
    const quizContent = questions.length > 0 ? questions : topicsArr.map((t, idx) => ({
        question: idx % 3 === 0 ? `Which principle governs ${t} in ${chapter.name}?` : 
                 idx % 3 === 1 ? `Calculate the effect of ${t} assuming standard conditions.` :
                 `Assertion: ${t} is a critical process. Reason: It enables ${chapter.name} to function.`,
        options: idx % 3 === 1 ? ["10 units", "20 units", "5 units", "None"] : ["Significantly", "Marginally", "Theoretical only", "Depends on environment"],
        correct: 0,
        type: idx % 3 === 0 ? 'conceptual' : idx % 3 === 1 ? 'numerical' : 'assertion_reason',
        difficulty: idx % 3 === 0 ? 'easy' : idx % 3 === 1 ? 'medium' : 'hard',
        explanation: `${t} is a fundamental concept in ${chapter.name} that requires deep understanding.`
    }));

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Button variant="outline" onClick={() => setActiveMode('overview')} className="mb-12 border-2 rounded-2xl shadow-sm">
            <ArrowLeft className="mr-2" /> Forfeit Quest
          </Button>
          <QuizComponent 
            questions={[...quizContent].sort(() => Math.random() - 0.5).slice(0, 10)} 
            mode="rapid_fire"
            onComplete={(score, speedBonus) => handleChallengeComplete(score, 10, speedBonus)} 
          />
        </div>
      </div>
    );
  }

  if (activeMode === 'challenge' && challengeType === 'game') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Button variant="outline" onClick={() => setActiveMode('overview')} className="mb-8 border-2 rounded-2xl shadow-sm">
            <ArrowLeft className="mr-2" /> Exit Arena
          </Button>
          <GamingArena 
              chapterId={chapterId}
              chapterName={chapter.name}
              subtopics={chapter.topics || []}
              gameType={chapter.content?.challenge?.game?.type || 'topic_matcher'}
              onComplete={() => handleChallengeComplete(100, 100, 50)}
          />
        </div>
      </div>
    );
  }

  if (activeMode === 'result') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <ResultScreen 
            type={challengeType ? 'challenge' : 'learning'}
            score={lastScore}
            total={lastTotal}
            xpEarned={xpEarned}
            bonusXP={bonusXP}
            onContinue={() => setActiveMode('overview')}
            onRetry={challengeType ? () => {
                setActiveMode('challenge');
            } : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="outline" onClick={onBack} className="mb-10 p-6 rounded-2xl border-2 font-black text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all">
          <ArrowLeft size={24} className="mr-3" />
          Back to {subjectName}
        </Button>

        {/* Master Header */}
        <div className="bg-white rounded-[48px] shadow-4xl p-8 sm:p-16 mb-12 border-4 border-gray-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-0">
            <BookOpen size={200} className="text-blue-600" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-10 md:space-y-0 md:space-x-12 mb-16 text-center md:text-left border-b-4 border-gray-50 pb-16">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[40px] shadow-3xl shadow-blue-100 flex-shrink-0 transform -rotate-2">
              <BookOpen className="text-white" size={60} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-blue-100">
                    Syllabus Level {chapter.order_num}
                  </span>
                  {progress?.completed && (
                    <span className="px-5 py-2 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-green-100 flex items-center">
                        <CheckCircle2 size={16} className="mr-2" /> Mastered
                    </span>
                  )}
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
                {chapterName}
              </h1>
              <p className="text-xl text-gray-500 font-bold max-w-2xl">
                {chapter.description}
              </p>
            </div>
          </div>

          {/* Module Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 relative">
             {/* Learn */}
            <Card 
              hover 
              className="group cursor-pointer border-4 border-transparent hover:border-blue-500 hover:shadow-4xl transition-all duration-500 bg-gray-50/50 rounded-[40px]"
              onClick={() => {
                setActiveMode('learning');
                setChallengeType(null);
              }}
            >
              <div className="p-12 text-center flex flex-col items-center">
                <div className="bg-white w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl">
                  <BookOpen className="text-blue-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Interactive Journey</h3>
                <p className="text-gray-400 font-bold text-sm">Visual slides & micro-tips</p>
                <div className="mt-8 flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                  <span>Start Learning</span> <ArrowRight size={16} />
                </div>
              </div>
            </Card>

            {/* Gaming Arena */}
            <Card 
              hover 
              className="group cursor-pointer border-4 border-transparent hover:border-purple-500 hover:shadow-4xl transition-all duration-500 bg-gray-50/50 rounded-[40px]"
              onClick={() => {
                setActiveMode('challenge');
                setChallengeType('game');
              }}
            >
              <div className="p-12 text-center flex flex-col items-center">
                <div className="bg-white w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl">
                  <Gamepad2 className="text-purple-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Gaming Arena</h3>
                <p className="text-gray-400 font-bold text-sm">Master every subtopic through levels</p>
                <div className="mt-8 flex items-center space-x-2 text-purple-600 font-black text-xs uppercase tracking-widest">
                  <span>Enter Arena</span> <ArrowRight size={16} />
                </div>
              </div>
            </Card>

             {/* Rapid Fire */}
             <Card 
              hover 
              className="group cursor-pointer border-4 border-transparent hover:border-orange-500 hover:shadow-4xl transition-all duration-500 bg-orange-50/30 rounded-[40px]"
              onClick={() => {
                setActiveMode('challenge');
                setChallengeType('rapid');
              }}
            >
              <div className="p-12 text-center flex flex-col items-center">
                <div className="bg-white w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                  <Zap className="text-orange-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Rapid Fire</h3>
                <p className="text-gray-400 font-bold text-sm">Timer mode for Bonus XP</p>
                <div className="mt-8 flex items-center space-x-2 text-orange-600 font-black text-xs uppercase tracking-widest">
                  <span>Ignite <Zap size={14} className="fill-current" /></span> <ArrowRight size={16} />
                </div>
              </div>
            </Card>
          </div>

          <div className="p-10 bg-gray-900 rounded-[32px] flex flex-col sm:flex-row items-center justify-between text-white space-y-6 sm:space-y-0 border-t-8 border-indigo-500">
             <div className="flex items-center space-x-6">
                <div className="bg-indigo-500 p-5 rounded-3xl animate-pulse">
                    <Trophy size={40} />
                </div>
                <div>
                    <h4 className="text-2xl font-black tracking-tight">Claim Chapter Mastery</h4>
                    <p className="text-gray-400 font-bold">Complete activities to master this chapter</p>
                </div>
             </div>
             <Button
                size="lg"
                onClick={() => updateProgressAndXP(50)}
                disabled={completingChapter || progress?.completed}
                className="px-12 py-7 text-xl font-black rounded-2xl shadow-3xl shadow-indigo-500/20 uppercase tracking-tight bg-indigo-500"
              >
                {completingChapter ? 'Syncing...' : progress?.completed ? 'Mastered' : 'I am Ready!'}
              </Button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="p-10 bg-gray-50/50 rounded-[48px] border-2 border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-10 flex items-center">
                <Sparkles className="text-yellow-400 mr-4" /> Curriculum Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {(chapter.topics || []).map((topic, idx) => (
                    <div key={idx} className="flex items-center p-6 bg-white rounded-3xl border-2 border-transparent hover:border-blue-100 hover:shadow-xl transition-all group">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mr-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <CheckCircle2 size={20} />
                         </div>
                         <span className="font-bold text-gray-700 leading-tight">{topic}</span>
                    </div>
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
}
