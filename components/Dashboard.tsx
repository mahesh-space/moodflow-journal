import React, { useMemo } from 'react';
import { JournalEntry, EmotionType } from '../types';
import { EMOTION_THEMES } from '../constants';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface DashboardProps {
  entries: JournalEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  
  const stats = useMemo(() => {
    if (!entries.length) return null;

    // Timeline Data (Last 7 entries or days)
    const timelineData = entries
      .slice()
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-10) // Last 10 entries
      .map(e => ({
        date: new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        intensity: e.analysis?.emotion_intensity || 0,
        sentiment: e.analysis?.sentiment_score || 0
      }));

    // Emotion Distribution
    const distribution: Record<string, number> = {};
    entries.forEach(e => {
      const em = e.analysis?.primary_emotion;
      if (em) {
        distribution[em] = (distribution[em] || 0) + 1;
      }
    });
    
    const pieData = Object.entries(distribution).map(([name, value]) => ({ name, value }));
    
    // Average Sentiment
    const avgSentiment = entries.reduce((acc, curr) => acc + (curr.analysis?.sentiment_score || 0), 0) / entries.length;

    return { timelineData, pieData, avgSentiment };
  }, [entries]);

  if (!entries.length) return (
    <div className="flex flex-col items-center justify-center h-64 opacity-50">
        <p>No data available for analytics yet.</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
          <h3 className="text-sm font-bold uppercase opacity-60 tracking-wider">Total Entries</h3>
          <p className="text-4xl font-bold mt-2">{entries.length}</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
          <h3 className="text-sm font-bold uppercase opacity-60 tracking-wider">Avg Sentiment</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-bold">
              {stats?.avgSentiment.toFixed(2)}
            </p>
            <span className="text-sm opacity-70">(-1 to +1)</span>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
          <h3 className="text-sm font-bold uppercase opacity-60 tracking-wider">Dominant Mood</h3>
          <p className="text-4xl font-bold mt-2 capitalize truncate">
            {stats?.pieData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Emotion Distribution Chart */}
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm h-80">
          <h3 className="text-lg font-bold mb-4">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats?.pieData.map((entry, index) => {
                  const colorClass = EMOTION_THEMES[entry.name as EmotionType]?.textColor.replace('text-', 'bg-') || '#8884d8';
                  // Simple hack to get hex from tailwind class isn't perfect, using fallbacks for chart colors
                  // Ideally would map tailwind colors to hex. Using a predefined palette for charts:
                  const COLORS = ['#60A5FA', '#34D399', '#FB923C', '#FBBF24', '#F472B6', '#A78BFA', '#F87171'];
                  return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                })}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Intensity Timeline */}
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm h-80">
          <h3 className="text-lg font-bold mb-4">Emotional Intensity (Last 10)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.timelineData}>
              <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none' }} />
              <Line 
                type="monotone" 
                dataKey="intensity" 
                stroke="#4F46E5" 
                strokeWidth={3} 
                dot={{r: 4, fill: '#4F46E5'}}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
