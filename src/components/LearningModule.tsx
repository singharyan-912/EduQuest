import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Play, 
  Sparkles,
  ChevronRight,
  Award,
  FileText,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';


interface LearningSlide {
  title: string;
  content: string;
  visual?: string;
  visual_type?: string;
  component?: React.ReactNode;
}

interface LearningModuleProps {
  slides: LearningSlide[];
  pyqUrl?: string;
  onComplete: () => void;
}

export function LearningModule({ slides, pyqUrl, onComplete }: LearningModuleProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showPYQ, setShowPYQ] = useState(false);

  if (!slides || slides.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-gray-200">
        <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Content Not Available</h3>
        <p className="text-gray-500 mb-6">We're still preparing the interactive slides for this topic. Check back soon!</p>
        <Button onClick={onComplete}>Return to Overview</Button>
      </Card>
    );
  }

  const slide = slides[currentIdx];
  const progress = ((currentIdx + 1) / slides.length) * 100;

  const handleNext = () => {
    if (showPYQ) {
      onComplete();
      return;
    }

    if (currentIdx < slides.length - 1) {
      setDirection(1);
      setCurrentIdx(c => c + 1);
    } else {
      setShowPYQ(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981']
      });
    }
  };

  const handleBack = () => {
    if (showPYQ) {
      setShowPYQ(false);
      return;
    }
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(c => c - 1);
    }
  };


  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 select-none">
      {/* Progress Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 px-2">
             <div className="flex items-center space-x-2">
                <Sparkles className="text-yellow-400" size={18} />
                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">
                  {showPYQ ? 'Final Challenge' : 'Knowledge Journey'}
                </span>
             </div>
             <span className="text-sm font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border-2 border-blue-100 shadow-sm">
                {showPYQ ? 'Board Exam Prep' : `Module ${currentIdx + 1} of ${slides.length}`}
             </span>
        </div>
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border-2 border-white">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: showPYQ ? '100%' : `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className={`absolute top-0 left-0 h-full shadow-lg ${showPYQ ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'}`}
          />
        </div>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        {!showPYQ ? (
          <motion.div
            key={currentIdx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <Card className="overflow-hidden border-0 shadow-3xl bg-white/80 backdrop-blur-xl min-h-[500px] flex flex-col rounded-[40px]">
              <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="flex items-center text-white">
                  <div className="bg-white/20 p-3 rounded-2xl mr-4 backdrop-blur-md">
                      <BookOpen size={24} />
                  </div>
                  <div>
                      <p className="text-xs font-black text-white/70 uppercase tracking-[0.2em] mb-1">Chapter Concept</p>
                      <h3 className="text-2xl font-black tracking-tight">{slide.title}</h3>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-14 flex-1 flex flex-col">
                {slide.component ? (
                    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
                        {slide.component}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
                      <div className="space-y-8">
                        <div className="text-2xl text-gray-700 leading-relaxed font-bold">
                            {slide.content}
                        </div>
                      </div>

                      {slide.visual && (
                        <div className="relative group lg:block hidden">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[48px] blur-2xl opacity-50 transition-opacity" />
                            <img 
                                src={slide.visual} 
                                className="relative w-full rounded-[40px] shadow-4xl border-[12px] border-white object-cover aspect-video"
                                alt={slide.title}
                            />
                        </div>
                      )}
                    </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="p-8 sm:p-10 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={currentIdx === 0}
                  className="px-8 py-7 text-lg font-black rounded-[20px] text-gray-400 hover:text-blue-600 border-2"
                >
                  <ArrowLeft className="mr-3" /> Previous
                </Button>
                <Button 
                    size="lg" 
                    onClick={handleNext} 
                    className="px-12 py-7 text-xl font-black rounded-[24px] shadow-2xl bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                >
                    Next Step <ChevronRight className="ml-2" size={24} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="pyq-section"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="overflow-hidden border-0 shadow-3xl bg-white/90 backdrop-blur-xl min-h-[500px] flex flex-col rounded-[40px] border-4 border-orange-100">
               <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-orange-500 to-red-600">
                <div className="flex items-center text-white">
                  <div className="bg-white/20 p-3 rounded-2xl mr-4 backdrop-blur-md">
                      <Award size={24} />
                  </div>
                  <div>
                      <p className="text-xs font-black text-white/70 uppercase tracking-[0.2em] mb-1">Board Excellence</p>
                      <h3 className="text-2xl font-black tracking-tight">Previous Year Questions (PYQs)</h3>
                  </div>
                </div>
              </div>

              <div className="p-12 flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-4 border-4 border-orange-100">
                      <FileText size={64} />
                  </div>
                  <div className="max-w-xl">
                      <h4 className="text-3xl font-black text-gray-900 mb-4">Master the Board Exams</h4>
                      <p className="text-xl text-gray-600 font-bold leading-relaxed">
                          We've curated the most important questions from the last 10 years for this chapter. 
                          Practice these to ensure you're fully prepared for the upcoming examinations.
                      </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                      <Button 
                        size="lg"
                        className="flex-1 py-10 rounded-3xl text-xl font-black bg-gray-900 hover:bg-black shadow-xl"
                        onClick={() => window.open(pyqUrl, '_blank')}
                      >
                         <Play className="mr-3" /> View PDF
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="flex-1 py-10 rounded-3xl text-xl font-black border-4 border-orange-200 text-orange-600 hover:bg-orange-50"
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = pyqUrl || '#';
                            link.download = `PYQ_Chapter.pdf`;
                            link.click();
                        }}
                      >
                         <Download className="mr-3" /> Download
                      </Button>
                  </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  className="px-8 py-7 text-lg font-black rounded-[20px] text-gray-400 hover:text-orange-600 border-2"
                >
                  <ArrowLeft className="mr-3" /> Back to Slides
                </Button>
                <Button 
                    size="lg" 
                    onClick={handleNext} 
                    className="px-12 py-7 text-xl font-black rounded-[24px] shadow-2xl bg-green-600 hover:bg-green-700 shadow-green-200"
                >
                    Complete Journey <CheckCircle2 className="ml-2" size={24} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
