import { BookOpen, CheckCircle2 } from 'lucide-react';

interface PerformanceCardProps {
  progress: any;
}

export function PerformanceCard({ progress }: PerformanceCardProps) {
  const { subjects, progress_percentage, chapters_completed, total_chapters } = progress;
  
  if (!subjects) return null;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
        <BookOpen size={100} />
      </div>

      <div className="flex items-center space-x-4 mb-6 relative z-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-500">
           {/* Fallback Icon */}
           <BookOpen size={24} />
        </div>
        <div>
           <h3 className="font-black text-gray-900 text-lg leading-tight">{subjects.name}</h3>
           <p className="text-gray-500 text-xs font-bold tracking-wider uppercase">Class {subjects.class}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
         <div>
            <div className="flex justify-between text-sm font-bold mb-2">
               <span className="text-gray-600">Completion</span>
               <span className="text-indigo-600">{progress_percentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
               <div 
                 className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000" 
                 style={{ width: `${progress_percentage || 0}%` }}
               ></div>
            </div>
         </div>

         <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100">
            <div className="flex items-center space-x-2 text-gray-700">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="font-bold text-sm">Chapters Done</span>
            </div>
            <span className="font-black text-gray-900">{chapters_completed} / {total_chapters}</span>
         </div>
      </div>
    </div>
  );
}
