import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPLIED: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50 ring-blue-500/20',
    INTERVIEW: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50 ring-amber-500/20',
    OFFER: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50 ring-emerald-500/20',
    REJECTED: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700/50 ring-rose-500/20',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ring-1 ${styles[status] || 'bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600'}`}>
      {status}
    </span>
  );
};

interface JobHeaderProps {
  job: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

const JobHeader = ({ job, isEditing, setIsEditing, formData, handleChange, handleSave, handleDelete, isSaving, isDeleting }: JobHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-white/50 dark:border-slate-700/50 p-8 relative overflow-hidden group transition-colors duration-300">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
              {job.company.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3 max-w-md">
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="block w-full text-2xl font-bold text-gray-900 dark:text-white bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Company" />
                  <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="block w-full text-lg text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Job Title" />
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{job.company}</h1>
                  <p className="text-xl text-gray-500 dark:text-slate-400 font-medium">{job.jobTitle}</p>
                </>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <StatusBadge status={job.status} />
              <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600">
                {job.priority} Priority
              </span>
              <span className="text-sm text-gray-400 dark:text-slate-500 flex items-center bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm">
                Applied on {new Date(job.appliedDate || Date.now()).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/jobs')} className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">Back</button>
              <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all">Edit</button>
              <button onClick={handleDelete} className="px-5 py-2.5 rounded-full bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-700/50 text-rose-600 dark:text-rose-300 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobHeader;