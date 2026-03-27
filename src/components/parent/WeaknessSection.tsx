import { Target, AlertTriangle } from 'lucide-react';

interface WeaknessSectionProps {
  subjectProgress: any[];
  chapterProgress: any[];
}

export function WeaknessSection({ subjectProgress, chapterProgress }: WeaknessSectionProps) {
  // Sort subjects by progress to find strengths and weaknesses
  const sortedSubjects = [...subjectProgress].sort((a, b) => 
    (b.progress_percentage || 0) - (a.progress_percentage || 0)
  );

  const strongSubjects = sortedSubjects.filter(s => (s.progress_percentage || 0) >= 70).slice(0, 2);
  const weakSubjects = [...sortedSubjects].reverse().filter(s => (s.progress_percentage || 0) < 50).slice(0, 2);

  // If there's not much data, try to extract pending chapters as weaknesses
  const pendingChapters = chapterProgress.filter(c => !c.completed).slice(0, 3);
  
  return (
      <div className="space-y-8">
          {/* WEAKNESS DETECTION */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-red-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 opacity-50"></div>
             <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center relative z-10">
                <AlertTriangle className="mr-3 text-red-500" /> Needs Improvement
             </h2>
             <div className="space-y-4 relative z-10">
                {weakSubjects.length > 0 ? (
                    weakSubjects.map((sub, idx) => (
                       <div key={`ws-${idx}`} className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:bg-red-50 transition-colors">
                          <span className="font-bold text-gray-800 text-lg">{sub.subjects?.name}</span>
                          <span className="text-red-600 font-black text-xs uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full mt-3 sm:mt-0 inline-block w-max">Critical Focus</span>
                       </div>
                    ))
                ) : pendingChapters.length > 0 ? (
                    pendingChapters.map((ch, idx) => (
                        <div key={`wc-${idx}`} className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col hover:bg-red-50 transition-colors">
                           <span className="font-bold text-gray-800">{ch.chapters?.name}</span>
                           <div className="flex items-center mt-2">
                              <span className="text-red-500 font-bold text-xs uppercase">Pending Completion</span>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 font-medium p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
                        Not enough data or no critical weaknesses detected yet.
                    </p>
                )}
             </div>
          </div>

          {/* STRENGTH ANALYSIS */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-green-500 relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 p-8 bg-green-50 rounded-full w-40 h-40 opacity-50 pointer-events-none"></div>
             <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center relative z-10">
                <Target className="mr-3 text-green-500" /> Strength Areas
             </h2>
             <div className="space-y-4 relative z-10">
                {strongSubjects.length > 0 ? (
                    strongSubjects.map((sub, idx) => (
                       <div key={`ss-${idx}`} className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:bg-green-50 transition-colors">
                          <span className="font-bold text-gray-800 text-lg">{sub.subjects?.name}</span>
                          <span className="text-green-600 font-black text-xs uppercase tracking-widest bg-green-100 px-3 py-1 rounded-full mt-3 sm:mt-0 inline-block w-max">Mastering</span>
                       </div>
                    ))
                ) : (
                    <p className="text-gray-500 font-medium p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
                        Keep progressing in subjects to establish strong areas!
                    </p>
                )}
             </div>
          </div>
      </div>
  );
}
