import React from 'react';
import { useJobStats, useJobs } from '../../hooks/useJobs';
import { Link } from 'react-router-dom';

const StatCard = ({ title, count, gradient, icon }: { title: string; count: number; gradient: string; icon: React.ReactNode }) => (
  <div className={`
    relative overflow-hidden rounded-2xl p-6 
    bg-gradient-to-br ${gradient}
    text-white shadow-lg shadow-gray-200/50 dark:shadow-black/30
    transition-all duration-300 ease-in-out
    hover:-translate-y-1 hover:shadow-xl group
  `}>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider opacity-80 bg-black/10 px-2 py-1 rounded-full">
          {title}
        </span>
      </div>
      <dd className="text-4xl font-extrabold tracking-tight">
        {count}
      </dd>
    </div>
    
    <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
    <div className="absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-black/5 blur-2xl" />
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPLIED': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'INTERVIEW': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'OFFER': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    case 'REJECTED': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    default: return 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-600';
  }
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useJobStats();
  const { data: recentJobs, isLoading: jobsLoading } = useJobs({ limit: 5 });
  
  if (statsLoading || jobsLoading) return <div className="flex h-screen items-center justify-center text-blue-600 font-medium animate-pulse">Loading dashboard...</div>;

  const total = (stats?.APPLIED || 0) + (stats?.INTERVIEW || 0) + (stats?.OFFER || 0) + (stats?.REJECTED || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400">
            Here's what's happening with your job search today.
          </p>
        </div>
        <Link
          to="/jobs/new"
          className="
            inline-flex items-center justify-center px-6 py-3 
            text-base font-bold text-white transition-all duration-200 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            rounded-full shadow-lg shadow-blue-500/30 
            hover:from-blue-700 hover:to-indigo-700 
            hover:shadow-blue-500/50 hover:-translate-y-1
          "
        >
          + Add Application
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total" 
          count={total} 
          gradient="from-gray-700 to-gray-900 dark:from-slate-700 dark:to-slate-900"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
        />
        <StatCard 
          title="Interviews" 
          count={stats?.INTERVIEW || 0} 
          gradient="from-amber-400 to-orange-500"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
        />
        <StatCard 
          title="Offers" 
          count={stats?.OFFER || 0} 
          gradient="from-emerald-400 to-teal-500"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <StatCard 
          title="Rejected" 
          count={stats?.REJECTED || 0} 
          gradient="from-rose-400 to-pink-500"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-white/50 dark:border-slate-700/50 overflow-hidden transition-colors duration-300">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Your latest application updates.</p>
          </div>
          <Link to="/jobs" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all">
            View All &rarr;
          </Link>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {!recentJobs || recentJobs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-700 mb-4">
                <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No activity yet</h3>
              <p className="mt-2 text-gray-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                You haven't tracked any jobs yet. Add your first application to see your stats light up!
              </p>
              <Link
                to="/jobs/new"
                className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300"
              >
                Add First Job
              </Link>
            </div>
          ) : (
            recentJobs.map((job) => (
              <Link 
                key={job.id} 
                to={`/jobs/${job.id}`} 
                className="group block hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="px-6 py-5 sm:px-8 flex items-center justify-between">
                  <div className="flex items-center min-w-0 gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg shadow-sm group-hover:scale-110 transition-transform duration-200">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                        {job.jobTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider font-medium">Updated</p>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
                        {new Date(job.updatedAt || job.appliedDate || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <span className={`
                        px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                        ${getStatusColor(job.status)}
                      `}>
                        {job.status}
                      </span>
                    </div>
                    
                    <svg className="h-5 w-5 text-gray-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;