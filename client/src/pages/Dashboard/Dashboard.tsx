import React from 'react';
import { useJobStats } from '../../hooks/useJobs';
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
  const { data: stats, isLoading, isError } = useJobStats();

  if (isLoading) return <div className="text-center mt-10">Loading stats...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Error loading dashboard.</div>;

  // Calculate total applications
  const total = (stats?.APPLIED || 0) + (stats?.INTERVIEW || 0) + (stats?.OFFER || 0) + (stats?.REJECTED || 0);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Applications" count={total} color="border-gray-500" />
        <StatCard title="Interviews" count={stats?.INTERVIEW || 0} color="border-yellow-500" />
        <StatCard title="Offers" count={stats?.OFFER || 0} color="border-green-500" />
        <StatCard title="Rejected" count={stats?.REJECTED || 0} color="border-red-500" />
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Your recent job application history will appear here.</p>
          </div>
          <div className="mt-5">
            <Link to="/jobs" className="text-blue-600 hover:text-blue-500 font-medium">
              View all applications &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;