import { useJobStats, useJobs } from '../../hooks/useJobs';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, color }: { title: string; count: number; color: string }) => (
  <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color}`}>
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">
        {title}
      </dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">
        {count}
      </dd>
    </div>
  </div>
);

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
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
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