import { useJobs } from '../../hooks/useJobs';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const Stats = () => {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) return <div className="flex h-64 items-center justify-center text-blue-600 font-medium animate-pulse">Loading stats...</div>;
  
  if (!jobs || jobs.length === 0) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-gray-700">No data yet</h2>
      <p className="text-gray-500 mt-2">Add some job applications to see your analytics!</p>
    </div>
  );

  const statusCounts = jobs.reduce((acc: any, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = [
    { name: 'Applied', value: statusCounts['APPLIED'] || 0, color: '#3b82f6' },   
    { name: 'Interview', value: statusCounts['INTERVIEW'] || 0, color: '#f59e0b' }, 
    { name: 'Offer', value: statusCounts['OFFER'] || 0, color: '#10b981' },        
    { name: 'Rejected', value: statusCounts['REJECTED'] || 0, color: '#ef4444' },   
  ].filter(d => d.value > 0);

  const applicationsByDate = jobs.reduce((acc: any, job) => {
    if (!job.appliedDate) return acc;
    const date = new Date(job.appliedDate).toLocaleDateString('en-CA');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(applicationsByDate)
    .sort()
    .slice(-7) 
    .map(date => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      count: applicationsByDate[date]
    }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Analytics
        </h1>
        <p className="mt-2 text-gray-500">
          Visual insights into your job search performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- Card 1: Status Distribution --- */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 p-8 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Pipeline Health</h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#333', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Card 2: Activity Timeline --- */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 p-8 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
          {barData.length > 0 ? (
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Not enough data yet
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Stats;