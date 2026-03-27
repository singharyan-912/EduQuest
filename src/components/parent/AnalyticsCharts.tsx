import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsChartsProps {
  subjectProgress: any[];
  xpHistory: number; // Used for a mock time-series chart
}

export function AnalyticsCharts({ subjectProgress, xpHistory }: AnalyticsChartsProps) {
  // Bar Chart Data (Subject Progress)
  const barData = subjectProgress.map(sp => ({
    name: sp.subjects?.name || 'Unknown',
    progress: sp.progress_percentage || 0,
  }));

  // Pie Chart Data (Syllabus Composition)
  const pieData = subjectProgress.map(sp => ({
    name: sp.subjects?.name || 'Unknown',
    chapters: sp.total_chapters || 0,
    completed: sp.chapters_completed || 0
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (subjectProgress.length === 0) {
     return <div className="h-[300px] flex items-center justify-center text-gray-400 font-bold bg-gray-50 rounded-2xl border-dashed border-2">Need data to build charts</div>;
  }

  return (
    <div className="space-y-12">
      {/* 1. Bar Chart: Performance by Subject */}
      <div>
        <h4 className="text-lg font-black text-gray-600 mb-6 uppercase tracking-wider text-center">Completion Timeline</h4>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 'bold' }} domain={[0, 100]} />
              <Tooltip 
                 cursor={{ fill: 'transparent' }} 
                 contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="progress" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40} name="Progress %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Pie Chart: Syllabus Distribution */}
      <div className="pt-8 border-t border-gray-100">
        <h4 className="text-lg font-black text-gray-600 mb-6 uppercase tracking-wider text-center">Chapter Dominance</h4>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="chapters"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value: any, name: any, props: any) => [`${value} Chapters Total`, props.payload.name]}
                 contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
           {pieData.map((entry, index) => (
               <div key={index} className="flex items-center text-sm font-bold text-gray-600">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
               </div>
           ))}
        </div>
      </div>
    </div>
  );
}
