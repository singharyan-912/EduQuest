import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Timer, 
  Zap,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  type?: 'conceptual' | 'numerical' | 'assertion_reason' | 'case_based' | 'match_following';
  difficulty?: 'easy' | 'medium' | 'hard';
  case_text?: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  mode?: 'normal' | 'rapid_fire';
  onComplete: (score: number, bonusXP: number) => void;
}

export function QuizComponent({ questions, mode = 'normal', onComplete }: QuizComponentProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'rapid_fire' ? 60 : 0);
  const [bonusXP, setBonusXP] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string, originalIdx: number }[]>([]);
  const [shuffledCorrectIdx, setShuffledCorrectIdx] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIdx];

  useEffect(() => {
    if (currentQuestion) {
      const optionsWithIdx = currentQuestion.options.map((opt, idx) => ({ text: opt, originalIdx: idx }));
      
      // Shuffle only if not 'match_following' or 'assertion_reason' where order might be conventional
      if (currentQuestion.type !== 'match_following' && currentQuestion.type !== 'assertion_reason') {
        const shuffled = [...optionsWithIdx].sort(() => Math.random() - 0.5);
        setShuffledOptions(shuffled);
        setShuffledCorrectIdx(shuffled.findIndex(opt => opt.originalIdx === currentQuestion.correct));
      } else {
        setShuffledOptions(optionsWithIdx);
        setShuffledCorrectIdx(currentQuestion.correct);
      }
    }
  }, [currentIdx, questions]);

  useEffect(() => {
    if (mode === 'rapid_fire' && timeLeft > 0 && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleNext(true); // Auto-fail on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, timeLeft, isAnswered]);

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-gray-200 rounded-[32px]">
        <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz Not Available</h3>
        <p className="text-gray-500 mb-6">We're still preparing the questions for this chapter.</p>
        <Button onClick={() => onComplete(0, 0)}>Return to Overview</Button>
      </Card>
    );
  }

  const progress = ((currentIdx + 1) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setIsAnswered(true);
    
    const isCorrect = selectedIdx === shuffledCorrectIdx;
    if (isCorrect) {
      setScore(s => s + 1);
      
      // Speed bonus for Rapid Fire
      if (mode === 'rapid_fire') {
        const speedBonus = Math.floor(timeLeft / 2);
        setBonusXP(prev => prev + speedBonus);
      }

      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981']
      });
    }
  };

  const handleNext = (isTimeout = false) => {
    const isCorrect = selectedIdx === shuffledCorrectIdx && !isTimeout;
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      if (mode === 'rapid_fire') setTimeLeft(60); // Reset timer for next question
    } else {
      onComplete(score + (isCorrect ? 1 : 0), bonusXP);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 select-none">
      {/* Header Info */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center space-x-2">
                <Award className="text-yellow-500" size={20} />
                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">
                    Challenge {currentIdx + 1}/{questions.length}
                </span>
             </div>
             <div className="flex items-center space-x-4">
                {mode === 'rapid_fire' && (
                    <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border-2 font-black text-sm
                        ${timeLeft < 10 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-orange-50 border-orange-200 text-orange-600'}
                    `}>
                        <Timer size={16} />
                        <span>{timeLeft}s</span>
                    </div>
                )}
                {bonusXP > 0 && (
                    <div className="flex items-center space-x-1 px-4 py-1.5 bg-yellow-50 border-2 border-yellow-200 text-yellow-700 rounded-full font-black text-sm">
                        <Zap size={16} />
                        <span>+{bonusXP} XP</span>
                    </div>
                )}
             </div>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border-2 border-white">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          className="relative"
        >
          <Card className="p-8 sm:p-14 mb-8 border-0 shadow-3xl bg-white/90 backdrop-blur-xl rounded-[40px] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none">
               <HelpCircle size={200} className="text-blue-600" />
            </div>
            
            <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="h-1.5 w-12 bg-blue-500 rounded-full" />
                    <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">
                      {currentQuestion.type?.replace('_', ' ') || 'Conceptual Quest'}
                    </span>
                </div>
                {currentQuestion.case_text && (
                  <div className="mb-8 p-6 bg-blue-50/50 rounded-3xl border-2 border-blue-100 text-gray-700 font-medium italic leading-relaxed">
                    {currentQuestion.case_text}
                  </div>
                )}

                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                    {currentQuestion.question}
                   </h3>
                   {currentQuestion.difficulty && (
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 flex-shrink-0 ml-4
                        ${currentQuestion.difficulty === 'easy' ? 'bg-green-50 border-green-200 text-green-600' : 
                          currentQuestion.difficulty === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 
                          'bg-red-50 border-red-200 text-red-600'}
                     `}>
                        {currentQuestion.difficulty}
                     </span>
                   )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                {shuffledOptions.map((option, idx) => {
                    const isSelected = selectedIdx === idx;
                    const isCorrect = idx === shuffledCorrectIdx;
                    const showCorrect = isAnswered && isCorrect;
                    const showWrong = isAnswered && isSelected && !isCorrect;

                    return (
                    <motion.button
                        key={idx}
                        whileHover={!isAnswered ? { x: 8, scale: 1.01 } : {}}
                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(idx)}
                        disabled={isAnswered}
                        className={`group relative text-left p-6 rounded-[24px] border-4 transition-all duration-300 flex items-center justify-between
                        ${isSelected ? 'border-blue-500 bg-white shadow-xl scale-[1.02]' : 'border-gray-50 bg-gray-50/50 hover:bg-white hover:border-blue-200'}
                        ${showCorrect ? 'border-green-500 bg-green-50/50 shadow-green-100' : ''}
                        ${showWrong ? 'border-red-500 bg-red-50/50 shadow-red-100' : ''}
                        ${isAnswered && !isSelected && !isCorrect ? 'opacity-40 grayscale-[0.3]' : ''}
                        `}
                    >
                        <div className="flex items-center space-x-6">
                        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all
                            ${isSelected ? 'bg-blue-600 text-white shadow-lg rotate-12' : 'bg-white text-gray-400 border-2 border-gray-100 group-hover:text-blue-500 group-hover:border-blue-100'}
                            ${showCorrect ? 'bg-green-500 text-white rotate-0' : ''}
                            ${showWrong ? 'bg-red-500 text-white rotate-0' : ''}
                        `}>
                            {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`text-xl font-bold ${isSelected || showCorrect || showWrong ? 'text-gray-900' : 'text-gray-600'}`}>
                            {option.text}
                        </span>
                        </div>
                        {showCorrect && <div className="bg-green-500 p-2 rounded-full text-white shadow-lg"><CheckCircle2 size={24} /></div>}
                        {showWrong && <div className="bg-red-500 p-2 rounded-full text-white shadow-lg"><XCircle size={24} /></div>}
                    </motion.button>
                    );
                })}
                </div>

                {/* Explanation Area */}
                <AnimatePresence>
                    {isAnswered && currentQuestion.explanation && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-10 overflow-hidden"
                        >
                            <div className="p-8 bg-indigo-50/50 rounded-3xl border-2 border-indigo-100">
                                <h4 className="flex items-center font-black text-indigo-900 mb-3 text-sm uppercase tracking-widest">
                                    <Lightbulb className="mr-2" size={16} /> Concept Deep Dive
                                </h4>
                                <p className="text-gray-700 font-bold leading-relaxed italic">
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end pt-6 relative items-center space-x-6">
        {isAnswered && (
            <div className="flex items-center text-gray-400 font-black text-xs uppercase tracking-[0.2em] hidden sm:flex">
                <TrendingUp className="mr-2" size={16} /> Streak Active
            </div>
        )}
        
        {!isAnswered ? (
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={selectedIdx === null}
            className="px-16 py-8 text-2xl shadow-3xl shadow-blue-200 border-4 border-white font-black rounded-[32px] transform transition-transform hover:scale-105 active:scale-95 bg-blue-600"
          >
            Lock Answer
          </Button>
        ) : (
          <Button 
            size="lg" 
            onClick={() => handleNext()}
            className="px-16 py-8 text-2xl shadow-3xl shadow-green-200 border-4 border-white font-black rounded-[32px] transform transition-transform hover:scale-105 active:scale-95 bg-green-600"
          >
            {currentIdx < questions.length - 1 ? 'Next Quest' : 'Reveal Glory'}
            <ArrowRight className="ml-3" size={28} />
          </Button>
        )}
      </div>
    </div>
  );
}
