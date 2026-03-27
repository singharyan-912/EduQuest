import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowRight, RotateCcw, Zap, Target, Award } from 'lucide-react';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  type: 'learning' | 'challenge';
  score?: number;
  total?: number;
  xpEarned: number;
  bonusXP?: number;
  onContinue: () => void;
  onRetry?: () => void;
}

export function ResultScreen({ 
    type, 
    score, 
    total, 
    xpEarned, 
    bonusXP = 0, 
    onContinue, 
    onRetry 
}: ResultScreenProps) {
  const percentage = score && total ? (score / total) * 100 : 100;
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 50;

  useEffect(() => {
    if (isExcellent) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    } else {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
  }, [isExcellent]);

  const getPerformanceMessage = () => {
    if (type === 'learning') return "Concept Mastered! You're building a strong foundation.";
    if (percentage === 100) return "Absolute Perfection! You've achieved Grandmaster status.";
    if (percentage >= 80) return "Outstanding! You have a deep understanding of this chapter.";
    if (percentage >= 50) return "Good Progress! A bit more practice and you'll be a pro.";
    return "Keep Pushing! Every mistake is a learning opportunity.";
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
            duration: 0.5,
            staggerChildren: 0.2
        }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div variants={itemVariants} className="relative mb-12">
        <div className={`absolute inset-0 blur-3xl rounded-full opacity-20 ${isExcellent ? 'bg-yellow-400' : 'bg-blue-400'}`} />
        <div className={`relative p-8 rounded-[40px] shadow-3xl border-8 border-white transform transition-transform hover:scale-110 duration-500
            ${isExcellent ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}
        `}>
          {isExcellent ? (
            <Trophy size={80} className="text-white drop-shadow-2xl" />
          ) : (
            <Star size={80} className="text-white drop-shadow-2xl" />
          )}
        </div>
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border-2 border-gray-50"
        >
            <Award className={isExcellent ? 'text-orange-500' : 'text-blue-500'} size={32} />
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 mb-12">
        <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">
            {isExcellent ? 'Glorious Victory!' : isGood ? 'Great Effort!' : 'Chapter Complete!'}
        </h2>
        <p className="text-2xl text-gray-500 font-bold max-w-lg mx-auto leading-tight">
            {getPerformanceMessage()}
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 w-full max-w-xl">
        {/* Score Card */}
        {type === 'challenge' && (
            <div className="bg-white p-8 rounded-[32px] border-4 border-gray-50 shadow-xl flex flex-col items-center group hover:border-blue-100 transition-colors">
                <Target className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <div className="text-4xl font-black text-gray-900 mb-1">
                    {score}<span className="text-gray-300 mx-1">/</span>{total}
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Accuracy Score</span>
            </div>
        )}

        {/* XP Card */}
        <div className={`bg-gray-900 p-8 rounded-[32px] border-4 border-gray-800 shadow-xl flex flex-col items-center group transition-all
            ${type === 'learning' ? 'sm:col-span-2' : ''}
        `}>
            <div className="flex items-center space-x-3 mb-2">
                <Zap className="text-yellow-400 fill-yellow-400" size={24} />
                <div className="text-4xl font-black text-white">
                    +{xpEarned + bonusXP}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Total XP Earned</span>
                {bonusXP > 0 && (
                    <span className="bg-yellow-400/20 text-yellow-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-400/30">
                        INC. +{bonusXP} BONUS
                    </span>
                )}
            </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
        {onRetry && (
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onRetry} 
            className="flex-1 py-8 text-xl border-4 border-gray-100 rounded-[28px] font-black text-gray-400 hover:text-blue-600 hover:border-blue-200"
          >
            <RotateCcw className="mr-3" />
            Try Again
          </Button>
        )}
        <Button 
            size="lg" 
            onClick={onContinue} 
            className="flex-1 py-8 text-xl shadow-4xl shadow-blue-200 border-4 border-white rounded-[28px] font-black transform transition-transform hover:scale-105 active:scale-95 bg-blue-600"
        >
          Continue
          <ArrowRight className="ml-3" size={24} />
        </Button>
      </motion.div>
    </motion.div>
  );
}
