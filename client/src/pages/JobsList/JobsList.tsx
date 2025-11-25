import { useState, useEffect } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPLIED: 'bg-blue-50 text-blue-700 border-blue-200',
    INTERVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    OFFER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const defaultStyle = 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`
      px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
      ${styles[status] || defaultStyle}
    `}>
      {status}
    </span>
  );
};

const JobsList = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // 3. Fetch Data
  const { data: jobs, isLoading, isError } = useJobs({ 
    search: debouncedSearch, 
    status: statusFilter 
  });

  if (isError) return (
    <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700">
      Something went wrong loading your jobs. Please try refreshing.
    </div>
  );

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            All Applications
          </h1>
          <p className="mt-2 text-gray-500">
            Manage your pipeline and track your progress.
          </p>
        </div>
        <Link
          to="/jobs/new"
          className="
            inline-flex items-center justify-center px-5 py-2.5 
            text-sm font-bold text-white transition-all duration-200 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            rounded-full shadow-lg shadow-blue-500/30 
            hover:from-blue-700 hover:to-indigo-700 
            hover:shadow-blue-500/50 hover:-translate-y-0.5
          "
        >
          + Add Job
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-1 rounded-2xl shadow-sm border border-gray-200/60">
        <div className="flex flex-col sm:flex-row gap-2 p-2">
          
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              placeholder="Search by company or role..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="hidden sm:block w-px bg-gray-200 my-2"></div>

          <div className="relative sm:w-48 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </div>
            <select
              className="block w-full pl-10 pr-10 py-3 border-none rounded-xl bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-gray-200/40 rounded-2xl border border-white/50 overflow-hidden min-h-[300px] flex flex-col">
        
        {isLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium animate-pulse">Finding your applications...</p>
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20 px-4 text-center">
            <div className="bg-blue-50 rounded-full p-4 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-gray-500 max-w-sm">
              {searchText || statusFilter !== 'ALL' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't added any jobs yet. Start your tracking journey today!"}
            </p>
            {(searchText || statusFilter !== 'ALL') && (
              <button 
                onClick={() => {setSearchText(''); setStatusFilter('ALL')}}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {jobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-blue-50/30 transition-colors duration-150">
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{job.company}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          job.priority === 'HIGH' ? 'bg-red-500' : 
                          job.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-400'
                        }`}></span>
                        {job.priority} Priority
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '-'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/jobs/${job.id}`} 
                        className="text-gray-400 hover:text-blue-600 transition-colors group-hover:text-blue-600"
                      >
                        View Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;