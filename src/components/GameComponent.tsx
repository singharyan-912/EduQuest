import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Zap, Target, CheckCircle2, Play, Sliders, Timer, RefreshCcw } from 'lucide-react';
import PhaserGame from './PhaserGame';
import { ProjectileScene } from '../games/ProjectileGame/ProjectileScene';

interface GameComponentProps {
  type: string;
  config: any;
  onComplete: (score: number) => void;
}

export function GameComponent({ type, config, onComplete }: GameComponentProps) {
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  // PROJECTILE MOTION MINI-GAME
  if (type === 'projectile_motion' || type === 'projectile_lab') {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null);

    const handleLaunch = () => {
        if (gameInstance) {
            gameInstance.events.emit('launch');
        }
    };

    const handleGameComplete = (finalScore: number) => {
        setScore(finalScore);
        setIsFinished(true);
        setTimeout(() => onComplete(finalScore), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start p-4 animate-in zoom-in duration-500">
            {/* Phaser Canvas Container */}
            <div className="flex-1 relative group">
                <PhaserGame 
                    scene={ProjectileScene} 
                    gameData={{ angle, velocity }}
                    onGameCreated={(game) => {
                        setGameInstance(game);
                        game.events.on('gameComplete', handleGameComplete);
                        game.events.on('scoreUpdate', (s: number) => setScore(s));
                    }}
                />
                {isFinished && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-[32px] z-10">
                        <div className="text-center p-8 bg-white rounded-[40px] shadow-4xl transform scale-110">
                            <Trophy size={80} className="text-yellow-500 mx-auto mb-4 animate-bounce" />
                            <h4 className="text-3xl font-black text-gray-900 mb-2">MISSION COMPLETE!</h4>
                            <p className="text-gray-500 font-bold">You've mastered the laws of motion!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Game Controls */}
            <Card className="w-full lg:w-[350px] p-8 space-y-8 rounded-[40px] border-4 border-gray-50 shadow-2xl bg-white/50 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Zap className="text-orange-500 fill-orange-500" size={24} />
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Lab Controls</span>
                    </div>
                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black text-xs border border-blue-100 uppercase tracking-widest">
                        Score: {score}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest flex items-center">
                                <Sliders size={16} className="mr-2" /> Launch Angle
                            </label>
                            <span className="text-2xl font-black text-blue-600">{angle}°</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" max="85" value={angle} 
                            onChange={(e) => setAngle(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest flex items-center">
                                <Zap size={16} className="mr-2" /> Initial Velocity
                            </label>
                            <span className="text-2xl font-black text-orange-600">{velocity} m/s</span>
                        </div>
                        <input 
                            type="range" 
                            min="20" max="100" value={velocity} 
                            onChange={(e) => setVelocity(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-600 hover:accent-orange-500 transition-all"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <Button 
                        size="lg" 
                        onClick={handleLaunch}
                        disabled={isFinished}
                        className="w-full py-10 text-3xl font-black rounded-[32px] shadow-3xl shadow-blue-200 border-4 border-white transform transition-transform active:scale-95 bg-blue-600 text-white"
                    >
                        <Play size={32} className="mr-3 fill-current" /> LAUNCH!
                    </Button>
                    <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest mt-6 italic">
                        "Gravity: 9.8 m/s² | Resistance: 0.1"
                    </p>
                </div>
            </Card>
        </div>
    );
  }

  // Fallback for Equation Balancer (Already defined in base file)
  if (type === 'equation_balancer') {
    const [left, setLeft] = useState(1);
    const [middle, setMiddle] = useState(1);
    const [right, setRight] = useState(1);

    const checkSolution = () => {
      if (left === 2 && middle === 1 && right === 2) {
        setIsFinished(true);
        setTimeout(() => onComplete(100), 2000);
      }
    };

    return (
      <div className="flex flex-col items-center p-8 animate-in zoom-in duration-500">
        <div className="bg-indigo-600 p-8 rounded-[40px] shadow-2xl mb-12 border-4 border-indigo-400">
           <Zap className="text-yellow-400 animate-pulse fill-yellow-400" size={60} />
        </div>
        <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">{config.title || 'Balance the Equation'}</h3>
        <p className="text-xl text-gray-500 mb-16 font-bold">Conservation of Mass: Atoms L = Atoms R</p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 text-5xl font-black text-gray-800 bg-white p-16 rounded-[48px] shadow-4xl border-4 border-indigo-50 relative">
          <div className="flex flex-col items-center gap-6">
            <input type="number" value={left} min="1" max="5" onChange={e => setLeft(parseInt(e.target.value))} className="w-24 text-center bg-indigo-50 rounded-2xl p-4 border-4 border-indigo-100 text-indigo-600 outline-none focus:border-indigo-500" />
            <span className="tracking-widest">H₂</span>
          </div>
          <span className="text-indigo-400 text-6xl">+</span>
          <div className="flex flex-col items-center gap-6">
            <input type="number" value={middle} min="1" max="5" onChange={e => setMiddle(parseInt(e.target.value))} className="w-24 text-center bg-indigo-50 rounded-2xl p-4 border-4 border-indigo-100 text-indigo-600 outline-none focus:border-indigo-500" />
            <span className="tracking-widest">O₂</span>
          </div>
          <span className="text-indigo-200 text-6xl">→</span>
          <div className="flex flex-col items-center gap-6">
            <input type="number" value={right} min="1" max="5" onChange={e => setRight(parseInt(e.target.value))} className="w-24 text-center bg-indigo-50 rounded-2xl p-4 border-4 border-indigo-100 text-indigo-600 outline-none focus:border-indigo-500" />
            <span className="tracking-widest">H₂O</span>
          </div>
        </div>

        <div className="mt-16 w-full max-w-lg">
          {!isFinished ? (
             <Button size="lg" onClick={checkSolution} className="w-full py-10 text-3xl font-black rounded-[32px] shadow-4xl shadow-indigo-200 bg-indigo-600 text-white">
               Check Balance
             </Button>
          ) : (
            <div className="bg-green-100 text-green-700 p-10 rounded-[40px] flex items-center justify-center font-black text-3xl animate-bounce border-4 border-green-200">
              <CheckCircle2 className="mr-4" size={48} /> PERFECTLY BALANCED!
            </div>
          )}
        </div>
      </div>
    );
  }

  // Universal Game: Topic Scramble (Already defined in base file)
  if (type === 'topic_matcher') {
    const topics = config.topics || ['Concept', 'Theory', 'Practice'];
    const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
    const [scrambled, setScrambled] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const target = topics[currentTopicIdx];

    useEffect(() => {
      const str = target.toUpperCase().replace(/\s/g, '');
      const arr = str.split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setScrambled(arr.join(' '));
      setGuess('');
      setFeedback(null);
    }, [currentTopicIdx, target]);

    const handleCheck = () => {
      if (guess.toUpperCase().replace(/\s/g, '') === target.toUpperCase().replace(/\s/g, '')) {
        setFeedback('correct');
        if (currentTopicIdx < topics.length - 1) {
          setTimeout(() => setCurrentTopicIdx(prev => prev + 1), 1000);
        } else {
          setIsFinished(true);
          setTimeout(() => onComplete(100), 2000);
        }
      } else {
        setFeedback('wrong');
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <div className="flex flex-col items-center p-8 animate-in slide-in-from-bottom duration-500 max-w-2xl w-full">
         <div className="bg-orange-500 p-8 rounded-[40px] shadow-3xl mb-12 border-8 border-white">
           <Target className="text-white animate-pulse" size={64} />
        </div>
        <h3 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Topic Scramble</h3>
        <p className="text-2xl text-gray-400 mb-16 font-bold text-center italic">Unscramble the core pillars of this chapter!</p>

        <div className="bg-white p-12 rounded-[56px] shadow-4xl border-4 border-orange-50 w-full text-center space-y-12">
           <div className="text-5xl sm:text-7xl font-black tracking-[0.3em] text-orange-600 bg-orange-50/50 py-16 rounded-[40px] border-4 border-orange-100 shadow-inner break-words">
             {scrambled}
           </div>

           <div className="space-y-6">
              <input 
                type="text" 
                value={guess}
                onChange={e => setGuess(e.target.value)}
                placeholder="TYPE YOUR DISCOVERY..."
                className={`w-full text-center p-8 text-4xl font-black rounded-[32px] border-8 transition-all uppercase outline-none
                  ${feedback === 'correct' ? 'border-green-500 bg-green-50' : feedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-gray-50 focus:border-orange-500 focus:bg-white'}
                `}
              />
              <div className="flex justify-between text-sm font-black text-orange-400 tracking-[0.3em] uppercase px-4">
                 <span>GOAL {currentTopicIdx + 1} / {topics.length}</span>
                 <div className="flex items-center space-x-2">
                    <Timer size={16} /> <span>HINT: {target.length} UNITS</span>
                 </div>
              </div>
           </div>
        </div>

        <Button 
          size="lg" 
          onClick={handleCheck}
          disabled={!guess || isFinished}
          className="mt-12 w-full py-10 text-3xl font-black rounded-[40px] shadow-4xl shadow-orange-200 bg-orange-500 text-white transform active:scale-95"
        >
          {isFinished ? 'LEGENDARY!' : 'VALIDATE THEORY'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-20 text-center flex flex-col items-center animate-in fade-in duration-700 bg-white rounded-[60px] border-4 border-gray-50 shadow-2xl">
      <div className="p-12 bg-blue-50 rounded-full mb-12 border-4 border-blue-100 shadow-inner">
        <Target size={100} className="text-blue-500 animate-pulse" />
      </div>
      <h3 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Arena Entry</h3>
      <p className="text-2xl text-gray-500 mb-16 font-bold max-w-xl">You are entering the interactive proving grounds for {type}. Ready to show your skills?</p>
      
      <Button 
        size="lg" 
        onClick={() => onComplete(100)} 
        className="px-24 py-10 text-3xl shadow-4xl shadow-blue-200 font-black rounded-[40px] bg-blue-600 text-white transform hover:scale-105 active:scale-95"
      >
        I AM READY
      </Button>
    </div>
  );
}

// Helper icons needed but missing from imports
const Trophy = ({ size, className }: { size: number, className: string }) => (
    <div className={className} style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
    </div>
);
