import { useJobStats, useJobs } from '../../hooks/useJobs';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, color }: { title: string; count: number; color: string }) => {
  const bgGradients: Record<string, string> = {
    'border-gray-500': 'from-gray-50 to-gray-100 text-gray-600',
    'border-yellow-500': 'from-orange-50 to-amber-100 text-amber-600',
    'border-green-500': 'from-emerald-50 to-teal-100 text-emerald-600',
    'border-red-500': 'from-rose-50 to-pink-100 text-rose-600',
  };

  const gradientClass = bgGradients[color] || 'from-white to-gray-50';

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 
      bg-gradient-to-br ${gradientClass}
      border border-white/50 shadow-lg shadow-gray-200/50
      transition-all duration-300 ease-in-out
      hover:-translate-y-1 hover:shadow-xl
    `}>
      <dt className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">
        {title}
      </dt>
      <dd className="text-4xl font-extrabold tracking-tight">
        {count}
      </dd>
      
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
    </div>
  );
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useJobStats();
  
  // Fetch Recent Activity (Limit to 5)
  const { data: recentJobs, isLoading: jobsLoading } = useJobs({ limit: 5 });

  // if (statsLoading || jobsLoading) return <div className="text-center mt-10">Loading dashboard...</div>;

  const total = (stats?.APPLIED || 0) + (stats?.INTERVIEW || 0) + (stats?.OFFER || 0) + (stats?.REJECTED || 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-800';
      case 'INTERVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'OFFER': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/jobs/new"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 
  rounded-full shadow-lg shadow-blue-500/30 
  hover:from-blue-700 hover:to-indigo-700 
  hover:shadow-blue-500/50 hover:-translate-y-0.5
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
">
            + Add New Job
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Applications" count={total} color="border-gray-500" />
        <StatCard title="Interviews" count={stats?.INTERVIEW || 0} color="border-yellow-500" />
        <StatCard title="Offers" count={stats?.OFFER || 0} color="border-green-500" />
        <StatCard title="Rejected" count={stats?.REJECTED || 0} color="border-red-500" />
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <Link to="/jobs" className="text-sm text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {!recentJobs || recentJobs.length === 0 ? (
            <li className="px-4 py-5 text-center text-sm text-gray-500">
              No recent activity. Start applying!
            </li>
          ) : (
            recentJobs.map((job) => (
              <li key={job.id}>
                <Link to={`/jobs/${job.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{job.company}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {job.jobTitle}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Updated {new Date(job.updatedAt || job.appliedDate || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;